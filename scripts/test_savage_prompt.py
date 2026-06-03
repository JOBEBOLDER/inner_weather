import json
import os
from pathlib import Path

from anthropic import Anthropic
from dotenv import load_dotenv


TEST_INPUT = (
    "我觉得自己学代码学的没有别人快，别人都有数学和理工科基础，"
    "我自己是个艺术生，没有别人聪明"
)


def validate_payload(payload: dict) -> list[str]:
    required_top_fields = [
        "original_input",
        "items",
        "awareness",
        "reframe",
        "action",
        "style",
    ]
    missing = [field for field in required_top_fields if field not in payload]
    errors: list[str] = []

    if missing:
        errors.append(f"Missing top-level fields: {missing}")

    if isinstance(payload.get("items"), list) and len(payload["items"]) == 0:
        errors.append("items should not be empty")

    if payload.get("style") != "savage":
        errors.append("style should be exactly 'savage'")

    awareness = payload.get("awareness")
    if isinstance(awareness, dict):
        for key in ("emotion", "bias"):
            if key not in awareness:
                errors.append(f"awareness missing key: {key}")
    else:
        errors.append("awareness should be an object")

    action = payload.get("action")
    if isinstance(action, dict):
        for key in ("now", "if_then_trigger", "if_then_response"):
            if key not in action:
                errors.append(f"action missing key: {key}")
    else:
        errors.append("action should be an object")

    return errors


def main() -> None:
    load_dotenv()

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set. Please update .env first.")

    model = os.getenv("MODEL", "claude-sonnet-4-20250514")

    prompt_path = Path(__file__).resolve().parent.parent / "prompts" / "zh" / "savage_zh_v1.txt"
    system_prompt = prompt_path.read_text(encoding="utf-8")

    client = Anthropic(api_key=api_key)
    resp = client.messages.create(
        model=model,
        max_tokens=800,
        temperature=0.2,
        system=system_prompt,
        messages=[{"role": "user", "content": TEST_INPUT}],
    )

    output_text = "".join(
        block.text for block in resp.content if getattr(block, "type", None) == "text"
    ).strip()

    print("=== Raw Model Output ===")
    print(output_text)
    print()

    print("=== Validation ===")
    try:
        payload = json.loads(output_text)
        print("JSON parse: OK")
    except json.JSONDecodeError as exc:
        print(f"JSON parse: FAIL ({exc})")
        return

    errors = validate_payload(payload)
    if errors:
        print("Schema check: FAIL")
        for err in errors:
            print(f"- {err}")
    else:
        print("Schema check: OK")
        print("Day 1 minimum loop: PASS")


if __name__ == "__main__":
    main()
