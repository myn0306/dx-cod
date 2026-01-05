// DX人材セルフチェック診断ツール
// バージョン: 1.0.0

const STORAGE_KEY = 'dx_skills_assessment_progress';

let currentStep = 'start';
let currentQuestionIndex = 0;
let answers = [];

// ローカルストレージ管理
function saveProgress() {
  try {
    const progress = {
      currentStep: currentStep,
      currentQuestionIndex: currentQuestionIndex,
      answers: answers
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('保存エラー:', error);
  }
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const progress = JSON.parse(saved);
      currentStep = progress.currentStep || 'start';
      currentQuestionIndex = progress.currentQuestionIndex || 0;
      answers = progress.answers || [];
      return true;
    }
  } catch (error) {
    console.error('読み込みエラー:', error);
  }
  return false;
}

function clearProgress() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('クリアエラー:', error);
  }
}

// STEP1: 現在地確認（5問）
const preQuestions = [
  {
    icon: "person",
    text: "あなたの現在の状況に最も近いものを選んでください",
    type: "single",
    options: [
      "DX推進部門・CDO候補",
      "IT部門からDX領域へ移行中",
      "事業部門でDXプロジェクトを担当",
      "経営層（DX戦略に関心）",
      "DX人材を目指して学習中",
      "その他"
    ]
  },
  {
    icon: "thought",
    text: "DXに取り組む上で、現在感じている課題を全て選んでください（複数選択可）",
    type: "multiple",
    options: [
      "技術的な知識が不足している",
      "経営層の理解が得られない",
      "現場の抵抗が強い",
      "予算・リソースが確保できない",
      "自分のスキルに自信がない",
      "孤独感・孤立感を感じる",
      "短期的な成果を求められる",
      "特にない"
    ]
  },
  {
    icon: "growth",
    text: "過去にこのような経験はありますか？（複数選択可）",
    type: "multiple",
    options: [
      "DXプロジェクトをリードした",
      "組織変革で抵抗勢力と対峙した",
      "技術導入の失敗を経験した",
      "経営層へのプレゼンで苦労した",
      "部門間の調整で板挟みになった",
      "まだない"
    ]
  },
  {
    icon: "star",
    text: "DX推進で最も大切にしたいことを3つ選んでください",
    type: "multiple",
    maxSelect: 3,
    options: [
      "技術的な正しさ・品質",
      "ビジネス成果・ROI",
      "組織文化の変革",
      "人材育成・能力開発",
      "顧客体験の向上",
      "業務効率化",
      "イノベーション創出",
      "持続可能な変革",
      "倫理的配慮",
      "自分自身の成長"
    ]
  },
  {
    icon: "rainbow",
    text: "3年後、あなたはどんな存在でありたいですか？",
    type: "single",
    options: [
      "技術に精通したDXアーキテクト",
      "組織を動かすチェンジリーダー",
      "技術と経営の橋渡し役",
      "人を育てるDXエバンジェリスト",
      "まだ明確ではない"
    ]
  }
];

// STEP2: 4層スキルチェック（48問）
const mainQuestions = [
  // 【第1層】技術的理解 - A. 技術の目利き力（4問）
  {
    icon: "star",
    text: "新しいツールを導入する際、「最新技術だから」という理由だけで決めることはない",
    type: "check",
    layer: "tech",
    category: "judgment"
  },
  {
    icon: "star",
    text: "AIやクラウドの「できないこと」「リスク」を、具体的に説明できる",
    type: "check",
    layer: "tech",
    category: "judgment"
  },
  {
    icon: "star",
    text: "古いシステムの価値を認めつつ、段階的な移行計画を描ける",
    type: "check",
    layer: "tech",
    category: "judgment"
  },
  {
    icon: "star",
    text: "技術トレンドに触れても、冷静に自組織との距離を測れる",
    type: "check",
    layer: "tech",
    category: "judgment"
  },
  
  // B. データとビジネスの接続（4問）
  {
    icon: "growth",
    text: "データの数字を見て、「これは何を意味するか」「次のアクションは何か」を言語化できる",
    type: "check",
    layer: "tech",
    category: "data"
  },
  {
    icon: "growth",
    text: "DXの成果を測る具体的なKPIを設定し、定期的に振り返っている",
    type: "check",
    layer: "tech",
    category: "data"
  },
  {
    icon: "growth",
    text: "データを特定の人だけが見られる状態から、必要な人が見られる状態に変えている",
    type: "check",
    layer: "tech",
    category: "data"
  },
  {
    icon: "growth",
    text: "技術投資の判断を、データに基づいて経営層に説明できる",
    type: "check",
    layer: "tech",
    category: "data"
  },
  
  // C. セキュリティとコンプライアンス（4問）
  {
    icon: "star",
    text: "データプライバシーやセキュリティのリスクを理解し、対策を講じている",
    type: "check",
    layer: "tech",
    category: "security"
  },
  {
    icon: "star",
    text: "法規制やコンプライアンス要件を考慮した技術選定ができる",
    type: "check",
    layer: "tech",
    category: "security"
  },
  {
    icon: "star",
    text: "セキュリティインシデント発生時の対応手順を理解している",
    type: "check",
    layer: "tech",
    category: "security"
  },
  {
    icon: "star",
    text: "技術的負債とセキュリティリスクのバランスを取りながら判断できる",
    type: "check",
    layer: "tech",
    category: "security"
  },
  
  // 【第2層】組織的影響力 - D. 対話と翻訳の力（4問）
  {
    icon: "person",
    text: "経営層・現場・技術者、それぞれに響く言葉で同じ内容を語れる",
    type: "check",
    layer: "org",
    category: "dialogue"
  },
  {
    icon: "person",
    text: "プレゼンを「説得の場」ではなく「対話の場」として設計している",
    type: "check",
    layer: "org",
    category: "dialogue"
  },
  {
    icon: "person",
    text: "反対意見を聞いて、その背景にある価値観を理解しようとする",
    type: "check",
    layer: "org",
    category: "dialogue"
  },
  {
    icon: "person",
    text: "部門間の温度差や対立を事前に予測し、調整の手を打てる",
    type: "check",
    layer: "org",
    category: "dialogue"
  },
  
  // E. 変化への伴走（4問）
  {
    icon: "thought",
    text: "失敗が起きたとき、犯人探しではなく「学び」を共有する文化を作っている",
    type: "check",
    layer: "org",
    category: "change"
  },
  {
    icon: "thought",
    text: "大きな変革の前に、小さな成功体験を意図的に設計している",
    type: "check",
    layer: "org",
    category: "change"
  },
  {
    icon: "thought",
    text: "抵抗勢力の声を「貴重な情報源」として扱える",
    type: "check",
    layer: "org",
    category: "change"
  },
  {
    icon: "thought",
    text: "世代間・職種間で互いに学び合える場を作っている",
    type: "check",
    layer: "org",
    category: "change"
  },
  
  // F. 人材育成と文化づくり（4問）
  {
    icon: "growth",
    text: "「教える」ではなく「学び続ける文化」を育てている",
    type: "check",
    layer: "org",
    category: "culture"
  },
  {
    icon: "growth",
    text: "ITリテラシーの違いを、それぞれのペースで尊重している",
    type: "check",
    layer: "org",
    category: "culture"
  },
  {
    icon: "growth",
    text: "ツールを押し付けず、選択肢を示して自分で選べるよう支援している",
    type: "check",
    layer: "org",
    category: "culture"
  },
  {
    icon: "growth",
    text: "「分からないことを聞ける空気」を意識的に作っている",
    type: "check",
    layer: "org",
    category: "culture"
  },
  
  // G. 政治力と資源確保（4問）
  {
    icon: "star",
    text: "経営層から信頼され、必要な権限を得ている",
    type: "check",
    layer: "org",
    category: "politics"
  },
  {
    icon: "star",
    text: "新しい施策のために、古い業務を具体的に廃止する決断をしている",
    type: "check",
    layer: "org",
    category: "politics"
  },
  {
    icon: "star",
    text: "短期的な成果が見えなくても、未来のためのリソースを死守している",
    type: "check",
    layer: "org",
    category: "politics"
  },
  {
    icon: "star",
    text: "全体最適のために、一時的に嫌われる覚悟を持っている",
    type: "check",
    layer: "org",
    category: "politics"
  },
  
  // 【第3層】哲学的軸 - H. 組織の存在意義との接続（3問）
  {
    icon: "rainbow",
    text: "「なぜDXをするのか」を、効率化以上の言葉で語れる",
    type: "check",
    layer: "philosophy",
    category: "purpose"
  },
  {
    icon: "rainbow",
    text: "デジタル化で失われるもの（対面の温かさ、手作業の価値）に誠実な眼差しを持っている",
    type: "check",
    layer: "philosophy",
    category: "purpose"
  },
  {
    icon: "rainbow",
    text: "短期的な成果圧力と、長期的な変容の現実の間で、戦略的なバランスを取れている",
    type: "check",
    layer: "philosophy",
    category: "purpose"
  },
  
  // I. 不確実性への向き合い方（3問）
  {
    icon: "thought",
    text: "DXに正解がないことを受け入れ、走りながら軌道修正する勇気を持っている",
    type: "check",
    layer: "philosophy",
    category: "uncertainty"
  },
  {
    icon: "thought",
    text: "「分からない」「一緒に考えたい」と正直に伝えられる",
    type: "check",
    layer: "philosophy",
    category: "uncertainty"
  },
  {
    icon: "thought",
    text: "変化が遅くても、人が変わるには時間がかかることを理解し、焦らず伴走できる",
    type: "check",
    layer: "philosophy",
    category: "uncertainty"
  },
  
  // J. 倫理と人間中心（3問）
  {
    icon: "person",
    text: "「技術的に可能か」だけでなく「人を幸せにするか」を問い続けている",
    type: "check",
    layer: "philosophy",
    category: "ethics"
  },
  {
    icon: "person",
    text: "自動化の目的を、人が本来向き合うべきことに時間を使えるようにすることだと理解している",
    type: "check",
    layer: "philosophy",
    category: "ethics"
  },
  {
    icon: "person",
    text: "デジタルが苦手な人を置き去りにしない仕組みを意図的に作っている",
    type: "check",
    layer: "philosophy",
    category: "ethics"
  },
  
  // K. 外部との接続（3問）
  {
    icon: "growth",
    text: "社外に壁打ち相手や同志がいて、客観的な視点を得ている",
    type: "check",
    layer: "philosophy",
    category: "external"
  },
  {
    icon: "growth",
    text: "社内の効率化だけでなく、エンドユーザーの喜びを議論の中心に置いている",
    type: "check",
    layer: "philosophy",
    category: "external"
  },
  {
    icon: "growth",
    text: "他業界の事例から謙虚に学び、自組織に翻訳している",
    type: "check",
    layer: "philosophy",
    category: "external"
  },
  
  // 【第4層】サステナビリティ - L. 自分の芯のメンテナンス（4問）
  {
    icon: "star",
    text: "忙しくても、自分がなぜ変革を志したのかを思い出す時間を確保している",
    type: "check",
    layer: "sustain",
    category: "core"
  },
  {
    icon: "star",
    text: "孤独を受け入れ、適切に感情をリセットする術を持っている",
    type: "check",
    layer: "sustain",
    category: "core"
  },
  {
    icon: "star",
    text: "完璧である必要はないと、自分に許可している",
    type: "check",
    layer: "sustain",
    category: "core"
  },
  {
    icon: "star",
    text: "体と心の限界信号に気づき、立ち止まる判断ができる",
    type: "check",
    layer: "sustain",
    category: "core"
  },
  
  // M. 楽しさと意味の両立（4問）
  {
    icon: "rainbow",
    text: "自己診断を「やらされ感」ではなく、成長確認のワクワクとして捉えられる",
    type: "check",
    layer: "sustain",
    category: "joy"
  },
  {
    icon: "rainbow",
    text: "できていないことを責めず、「伸びしろ」として観察できる",
    type: "check",
    layer: "sustain",
    category: "joy"
  },
  {
    icon: "rainbow",
    text: "小さな達成を自分で祝う習慣がある",
    type: "check",
    layer: "sustain",
    category: "joy"
  },
  {
    icon: "rainbow",
    text: "DXの仕事そのものに、楽しさを見出せている",
    type: "check",
    layer: "sustain",
    category: "joy"
  }
];

// チェックボックスの選択肢
const checkOptions = [
  { value: 5, emoji: "◎", text: "自然にできている" },
  { value: 3, emoji: "○", text: "意識すればできる" },
  { value: 1, emoji: "△", text: "まだできていない" },
  { value: 0, emoji: "？", text: "考えたことがない" }
];

// SVGアイコン定義
function getIconSVG(iconName) {
  const icons = {
    person: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="100" cy="60" r="30" fill="#06b6d4"/>
      <path d="M70 100 Q100 90 130 100 L140 160 Q100 150 60 160 Z" fill="#0891b2"/>
      <circle cx="90" cy="55" r="3" fill="#fff"/>
      <circle cx="110" cy="55" r="3" fill="#fff"/>
      <path d="M90 70 Q100 75 110 70" stroke="#fff" stroke-width="2" fill="none"/>
    </svg>`,
    thought: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="140" cy="60" r="15" fill="#06b6d4" opacity="0.6"/>
      <circle cx="120" cy="80" r="20" fill="#3b82f6" opacity="0.7"/>
      <ellipse cx="80" cy="110" rx="50" ry="45" fill="#0891b2"/>
      <text x="65" y="120" font-size="30" fill="#fff">?</text>
    </svg>`,
    growth: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <path d="M100 160 L100 80" stroke="#0891b2" stroke-width="8" stroke-linecap="round"/>
      <path d="M70 110 L100 80 L130 110" stroke="#3b82f6" stroke-width="8" stroke-linecap="round" fill="none"/>
      <circle cx="60" cy="140" r="12" fill="#06b6d4"/>
      <circle cx="100" cy="120" r="15" fill="#3b82f6"/>
      <circle cx="140" cy="100" r="18" fill="#0ea5e9"/>
    </svg>`,
    star: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <path d="M100 40 L110 80 L150 85 L120 110 L130 150 L100 130 L70 150 L80 110 L50 85 L90 80 Z" fill="#0ea5e9"/>
      <circle cx="100" cy="100" r="20" fill="#3b82f6"/>
      <circle cx="80" cy="70" r="8" fill="#06b6d4" opacity="0.7"/>
      <circle cx="130" cy="80" r="10" fill="#0891b2" opacity="0.6"/>
    </svg>`,
    rainbow: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <path d="M30 150 Q100 50 170 150" stroke="#3b82f6" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M40 150 Q100 70 160 150" stroke="#06b6d4" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M50 150 Q100 90 150 150" stroke="#0891b2" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M60 150 Q100 110 140 150" stroke="#0ea5e9" stroke-width="12" fill="none" stroke-linecap="round"/>
    </svg>`,
    start: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="80" cy="100" r="70" fill="url(#grad1)" opacity="0.2"/>
      <circle cx="80" cy="100" r="50" fill="url(#grad1)" opacity="0.4"/>
      <circle cx="80" cy="100" r="30" fill="url(#grad1)"/>
      <path d="M80 75 L80 60 M80 125 L80 140 M55 100 L40 100 M105 100 L120 100" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <circle cx="80" cy="100" r="12" fill="#fff"/>
      <path d="M76 100 L79 103 L87 93" stroke="#3b82f6" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <text x="130" y="115" font-size="48" font-weight="900" fill="url(#textGrad)" font-family="Arial, sans-serif">DX</text>
      <circle cx="160" cy="40" r="8" fill="#0ea5e9">
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="30" cy="50" r="6" fill="#06b6d4">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="2.5s" repeatCount="indefinite"/>
      </circle>
      <circle cx="170" cy="160" r="7" fill="#0891b2">
        <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite"/>
      </circle>
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4f46e5"/>
          <stop offset="50%" style="stop-color:#3b82f6"/>
          <stop offset="100%" style="stop-color:#06b6d4"/>
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6"/>
          <stop offset="50%" style="stop-color:#06b6d4"/>
          <stop offset="100%" style="stop-color:#0891b2"/>
        </linearGradient>
      </defs>
    </svg>`,
    result: `<svg viewBox="0 0 200 200" width="100%" height="100%">
      <circle cx="100" cy="100" r="60" fill="url(#grad2)"/>
      <path d="M75 100 L90 115 L125 75" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
      <circle cx="160" cy="50" r="15" fill="#ffd364"/>
      <circle cx="40" cy="60" r="12" fill="#f093fb"/>
      <circle cx="170" cy="140" r="10" fill="#764ba2"/>
      <defs>
        <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f5576c"/>
          <stop offset="100%" style="stop-color:#f093fb"/>
        </linearGradient>
      </defs>
    </svg>`
  };
  return icons[iconName] || '';
}

// 初期化
function initializeApp() {
  const hasProgress = loadProgress();
  if (hasProgress && currentStep !== 'start') {
    if (currentStep === 'pre' || currentStep === 'main') {
      renderQuestion();
      restoreAnswers();
    } else if (currentStep === 'result') {
      const resultData = calculateResult();
      renderResult(resultData);
    } else {
      renderStartScreen();
    }
  } else {
    renderStartScreen();
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);

// スタート画面
function renderStartScreen() {
  const content = document.getElementById('app-content');
  content.innerHTML = `
    <div class="start-screen">
      <div class="start-icon-container">${getIconSVG('start')}</div>
      <div class="start-description">
        <strong>この診断について</strong>
        <ul>
          <li>所要時間: 約15〜20分</li>
          <li>質問数: STEP1(5問) + STEP2(48問)</li>
          <li>DX人材としての4層スキル（技術理解・組織影響力・哲学的軸・サステナビリティ）を可視化します</li>
          <li>結果はレーダーチャートで表示され、あなたの強みと伸びしろが一目で分かります</li>
        </ul>
        <p style="margin-top: 24px; color: #64748b;">
          このチェックは「採点」ではなく「今の自分を知るための地図」です。<br>
          リラックスして、正直に答えてみてください 😊
        </p>
      </div>
      <button class="btn btn-primary" onclick="startDiagnosis()">診断をはじめる</button>
    </div>
  `;
}

function startDiagnosis() {
  currentStep = 'pre';
  currentQuestionIndex = 0;
  answers = [];
  saveProgress();
  renderQuestion();
}

// 質問画面
function renderQuestion() {
  const content = document.getElementById('app-content');
  const isPreStep = currentStep === 'pre';
  const questions = isPreStep ? preQuestions : mainQuestions;
  const totalQuestions = preQuestions.length + mainQuestions.length;
  const currentAbsoluteIndex = isPreStep ? currentQuestionIndex : preQuestions.length + currentQuestionIndex;
  
  let progress = 0;
  if (isPreStep) {
    progress = (currentQuestionIndex / preQuestions.length) * 10;
  } else {
    progress = 10 + ((currentQuestionIndex / mainQuestions.length) * 90);
  }
  
  const question = questions[currentQuestionIndex];
  const stepLabel = isPreStep ? 'STEP1: 現在地確認' : 'STEP2: スキルチェック';
  
  let introMessage = '';
  if (isPreStep && currentQuestionIndex === 0) {
    introMessage = `
      <div class="intro-message">
        まず、あなたの現在の状況について教えてください。<br>
        より正確な診断結果を出すための質問です。正直に答えて大丈夫です 😊
      </div>
    `;
  } else if (!isPreStep && currentQuestionIndex === 0) {
    introMessage = `
      <div class="intro-message">
        ここからは、DX人材としての4層スキルをチェックします。<br>
        ◎○△？の4段階で、今の自分に当てはまるものを選んでください。<br>
        正解も不正解もありません。今の自分の感覚で答えてくださいね 😊
      </div>
    `;
  }
  
  content.innerHTML = `
    ${introMessage}
    <div class="progress-container">
      <div class="progress-text">${stepLabel} (${currentQuestionIndex + 1}/${questions.length})</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${progress}%"></div>
      </div>
    </div>
    
    <div class="question-container">
      <div class="question-header">
        <div class="question-icon-container">${getIconSVG(question.icon)}</div>
        <div class="question-text">${question.text}</div>
      </div>
      
      <div class="options" id="options-container"></div>
      ${question.type === 'multiple' ? '<div class="select-hint">※複数選択可' + (question.maxSelect ? `(最大${question.maxSelect}つまで)` : '') + '</div>' : ''}
    </div>
    
    <div class="nav-buttons">
      ${currentAbsoluteIndex > 0 ? '<button class="btn btn-secondary" onclick="goBack()">もどる</button>' : '<div></div>'}
      <button class="btn btn-primary" id="next-btn" disabled onclick="goNext()">つぎへ</button>
    </div>
  `;
  
  renderOptions();
}

function renderOptions() {
  const isPreStep = currentStep === 'pre';
  const questions = isPreStep ? preQuestions : mainQuestions;
  const question = questions[currentQuestionIndex];
  const optionsContainer = document.getElementById('options-container');
  
  if (question.type === 'check') {
    optionsContainer.innerHTML = checkOptions.map(option => `
      <button class="option-button" data-value="${option.value}" onclick="selectOption(${option.value})">
        <span style="font-size: 24px; margin-right: 12px;">${option.emoji}</span>
        ${option.text}
      </button>
    `).join('');
  } else {
    optionsContainer.innerHTML = question.options.map((option, index) => `
      <button class="option-button" data-index="${index}" onclick="selectPreOption(${index})">
        ${option}
      </button>
    `).join('');
  }
}

function selectPreOption(index) {
  const isPreStep = currentStep === 'pre';
  const questions = isPreStep ? preQuestions : mainQuestions;
  const question = questions[currentQuestionIndex];
  const buttons = document.querySelectorAll('.option-button');
  
  const actualIndex = currentStep === 'pre' 
    ? currentQuestionIndex 
    : preQuestions.length + currentQuestionIndex;
  
  if (question.type === 'single') {
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[index].classList.add('selected');
    
    if (!answers[actualIndex]) {
      answers[actualIndex] = [];
    }
    answers[actualIndex] = [index];
    saveProgress();
    
    document.getElementById('next-btn').disabled = false;
  } else if (question.type === 'multiple') {
    if (!answers[actualIndex]) {
      answers[actualIndex] = [];
    }
    
    const currentAnswers = answers[actualIndex];
    const indexPos = currentAnswers.indexOf(index);
    
    if (indexPos > -1) {
      currentAnswers.splice(indexPos, 1);
      buttons[index].classList.remove('selected');
    } else {
      if (question.maxSelect && currentAnswers.length >= question.maxSelect) {
        const firstSelected = currentAnswers.shift();
        buttons[firstSelected].classList.remove('selected');
      }
      currentAnswers.push(index);
      buttons[index].classList.add('selected');
    }
    
    saveProgress();
    document.getElementById('next-btn').disabled = currentAnswers.length === 0;
  }
}

function selectOption(value) {
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => {
    if (parseInt(btn.dataset.value) === value) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  
  const nextBtn = document.getElementById('next-btn');
  nextBtn.disabled = false;
  
  const actualIndex = currentStep === 'pre' 
    ? currentQuestionIndex 
    : preQuestions.length + currentQuestionIndex;
  
  answers[actualIndex] = value;
  saveProgress();
}

function goBack() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
  } else if (currentStep === 'main') {
    currentStep = 'pre';
    currentQuestionIndex = preQuestions.length - 1;
  }
  saveProgress();
  renderQuestion();
  restoreAnswers();
}

function restoreAnswers() {
  const isPreStep = currentStep === 'pre';
  const questions = isPreStep ? preQuestions : mainQuestions;
  const question = questions[currentQuestionIndex];
  
  const actualIndex = currentStep === 'pre' 
    ? currentQuestionIndex 
    : preQuestions.length + currentQuestionIndex;
  
  if (answers[actualIndex]) {
    setTimeout(() => {
      if (question.type === 'check') {
        const selectedBtn = document.querySelector(`[data-value="${answers[actualIndex]}"]`);
        if (selectedBtn) selectedBtn.classList.add('selected');
      } else {
        const selectedIndices = Array.isArray(answers[actualIndex]) ? answers[actualIndex] : [answers[actualIndex]];
        selectedIndices.forEach(index => {
          const btn = document.querySelector(`[data-index="${index}"]`);
          if (btn) btn.classList.add('selected');
        });
      }
      document.getElementById('next-btn').disabled = false;
    }, 0);
  }
}

function goNext() {
  const isPreStep = currentStep === 'pre';
  const questions = isPreStep ? preQuestions : mainQuestions;
  
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    saveProgress();
    renderQuestion();
    restoreAnswers();
  } else if (isPreStep && mainQuestions.length > 0) {
    currentStep = 'main';
    currentQuestionIndex = 0;
    saveProgress();
    renderQuestion();
  } else {
    currentStep = 'result';
    saveProgress();
    calculateAndShowResult();
  }
}

// 結果計算
function calculateResult() {
  const layerScores = {
    tech: 0,
    org: 0,
    philosophy: 0,
    sustain: 0
  };
  
  const layerCounts = {
    tech: 0,
    org: 0,
    philosophy: 0,
    sustain: 0
  };
  
  mainQuestions.forEach((q, index) => {
    const answerIndex = preQuestions.length + index;
    const answer = answers[answerIndex];
    
    if (answer !== undefined && q.layer) {
      layerScores[q.layer] += answer;
      layerCounts[q.layer]++;
    }
  });
  
  // 各層のスコアを100%換算
  const layerPercentages = {};
  for (let layer in layerScores) {
    const maxScore = layerCounts[layer] * 5;
    layerPercentages[layer] = maxScore > 0 ? Math.round((layerScores[layer] / maxScore) * 100) : 0;
  }
  
  return {
    scores: layerPercentages,
    rawScores: layerScores,
    counts: layerCounts
  };
}

function calculateAndShowResult() {
  const resultData = calculateResult();
  renderResult(resultData);
}

// 結果画面
function renderResult(resultData) {
  const content = document.getElementById('app-content');
  
  content.innerHTML = `
    <div class="result-container">
      <div class="result-icon-container">${getIconSVG('result')}</div>
      <h2 class="result-title">診断結果</h2>
      
      ${renderRadarChart(resultData.scores)}
      ${renderScoreBars(resultData.scores)}
      ${renderGrowthMap(resultData.scores)}
      ${renderClosingMessage()}
      
      <div class="result-buttons">
        <button class="btn btn-pdf" onclick="downloadPDF()">📄 PDFをダウンロード</button>
        <button class="btn btn-primary" onclick="restart()">もう一度診断する</button>
      </div>
    </div>
  `;
  
  // Chart.jsでレーダーチャートを描画
  setTimeout(() => {
    drawRadarChart(resultData.scores);
  }, 100);
}

function renderRadarChart(scores) {
  return `
    <div class="radar-chart-section">
      <h3 class="section-title">DX人材 4層スキルマップ</h3>
      <canvas id="radarChart" width="400" height="400"></canvas>
      <div class="layer-legend">
        <div class="legend-item">
          <span class="legend-color" style="background: #3b82f6;"></span>
          <span>技術的理解</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #06b6d4;"></span>
          <span>組織的影響力</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #0891b2;"></span>
          <span>哲学的軸</span>
        </div>
        <div class="legend-item">
          <span class="legend-color" style="background: #0ea5e9;"></span>
          <span>サステナビリティ</span>
        </div>
      </div>
    </div>
  `;
}

function drawRadarChart(scores) {
  const ctx = document.getElementById('radarChart').getContext('2d');
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        '技術的理解',
        '組織的影響力',
        '哲学的軸',
        'サステナビリティ'
      ],
      datasets: [{
        label: 'あなたのスコア',
        data: [
          scores.tech,
          scores.org,
          scores.philosophy,
          scores.sustain
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            font: {
              size: 12
            }
          },
          pointLabels: {
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function renderScoreBars(scores) {
  const layers = [
    { key: 'tech', label: '技術的理解', color: 'linear-gradient(90deg, #3b82f6, #06b6d4)' },
    { key: 'org', label: '組織的影響力', color: 'linear-gradient(90deg, #06b6d4, #0891b2)' },
    { key: 'philosophy', label: '哲学的軸', color: 'linear-gradient(90deg, #0891b2, #0ea5e9)' },
    { key: 'sustain', label: 'サステナビリティ', color: 'linear-gradient(90deg, #0ea5e9, #3b82f6)' }
  ];
  
  return `
    <div class="score-section">
      <h3 class="section-title">各層のスコア詳細</h3>
      <div class="score-bars">
        ${layers.map(layer => `
          <div class="score-item">
            <div class="score-label">${layer.label}</div>
            <div class="score-bar-container">
              <div class="score-bar" style="width: ${scores[layer.key]}%; background: ${layer.color};"></div>
            </div>
            <div class="score-value">${scores[layer.key]}%</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderGrowthMap(scores) {
  const layerNames = {
    tech: '技術的理解',
    org: '組織的影響力',
    philosophy: '哲学的軸',
    sustain: 'サステナビリティ'
  };
  
  const sorted = Object.entries(scores)
    .map(([key, value]) => ({ key, label: layerNames[key], score: value }))
    .sort((a, b) => b.score - a.score);
  
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  
  return `
    <div class="growth-map-section">
      <h3 class="section-title">あなたの成長マップ</h3>
      
      <div class="strength-area">
        <h4>💪 あなたの強み</h4>
        <p><strong>${strongest.label}:</strong> ${strongest.score}%</p>
        <p class="growth-advice">${getStrengthAdvice(strongest.key)}</p>
      </div>
      
      <div class="growth-area">
        <h4>🌱 伸びしろ領域</h4>
        <p><strong>${weakest.label}:</strong> ${weakest.score}%</p>
        <p class="growth-advice">${getGrowthAdvice(weakest.key)}</p>
      </div>
      
      <div class="balance-check">
        <h4>⚖️ バランスチェック</h4>
        <p class="growth-advice">${getBalanceAdvice(scores)}</p>
      </div>
    </div>
  `;
}

function getStrengthAdvice(layer) {
  const advice = {
    tech: 'デジタル技術やデータ活用への理解が高く、技術的な判断や説明が得意なようです。この強みを活かして、組織内の技術リテラシー向上に貢献したり、経営層への技術翻訳役として活躍できるでしょう。',
    org: '人を動かし、組織を変える力が優れています。対話力や変革への伴走力を活かして、DXプロジェクトのリーダーシップを発揮したり、現場の抵抗を乗り越える橋渡し役として力を発揮できるでしょう。',
    philosophy: 'DXの本質的な意義を理解し、倫理的な視点を持っています。この哲学的な軸を大切にすることで、単なる効率化ではない、人を幸せにするDXを実現できるでしょう。',
    sustain: '自分自身を持続的にマネジメントする力が高いです。長期的な変革を支え続けるために必要な、心身のバランス感覚を持っています。この力があるからこそ、焦らず着実にDXを進められるでしょう。'
  };
  return advice[layer] || '';
}

function getGrowthAdvice(layer) {
  const advice = {
    tech: '技術的な理解を深めることで、より説得力のあるDX推進ができるようになります。まずは、自分が興味を持てる技術分野（AI、データ分析、クラウドなど）から学んでみましょう。オンライン学習やコミュニティへの参加もおすすめです。',
    org: '組織を動かす力を育てるには、小さな実践から始めましょう。まずは身近なチームでの対話や、小さな変革プロジェクトのリーダーを経験してみてください。失敗を恐れず、学びながら進むことが大切です。',
    philosophy: 'DXの「なぜ」を深く考える時間を持ちましょう。自組織の存在意義、顧客の本当の願い、デジタル化で守るべき価値などについて、じっくり内省してみてください。また、他社のDX事例から「哲学」を学ぶのも良いでしょう。',
    sustain: '自分自身のケアを意識的に行いましょう。忙しくても、自分がなぜ変革を志したのかを思い出す時間、心身をリセットする時間を確保してください。孤独を感じたら、社外のコミュニティで同志を見つけるのもおすすめです。'
  };
  return advice[layer] || '';
}

function getBalanceAdvice(scores) {
  const values = Object.values(scores);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const diff = max - min;
  
  if (diff < 20) {
    return '4つの層がバランスよく発達しています。この均衡を保ちながら、全体的に成長していくことで、理想的なDX人材に近づけるでしょう。';
  } else if (diff < 40) {
    return '特定の層に強みがありますが、他の層にも一定の水準があります。強みを活かしつつ、伸びしろ領域を少しずつ育てていくことで、より多面的な力を発揮できるでしょう。';
  } else {
    return '層ごとの差が大きい状態です。まずは伸びしろ領域に集中的に取り組むことで、バランスを取り戻しましょう。強みだけでは突破できない壁も、バランスの取れた成長で乗り越えられます。';
  }
}

function renderClosingMessage() {
  return `
    <div class="closing-section">
      <h3 class="closing-title">📝 最後に</h3>
      <div class="closing-text">
        この診断は「今のあなた」を映す鏡です。<br>
        スコアが高い・低いではなく、「今、どこに立っているか」を知ることが大切です。<br><br>
        DX人材としての成長は、一朝一夕ではありません。<br>
        焦らず、一歩ずつ、自分のペースで進んでいってください。<br><br>
        この診断結果が、あなたの次の一歩を照らす光になれば嬉しいです。<br>
        応援しています 😊
      </div>
    </div>
  `;
}

function restart() {
  clearProgress();
  currentStep = 'start';
  currentQuestionIndex = 0;
  answers = [];
  renderStartScreen();
}

// PDF出力
async function downloadPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const resultContainer = document.querySelector('.result-container');
    const buttonsContainer = document.querySelector('.result-buttons');
    
    if (!resultContainer) {
      alert('診断結果が見つかりません');
      return;
    }

    const downloadBtn = document.querySelector('.btn-pdf');
    const originalText = downloadBtn.textContent;
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'PDF生成中...';

    let buttonsDisplay = '';
    if (buttonsContainer) {
      buttonsDisplay = buttonsContainer.style.display;
      buttonsContainer.style.display = 'none';
    }

    const canvas = await html2canvas(resultContainer, {
      scale: 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297;

    let finalWidth = imgWidth;
    let finalHeight = imgHeight;
    
    if (imgHeight > pageHeight) {
      const scale = pageHeight / imgHeight;
      finalWidth = imgWidth * scale;
      finalHeight = pageHeight;
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const x = (210 - finalWidth) / 2;
    const y = 0;
    
    pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);

    const fileName = `DX人材診断結果_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    if (buttonsContainer) {
      buttonsContainer.style.display = buttonsDisplay;
    }
    downloadBtn.disabled = false;
    downloadBtn.textContent = originalText;
  } catch (error) {
    console.error('PDF生成エラー:', error);
    alert('PDFの生成に失敗しました。もう一度お試しください。');
    const downloadBtn = document.querySelector('.btn-pdf');
    const buttonsContainer = document.querySelector('.result-buttons');
    if (buttonsContainer) {
      buttonsContainer.style.display = '';
    }
    if (downloadBtn) {
      downloadBtn.disabled = false;
      downloadBtn.textContent = '📄 PDFをダウンロード';
    }
  }
}
