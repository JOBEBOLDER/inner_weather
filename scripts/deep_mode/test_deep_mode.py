# scripts/deep_mode/test_deep_mode.py

import sys
from pathlib import Path

# Add project root to sys.path so deep_mode_session.py can be found.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from deep_mode_session import DeepModeSession

def test_deep_mode():
    print("=" * 50)
    print("深度模式状态机测试")
    print("=" * 50)
    
    # 初始化会话
    session = DeepModeSession(
        style="savage",
        initial_thought="我觉得自己学代码学的没有别人快，"
                       "我是艺术生，没有别人聪明"
    )
    
    # 第1轮
    print("\n【用户输入】")
    print(session.initial_thought)
    reply1 = session.start()
    print(f"\n【AI第1轮】\n{reply1}")
    
    # 模拟用户回答
    user_reply1 = "大概半年了，从开始学代码就有这种感觉"
    print(f"\n【用户第1轮回答】\n{user_reply1}")
    reply2 = session.reply(user_reply1)
    print(f"\n【AI第2轮】\n{reply2}")
    
    # 模拟用户回答
    user_reply2 = "我觉得最坏就是永远学不会，找不到工作"
    print(f"\n【用户第2轮回答】\n{user_reply2}")
    reply3 = session.reply(user_reply2)
    print(f"\n【AI第3轮】\n{reply3}")
    
    # 模拟用户回答
    user_reply3 = "好吧，也许我只是需要更多时间"
    print(f"\n【用户第3轮回答】\n{user_reply3}")
    
    # 生成小票
    print("\n" + "=" * 50)
    print("生成小票...")
    print("=" * 50)
    
    receipt = session.generate_receipt()
    print(f"\n✅ 小票生成成功")
    print(f"Reframe: {receipt.get('reframe', 'N/A')}")
    print(f"Now: {receipt.get('action', {}).get('now', 'N/A')}")

if __name__ == "__main__":
    test_deep_mode()