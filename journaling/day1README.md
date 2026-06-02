# InnerWeather - Day 1 Prompt Validation

今天的目标：验证核心链路是否可用。

输入一句负面想法 -> 调用 DeepSeek API（System Prompt）-> 输出结构化 JSON -> 可被前端直接解析。

## Files

- `prompts/savage_system_v1.txt`: 毒舌闺蜜 System Prompt
- `scripts/test_savage_prompt.py`: Day 1 最小验证脚本
- `requirements.txt`: Python 依赖
- `.env.example`: 环境变量示例

## Quick Start

1) 创建并激活 Python 虚拟环境（可选）

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2) 安装依赖

```bash
pip install -r requirements.txt
```

3) 配置环境变量

```bash
cp .env.example .env
```

在 `.env` 中填入你的 Key：

```bash
DEEPSEEK_API_KEY=your_deepseek_api_key_here
MODEL=deepseek-chat
```

4) 运行 Day 1 验证

```bash
python scripts/test_savage_prompt.py
```

## 输出说明

脚本会做两件事：

- 打印模型原始输出
- 尝试解析 JSON，并检查关键字段是否齐全

若解析成功，你会看到 `JSON parse: OK` 与 `Day 1 minimum loop: PASS`。
