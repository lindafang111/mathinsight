import axios from 'axios';

export default async function handler(req, res) {
  // 仅允许 POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { answers } = req.body;

  // 🔑 从环境变量读取 SiliconFlow 密钥
  const apiKey = process.env.SILICONFLOW_API_KEY;
  if (!apiKey) {
    console.error('❌ SILICONFLOW_API_KEY 未配置！请在 Vercel Settings → Environment Variables 中添加。');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 构建 Prompt
  const prompt = `
你是一位经验丰富的高等数学教练，擅长用清晰、鼓励的方式帮助大学生突破学习瓶颈。
用户信息如下：
- 当前最大困惑：${answers.intro || '未说明'}
- 学习目标：${answers.goal || '未说明'}
- 每日可用时间：${answers.timePerDay || '未说明'}
- 偏好学习方式：${answers.learningStyle || '未说明'}
- 特别心声：${answers.finalNote || '无'}

请生成一份【个性化高数突破计划】，要求：
1. 开头共情（如“理解你的焦虑...”）
2. 分 3 阶段：诊断 → 突破 → 巩固
3. 每阶段给出具体行动建议（如“每天做 2 道格林公式方向题”）
4. 推荐 1~2 个免费资源（如 Bilibili 视频、教材章节），用 [文字](链接) 格式
5. 用 Markdown 输出，包含 ## 标题、- 列表、**加粗**
6. 结尾鼓励
7. 不要出现“AI”、“模型”等字眼
`;

  try {
    const response = await axios.post(
      'https://api.siliconflow.cn/v1/chat/completions',
      {
        model: 'alibaba/Qwen2-7B-Instruct', // ✅ 硅基流动官方模型名
        messages: [
          { role: 'system', content: '你是一个耐心、专业的高数导师，语言温暖而精准。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.6
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // 15秒超时
      }
    );

    const content = response.data.choices[0].message.content.trim();

    return res.status(200).json({ plan: content });

  } catch (error) {
    console.error('🔥 调用 SiliconFlow 失败:', error.response?.data || error.message);
    return res.status(500).json({
      error: '生成方案时出错，请稍后再试'
    });
  }
}
