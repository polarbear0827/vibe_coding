const state = {
  activeStage: "all",
  activeLessonId: LESSONS[0].id,
  query: "",
  completed: new Set(JSON.parse(localStorage.getItem("completedLessons") || "[]"))
};

const $ = (selector) => document.querySelector(selector);
const lessonList = $("#lessonList");
const reader = $("#reader");
const stageTabs = $("#stageTabs");

function persist() {
  localStorage.setItem("completedLessons", JSON.stringify([...state.completed]));
}

function filteredLessons() {
  return LESSONS.filter((lesson) => {
    const stageOk = state.activeStage === "all" || lesson.stage === state.activeStage;
    const haystack = [
      lesson.title,
      lesson.subtitle,
      lesson.takeaway,
      ...lesson.explanation,
      ...lesson.prerequisites.flat(),
      lesson.caseStudy
    ].join(" ").toLowerCase();
    return stageOk && haystack.includes(state.query.toLowerCase());
  });
}

function renderStages() {
  stageTabs.innerHTML = STAGES.map((stage) => `
    <button class="stage-tab ${state.activeStage === stage.id ? "active" : ""}" type="button" data-stage="${stage.id}">
      ${stage.label}
    </button>
  `).join("");
}

function renderList() {
  const lessons = filteredLessons();
  lessonList.innerHTML = lessons.map((lesson, index) => `
    <li>
      <button class="lesson-button ${lesson.id === state.activeLessonId ? "active" : ""}" type="button" data-lesson="${lesson.id}">
        <span class="lesson-index">${String(index + 1).padStart(2, "0")}</span>
        <span>
          <strong>${lesson.title}</strong>
          <small>${lesson.subtitle}</small>
        </span>
        <span class="done-dot ${state.completed.has(lesson.id) ? "done" : ""}" aria-label="完成狀態"></span>
      </button>
    </li>
  `).join("");
}

function renderProgress() {
  const done = state.completed.size;
  $("#progressText").textContent = `${done} / ${LESSONS.length}`;
  $("#progressBar").style.width = `${Math.round(done / LESSONS.length * 100)}%`;
}

function renderSources() {
  $("#sourceGrid").innerHTML = SOURCES.map((source) => `
    <a class="source-card" href="${source.url}" target="_blank" rel="noreferrer">
      <strong>${source.title}</strong>
      <span>${source.note}</span>
    </a>
  `).join("");
}

function currentLesson() {
  return LESSONS.find((lesson) => lesson.id === state.activeLessonId) || LESSONS[0];
}

function renderReader() {
  const lesson = currentLesson();
  const stage = STAGES.find((item) => item.id === lesson.stage);
  reader.innerHTML = `
    <article class="lesson-page">
      <div class="lesson-hero">
        <span class="stage-chip">${stage.label}</span>
        <h1>${lesson.title}</h1>
        <p>${lesson.subtitle}</p>
        <div class="takeaway">${lesson.takeaway}</div>
      </div>

      <section class="section-block">
        <h2>先補前置名詞</h2>
        <div class="term-grid">
          ${lesson.prerequisites.map(([term, desc]) => `
            <div class="term-card">
              <strong>${term}</strong>
              <p>${desc}</p>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="section-block readable">
        <h2>詳細講解</h2>
        ${lesson.explanation.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </section>

      <section class="section-block">
        <h2>直覺生活類比如何對應名詞</h2>
        <div class="analogy-box">
          <div>
            <h3>${lesson.analogy.title}</h3>
            <p>${lesson.analogy.detail}</p>
          </div>
          <dl>
            ${lesson.analogy.map.map(([left, right]) => `
              <div><dt>${left}</dt><dd>${right}</dd></div>
            `).join("")}
          </dl>
        </div>
      </section>

      <section class="section-block">
        <h2>程式碼註解講解</h2>
        <pre class="code-block"><code>${escapeHtml(lesson.code.body.join("\n"))}</code></pre>
      </section>

      <section class="section-block readable">
        <h2>實際案例拆解</h2>
        <p>${lesson.caseStudy}</p>
      </section>

      <section class="section-block">
        <h2>互動理解練習</h2>
        <div class="lab" id="lab"></div>
      </section>

      <div class="reader-actions">
        <button class="primary-button" type="button" id="completeButton">
          ${state.completed.has(lesson.id) ? "已完成理解檢核" : "標記這頁已理解"}
        </button>
      </div>
    </article>
  `;
  renderLab(lesson.lab.type);
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function renderLab(type) {
  const lab = $("#lab");
  const labs = {
    mutation: mutationLab,
    postman: postmanLab,
    boundary: boundaryLab,
    pyramid: pyramidLab,
    k6: k6Lab,
    golden: goldenLab,
    prometheus: prometheusLab,
    correctness: correctnessLab,
    smell: smellLab,
    regression: regressionLab,
    profiling: profilingLab,
    grafana: grafanaLab
  };
  lab.innerHTML = (labs[type] || genericLab)();
  bindLab(type);
}

function mutationLab() {
  return `
    <p>選擇你的測試案例，看看「>= 被突變成 >」時能不能被抓到。</p>
    <div class="choice-row" data-lab="mutation">
      <label><input type="checkbox" value="9"> points = 9 應不可兌換</label>
      <label><input type="checkbox" value="10"> points = 10 應可兌換</label>
      <label><input type="checkbox" value="11" checked> points = 11 應可兌換</label>
    </div>
    <output class="lab-output" id="labOutput"></output>
  `;
}

function postmanLab() {
  return `
    <p>把下面四個步驟排成自動化 API 測試流程。</p>
    <div class="flow-grid" data-lab="postman">
      <button data-step="1">在 Postman 建立 request</button>
      <button data-step="2">在 Tests 寫 response 斷言</button>
      <button data-step="3">匯出或提交 Collection</button>
      <button data-step="4">CI 用 Newman 執行 Collection</button>
    </div>
    <output class="lab-output" id="labOutput">點擊步驟後，我會說明它在流程中的角色。</output>
  `;
}

function boundaryLab() {
  return `
    <p>規則：滿 10 點可以兌換。拖曳滑桿觀察結果。</p>
    <input class="wide-range" id="pointsRange" type="range" min="7" max="13" value="10">
    <output class="lab-output" id="labOutput"></output>
  `;
}

function pyramidLab() {
  return `
    <p>調整 E2E 數量，觀察回饋時間與定位成本。</p>
    <input class="wide-range" id="e2eRange" type="range" min="5" max="80" value="20">
    <output class="lab-output" id="labOutput"></output>
  `;
}

function k6Lab() {
  return `
    <p>選擇壓測目標，看看應該使用哪種流量模型。</p>
    <div class="choice-row" data-lab="k6">
      <button data-mode="capacity">找容量上限</button>
      <button data-mode="sla">驗證 SLA</button>
      <button data-mode="spike">測突發流量</button>
    </div>
    <output class="lab-output" id="labOutput"></output>
  `;
}

function goldenLab() {
  return `
    <p>Little's Law：L = lambda x W。調整流量與延遲，看系統內堆積多少工作。</p>
    <label>到達率 lambda：<input id="arrival" type="range" min="20" max="200" value="100"></label>
    <label>平均延遲 W：<input id="latency" type="range" min="100" max="1500" value="200"></label>
    <output class="lab-output" id="labOutput"></output>
  `;
}

function prometheusLab() {
  return `
    <p>選擇哪些 label 適合放進 Prometheus metric。</p>
    <div class="choice-row" data-lab="prometheus">
      <label><input type="checkbox" value="route" checked> route</label>
      <label><input type="checkbox" value="status" checked> status</label>
      <label><input type="checkbox" value="user_id"> user_id</label>
      <label><input type="checkbox" value="order_id"> order_id</label>
    </div>
    <output class="lab-output" id="labOutput"></output>
  `;
}

function correctnessLab() {
  return `<p>檢核一個付款測試是否完整。</p><output class="lab-output">好的功能測試至少檢查：API 回應、資料庫狀態、外部副作用、錯誤路徑、重複請求。只看 200 OK 不夠。</output>`;
}

function smellLab() {
  return `<p>判斷這段程式的主要味道。</p><output class="lab-output">如果一個函式同時驗證、算價、寫資料庫、寄信，主要問題是責任過多。優先用 Extract Function / Extract Class 拆出穩定邊界。</output>`;
}

function regressionLab() {
  return `<p>Baseline p95 是 180ms，新版 p95 是 245ms。</p><output class="lab-output">退化約 36%。如果團隊門檻是超過 15% 就阻擋部署，這次應該先調查再上線。</output>`;
}

function profilingLab() {
  return `<p>效能慢時先做哪件事？</p><output class="lab-output">先量測。Profiler 顯示資源花在哪裡，再決定優化資料庫、序列化、演算法或外部依賴。</output>`;
}

function grafanaLab() {
  return `<p>挑選 dashboard 第一屏應優先回答的問題。</p><output class="lab-output">第一屏應先回答：服務是否健康、影響多大、哪個區域或依賴異常、是否和部署相關。不要只堆滿孤立圖表。</output>`;
}

function genericLab() {
  return `<output class="lab-output">閱讀定義、類比對應、程式碼與案例後，試著用自己的話說出這個概念要避免的風險。</output>`;
}

function bindLab(type) {
  const output = $("#labOutput");
  if (type === "mutation") {
    const update = () => {
      const selected = [...document.querySelectorAll("[data-lab='mutation'] input:checked")].map((input) => input.value);
      const catchesBoundary = selected.includes("10");
      output.textContent = catchesBoundary
        ? "Killed：你測了 points = 10，所以 >= 被改成 > 時測試會失敗。"
        : "Survived：你沒有測真正邊界 points = 10，所以突變後仍可能通過。";
    };
    document.querySelectorAll("[data-lab='mutation'] input").forEach((input) => input.addEventListener("change", update));
    update();
  }
  if (type === "postman") {
    const notes = {
      1: "第一步是把 API 呼叫保存起來：method、URL、headers、body 都要明確。",
      2: "第二步才是自動化價值：Tests 斷言 status、schema、商業規則。",
      3: "Collection 是可共享、可版本控制的檢查表。",
      4: "Newman 在 CI 執行同一份 Collection，讓回歸測試不靠人工。"
    };
    document.querySelectorAll("[data-lab='postman'] button").forEach((button) => {
      button.addEventListener("click", () => output.textContent = notes[button.dataset.step]);
    });
  }
  if (type === "boundary") {
    const range = $("#pointsRange");
    const update = () => {
      const value = Number(range.value);
      output.textContent = `${value} 點：${value >= 10 ? "應該可以兌換" : "應該不能兌換"}。最重要的測試點是 9、10、11。`;
    };
    range.addEventListener("input", update);
    update();
  }
  if (type === "pyramid") {
    const range = $("#e2eRange");
    const update = () => {
      const e2e = Number(range.value);
      const minutes = Math.round(e2e * 1.8);
      output.textContent = `E2E ${e2e} 條，估計回饋時間約 ${minutes} 分鐘。若規則可在 unit/integration 測，別全部壓到 E2E。`;
    };
    range.addEventListener("input", update);
    update();
  }
  if (type === "k6") {
    const notes = {
      capacity: "找容量上限：使用 ramping-vus 或逐步提高 arrival rate，觀察何時延遲與錯誤率失控。",
      sla: "驗證 SLA：使用 constant-arrival-rate，固定真實流量，搭配 thresholds 判斷通過。",
      spike: "測突發流量：短時間快速升高流量，觀察排隊、熔斷、降級與恢復。"
    };
    document.querySelectorAll("[data-lab='k6'] button").forEach((button) => {
      button.addEventListener("click", () => output.textContent = notes[button.dataset.mode]);
    });
  }
  if (type === "golden") {
    const arrival = $("#arrival");
    const latency = $("#latency");
    const update = () => {
      const lambda = Number(arrival.value);
      const w = Number(latency.value) / 1000;
      output.textContent = `lambda=${lambda}/s，W=${w.toFixed(1)}s，所以 L 約 ${Math.round(lambda * w)} 個在途請求。延遲變長會直接放大堆積量。`;
    };
    arrival.addEventListener("input", update);
    latency.addEventListener("input", update);
    update();
  }
  if (type === "prometheus") {
    const update = () => {
      const values = [...document.querySelectorAll("[data-lab='prometheus'] input:checked")].map((input) => input.value);
      const risky = values.includes("user_id") || values.includes("order_id");
      output.textContent = risky
        ? "風險高：user_id/order_id 會造成高基數。單筆追蹤請交給 logs/traces。"
        : "較健康：route/status 通常可聚合，適合做 Prometheus label。";
    };
    document.querySelectorAll("[data-lab='prometheus'] input").forEach((input) => input.addEventListener("change", update));
    update();
  }
}

function rerender() {
  renderStages();
  renderList();
  renderReader();
  renderProgress();
}

stageTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-stage]");
  if (!button) return;
  state.activeStage = button.dataset.stage;
  const first = filteredLessons()[0];
  if (first) state.activeLessonId = first.id;
  rerender();
});

lessonList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-lesson]");
  if (!button) return;
  state.activeLessonId = button.dataset.lesson;
  rerender();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#searchInput").addEventListener("input", (event) => {
  state.query = event.target.value;
  const first = filteredLessons()[0];
  if (first && !filteredLessons().some((lesson) => lesson.id === state.activeLessonId)) {
    state.activeLessonId = first.id;
  }
  renderList();
});

reader.addEventListener("click", (event) => {
  if (event.target.id !== "completeButton") return;
  const lesson = currentLesson();
  if (state.completed.has(lesson.id)) state.completed.delete(lesson.id);
  else state.completed.add(lesson.id);
  persist();
  rerender();
});

$("#themeToggle").addEventListener("click", () => {
  document.documentElement.classList.toggle("light");
  localStorage.setItem("theme", document.documentElement.classList.contains("light") ? "light" : "dark");
});

if (localStorage.getItem("theme") === "light") {
  document.documentElement.classList.add("light");
}

renderSources();
rerender();
