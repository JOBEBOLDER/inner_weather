# Prompts

Canonical layout (used by Next.js `lib/prompts.ts` and Python test scripts):

```
prompts/
├── zh/
│   ├── savage_zh_v1.txt      → style: savage
│   ├── buddha_zh_v1.txt      → style: buddha
│   ├── mindful_zh_v1.txt     → style: mindful
│   ├── cbt_zh_v1.txt         → style: cbt
│   ├── socratic_zh_v1.txt    → style: socratic
│   ├── mentor_zh_v1.txt      → style: mentor
│   └── deep_mode/
│       ├── neutral_deep_zh_v1.txt
│       ├── savage_deep_zh_v1.txt
│       └── receipt_generator_v1.txt
└── en/
    ├── savage_en_v1.txt      → style: savage (English)
    ├── buddha_en_v1.txt
    ├── mindful_en_v1.txt
    ├── cbt_en_v1.txt
    ├── socratic_en_v1.txt
    ├── mentor_en_v1.txt
    └── deep_mode/
        ├── neutral_deep_en_v1.txt
        └── receipt_generator_en_v1.txt
```

When UI locale is English, `lib/prompts.ts` loads `prompts/en/` first.
If an English file is missing, it falls back to `prompts/zh/` with a language override wrapper.
