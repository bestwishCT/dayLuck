import './style.css';
import './app.css';

import {EncryptContent, DecryptContent} from '../wailsjs/go/main/App';

document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="card">
      <div class="tabs-container">
        <div class="tab-header">
          <div class="tab-item" data-tab="main-tab" style="display:none;">Main</div>
          <div class="tab-item" data-tab="crypto-tool-tab" style="display:none;">加密解密工具</div>
          <div class="tab-item active" data-tab="ai-helper-tab">AI小助手</div>
        </div>
        <div class="tab-content">
          <!-- Main Tab Content -->
          <div id="main-tab" class="tab-pane" style="display:none;">
            <div class="brand-section">
              <h1 class="title mb-2">Enterprise Suite</h1>
              <p class="subtitle mb-4">Professional Business Solutions</p>
            </div>
            
            <div class="status-bar mb-4">
              <div class="status-item">
                <span class="status-dot active"></span>
                <span class="status-text">System Ready</span>
              </div>
            </div>

            <div class="main-content">
              <div class="result mb-4" id="result-main">
                <div class="result-header">System Message</div>
                <div class="result-body">Please enter your name below 👇</div>
              </div>
              
              <div class="input-box flex mb-2">
                <input class="input" id="name" type="text" autocomplete="off" placeholder="Enter your name..." />
                <button class="btn ml-2" onclick="greet()">
                  <span class="btn-text">Submit</span>
                  <span class="btn-icon">→</span>
                </button>
              </div>
            </div>

            <div class="footer">
              <div class="version">Version 1.0.0</div>
              <div class="copyright">© 2024 Enterprise Solutions. All rights reserved.</div>
            </div>
          </div>

          <!-- Crypto Tool Tab Content -->
          <div id="crypto-tool-tab" class="tab-pane" style="display:none;">
            <h2 class="tab-title mb-4">CID加密&解密</h2>

            <div class="form-section mb-4">
              <h3 class="section-title mb-2">盐值设置</h3>
              <div class="input-group flex mb-2">
                <input class="input" id="decode-key-input" type="text" placeholder="请输入盐值 (默认: 11.nWv01123f000n)" value="11.nWv01123f000n" />
              </div>
            </div>

            <div class="form-section mb-4">
              <h3 class="section-title mb-2">加密内容</h3>
              <div class="input-group flex mb-2">
                <input class="input" id="encrypt-input" type="text" placeholder="请输入加密内容..." />
                <button class="btn ml-2" id="encrypt-btn">加密</button>
              </div>
              <div class="char-count mb-2">字符数量: <span id="encrypt-char-count">0</span></div>
              <h3 class="section-title mb-2">加密结果:</h3>
              <div class="result-display" id="encrypt-result"></div>
            </div>

            <div class="form-section">
              <h3 class="section-title mb-2">解密内容</h3>
              <div class="input-group flex mb-2">
                <input class="input" id="decrypt-input" type="text" placeholder="请输入加密后的内容..." />
                <button class="btn ml-2" id="decrypt-btn">解密</button>
              </div>
              <h3 class="section-title mb-2">解密结果:</h3>
              <div class="result-display" id="decrypt-result"></div>
            </div>

          </div>

          <!-- AI Helper Tab Content -->
          <div id="ai-helper-tab" class="tab-pane">
            <div class="brand-section">
              <img src="./assets/images/logo-universal.png" alt="AI小助手" style="width:80%;max-width:320px;height:auto;display:block;margin:0 auto 1.2rem auto;border-radius:1.2rem;box-shadow:0 2px 24px #e0e7ef;" />
              <h1 class="title mb-2">AI小助手</h1>
              <p class="subtitle mb-4">陪伴你每一天，传递正能量</p>
            </div>
            <div class="main-content">
              <div class="result mb-4" id="ai-chat-area" style="height:180px;overflow-y:auto;background:#f8fbfd;border-radius:0.8rem;padding:1rem;text-align:left;font-size:1rem;"></div>
              <div class="input-box flex mb-2">
                <input class="input" id="ai-chat-input" type="text" autocomplete="off" placeholder="和AI聊聊你的烦恼或目标..." />
                <button class="btn ml-2" id="ai-chat-send-btn">
                  <span class="btn-text">发送</span>
                  <span class="btn-icon">💬</span>
                </button>
              </div>
            </div>
            <div class="footer">
              <div class="version">今日祝福：<span id="ai-daily-blessing"></span></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
  <div style="position:fixed;left:0;right:0;bottom:2.5vh;z-index:999;text-align:center;font-size:1.25rem;font-weight:bold;color:#888;letter-spacing:0.12em;user-select:none;">吴影非老师作品 侵权必究</div>
`;

const mainResultElement = document.getElementById("result-main");
const mainNameElement = document.getElementById("name");

mainNameElement.focus();

// Greet function for Main Tab
window.greet = function () {
  let name = mainNameElement.value;
  if (name === "") return;
  mainResultElement.innerText = `Hello ${name}, It's show time!`;
};

// Tab switching logic
const tabHeaders = document.querySelectorAll('.tab-item');
const tabPanes = document.querySelectorAll('.tab-pane');

function switchTab(targetTabId) {
  // Remove active class from all tabs and panes
  tabHeaders.forEach(item => item.classList.remove('active'));
  tabPanes.forEach(pane => pane.classList.remove('active'));

  // Add active class to target tab and pane
  const targetHeader = document.querySelector(`[data-tab="${targetTabId}"]`);
  const targetPane = document.getElementById(targetTabId);
  
  if (targetHeader && targetPane) {
    targetHeader.classList.add('active');
    targetPane.classList.add('active');
  }
}

tabHeaders.forEach(header => {
  header.addEventListener('click', () => {
    const targetTab = header.getAttribute('data-tab');
    switchTab(targetTab);
  });
});

// Crypto Tool Logic
const decodeKeyInput = document.getElementById('decode-key-input');
const encryptInput = document.getElementById('encrypt-input');
const encryptBtn = document.getElementById('encrypt-btn');
const encryptCharCount = document.getElementById('encrypt-char-count');
const encryptResult = document.getElementById('encrypt-result');

const decryptInput = document.getElementById('decrypt-input');
const decryptBtn = document.getElementById('decrypt-btn');
const decryptResult = document.getElementById('decrypt-result');

// Update character count for encryption input
encryptInput.addEventListener('input', () => {
  encryptCharCount.innerText = encryptInput.value.length;
});

// Encrypt button click handler
encryptBtn.addEventListener('click', async () => {
  const content = encryptInput.value;
  const key = decodeKeyInput.value;
  if (content === "") {
    encryptResult.innerText = "";
    return;
  }
  try {
    const result = await EncryptContent(content, key);
    encryptResult.innerText = result;
  } catch (err) {
    console.error(err);
    encryptResult.innerText = `Error: ${err}`;
  }
});

// Decrypt button click handler
decryptBtn.addEventListener('click', async () => {
  const content = decryptInput.value;
  const key = decodeKeyInput.value;
  if (content === "") {
    decryptResult.innerText = "";
    return;
  }
  try {
    const result = await DecryptContent(content, key);
    decryptResult.innerText = result;
  } catch (err) {
    console.error(err);
    decryptResult.innerText = `Error: ${err}`;
  }
});

// AI Helper 语录、贴士、祝福
const aiQuotes = [
  "你很棒，别忘了给自己点赞！",
  "每一次努力，都是幸运的伏笔。",
  "相信自己，你比想象中更强大。",
  "失败是成功之母，勇敢迈出下一步！",
  "保持微笑，阳光总在风雨后。"
];
const aiTips = [
  "学习时记得劳逸结合，效率更高哦！",
  "制定小目标，一步步实现更容易。",
  "遇到难题先别急，分解成小问题试试。",
  "每天复盘一下，进步看得见。",
  "和同学交流，互帮互助更快乐。"
];
const aiBlessings = [
  "愿你今天元气满满，收获满满！",
  "新的一天，新的开始，加油！",
  "祝你学习进步，心情愉快！",
  "好运常伴你左右！",
  "愿你每天都能遇见美好。"
];

// 扩充AI小助手语料和规则
const aiScenes = {
  anxiety: [
    /焦虑|压力|紧张|担心|害怕|恐惧|不安|慌张|心慌|焦急|焦躁|烦恼|负担/,
    [
      "学习有压力很正常，适当休息、分阶段完成任务会更轻松。相信你可以的！",
      "焦虑时可以深呼吸，给自己一点空间，慢慢来，一切都会好起来。",
      "你不是一个人在战斗，遇到压力可以和朋友或老师聊聊哦。",
      "压力大时可以试试运动或听音乐，放松一下心情。",
      "每个人都会有焦虑的时候，重要的是学会自我调节。",
      "可以写下你的烦恼，分解成小问题逐步解决。",
      "适当的压力能激发潜力，但别让它压垮你。",
      "和信任的人聊聊你的感受，会有意想不到的收获。",
      "给自己一些积极的心理暗示，比如'我可以做到'。",
      "相信时间会带来答案，慢慢来，一切都会好起来。"
    ]
  ],
  exam: [
    /考试|考|分数|成绩|挂科|复习|应试|考前|考后|考场|考卷|测验/,
    [
      "考试只是检验知识的方式之一，过程比结果更重要。加油！",
      "复习时可以做思维导图，帮助梳理知识点，考试会更有信心。",
      "别太在意一时的分数，未来还有很多机会等着你。",
      "考前适当休息，保持好心态，发挥会更好。",
      "考后无论结果如何，努力过就不后悔。",
      "可以和同学组队复习，互相讲解更容易记住。",
      "错题本是提升的利器，考后及时整理错题。",
      "考试紧张时可以做几次深呼吸，缓解情绪。",
      "相信自己，平时的积累会在考场上发挥出来。",
      "每一次考试都是成长的机会。"
    ]
  ],
  procrastination: [
    /拖延|懒|不想动|没动力|拖着|拖拉|拖延症|明天再说|拖到最后/,
    [
      "可以试试番茄钟法，专注25分钟后休息5分钟，效率会提升哦！",
      "动力不足时，给自己设个小奖励，完成任务后犒劳一下自己。",
      "每个人都会有拖延的时候，重要的是迈出第一步。",
      "把大任务拆成小目标，一步步完成会更容易。",
      "写下待办清单，完成一项打个勾，成就感满满。",
      "和朋友一起学习，互相监督更有动力。",
      "早起10分钟，给自己一个积极的开始。",
      "拖延时可以想想完成后的轻松感。",
      "给自己设定截止时间，适度压力有助于行动。",
      "相信自己可以战胜拖延，行动起来！"
    ]
  ],
  motivation: [
    /动力|坚持|放弃|难|累|没劲|不想学|受挫|泄气|迷茫|无助/,
    [
      "遇到困难别气馁，坚持下去你会看到不一样的风景！",
      "每个人都会有低谷，重要的是不要放弃。",
      "给自己设定一个小目标，逐步实现会更有成就感。",
      "可以回顾一下自己曾经的进步，给自己加油。",
      "和朋友聊聊，互相鼓励会更有力量。",
      "适当休息后再出发，效率会更高。",
      "失败是成功之母，每一次经历都是成长。",
      "相信自己，你比想象中更强大。",
      "给自己一些积极的心理暗示，比如'我可以做到'。",
      "坚持下去，未来一定会感谢现在努力的你。"
    ]
  ],
  relationship: [
    /同学|朋友|同伴|关系|孤独|没人理|被排挤|社交|沟通|同桌|同伴|集体|团队/,
    [
      "和同学多交流，主动问候一句，友谊会慢慢建立起来。",
      "遇到人际问题时，先理解对方的感受，沟通会更顺畅。",
      "你很棒，值得被喜欢和尊重。孤独时可以和AI聊聊哦！",
      "可以参加社团或兴趣小组，结识更多朋友。",
      "遇到误会时，主动沟通最重要。",
      "每个人都有被理解和接纳的权利。",
      "友谊需要用心经营，真诚最重要。",
      "和朋友一起分享快乐和烦恼，感情会更深。",
      "遇到排挤时要相信自己，世界很大，总有人懂你。",
      "社交不是强求，做自己最舒服。"
    ]
  ],
  family: [
    /家人|父母|妈妈|爸爸|家庭|亲情|家里|家/,
    [
      "家人永远是你最坚强的后盾。",
      "和父母多沟通，分享你的想法和感受。",
      "有时间多陪陪家人，温暖彼此的心。",
      "家是最温暖的港湾，无论遇到什么都可以回去。",
      "父母有时表达方式不同，但他们都爱你。",
      "遇到家庭矛盾时，冷静沟通很重要。",
      "珍惜和家人在一起的时光。",
      "家人的鼓励是前进的动力。",
      "有困难时可以向家人寻求帮助。",
      "家是你永远的避风港。"
    ]
  ],
  love: [
    /喜欢谁|暗恋|恋爱|表白|感情|情侣|分手|失恋|心动|暧昧|喜欢我|喜欢你/,
    [
      "感情的事顺其自然，真心最重要。",
      "喜欢一个人是美好的体验，勇敢表达自己。",
      "恋爱中要学会尊重和包容。",
      "失恋虽然难过，但也是成长的一部分。",
      "表白需要勇气，也要做好接受结果的准备。",
      "感情需要双方共同经营。",
      "遇到喜欢的人要珍惜缘分。",
      "分手不是终点，未来会遇到更适合的人。",
      "心动是美好的，享受当下的感觉。",
      "爱情不是生活的全部，自己也很重要。"
    ]
  ],
  future: [
    /目标|计划|规划|未来|理想|梦想|志向|方向|人生/,
    [
      "为自己设定一个小目标，逐步实现会更有成就感。需要帮忙一起规划吗？",
      "未来充满无限可能，勇敢追梦吧！",
      "有梦想就要坚持，哪怕路很远。",
      "人生的方向可以慢慢摸索，不必着急。",
      "计划可以随时调整，重要的是行动。",
      "理想是人生的灯塔，照亮前行的路。",
      "遇到迷茫时可以和信任的人聊聊。",
      "每个人都有属于自己的精彩人生。",
      "一步步来，未来会越来越清晰。",
      "相信自己，未来可期。"
    ]
  ],
  emotion: [
    /难过|沮丧|失落|不开心|想哭|抑郁|低落|烦躁|情绪|心情差|心烦|郁闷/,
    [
      "情绪低落时可以听听喜欢的音乐，或者出去走走，心情会好转。",
      "每个人都会有不开心的时候，允许自己偶尔脆弱，但别忘了你很坚强。",
      "如果很难受，可以和信任的人聊聊，或者写下来释放情绪。",
      "心情不好时可以做点喜欢的事转移注意力。",
      "允许自己偶尔难过，但别让情绪控制你。",
      "可以试试冥想或深呼吸，缓解情绪。",
      "和朋友聊聊天，心情会变好。",
      "写日记也是释放情绪的好方法。",
      "给自己一个拥抱，你值得被温柔对待。",
      "相信明天会更好。"
    ]
  ],
  time: [
    /时间|管理|安排|拖延症|计划|日程|表格|时间表|效率/,
    [
      "合理安排时间，列个清单，优先做重要的事。",
      "每天睡前花5分钟规划明天，效率会提升不少。",
      "时间管理不是做更多，而是做更重要的事。",
      "用番茄钟法提升专注力。",
      "制定时间表，按计划执行。",
      "学会拒绝不重要的事情，专注于目标。",
      "定期复盘，调整自己的时间安排。",
      "用闹钟提醒自己按时休息和学习。",
      "效率高时多做点，效率低时适当休息。",
      "时间宝贵，珍惜每一天。"
    ]
  ],
  interest: [
    /兴趣|爱好|喜欢|特长|培养|新技能|新事物|尝试/,
    [
      "培养兴趣可以让生活更有趣，试着多尝试新事物吧！",
      "有喜欢的事情就坚持下去，你会越来越棒。",
      "兴趣是最好的老师，享受学习的过程。",
      "多参加兴趣小组，结识志同道合的朋友。",
      "尝试新技能，发现不一样的自己。",
      "兴趣可以缓解压力，让生活更有色彩。",
      "把兴趣和学习结合起来，事半功倍。",
      "每个人都有独特的兴趣和天赋。",
      "培养兴趣需要时间和耐心。",
      "享受兴趣带来的快乐。"
    ]
  ],
  health: [
    /健康|生病|感冒|发烧|头疼|身体|锻炼|运动|饮食|作息|睡眠/,
    [
      "健康是最重要的财富，注意休息和饮食。",
      "生病时要及时就医，别硬撑。",
      "每天适当运动，保持身体活力。",
      "多喝水，少熬夜，规律作息。",
      "感冒时多喝热水，注意保暖。",
      "头疼时可以适当休息，避免用脑过度。",
      "饮食均衡，营养全面。",
      "保持良好的心态有助于健康。",
      "睡眠充足，精神才会更好。",
      "健康第一，学习第二。"
    ]
  ],
  entertainment: [
    /娱乐|放松|休息|游戏|电影|音乐|追剧|旅游|玩/,
    [
      "适当娱乐有助于身心健康。",
      "学习之余可以玩会儿游戏放松一下。",
      "看一部喜欢的电影，享受美好时光。",
      "听音乐可以缓解压力。",
      "和朋友一起旅游，开阔视野。",
      "追剧时注意别熬夜哦。",
      "娱乐和学习要平衡。",
      "休息好才能更好地学习。",
      "偶尔放松一下，给自己充电。",
      "生活需要仪式感，娱乐也是一种奖励。"
    ]
  ],
  thanks: [
    /谢谢|感激|感恩|多谢|辛苦了|感谢/,
    [
      "很高兴能帮到你，有需要随时来找我哦！",
      "你的感谢让我很温暖，祝你每天都开心！",
      "不用客气，陪伴你是我的荣幸。",
      "感谢你的信任，愿你每天都有好心情。",
      "有你这样的朋友真好。",
      "你的善良让我感动。",
      "谢谢你的支持，我们一起加油！",
      "感恩遇见，愿你幸福。",
      "你的每一句感谢都是我前进的动力。",
      "祝你一切顺利！"
    ]
  ],
  goodbye: [
    /再见|拜拜|下次见|走了|晚安|休息|下线|明天见|回头见/,
    [
      "祝你有个美好的一天，我们下次再聊！",
      "早点休息，保持好心情，晚安！",
      "再见啦，记得常来和我说说话哦！",
      "下次见，期待你的好消息。",
      "祝你做个好梦。",
      "明天会更好！",
      "下线休息也要记得照顾好自己。",
      "回头见，别忘了我哦！",
      "有空常来聊聊。",
      "晚安，愿你有个甜美的梦。"
    ]
  ],
  // 闲聊趣味
  joke: [
    /笑话|讲个笑话|逗我笑|来点幽默/,
    [
      "为什么书包会动？因为里面有书（鼠）！",
      "小明考试只考了1分，老师问他为什么，他说：因为卷子太难，连蒙都不会。",
      "有一天，一只小鸭走丢了，结果变成了迷路鸭（米老鸭）。",
      "为什么鱼不说话？因为水里有话（化）学反应。",
      "老师：你为什么上课睡觉？学生：因为我在梦里学习。",
      "小狗为什么不吃骨头？因为它在减肥。",
      "为什么电脑很累？因为它有很多工作要处理（process）。",
      "小明为什么喜欢数学？因为他觉得有理（有理数）！",
      "为什么星星不会迷路？因为它们有导航（银河）。",
      "你笑了没？没笑我再来一个！"
    ]
  ],
  chicken_soup: [
    /鸡汤|励志|鼓励我|正能量|来点鸡汤/,
    [
      "你要相信，所有的努力都不会被辜负。",
      "每一个不曾起舞的日子，都是对生命的辜负。",
      "你现在的努力，是为了以后有更多选择的权利。",
      "人生没有白走的路，每一步都算数。",
      "坚持下去，属于你的风景终会出现。",
      "别怕路远，只要你愿意走，总会到达。",
      "你很棒，别怀疑自己。",
      "每一天都是新的开始，勇敢迎接挑战。",
      "相信自己，你值得拥有更好的未来。",
      "阳光总在风雨后。"
    ]
  ],
  weather: [
    /天气|下雨|晴天|阴天|气温|冷|热|温度/,
    [
      "今天天气不错，适合学习和锻炼！",
      "下雨天记得带伞，注意保暖哦。",
      "晴天心情也会变好，出去走走吧。",
      "天气冷要多穿点，别感冒了。",
      "天气热要多喝水，注意防晒。",
      "阴天也要保持好心情。",
      "气温变化大，注意增减衣物。",
      "无论什么天气，心情都要阳光。",
      "天气只是外在，心情才最重要。",
      "希望今天的天气和你的心情一样美好。"
    ]
  ],
  constellation: [
    /星座|运势|十二星座|白羊|金牛|双子|巨蟹|狮子|处女|天秤|天蝎|射手|摩羯|水瓶|双鱼/,
    [
      "星座只是参考，真正决定命运的是你自己。",
      "今天的运势不错，适合尝试新事物。",
      "白羊座：勇敢果断，今天适合行动。",
      "金牛座：踏实努力，注意劳逸结合。",
      "双子座：思维活跃，多和朋友交流。",
      "巨蟹座：关心家人，温暖他人。",
      "狮子座：自信大方，勇敢表达自己。",
      "处女座：细心认真，适合整理计划。",
      "天秤座：注重平衡，适合社交。",
      "天蝎座：神秘专注，适合深入学习。",
      "射手座：乐观开朗，适合户外活动。",
      "摩羯座：务实上进，适合制定目标。",
      "水瓶座：创新独立，适合头脑风暴。",
      "双鱼座：感性温柔，适合艺术创作。"
    ]
  ],
  about: [
    /你是谁|你能做什么|自我介绍|你的功能|你的名字|你会什么|你是什么/,
    [
      "我是你的AI小助手，专注陪伴和正能量，随时为你解答和鼓励！",
      "我能陪你聊天、解答疑惑、给你正能量和学习建议。",
      "你可以和我聊学习、生活、情感、娱乐等各种话题。",
      "我是本地运行的AI小助手，不联网也能陪伴你。",
      "我的目标是让你每天都能感受到温暖和鼓励。",
      "你可以问我任何问题，我会尽力帮你。",
      "我会讲笑话、分享鸡汤、给你祝福，还能帮你规划目标。",
      "我是你的专属陪伴型AI，有我在你不会孤单。",
      "我会不断学习，变得更懂你。",
      "很高兴认识你！"
    ]
  ],
  chat: [
    /你好|hi|hello|哈喽|在吗|嗨|hey|早上好|中午好|下午好|晚上好/,
    [
      "你好呀，很高兴见到你！",
      "嗨，有什么想聊的吗？",
      "我一直都在，陪你一起成长。",
      "早上好，新的一天开始啦！",
      "中午好，记得吃饭哦！",
      "下午好，学习加油！",
      "晚上好，辛苦一天了，放松一下吧。",
      "hi，有什么烦恼都可以和我说。",
      "哈喽，今天心情怎么样？",
      "我在呢，随时等你来聊。"
    ]
  ]
};

function aiReply(userMsg) {
  const msg = userMsg.trim();
  if (!msg) return "说说你的想法吧，我一直在~";
  for (const key in aiScenes) {
    if (aiScenes[key][0].test(msg)) {
      const arr = aiScenes[key][1];
      return arr[Math.floor(Math.random()*arr.length)];
    }
  }
  // 学习贴士
  if (/学习|方法|效率|记忆/.test(msg)) {
    return aiTips[Math.floor(Math.random()*aiTips.length)];
  }
  // 祝福
  if (/祝福|好运|开心|快乐/.test(msg)) {
    return aiBlessings[Math.floor(Math.random()*aiBlessings.length)];
  }
  // 随机温暖语录
  if (Math.random() < 0.4) {
    return aiQuotes[Math.floor(Math.random()*aiQuotes.length)];
  }
  return "我一直在你身边，有什么都可以和我说哦！";
}

// AI小助手聊天逻辑
const aiChatArea = document.getElementById('ai-chat-area');
const aiChatInput = document.getElementById('ai-chat-input');
const aiChatSendBtn = document.getElementById('ai-chat-send-btn');
const aiDailyBlessing = document.getElementById('ai-daily-blessing');

function appendAIChat(role, text) {
  const color = role === 'user' ? '#357bd6' : '#27ae60';
  const align = role === 'user' ? 'right' : 'left';
  aiChatArea.innerHTML += `<div style="text-align:${align};margin:6px 0;"><span style="display:inline-block;max-width:80%;background:${role==='user'?'#eaf2f8':'#e0f7e9'};color:${color};padding:6px 12px;border-radius:1em;">${text}</span></div>`;
  aiChatArea.scrollTop = aiChatArea.scrollHeight;
}

function sendAIChat() {
  const userMsg = aiChatInput.value;
  if (!userMsg.trim()) return;
  appendAIChat('user', userMsg);
  setTimeout(() => {
    const reply = aiReply(userMsg);
    appendAIChat('ai', reply);
  }, 400);
  aiChatInput.value = '';
}
aiChatSendBtn.onclick = sendAIChat;
aiChatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendAIChat();
});
// 初始显示每日祝福
if (aiDailyBlessing) {
  aiDailyBlessing.innerText = aiBlessings[Math.floor(Math.random()*aiBlessings.length)];
}
