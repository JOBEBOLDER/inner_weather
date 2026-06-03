import os
import json
import re
from pathlib import Path

from openai import OpenAI
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
    errors: list[str] = []

    missing = [f for f in required_top_fields if f not in payload]
    if missing:
        errors.append(f"Missing top-level fields: {missing}")

    if isinstance(payload.get("items"), list) and len(payload["items"]) == 0:
        errors.append("items should not be empty")

    if payload.get("style") != "cbt":
        errors.append(f"style should be 'cbt', got: {payload.get('style')!r}")

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


def extract_json(raw: str) -> str:
    # Strip <thinking>...</thinking> blocks (DeepSeek reasoning models).
    cleaned = re.sub(r"<thinking>.*?</thinking>", "", raw, flags=re.DOTALL).strip()

    # Extract JSON from markdown fences if present.
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", cleaned)
    if fence_match:
        return fence_match.group(1).strip()
    return cleaned.strip()


def main() -> None:
    load_dotenv()

    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY is not set. Please update .env first.")

    model_name = os.getenv("MODEL", "deepseek-chat")

    prompt_path = Path(__file__).resolve().parent.parent / "prompts" / "zh" / "cbt_zh_v1.txt"
    system_prompt = prompt_path.read_text(encoding="utf-8")

    client = OpenAI(
        api_key=api_key,
        base_url="https://api.deepseek.com",
    )

    print("==================================================")
    print(f"Style:      理性分析 (CBT Analyst)")
    print(f"Model:      {model_name}")
    print(f"Test input: {TEST_INPUT}")
    print("==================================================")

    try:
        resp = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": TEST_INPUT},
            ],
            temperature=0.7,
        )
        output_text = (resp.choices[0].message.content or "").strip()
    except Exception as exc:
        print(f"API call failed: {exc}")
        return

    print("\n=== Raw Model Output ===")
    print(output_text)
    print()

    cleaned = extract_json(output_text)

    print("=== Validation ===")
    try:
        payload = json.loads(cleaned)
        print("JSON parse: OK")
    except json.JSONDecodeError as exc:
        print(f"JSON parse: FAIL ({exc})")
        print("--- Cleaned string that failed ---")
        print(cleaned)
        return

    errors = validate_payload(payload)
    if errors:
        print("Schema check: FAIL")
        for err in errors:
            print(f"  - {err}")
        return

    print("Schema check: OK")
    print("CBT loop: PASS")

    print("\n=== Receipt Preview ===")
    print(f"Original : {payload.get('original_input', 'N/A')}")
    print("Items    :")
    for item in payload.get("items", []):
        print(f"  {item.get('name', 'N/A')}  →  {item.get('cost', 'N/A')}")
    awareness = payload.get("awareness", {})
    print(f"Emotion  : {awareness.get('emotion', 'N/A')}")
    print(f"Bias     : {awareness.get('bias', 'N/A')}")
    print(f"Reframe  : {payload.get('reframe', 'N/A')}")
    action = payload.get("action", {})
    print(f"Now      : {action.get('now', 'N/A')}")
    print(f"Trigger  : {action.get('if_then_trigger', 'N/A')}")
    print(f"Response : {action.get('if_then_response', 'N/A')}")


if __name__ == "__main__":
    main()
