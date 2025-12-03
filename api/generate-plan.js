const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// 安全中间件
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '.')));

// 静态首页
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ========== 你的 generatePlan 函数（保持不变）==========
function generatePlan(answers) {
  const { intro = '', goal = '', timePerDay = '', learningStyle = '', finalNote = '' } = answers;
  let output = '';

  if (intro) {
    output += `💬 **你说**：“${intro}”\n\n`;
  }

  const fullText = (intro + ' ' + finalNote).toLowerCase();
  let planType = 'general';

  // 泰勒展开
  if (/泰勒|taylor|展开|近似|余项|麦克劳林/.test(fullText)) {
    planType = 'taylor';
    output += `🔍 **核心问题**：你把泰勒当成记忆公式，而不是“用多项式局部逼近函数”的思想。\n`;
    output += `✅ **本周聚焦**：理解“余项 = 误差”，掌握前3阶展开。\n\n`;
    
    output += `📌 **思维实验**：\n`;
    output += `1. 想象你在山顶俯瞰山谷，只看得清最近的坡度。\n`;
    output += `2. 你不知道整个山的形状，但你知道：\n`;
    output += `   - 山顶高度 f(a)\n`;
    output += `   - 斜率 f'(a)\n`;
    output += `   - 弯曲程度 f''(a)\n`;
    output += `3. 于是你用“平地 + 坡度 + 弯曲”来近似山体 → 就是泰勒展开！\n\n`;
    
    output += `💡 **关键类比**：\n`;
    output += `- “用直线拟合曲线” → 一阶展开（切线）\n`;
    output += `- “用抛物线拟合曲线” → 二阶展开（考虑弯曲）\n\n`;
    
    output += `🛠️ **实操建议**：\n`;
    output += `1. 选函数：f(x) = e^x，在 a=0 处展开\n`;
    output += `2. 计算：f(0)=1, f'(0)=1, f''(0)=1\n`;
    output += `3. 写出：e^x ≈ 1 + x + x²/2\n`;
    output += `4. 手绘：画出 e^x 和它的近似多项式（草稿纸即可）\n`;
    output += `5. 观察：当 x=0.1 时，近似值≈1.105，真实值≈1.10517 → 误差极小！\n\n`;
    
    output += `⚠️ **常见误区**：\n`;
    output += `- 只背公式，不理解“为什么需要更高阶”\n`;
    output += `- 忽视余项 → 它告诉你“误差 ≤ |x|³/6”\n\n`;
    
    output += `🎯 **本周任务**：\n`;
    output += `- 对 ln(1+x) 在 a=0 处做二阶展开\n`;
    output += `- 计算 x=0.2 时的真实值 vs 近似值\n`;
    output += `- 验证误差是否小于 x³\n\n`;
  }
  
  // 格林公式方向
  else if (
    (/格林|green|曲线积分/.test(fullText) && /方向|正向|绕向|顺时针|逆时针|搞反/.test(fullText)) ||
    (/区域.*左手|左手.*区域/.test(fullText))
  ) {
    planType = 'greens';
    output += `🔍 **核心问题**：“正向”不是规定，而是“区域在左手边”的自然结果。\n`;
    output += `✅ **本周聚焦**：掌握“湖岸跑步法”判断方向 + 公式适用条件。\n\n`;
    
    output += `📌 **思维实验**：\n`;
    output += `1. 想象你在一条湖边跑步。\n`;
    output += `2. 你的左手指向湖内 → 这就是“正向”。\n`;
    output += `3. 如果你绕着湖跑一圈，身体始终朝外，手在湖里 → 方向就对了！\n\n`;
    
    output += `💡 **口诀**：> “左手抱湖，右手拍岸”\n\n`;
    
    output += `🛠️ **实操建议**：\n`;
    output += `1. 拿一张纸画一个闭合曲线（比如椭圆）\n`;
    output += `2. 在曲线上任取一点，画出切线方向\n`;
    output += `3. 想象自己站在那点，沿曲线走\n`;
    output += `4. 问：“我的左手是朝向区域内部吗？”\n`;
    output += `5. 如果是 → 正向；否则 → 反向\n\n`;
    
    output += `⚠️ **常见误区**：\n`;
    output += `- 认为“逆时针就是正向” → 错！只有区域在左边时才是\n`;
    output += `- 忽略“洞” → 环形区域：外圈正向（逆时针），内圈正向（顺时针）！\n\n`;
    
    output += `🎯 **本周任务**：\n`;
    output += `- 画三角形、圆形、带洞区域各一个\n`;
    output += `- 用“湖岸跑步法”标出正向\n`;
    output += `- 写下判断过程\n\n`;
  }
  
  // 极坐标
  else if (/极坐标|polar|r,θ|积分限|画图/.test(fullText)) {
    planType = 'polar';
    output += `🔍 **核心问题**：用直角坐标的“框”思维套极坐标的“生长”逻辑。\n`;
    output += `✅ **本周聚焦**：先定 θ 范围，再定 r 上下限。\n\n`;
    
    output += `📌 **思维实验**：\n`;
    output += `1. 想象雷达扫描：从 θ=0 开始，慢慢旋转到 θ=π\n`;
    output += `2. 在每个角度 θ，r 从 0 生长到边界\n`;
    output += `3. 边界可能是：r = sinθ（心形线）、r = 1（圆）等\n\n`;
    
    output += `🛠️ **实操建议**：\n`;
    output += `1. 画区域：r ≤ 1 + cosθ（心形线）\n`;
    output += `2. 问：θ 从多少到多少？→ 0 到 2π\n`;
    output += `3. 问：对每个 θ，r 从哪到哪？→ 0 到 1+cosθ\n`;
    output += `4. 写出积分限：∫₀²π ∫₀¹⁺ᶜᵒˢᶿ ...\n\n`;
    
    output += `⚠️ **常见误区**：\n`;
    output += `- 先定 r 再定 θ → 顺序反了！\n`;
    output += `- 忘记 r ≥ 0 → 当 1+cosθ < 0 时，实际 r=0\n\n`;
    
    output += `🎯 **本周任务**：\n`;
    output += `- 练习：r ≤ 2sinθ（上半圆）\n`;
    output += `- 写出 θ 和 r 的范围\n`;
    output += `- 计算面积 ∫∫ r dr dθ\n\n`;
  }
  
  // 隐函数求导
  else if (/隐函数|implicit|F\(x,y\)|dy\/dx/.test(fullText)) {
    planType = 'implicit';
    output += `🔍 **核心问题**：不敢对 F(x,y)=0 两边求导，是因为没看到“等高线”图像。\n`;
    output += `✅ **本周聚焦**：掌握 dy/dx = -Fₓ/Fᵧ 的几何意义。\n\n`;
    
    output += `📌 **思维实验**：\n`;
    output += `1. 想象地形图：F(x,y)=c 是等高线\n`;
    output += `2. 沿等高线走，高度不变 → dF = 0\n`;
    output += `3. 所以 Fₓ dx + Fᵧ dy = 0 → dy/dx = -Fₓ/Fᵧ\n\n`;
    
    output += `🛠️ **实操建议**：\n`;
    output += `1. 给定：x² + y² = 1\n`;
    output += `2. 设 F(x,y) = x² + y² - 1\n`;
    output += `3. 计算：Fₓ = 2x, Fᵧ = 2y\n`;
    output += `4. 所以：dy/dx = -2x/(2y) = -x/y\n`;
    output += `5. 验证：在 (0,1) 点，斜率为 0 → 水平切线，合理！\n\n`;
    
    output += `⚠️ **常见误区**：\n`;
    output += `- 直接对 y 求导忘记链式法则\n`;
    output += `- 不理解 Fᵧ ≠ 0 的条件（分母不能为零）\n\n`;
    
    output += `🎯 **本周任务**：\n`;
    output += `- 对 y³ + xy = 1 求 dy/dx\n`;
    output += `- 在点 (0,1) 计算切线斜率\n\n`;
  }
  
  // 重积分区域
  else if (/重积分|二重|三重|积分区域|画不出/.test(fullText)) {
    planType = 'multiple';
    output += `🔍 **核心问题**：试图脑补3D区域，而不是“切片→投影”降维。\n`;
    output += `✅ **本周聚焦**：学会画 xy 投影 + 确定 z 上下限。\n\n`;
    
    output += `📌 **思维实验**：\n`;
    output += `1. 想象切面包：把3D区域切成薄片（固定 z）\n`;
    output += `2. 每一片在 xy 平面的影子 → 投影区域 D\n`;
    output += `3. 对每个 (x,y) ∈ D，z 从下表面到上表面\n\n`;
    
    output += `🛠️ **实操建议**：\n`;
    output += `1. 区域：z = 1 - x² - y² 与 z = 0 之间\n`;
    output += `2. 投影：令 z=0 → x² + y² ≤ 1（单位圆）\n`;
    output += `3. 对每个 (x,y) ∈ 单位圆，z 从 0 到 1-x²-y²\n`;
    output += `4. 写出：∫∫_D [∫₀^{1-x²-y²} dz] dxdy\n\n`;
    
    output += `⚠️ **常见误区**：\n`;
    output += `- 直接写 ∫∫∫ ... 而不画投影\n`;
    output += `- 混淆 z 的上下限（谁在上？谁在下？）\n\n`;
    
    output += `🎯 **本周任务**：\n`;
    output += `- 区域：z = x² + y² 与 z = 4 之间\n`;
    output += `- 画出 xy 投影\n`;
    output += `- 写出三重积分表达式\n\n`;
  }
  
  // 通用建议
  else {
    output += `🧠 **你能说出困惑，这已经是突破的第一步。**\n`;
    output += `✅ **建议**：从一道错题开始，写下“我不懂为什么这里要______”。\n\n`;
  }

  // 时间 & 目标适配
  let dailyMin = 30;
  if (/少|<30|短|没时间/.test(timePerDay)) dailyMin = 15;
  else if (/1~2小时|60|以上/.test(timePerDay)) dailyMin = 60;

  let target = '期末过关';
  if (/考研/i.test(goal)) target = '考研数学';
  else if (/理解|真正/.test(goal)) target = '深度理解';

  output += `## 📅 你的专属【${target}】7天启动计划\n\n`;

  output += `### 🌟 每日必做（仅需 ${dailyMin} 分钟）\n`;
  output += `- **第1步**：完成上面的“本周任务”中的一小部分\n`;
  output += `- **第2步**：手写推导核心公式（哪怕抄一遍）\n`;
  if (dailyMin >= 30) {
    output += `- **第3步**：做 1 道典型例题（推荐：同济高数）\n`;
  }
  output += `\n`;

  // 7天计划（简化版）
  const weekPlans = {
    taylor: [
      "Day1: 理解 f(x) ≈ f(a) + f’(a)(x-a)",
      "Day2: 动手展开 e^x 到二阶",
      "Day3: 推导余项 R₂(x)",
      "Day4: 做1道近似计算题",
      "Day5: 对比不同展开点效果",
      "Day6: 整理常见函数展开表",
      "Day7: 模拟考：10分钟完成1道综合题"
    ],
    greens: [
      "Day1: 理解“左手抱湖”",
      "Day2: 画3个区域标正向",
      "Day3: 推导格林公式条件",
      "Day4: 做1道方向判断题",
      "Day5: 练习曲线积分转二重积分",
      "Day6: 总结：什么情况不能用？",
      "Day7: 模拟考：计算 ∮_C ..."
    ],
    polar: [
      "Day1: 画 r=sin(2θ), r=1+cosθ",
      "Day2: 练习写 θ 和 r 范围",
      "Day3: 计算1个极坐标积分",
      "Day4: 对比直角坐标效率",
      "Day5: 处理复杂区域",
      "Day6: 整理模板",
      "Day7: 模拟考：计算花瓣面积"
    ],
    implicit: [
      "Day1: 理解 F(x,y)=c 是等高线",
      "Day2: 推导 dy/dx = -Fₓ/Fᵧ",
      "Day3: 计算1个隐函数导数",
      "Day4: 理解几何意义",
      "Day5: 练习高阶求导",
      "Day6: 求切线方程",
      "Day7: 模拟考：给定 F(x,y,z)=0..."
    ],
    multiple: [
      "Day1: 理解“切片→投影”",
      "Day2: 画1个3D区域的投影",
      "Day3: 写出1个三重积分",
      "Day4: 练习交换积分次序",
      "Day5: 学柱坐标转换",
      "Day6: 练球坐标",
      "Day7: 模拟考：计算体积"
    ]
  };

  const plan = weekPlans[planType] || [
    "Day1: 找1道错题，写下卡点",
    "Day2: 看一个概念解释（如B站）",
    "Day3: 手写整理公式+条件",
    "Day4: 做3道基础题",
    "Day5: 尝试讲解给别人听",
    "Day6: 做1道综合题",
    "Day7: 复盘：哪些地方不再卡了？"
  ];

  plan.forEach((item, i) => {
    output += `- **${item}**\n`;
  });
  output += `\n`;

  // 工具箱
  output += `## 🧰 你的工具箱\n`;
  output += `- 📚 **教材重点**：同济《高等数学》第7版\n`;
  output += `- 🎥 **B站精选**：[3Blue1Brown 微积分本质](https://www.bilibili.com/video/BV1CAxaeHEeH?spm_id_from=333.788.videopod.episodes&vd_source=cbfd42c5d90f2e0917e8f72b9d3806f4&p=40)\n`;
  output += `- ✍️ **必备动作**：手写！手写！手写！\n\n`;

  // 情绪支持
  if (/急|焦虑|慌|崩溃|放弃|讨厌/.test(finalNote)) {
    output += `💌 **你说**：“${finalNote}”——我懂。\n`;
    output += `✨ **但请相信：高数不是天赋游戏，而是视角游戏。**\n`;
    output += `✅ **你不需要一次全懂，只需要每天推进1%。**\n\n`;
  }

  output += `🚀 **这份计划的价值，不在“完美”，而在“你今天就开始了”。**\n`;
  output += `💡 **现在，深呼吸，拿出草稿纸，写下第一个公式——你已经赢了。**`;

  return output;
}

// API 路由
app.post('/api/generate-plan', (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || (!answers.intro && !answers.finalNote)) {
      return res.status(400).json({ error: '请至少描述一点你的困惑，这是我们的起点 ❤️' });
    }
    const plan = generatePlan(answers);
    res.json({ plan });
  } catch (error) {
    console.error('生成失败:', error);
    res.status(500).json({ error: '服务器内部错误，请稍后重试。' });
  }
});

// ✅ 关键：监听 0.0.0.0
const PORT = process.env.PORT || 3002;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ MathInsight v13 · 纯建议版启动成功！`);
  console.log(`   访问: http://localhost:${PORT}`);
});
