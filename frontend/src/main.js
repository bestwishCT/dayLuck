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
    /焦虑|压力|紧张|担心|害怕|恐惧|不安|慌张|心慌/,
    [
      "学习有压力很正常，适当休息、分阶段完成任务会更轻松。相信你可以的！",
      "焦虑时可以深呼吸，给自己一点空间，慢慢来，一切都会好起来。",
      "你不是一个人在战斗，遇到压力可以和朋友或老师聊聊哦。"
    ]
  ],
  exam: [
    /考试|考|分数|成绩|挂科|复习|应试/,
    [
      "考试只是检验知识的方式之一，过程比结果更重要。加油！",
      "复习时可以做思维导图，帮助梳理知识点，考试会更有信心。",
      "别太在意一时的分数，未来还有很多机会等着你。"
    ]
  ],
  procrastination: [
    /拖延|懒|不想动|没动力|拖着|拖拉/,
    [
      "可以试试番茄钟法，专注25分钟后休息5分钟，效率会提升哦！",
      "动力不足时，给自己设个小奖励，完成任务后犒劳一下自己。",
      "每个人都会有拖延的时候，重要的是迈出第一步。"
    ]
  ],
  relationship: [
    /同学|朋友|同伴|关系|孤独|没人理|被排挤|社交|沟通/,
    [
      "和同学多交流，主动问候一句，友谊会慢慢建立起来。",
      "遇到人际问题时，先理解对方的感受，沟通会更顺畅。",
      "你很棒，值得被喜欢和尊重。孤独时可以和AI聊聊哦！"
    ]
  ],
  emotion: [
    /难过|沮丧|失落|不开心|想哭|抑郁|低落|烦躁/,
    [
      "情绪低落时可以听听喜欢的音乐，或者出去走走，心情会好转。",
      "每个人都会有不开心的时候，允许自己偶尔脆弱，但别忘了你很坚强。",
      "如果很难受，可以和信任的人聊聊，或者写下来释放情绪。"
    ]
  ],
  time: [
    /时间|管理|安排|拖延症|计划/,
    [
      "合理安排时间，列个清单，优先做重要的事。",
      "每天睡前花5分钟规划明天，效率会提升不少。",
      "时间管理不是做更多，而是做更重要的事。"
    ]
  ],
  interest: [
    /兴趣|爱好|喜欢|特长|培养/,
    [
      "培养兴趣可以让生活更有趣，试着多尝试新事物吧！",
      "有喜欢的事情就坚持下去，你会越来越棒。",
      "兴趣是最好的老师，享受学习的过程。"
    ]
  ],
  thanks: [
    /谢谢|感激|感恩|多谢|辛苦了/,
    [
      "很高兴能帮到你，有需要随时来找我哦！",
      "你的感谢让我很温暖，祝你每天都开心！",
      "不用客气，陪伴你是我的荣幸。"
    ]
  ],
  goodbye: [
    /再见|拜拜|下次见|走了|晚安|休息/,
    [
      "祝你有个美好的一天，我们下次再聊！",
      "早点休息，保持好心情，晚安！",
      "再见啦，记得常来和我说说话哦！"
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
