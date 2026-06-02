# 🌤️ Innerweather
> Reframing your thoughts, one receipt at a time.

[demo screenshot or gif]

---

## What is this?

Innerweather is an AI-powered mental reframing tool that turns negative thought patterns into structured "receipts" — helping you pause, process, and reframe your inner chatter.

---

## The Science Behind It

This isn't a gimmick. Every feature is grounded in established psychology:

- **Negativity Bias** — The brain generates roughly 60,000 thoughts per day, 70–80% of which skew negative (NSF research)
- **Cognitive Defusion** (ACT) — Externalising a thought into a "receipt" creates psychological distance, so it loses its grip on you
- **Distanced Self-Talk** — Addressing yourself as "you" instead of "I" shifts the brain from threat mode to challenge mode (Dr. Ethan Kross, University of Michigan)
- **CBT Catch-Check-Change** — The product flow maps directly onto the cognitive restructuring framework endorsed by the NHS

---

## Features

### ⚡ Quick Mode
Type a thought → pick a style → get your receipt. Done in under 30 seconds.

### 🌿 Deep Mode
Three rounds of AI-guided conversation → a personalised, in-depth receipt.

### 6 Companion Styles
| Style | Vibe | Best for |
|-------|-------|---------|
| 🧠 CBT Analyst | Structured evidence review | Recurring anxiety |
| 🍃 Mindful Acceptance | Gentle, non-judgmental presence | Emotional overwhelm |
| 💬 Honest Friend | Casual, grounded companionship | Wanting to feel heard |
| 🔍 Guided Discovery | Socratic questioning | Wanting to find your own answers |
| 🗡️ Savage BFF | Brutally funny, cuts through the drama | Full-on overthinking mode |
| 🪷 Cyber Buddha | Zen, radical acceptance | When you're way too attached |

### 📊 Impact Dashboard
- Top thought spirals (semantic clustering)
- Monthly mental spending report
- Reframe success rate tracking

---

## AI Engineering Highlights

A showcase of the technical depth behind the product:

### Structured Output Pipeline
```
User Input → System Prompt (style-specific)
→ DeepSeek V3 → JSON Validation
→ Receipt Rendering
```

### Multi-turn Conversation State Machine
Deep Mode manages a 3-round dialogue state:
- Round 1 (Identify): Detect the cognitive distortion type
- Round 2 (Challenge): RAG retrieval from the CBT knowledge base
- Round 3 (Consolidate): Force structured JSON output

### Semantic Clustering for Impact Dashboard
```
User Input → Embedding → Cosine Similarity
→ Match against 12 CBT cognitive distortion types
→ Top thought spirals leaderboard
```

### Prompt Engineering
- Individual system prompt design for all 6 companion styles
- Iteration log: v1 → v2 → v3
- Failure case analysis

---

## Tech Stack

```
Frontend    Next.js 14 + Tailwind CSS
AI Layer    DeepSeek V3 API
            Vercel AI SDK (streaming)
Database    Supabase (receipts + user data)
Deployment  Vercel
```

---

## Project Structure

```
innerweather/
├── prompts/           ← system prompts for all 6 styles
│   ├── savage_v1.txt
│   └── ...
├── scripts/           ← prompt validation scripts
│   ├── test_savage.py
│   └── ...
├── docs/              ← design documentation
│   ├── product_model.md
│   ├── prompt_iterations.md
│   └── evaluation_report.md
└── src/               ← frontend source code
```

---

## Prompt Design Philosophy

[To be filled: rationale behind the design decisions for each style's prompt]

---

## Evaluation

[To be filled: comparison results across different prompt versions]

---

## Getting Started

```bash
git clone https://github.com/your-username/innerweather
cd innerweather
pip install -r requirements.txt
cp .env.example .env
# Add your DEEPSEEK_API_KEY to .env
python scripts/test_savage_prompt.py
```

---

## Roadmap

- [x] Core receipt generation pipeline
- [x] 6 companion styles prompt design
- [ ] Multi-turn conversation state machine
- [ ] RAG knowledge base integration
- [ ] Web app (Next.js)
- [ ] Evaluation framework
- [ ] Menu bar desktop app

---

## References

- Kross, E. (2021). *Chatter: The Voice in Our Head*
- Hayes, S.C. — Acceptance and Commitment Therapy (ACT)
- NHS Every Mind Matters — CBT Reframing Framework
- Amen, D. — Automatic Negative Thoughts (ANTs)
- Huberman, A. — Neuroplasticity & Habit Formation

---

Built with 🌤️ by Gia