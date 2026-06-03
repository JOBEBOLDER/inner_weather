"""
Run all 6 style prompts against the DeepSeek API and print a summary report.

Usage:
    python scripts/test_all_prompts.py           # run all styles
    python scripts/test_all_prompts.py savage     # run one style by name
"""

import os
import sys
import json
import re
from dataclasses import dataclass, field
from pathlib import Path

from openai import OpenAI
from dotenv import load_dotenv


# ---------------------------------------------------------------------------
# Style registry
# ---------------------------------------------------------------------------

@dataclass
class StyleConfig:
    name: str              # display name
    prompt_file: str       # filename under prompts/zh/
    expected_style: str    # expected value of the "style" JSON field
    test_input: str        # fixed test sentence
    extra_checks: list     # list of (description, callable(payload) -> bool)
    has_merit: bool = False  # True only for 赛博佛祖


STYLES: list[StyleConfig] = [
    StyleConfig(
        name="毒舌闺蜜 (Savage BFF)",
        prompt_file="savage_zh_v1.txt",
        expected_style="savage",
        test_input="我觉得自己学代码学的没有别人快，别人都有数学和理工科基础，我自己是个艺术生，没有别人聪明",
        extra_checks=[],
    ),
    StyleConfig(
        name="赛博佛祖 (Cyber Buddha)",
        prompt_file="buddha_zh_v1.txt",
        expected_style="buddha",
        test_input="我总觉得自己不够好，不管做什么都感觉达不到别人的期望，也达不到自己的期望",
        extra_checks=[
            ("merit field is a non-empty string",
             lambda p: isinstance(p.get("merit"), str) and bool(p["merit"].strip())),
        ],
        has_merit=True,
    ),
    StyleConfig(
        name="正念接纳 (Mindful Acceptance)",
        prompt_file="mindful_zh_v1.txt",
        expected_style="mindful",
        test_input="我感觉自己一直在努力，但好像永远都不够，不知道什么时候才能真正放松下来",
        extra_checks=[],
    ),
    StyleConfig(
        name="理性分析 (CBT Analyst)",
        prompt_file="cbt_zh_v1.txt",
        expected_style="cbt",
        test_input="我总是搞砸重要的事，从来没有一次能真正做好，我就是不适合做这个",
        extra_checks=[],
    ),
    StyleConfig(
        name="引导发现 (Socratic)",
        prompt_file="socratic_zh_v1.txt",
        expected_style="socratic",
        test_input="我觉得自己根本不适合做创意工作，别人随便就能想到好点子，我每次都脑子空白",
        extra_checks=[
            ("reframe ends with a question mark",
             lambda p: isinstance(p.get("reframe"), str)
                       and p["reframe"].strip().endswith(("？", "?"))),
        ],
    ),
    StyleConfig(
        name="职业导师 (Mentor)",
        prompt_file="mentor_zh_v1.txt",
        expected_style="mentor",
        test_input="我工作了半年感觉还是什么都不会，同事随便问一个问题我都答不上来，感觉自己一直在原地踏步",
        extra_checks=[],
    ),
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

REQUIRED_TOP_FIELDS = ["original_input", "items", "awareness", "reframe", "action", "style"]


def extract_json(raw: str) -> str:
    cleaned = re.sub(r"<thinking>.*?</thinking>", "", raw, flags=re.DOTALL).strip()
    fence_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", cleaned)
    if fence_match:
        return fence_match.group(1).strip()
    return cleaned.strip()


def validate(payload: dict, config: StyleConfig) -> list[str]:
    errors: list[str] = []

    missing = [f for f in REQUIRED_TOP_FIELDS if f not in payload]
    if missing:
        errors.append(f"missing top-level fields: {missing}")

    if isinstance(payload.get("items"), list) and len(payload["items"]) == 0:
        errors.append("items is empty")

    if payload.get("style") != config.expected_style:
        errors.append(f"style expected '{config.expected_style}', got {payload.get('style')!r}")

    awareness = payload.get("awareness")
    if isinstance(awareness, dict):
        for key in ("emotion", "bias"):
            if key not in awareness:
                errors.append(f"awareness missing key '{key}'")
    else:
        errors.append("awareness is not an object")

    action = payload.get("action")
    if isinstance(action, dict):
        for key in ("now", "if_then_trigger", "if_then_response"):
            if key not in action:
                errors.append(f"action missing key '{key}'")
    else:
        errors.append("action is not an object")

    for desc, check in config.extra_checks:
        try:
            if not check(payload):
                errors.append(f"extra check failed: {desc}")
        except Exception as exc:
            errors.append(f"extra check error ({desc}): {exc}")

    return errors


# ---------------------------------------------------------------------------
# Single style runner
# ---------------------------------------------------------------------------

def run_style(config: StyleConfig, client: OpenAI, model_name: str,
              prompts_dir: Path, verbose: bool) -> dict:
    result = {
        "name": config.name,
        "passed": False,
        "json_ok": False,
        "schema_ok": False,
        "errors": [],
        "raw_output": "",
        "payload": None,
    }

    prompt_path = prompts_dir / config.prompt_file
    if not prompt_path.exists():
        result["errors"].append(f"prompt file not found: {prompt_path}")
        return result

    system_prompt = prompt_path.read_text(encoding="utf-8")

    try:
        resp = client.chat.completions.create(
            model=model_name,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": config.test_input},
            ],
            temperature=0.7,
        )
        raw = (resp.choices[0].message.content or "").strip()
    except Exception as exc:
        result["errors"].append(f"API call failed: {exc}")
        return result

    result["raw_output"] = raw

    if verbose:
        print(f"\n{'─' * 48}")
        print(f"  {config.name}")
        print(f"{'─' * 48}")
        print(raw)

    cleaned = extract_json(raw)

    try:
        payload = json.loads(cleaned)
        result["json_ok"] = True
        result["payload"] = payload
    except json.JSONDecodeError as exc:
        result["errors"].append(f"JSON parse failed: {exc}")
        return result

    errors = validate(payload, config)
    if errors:
        result["errors"].extend(errors)
    else:
        result["schema_ok"] = True
        result["passed"] = True

    return result


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    load_dotenv()

    api_key = os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        raise RuntimeError("DEEPSEEK_API_KEY is not set. Please update .env first.")

    model_name = os.getenv("MODEL", "deepseek-chat")
    prompts_dir = Path(__file__).resolve().parent.parent / "prompts" / "zh"

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

    # Filter by CLI argument if provided (e.g. `python test_all_prompts.py savage`)
    filter_arg = sys.argv[1].lower() if len(sys.argv) > 1 else None
    styles_to_run = [
        s for s in STYLES
        if filter_arg is None or filter_arg in s.expected_style.lower() or filter_arg in s.name.lower()
    ]

    if not styles_to_run:
        print(f"No styles matched '{filter_arg}'. Available: {[s.expected_style for s in STYLES]}")
        sys.exit(1)

    verbose = filter_arg is not None  # show raw output only when running a single style

    print(f"\nModel : {model_name}")
    print(f"Styles: {len(styles_to_run)} / {len(STYLES)}")
    print("=" * 56)

    results = []
    for config in styles_to_run:
        print(f"  Running  {config.name} ...", end=" ", flush=True)
        r = run_style(config, client, model_name, prompts_dir, verbose)
        status = "PASS" if r["passed"] else "FAIL"
        print(status)
        results.append(r)

    # ------------------------------------------------------------------
    # Summary
    # ------------------------------------------------------------------
    passed = [r for r in results if r["passed"]]
    failed = [r for r in results if not r["passed"]]

    print("\n" + "=" * 56)
    print(f"  RESULTS  {len(passed)} passed / {len(failed)} failed / {len(results)} total")
    print("=" * 56)

    for r in results:
        icon = "✓" if r["passed"] else "✗"
        json_tag = "JSON:OK " if r["json_ok"] else "JSON:FAIL "
        schema_tag = "Schema:OK" if r["schema_ok"] else "Schema:FAIL"
        print(f"  {icon}  {r['name']:<35} {json_tag} {schema_tag}")
        for err in r["errors"]:
            print(f"       → {err}")

    if failed:
        print()
        print("  Tip: run with the style name to see raw output, e.g.:")
        print("       python scripts/test_all_prompts.py savage")

    # Receipt preview (only when running all and all passed)
    if not filter_arg and passed:
        print("\n" + "=" * 56)
        print("  RECEIPT PREVIEW (first passed style)")
        print("=" * 56)
        r = passed[0]
        p = r["payload"]
        print(f"  Style    : {p.get('style')}")
        print(f"  Original : {p.get('original_input', '')[:60]}")
        awareness = p.get("awareness", {})
        print(f"  Emotion  : {awareness.get('emotion', 'N/A')}")
        print(f"  Bias     : {awareness.get('bias', 'N/A')}")
        print(f"  Reframe  : {str(p.get('reframe', ''))[:80]} ...")
        action = p.get("action", {})
        print(f"  Now      : {str(action.get('now', ''))[:80]}")

    print()
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()
