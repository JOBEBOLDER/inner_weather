import os
import json
import re
from pathlib import Path
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class DeepModeSession:
    """
    深度模式状态机
    管理3轮对话 + 最终小票生成
    """
    
    # 每轮对话的目标，注入进system prompt
    ROUND_GOALS = {
        1: "第1轮目标：接住用户的情绪，问一个开放性问题。"
           "只理解，不分析，不给建议。",
        2: "第2轮目标：基于用户上一轮的回答，"
           "往深处挖一层。触碰想法背后的假设。"
           "不给结论。",
        3: "第3轮目标：帮用户看到一个新的可能性。"
           "问一个让用户自己总结的问题。"
           "不替用户总结。"
    }
    
    def __init__(self, style: str, initial_thought: str):
        self.style = style
        self.initial_thought = initial_thought
        self.round = 0
        self.conversation_history = []
        self.is_complete = False
        
        # 初始化API客户端
        self.client = OpenAI(
            api_key=os.getenv("DEEPSEEK_API_KEY"),
            base_url="https://api.deepseek.com"
        )
        self.model = os.getenv("MODEL", "deepseek-chat")
        
        # 加载对话prompt
        prompt_path = (
            Path(__file__).parent
            / "prompts" / "zh" / "deep_mode"
            / f"{style}_deep_zh_v1.txt"
        )
        self.base_prompt = prompt_path.read_text(encoding="utf-8")
        
        # 加载小票生成prompt
        receipt_prompt_path = (
            Path(__file__).parent
            / "prompts" / "zh" / "deep_mode"
            / "receipt_generator_v1.txt"
        )
        self.receipt_prompt = receipt_prompt_path.read_text(encoding="utf-8")
    
    def start(self) -> str:
        """
        开始对话，处理用户的第一句输入
        返回AI的第1轮回复
        """
        self.round = 1
        
        # 构建第1轮的system prompt
        system = self._build_system_prompt(round_num=1)
        
        # 初始化对话历史
        self.conversation_history = [
            {"role": "user", "content": self.initial_thought}
        ]
        
        # 调用API
        reply = self._call_api(system)
        
        # 把AI回复加入历史
        self.conversation_history.append({
            "role": "assistant",
            "content": reply
        })
        
        return reply
    
    def reply(self, user_message: str) -> str:
        """
        处理用户的回复
        返回AI的下一轮回复，或者触发小票生成
        """
        if self.is_complete:
            raise ValueError("对话已结束，请生成小票")
        
        # 把用户回复加入历史
        self.conversation_history.append({
            "role": "user",
            "content": user_message
        })
        
        self.round += 1
        
        if self.round <= 3:
            # 还在对话阶段
            system = self._build_system_prompt(round_num=self.round)
            ai_reply = self._call_api(system)
            
            self.conversation_history.append({
                "role": "assistant",
                "content": ai_reply
            })
            
            # 第3轮结束后标记完成
            if self.round == 3:
                self.is_complete = True
            
            return ai_reply
        
        else:
            raise ValueError("已超过3轮，请调用generate_receipt()")
    
    def generate_receipt(self) -> dict:
        """
        3轮对话结束后，生成结构化小票
        """
        if not self.is_complete:
            raise ValueError("对话还未完成3轮")
        
        # 把完整对话历史格式化成文字
        conversation_text = self._format_conversation()
        
        # 构建小票生成prompt
        system = self.receipt_prompt.replace(
            "{STYLE}", self.style
        ).replace(
            "{CONVERSATION}", conversation_text
        )
        
        # 调用API生成JSON
        raw_output = self._call_api(
            system=system,
            user_message="请根据以上对话生成转念小票。",
            temperature=0.3  # 生成小票时降低随机性
        )
        
        # 清洗和解析JSON
        return self._parse_json(raw_output)
    
    def _build_system_prompt(self, round_num: int) -> str:
        """
        根据当前轮次，构建system prompt
        """
        round_goal = self.ROUND_GOALS[round_num]
        return (
            f"{self.base_prompt}\n\n"
            f"【当前状态】\n"
            f"当前轮次：第{round_num}轮 / 共3轮\n"
            f"{round_goal}\n"
            f"请只回复这一轮的内容，控制在3句话以内。"
        )
    
    def _call_api(
        self, 
        system: str,
        user_message: str = None,
        temperature: float = 0.7
    ) -> str:
        """
        调用DeepSeek API
        """
        messages = [{"role": "system", "content": system}]
        messages.extend(self.conversation_history)
        
        if user_message:
            messages.append({
                "role": "user", 
                "content": user_message
            })
        
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=temperature
        )
        
        return (response.choices[0].message.content or "").strip()
    
    def _format_conversation(self) -> str:
        """
        把对话历史格式化成可读文字
        """
        lines = [f"用户初始想法：{self.initial_thought}\n"]
        
        for i, msg in enumerate(self.conversation_history):
            if msg["role"] == "user" and i == 0:
                continue  # 跳过第一条，已经在上面写了
            role = "用户" if msg["role"] == "user" else "引导者"
            lines.append(f"{role}：{msg['content']}")
        
        return "\n".join(lines)
    
    def _parse_json(self, raw: str) -> dict:
        """
        清洗AI输出，解析JSON
        """
        # 去掉thinking标签
        cleaned = re.sub(
            r"<thinking>.*?</thinking>", 
            "", raw, flags=re.DOTALL
        ).strip()
        
        # 去掉markdown代码块
        fence = re.search(r"```(?:json)?\s*([\s\S]*?)```", cleaned)
        if fence:
            cleaned = fence.group(1).strip()
        
        return json.loads(cleaned)