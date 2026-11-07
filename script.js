/*
  ==============================
  隰手ｧ｣縺晃eb繧ｵ繧､繝? 隧ｦ菴懃沿
  ==============================

  縺薙％縺 縺大､画峩縺吶ｌ縺ｰ縲∝推隰弱?豁｣隗｣繧定ｨｭ螳壹〒縺阪∪縺吶??

  譛ｬ逡ｪ縺ｧ縺ｯ莉ｮ縺ｮ遲斐∴繧貞ｮ滄圀縺ｮ遲斐∴縺ｫ螟画峩縺励※縺上□縺輔＞縲?
*/

const ANSWERS = {
  start: "まじょ",
  witch: "\u3067\u30fc\u305f",
  king: "\u304d\u308a\u3068\u308a",
  hana: "\u304a\u3048\u304b\u304d",
  suyama: "\u304a\u3082\u3066",
  bonus: "\u304d\u3064\u306d",
  musashibara: "\u304b\u305f\u3061",
  demon: "\u304f\u308a\u3048\u3044\u305f\u30fc",
  big: "\u304a\u304b\u304b\u3044\u3068"
};

const STORAGE_KEY = "nazotoki_progress_v1";

const DEFAULT_STATE = {
  page: "start",
  maid: false,
  bonusItem: false
};

let state = loadState();
let modalNextPage = null;

const pages = [...document.querySelectorAll(".page")];
const modal = document.getElementById("correctModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalNext = document.getElementById("modalNext");

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_STATE, ...JSON.parse(saved) } : { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showPage(pageName) {
  pages.forEach(page => {
    page.classList.toggle("active", page.dataset.page === pageName);
  });

  state.page = pageName;
  saveState();
  window.scrollTo({ top: 0, behavior: "instant" });

  if (pageName === "gate") renderItems();
  if (pageName === "clear") renderReward();
}

function normalize(value) {
  return value
    .trim()
    .replace(/\s+/g, "")
    .replace(/[。、！？・「」『』（）()]/g, "")
    .toLowerCase();
}

function isCorrect(value, answer) {
  return normalize(value) === normalize(answer);
}

function checkAnswer(type, inputId, errorId, nextPage, title, text) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
	
	

  if (isCorrect(input.value, ANSWERS[type])) {
    error.textContent = "";
    input.value = "";

    if (type === "suyama") state.maid = true;
    if (type === "bonus") state.bonusItem = true;

    saveState();

    const collectImages = {
      start: "mori_story.png",
      witch: "mori_collect.png",
      king: "tukazaki_collect.png",
      hana: "hanai_collect.png",
      suyama: "suyama_collect.png",
      bonus: "bonus_item.png",
      musashibara: "musasibara_collect.png",
      demon: "nakamura_collect.png",
      big: "yamada_collect.png"
    };

    openCorrectModal(title, text, nextPage, collectImages[type] || "correct.png");
  } else {
   error.textContent = "\u7b54\u3048\u304c\u9055\u3046\u3088\u3046\u3060\u2026\u2026\u3082\u3046\u4e00\u5ea6\u8003\u3048\u3066\u307f\u3088\u3046\uff01";
  }
}

function openCorrectModal(title, text, nextPage, collectImage = "correct.png") {
  modalTitle.textContent = title;
  modalText.textContent = text;
  modalNextPage = nextPage;
  modalImage.src = "assets/" + collectImage;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
}
	
function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

modalNext.addEventListener("click", () => {
  closeModal();
  if (modalNextPage) showPage(modalNextPage);
});

document.getElementById("modalClose").addEventListener("click", closeModal);

/* 谺｡縺ｸ繝懊ち繝ｳ */
document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.next));
});

/* 遲斐∴蛻､螳? */
document.querySelectorAll("[data-check]").forEach(button => {
  button.addEventListener("click", () => {
    const type = button.dataset.check;

    const configs = {
      start: ["startAnswer", "startError", "witchIntro", "魔女を発見！", "森の奥へ進み、魔女に出会った。魔女に山田さんの話を聞いてみよう！"],
      witch: ["witchAnswer", "witchError", "kingIntro", "魔女の試練クリア！", "さすがのひらめき力だ。次は304近くを探そう！"],
      king: ["kingAnswer", "kingError", "hanaIntro", "王様の協力を得た！", "魔王城へ続く手がかりを教えてもらった。305の物販ブースへ向かおう！"],
      hana: ["hanaAnswer", "hanaError", "suyamaIntro", "刺客を突破！", "刺客の試練を乗り越えた。引き続き、物販ブースの周りを探そう！"],
      suyama: ["suyamaAnswer", "suyamaError", "suyamaBonus", "商人との取引成功！", "商人からメイド服をゲットした。メイドに紛れて城へ潜入しよう。"],
      bonus: ["bonusAnswer", "bonusError", "gate", "おまけのアイテムを入手！", "タマミツネのしっぽを貰った。何に使うんだろう…？"],
      musashibara: ["musashibaraAnswer", "musashibaraError", "demonIntro", "魔王の右腕を撃破！", "魔王の右腕を倒した。ついに魔王との決戦だ！"],
      demon: ["demonAnswer", "demonError", "defeat", "魔王を撃破！", "魔王を倒し山田さんが解放された！でも元の世界に帰れない…"],
      big: ["bigAnswer", "bigError", "clear", "最後の謎をクリア！", "大切な仲間はずっと旅を支えてくれた岡さんだった！これで山田さんは元の世界に帰れるぞ！"]
    };

    const config = configs[type];
    checkAnswer(type, ...config);
  });
});

/* 鬲皮視蝓主?蜿｣ */
document.getElementById("enterCastle").addEventListener("click", () => {
  if (!state.maid) {
    alert("魔王城に入るには、商人から受け取ったメイド服が必要なようだ。");
    return;
  }
  showPage("musashibaraIntro");
});

function renderItems() {
  const list = document.getElementById("itemList");
  list.innerHTML = "";

  const maid = document.createElement("div");
  maid.className = "item";
  maid.innerHTML = `
    <img src="assets/maid_item.png" alt="">
    <div><strong>メイド服</strong><br><small>魔王城へ潜入するために、商人から受け取った衣装</small></div>
  `;
  list.appendChild(maid);

  if (state.bonusItem) {
    const bonus = document.createElement("div");
    bonus.className = "item";
    bonus.innerHTML = `
      <img src="assets/bonus_item.png" alt="">
      <div><strong>タマミツネのしっぽ</strong><br><small>綺麗な紫色のしっぽ</small></div>
    `;
    list.appendChild(bonus);
  }
}

function renderReward() {
  const reward = document.getElementById("reward");

  if (state.bonusItem) {
    reward.innerHTML = `
      <p>おめでとう！全ての謎を解き明かした！</p>
      <p>さらに、タマミツネのしっぽを持っていたあなたは、クエスト完全クリア報酬が送られる！</p>
    `;
  } else {
    reward.innerHTML = `
      <p>おめでとう！全ての謎を解き明かした！</p>
      <p>君の協力のおかげで、山田さんは無事に元の世界へ帰ることができた！ありがとう！</p>
    `;
  }
}

/* 譛?蛻昴°繧? */
document.getElementById("resetBtn").addEventListener("click", () => {
  if (!confirm("初めからやり直しますか？これまでの進行状況やアイテムはリセットされます。")) return;
  state = { ...DEFAULT_STATE };
  saveState();
  showPage("start");
});

/* Enter繧ｭ繝ｼ縺ｧ繧ょ屓遲? */
document.querySelectorAll(".answer-box input").forEach(input => {
  input.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    const button = input.parentElement.querySelector("[data-check]");
    if (button) button.click();
  });
});

/* 蜀崎ｪｭ縺ｿ霎ｼ縺ｿ蠕後ｂ邯壹″縺九ｉ */
showPage(state.page);

/* 繝偵Φ繝医?陦ｨ遉ｺ繝ｻ髱櫁｡ｨ遉ｺ
   萓具ｼ嗤nclick="toggleHint('hint-witch-1')" */
function toggleHint(hintId) {
  const hint = document.getElementById(hintId);
  if (!hint) return;
  hint.style.display = hint.style.display === "block" ? "none" : "block";
}


