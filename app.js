// =============================================
// НАСТРОЙКИ: Меняй здесь под свой подарок
// =============================================
const GIFT_SKIN = {
  name: "AK-47 | Олигарх (Well-Worn)",
  nameShort: "AK-47 | Олигарх",
  wear: "Well-Worn",
  float: 0.4123456789,
  price: 126.50,
  rarity: "covert",
  rarityLabel: "Covert",
  image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiNQu6WReLFrJvWBMWSF0vp5vd5kSi26gBBp42WBmYqgd3_DbgImDpR3TOFYskTrmoexZO",
  dealerMsg: "Alright. Last one I'm pulling out tonight. Consider it a special occasion.",
};

// Стоимость одного спина
const COST_PER_SPIN = 0.36;

// =============================================
// Junk-офферы (3 штуки перед подарком)
// =============================================
const JUNK_OFFERS = [
  {
    name: "MAG-7 | MAGnitude (Battle-Scarred)",
    nameShort: "MAG-7 | MAGnitude",
    wear: "Battle-Scarred",
    float: 0.8234567891,
    price: 0.12,
    rarity: "milspec",
    rarityLabel: "Mil-Spec",
    image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5G3wi9a6KWRa61_I_yWMWSf0f5zot5hSiiljFN35Gndntz8eXqQPVR0X5N3ReEIuhHtlofgZO",
    dealerMsg: "Mistakes happen. I'm just trying to help out a friend so they don't lose their supply sergeant post.",
  },
  {
    name: "MP9 | Broken Record (Field-Tested)",
    nameShort: "MP9 | Broken Record",
    wear: "Field-Tested",
    float: 0.2145678912,
    price: 0.19,
    rarity: "milspec",
    rarityLabel: "Mil-Spec",
    image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f8DIC0OSnZr1hH_2WCm6FzKBwsrVrSi_qxhkhtTjUw9r8dH-ealMkDpNxEORZu0G-koDmZO",
    dealerMsg: "Making me go all the way in the back for the premium shelf stuff, huh? Alright, you got it.",
  },
  {
    name: "MP9 | Broken Record (Battle-Scarred)",
    nameShort: "MP9 | Broken Record",
    wear: "Battle-Scarred",
    float: 0.6891234567,
    price: 0.11,
    rarity: "milspec",
    rarityLabel: "Mil-Spec",
    image: "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f8DIC0OSnZr1hH_2WCm6FzKBwsrVrSi_qxhkhtTjUw9r8dH-ealMkDpNxEORZu0G-koDmZO",
    dealerMsg: "You're gonna regret passing on that later. Not a problem.",
  },
];

const OFFERS = [...JUNK_OFFERS, GIFT_SKIN];

// =============================================
// Кейс
// =============================================
const CASE_IMAGE = "https://community.akamai.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGJKz2lu_XsnXwtmkJjSU91dh8bj35VTqVBP4io_frnRk7P6he6FpbqWXCzSVkL4h6bExTHuwx0wk6mjUmdn_Iy2TbAUkCZslQu8CtBTrkNz5d7S1oNprwEg";

// =============================================
// State
// =============================================
let offerIndex = 0;
let totalSpent = 0;
let totalValue = 0;
let opened = 0;

// DOM refs
const caseIconEl = document.getElementById("case-icon");
const chatBody = document.getElementById("chat-body");
const offerNameEl = document.getElementById("offer-name");
const offerRarityEl = document.getElementById("offer-rarity");
const offerImageEl = document.getElementById("offer-image");
const offerWearEl = document.getElementById("offer-wear");
const floatMarkerEl = document.getElementById("float-marker");
const floatValueEl = document.getElementById("float-value");
const offerIndexEl = document.getElementById("offer-index");
const btnAccept = document.getElementById("btn-accept");
const btnAcceptLabel = document.getElementById("btn-accept-label");
const btnDecline = document.getElementById("btn-decline");
const btnReset = document.getElementById("btn-reset");
const statProfit = document.getElementById("stat-profit");
const statOpened = document.getElementById("stat-opened");
const unboxLog = document.getElementById("unbox-log");
const victory = document.getElementById("victory");
const victoryImage = document.getElementById("victory-image");
const victorySkin = document.getElementById("victory-skin");
const victoryRarity = document.getElementById("victory-rarity");
const victoryWear = document.getElementById("victory-wear");
const victoryPrice = document.getElementById("victory-price");
const btnCloseVictory = document.getElementById("btn-close-victory");

// =============================================
// Init
// =============================================
caseIconEl.src = CASE_IMAGE;
showOffer(0);

// =============================================
// Render offer
// =============================================
function ordinal(n) {
  const suffixes = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (suffixes[(v-20)%10] || suffixes[v] || suffixes[0]);
}

function floatToWearPct(f) {
  // ranges: FN 0-0.07(7%), MW 0.07-0.15(8%), FT 0.15-0.38(23%), WW 0.38-0.45(7%), BS 0.45-1(55%)
  return f * 100;
}

function showOffer(idx) {
  const offer = OFFERS[idx];
  offerNameEl.textContent = offer.name;
  offerRarityEl.textContent = offer.rarityLabel;
  offerRarityEl.className = "rarity-badge rarity-" + offer.rarity;
  offerImageEl.src = offer.image;
  offerImageEl.alt = offer.name;
  offerWearEl.textContent = offer.wear;
  floatMarkerEl.style.left = floatToWearPct(offer.float) + "%";
  floatValueEl.textContent = offer.float.toFixed(10);
  offerIndexEl.textContent = ordinal(idx + 1) + " Offer";
  btnAcceptLabel.textContent = "Accept Offer " + offer.price.toFixed(2).replace(".", ",") + " $";

  // Highlight if gift
  if (idx === OFFERS.length - 1) {
    btnAccept.style.background = "rgba(235,75,75,0.15)";
    btnAccept.style.borderColor = "#eb4b4b";
    btnAccept.style.color = "#ef6a6a";
    btnAccept.querySelector(".fill").style.background = "#eb4b4b";
  } else {
    btnAccept.style.background = "";
    btnAccept.style.borderColor = "";
    btnAccept.style.color = "";
    btnAccept.querySelector(".fill").style.background = "";
  }
}

// =============================================
// Chat helpers
// =============================================
function addDealerMsg(text) {
  const el = document.createElement("div");
  el.className = "dealer-msg";
  el.innerHTML = `
    <div class="dealer-avatar">M</div>
    <div class="dealer-bubble">${text}</div>
  `;
  chatBody.appendChild(el);
  scrollChat();
}

function addOfferCard(offer, num, declined) {
  const barColor = offer.rarity === "covert" ? "#eb4b4b" : offer.rarity === "classified" ? "#d32ce6" : offer.rarity === "restricted" ? "#8847ff" : "#4b69ff";
  const el = document.createElement("div");
  el.className = "offer-card";
  el.innerHTML = `
    <div class="offer-card-bar" style="background:${barColor}"></div>
    <div class="offer-card-body">
      <img src="${offer.image}" alt="${offer.name}" />
      <div class="offer-card-text">
        <p class="num">${ordinal(num)} Offer</p>
        <p class="name">${offer.name}</p>
        <p class="wear">${offer.wear}</p>
        <p class="price">Offer — ${offer.price.toFixed(2).replace(".", ",")} $</p>
      </div>
    </div>
  `;
  chatBody.appendChild(el);
  if (declined) {
    const d = document.createElement("p");
    d.className = "chat-declined";
    d.textContent = "Offer Declined.";
    chatBody.appendChild(d);
  }
  scrollChat();
}

function scrollChat() {
  chatBody.scrollTop = chatBody.scrollHeight;
}

// =============================================
// Stats update
// =============================================
function updateStats() {
  const profit = totalValue - totalSpent;
  statProfit.textContent = (profit >= 0 ? "" : "") + profit.toFixed(2).replace(".", ",") + " $";
  statProfit.className = profit < 0 ? "tabular loss" : profit > 0 ? "tabular gain" : "tabular";
  statOpened.textContent = opened;
}

function addLog(offer, accepted) {
  const el = document.createElement("div");
  el.className = "log-entry" + (accepted ? "" : " declined");
  el.innerHTML = `
    <div>
      <div class="name">${offer.nameShort}</div>
      <div>${offer.wear} — <span class="price">${offer.price.toFixed(2).replace(".", ",")} $</span></div>
    </div>
  `;
  unboxLog.prepend(el);
}

// =============================================
// Hold-button logic
// =============================================
function setupHoldBtn(btn, onConfirm) {
  let timer = null;
  let anim = null;

  function start(e) {
    e.preventDefault();
    btn.classList.add("filling");
    timer = setTimeout(() => {
      btn.classList.add("filled");
      onConfirm();
      reset();
    }, 800);
  }

  function reset() {
    clearTimeout(timer);
    timer = null;
    btn.classList.remove("filling", "filled");
  }

  btn.addEventListener("mousedown", start);
  btn.addEventListener("touchstart", start, { passive: false });
  btn.addEventListener("mouseup", reset);
  btn.addEventListener("mouseleave", reset);
  btn.addEventListener("touchend", reset);
  btn.addEventListener("touchcancel", reset);
}

// =============================================
// Actions
// =============================================
setupHoldBtn(btnAccept, () => {
  const offer = OFFERS[offerIndex];
  const isGift = offerIndex === OFFERS.length - 1;

  // Count spin cost
  totalSpent += COST_PER_SPIN;
  totalValue += offer.price;
  opened++;
  addOfferCard(offer, offerIndex + 1, false);
  addLog(offer, true);
  updateStats();

  if (isGift) {
    showVictory(offer);
  } else {
    // Accepted a junk — also reveal victory but with that skin
    showVictory(offer);
  }
});

setupHoldBtn(btnDecline, () => {
  const offer = OFFERS[offerIndex];

  // Count spin cost
  totalSpent += COST_PER_SPIN;
  opened++;
  addOfferCard(offer, offerIndex + 1, true);
  addLog(offer, false);
  updateStats();

  const nextIdx = offerIndex + 1;
  if (nextIdx < OFFERS.length) {
    offerIndex = nextIdx;
    const nextOffer = OFFERS[nextIdx];
    addDealerMsg(nextOffer.dealerMsg);
    showOffer(nextIdx);
  } else {
    // Wrap around if declined all (shouldn't happen in normal flow)
    offerIndex = OFFERS.length - 1;
    addDealerMsg("That was the last one I've got. Take it or leave it.");
    showOffer(OFFERS.length - 1);
  }
});

btnReset.addEventListener("click", () => {
  offerIndex = 0;
  totalSpent = 0;
  totalValue = 0;
  opened = 0;
  chatBody.innerHTML = `
    <p class="chat-sys">Sealed Genesis Terminal Arms Deal Offers.</p>
    <p class="chat-sys">tevxn Connected</p>
  `;
  unboxLog.innerHTML = "";
  updateStats();
  showOffer(0);
});

// =============================================
// Victory
// =============================================
function showVictory(offer) {
  const isGift = offer === GIFT_SKIN;
  victoryImage.src = offer.image;
  victoryImage.alt = offer.name;
  victorySkin.textContent = offer.name;
  victoryRarity.textContent = offer.rarityLabel;
  victoryRarity.className = "rarity-badge rarity-" + offer.rarity;
  victoryWear.textContent = offer.wear;
  victoryPrice.textContent = "~" + offer.price.toFixed(2).replace(".", ",") + " $";

  const kicker = victory.querySelector(".victory-kicker");
  const note = victory.querySelector(".victory-note");
  if (isGift) {
    kicker.textContent = "🎉 HAPPY BIRTHDAY 🎉";
    note.textContent = "This one's real. Check your inventory. 💚";
    note.style.display = "";
  } else {
    kicker.textContent = "✅ ACCEPTED";
    note.style.display = "none";
  }

  victory.hidden = false;
  launchConfetti(isGift);
}

btnCloseVictory.addEventListener("click", () => {
  victory.hidden = true;
});

// =============================================
// Confetti (simple canvas)
// =============================================
function launchConfetti(big) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:200;width:100%;height:100%;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const count = big ? 180 : 60;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 100,
    r: 4 + Math.random() * 6,
    color: ["#22c55e","#ef4444","#ffd700","#a855f7","#3b82f6","#ffffff"][Math.floor(Math.random() * 6)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * 360,
    vrot: (Math.random() - 0.5) * 8,
    life: 1,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.vy += 0.08;
      if (p.y < canvas.height + 30) alive = true;
      ctx.save();
      ctx.globalAlpha = Math.min(1, (canvas.height - p.y) / 200);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.5);
      ctx.restore();
    }
    if (alive) requestAnimationFrame(draw);
    else canvas.remove();
  }
  draw();
}

// =============================================
// Первый оффер: показываем сообщение дилера
// =============================================
setTimeout(() => {
  addDealerMsg(OFFERS[0].dealerMsg);
  showOffer(0);
}, 300);
