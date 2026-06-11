const STAGES = [
  { id: "all", label: "全部" },
  { id: "foundation", label: "I 基礎防衛" },
  { id: "automation", label: "II 自動化防線" },
  { id: "performance", label: "III 效能診斷" },
  { id: "observability", label: "IV 生產觀測" }
];

const SOURCES = [
  { title: "Postman Learning Center - Newman", url: "https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/", note: "Newman 是 Postman Collection 的命令列執行器，可用於 CI/CD。" },
  { title: "Postman Learning Center - Collections", url: "https://learning.postman.com/docs/collections/collections-overview/", note: "Collection 是一組可保存、組織與執行的 API request。" },
  { title: "PITest - Mutation Testing", url: "https://pitest.org/quickstart/mutators/", note: "突變測試會對程式做小改動，檢查測試是否能讓突變後的程式失敗。" },
  { title: "Martin Fowler - Test Pyramid", url: "https://martinfowler.com/articles/practical-test-pyramid.html", note: "測試金字塔描述不同層級測試的成本、速度與回饋品質。" },
  { title: "Grafana k6 - Scenarios", url: "https://grafana.com/docs/k6/latest/using-k6/scenarios/", note: "k6 用 scenario 描述壓測流量模型，例如固定到達率與逐步增加 VU。" },
  { title: "Grafana k6 - Thresholds", url: "https://grafana.com/docs/k6/latest/using-k6/thresholds/", note: "Threshold 是壓測結果的通過/失敗條件。" },
  { title: "Prometheus - Metric Types", url: "https://prometheus.io/docs/concepts/metric_types/", note: "Counter、Gauge、Histogram、Summary 的官方定義。" },
  { title: "Prometheus - Data Model", url: "https://prometheus.io/docs/concepts/data_model/", note: "Label 會形成時間序列維度，高基數 Label 會帶來成本。" },
  { title: "Grafana Docs - Dashboards", url: "https://grafana.com/docs/grafana/latest/dashboards/", note: "Dashboard 由 panel 組成，用來視覺化與分析資料來源。" },
  { title: "Little's Law", url: "https://en.wikipedia.org/wiki/Little%27s_law", note: "穩定系統中 L = lambda W，用來理解吞吐量、延遲與在途工作量。" }
];

const LESSONS = [
  {
    id: "code-smell",
    stage: "foundation",
    title: "Code Smell",
    subtitle: "程式還能跑，但維護成本正在變貴的早期警訊。",
    takeaway: "Code Smell 不是 bug。它是「未來修改會變慢、變危險」的味道。",
    prerequisites: [
      ["重構", "在不改變外部行為的前提下整理內部結構。"],
      ["耦合", "A 模組改動時，B 模組也被迫一起改，表示兩者耦合高。"],
      ["內聚", "一個模組是否專心處理同一類責任。越專心，內聚越高。"]
    ],
    explanation: [
      "初學者常把 Code Smell 誤會成語法錯誤。其實它更像醫生看到的風險指標：血壓偏高不是心肌梗塞，但它表示未來出事的機率上升。",
      "常見味道包含 God Object、Long Method、Duplicate Code、Primitive Obsession、Shotgun Surgery。它們共同的問題是：需求一改，你必須在很多地方猜、找、補，測試也更難寫。",
      "判斷 Code Smell 的重點不是「我喜不喜歡這段程式」，而是它是否讓變更變得不可預測。好的重構會讓責任邊界更清楚，讓下次改需求時只碰少數地方。"
    ],
    analogy: {
      title: "沒有分類的工具箱",
      map: [
        ["工具箱", "整個程式碼庫"],
        ["螺絲、膠帶、電線全混在一起", "不同責任塞在同一個類別或函式"],
        ["找一支小螺絲起子要翻半天", "小需求也要讀很多無關程式"],
        ["分格收納", "Extract Class、Extract Function、建立 Value Object"]
      ],
      detail: "這個類比對應的是「責任邊界」。Code Smell 的本質不是工具箱不能用，而是每次要做一個小動作，都會被混亂結構拖慢。"
    },
    code: {
      language: "js",
      body: [
        "function createOrder(user, items, couponCode) {",
        "  // 味道 1：這個函式同時驗證、算價、寄信、寫資料庫，責任太多。",
        "  if (!user.email || items.length === 0) throw new Error('invalid');",
        "  // 味道 2：金額、折扣、狀態都用 primitive，規則容易散落。",
        "  let total = items.reduce((sum, item) => sum + item.price, 0);",
        "  if (couponCode === 'VIP') total *= 0.8;",
        "  database.orders.insert({ userId: user.id, total, status: 'paid' });",
        "  mailer.send(user.email, 'paid');",
        "}"
      ]
    },
    caseStudy: "電商團隊想新增「企業客戶月結」。若訂單建立函式同時管折扣、金流、庫存與通知，月結功能會牽動每一段。比較安全的做法是拆出 PricingPolicy、PaymentMethod、OrderRepository 與 NotificationService，讓月結只新增支付策略，不重寫整條流程。",
    lab: { type: "smell" }
  },
  {
    id: "correctness",
    stage: "foundation",
    title: "功能正確性",
    subtitle: "不只看畫面成功，也要驗證狀態、資料與副作用都正確。",
    takeaway: "功能正確性是「在指定條件下，系統產生符合規格的結果」。",
    prerequisites: [
      ["規格", "系統承諾要滿足的條件。沒有規格，測試只能猜。"],
      ["斷言", "測試中明確檢查結果是否符合預期的語句。"],
      ["副作用", "函式除了回傳值以外造成的變化，例如寫資料庫、寄信、扣庫存。"]
    ],
    explanation: [
      "功能測試不能只測 happy path。真正可靠的測試會同時看 happy path、sad path 與 evil path。",
      "Happy path 是正常使用；sad path 是常見錯誤，例如餘額不足；evil path 是惡意或極端輸入，例如重複送出、偽造參數、超大 payload。",
      "很多 bug 來自「畫面顯示成功，但資料狀態錯了」。所以測試要檢查回傳值、資料庫狀態、外部事件與錯誤處理。"
    ],
    analogy: {
      title: "ATM 提款不是只看螢幕",
      map: [
        ["螢幕顯示提款成功", "API 回傳 200"],
        ["帳戶餘額減少", "資料庫狀態正確"],
        ["吐鈔機真的吐出正確張數", "外部副作用正確"],
        ["交易紀錄寫入", "audit log 或事件流正確"]
      ],
      detail: "這個類比對應到「狀態斷言」。如果只看螢幕，你會漏掉扣款失敗、重複扣款、交易紀錄缺失等問題。"
    },
    code: {
      language: "js",
      body: [
        "test('withdraw transfers money and records audit log', async () => {",
        "  const result = await withdraw({ accountId: 'A1', amount: 1000 });",
        "  expect(result.status).toBe('ok'); // 檢查使用者看得到的結果",
        "  expect(await balanceOf('A1')).toBe(9000); // 檢查系統狀態",
        "  expect(await cashDispenser.count()).toBeLessThan(initialCash); // 檢查副作用",
        "  expect(await auditLog.has('withdraw:A1:1000')).toBe(true); // 檢查可追蹤性",
        "});"
      ]
    },
    caseStudy: "支付頁面顯示成功，但訂單狀態仍是 pending，客服會被大量詢問。這不是 UI 小錯，而是狀態機不一致。測試應檢查訂單狀態、付款交易 ID、庫存保留、通知事件與重複請求的冪等性。",
    lab: { type: "correctness" }
  },
  {
    id: "boundary",
    stage: "foundation",
    title: "邊界測試案例",
    subtitle: "錯誤最常出現在規則剛好切換的地方。",
    takeaway: "邊界測試聚焦在臨界值，例如 9、10、11，而不是只測中間值。",
    prerequisites: [
      ["等價類", "在規則上會得到相同處理的一組輸入。"],
      ["邊界值", "規則剛好改變的位置，例如上限、下限、剛滿門檻。"],
      ["Off-by-one", "把包含/不包含邊界寫錯，例如 >= 寫成 >。"]
    ],
    explanation: [
      "如果規則是「滿 10 件免運」，只測 12 件沒有意義，因為 12 離邊界太遠。真正要測的是 9、10、11。",
      "邊界測試也包含空值、空集合、最大長度、最小長度、Unicode、時區切換、整數溢位與浮點精度。",
      "好測試會把規則寫進測試名稱，讓未來的人一眼知道錯的是規則，還是程式。"
    ],
    analogy: {
      title: "雲霄飛車身高閘口",
      map: [
        ["119 公分", "邊界外側，應拒絕"],
        ["120 公分", "邊界點，最容易寫錯"],
        ["121 公分", "邊界內側，應通過"],
        ["感測器校準", "輸入解析、單位轉換與資料格式"]
      ],
      detail: "這個類比對應的是「規則切換點」。中間值通常安全，真正危險的是剛好踩線。"
    },
    code: {
      language: "js",
      body: [
        "function canRedeem(points) {",
        "  return points >= 10; // 規格：10 點含以上可以兌換",
        "}",
        "",
        "expect(canRedeem(9)).toBe(false);  // 邊界外側",
        "expect(canRedeem(10)).toBe(true);  // 邊界本身，抓 > 與 >= 寫錯",
        "expect(canRedeem(11)).toBe(true);  // 邊界內側"
      ]
    },
    caseStudy: "1996 年 Ariane 5 首飛事故常被拿來說明邊界與溢位風險：沿用 Ariane 4 的慣性參考系統軟體，在 Ariane 5 不同飛行條件下觸發數值轉換溢位，最後造成任務失敗。教學重點不是「所有重用都危險」，而是重用時必須重新驗證新環境的輸入範圍。",
    lab: { type: "boundary" }
  },
  {
    id: "pyramid",
    stage: "automation",
    title: "測試金字塔",
    subtitle: "用不同層級的測試換取速度、信心與維護成本的平衡。",
    takeaway: "金字塔不是規定比例，而是提醒你：越接近完整系統，越慢、越貴、越脆弱。",
    prerequisites: [
      ["Unit Test", "隔離小單位，快，定位問題精準。"],
      ["Integration Test", "檢查多個元件或真實依賴是否能協作。"],
      ["E2E Test", "從使用者角度跑完整流程，信心高但成本高。"]
    ],
    explanation: [
      "測試金字塔的底層是大量單元測試，中間是整合測試，頂端是少量 E2E。它不是宗教比例，而是成本模型。",
      "如果所有測試都靠 E2E，失敗時你知道「購物車壞了」，但不知道是價格、庫存、登入、API 還是 UI 壞了。",
      "好的策略會把商業規則放在快測試，跨服務契約放在整合測試，最重要的使用者旅程才放 E2E。"
    ],
    analogy: {
      title: "汽車品管流程",
      map: [
        ["每顆螺絲測強度", "Unit Test"],
        ["引擎與變速箱合裝測試", "Integration Test"],
        ["整車上路試駕", "E2E Test"],
        ["每次只靠試駕找問題", "Ice Cream Cone 反模式"]
      ],
      detail: "這個類比對應的是「問題定位成本」。越晚才測到，越難知道哪個零件壞。"
    },
    code: {
      language: "txt",
      body: [
        "Unit: calculateDiscount() 對不同會員等級回傳正確折扣",
        "Integration: CheckoutService 能和測試資料庫、PaymentClient stub 協作",
        "E2E: 使用者登入、加入購物車、付款、看到訂單成功頁",
        "原則：同一條規則不要只靠最慢的測試保護。"
      ]
    },
    caseStudy: "一個團隊把 200 個情境都寫成瀏覽器 E2E，CI 常常跑 45 分鐘且 flaky。重整後，把價格規則移到 unit test、API 契約移到 integration test，只保留 8 條最重要 E2E，回饋時間降到 8 分鐘，失敗定位也更清楚。",
    lab: { type: "pyramid" }
  },
  {
    id: "postman-newman",
    stage: "automation",
    title: "Postman / Newman",
    subtitle: "Postman 幫你設計與保存 API 測試；Newman 讓同一組測試在命令列與 CI 自動跑。",
    takeaway: "Postman 是互動式 API 工作台；Newman 是 Postman Collection 的自動化執行器。",
    prerequisites: [
      ["API", "系統之間透過明確請求與回應交換資料的介面。"],
      ["Request", "一次 API 呼叫，包含 method、URL、headers、body。"],
      ["Collection", "Postman 裡保存的一組 request、測試腳本與環境設定。"],
      ["Environment", "不同環境的變數，例如 dev/staging/prod 的 baseUrl 與 token。"]
    ],
    explanation: [
      "Postman 適合人在開發時探索 API：你可以手動送出 request，觀察 response，補上 test script，並把一組 API 流程存成 Collection。",
      "Newman 解決的是「不能只靠人手動按」。它在命令列執行同一份 Collection，所以 CI 可以在每次 pull request 時自動驗證 API 是否仍符合預期。",
      "初學者最常卡住的是：Postman 不只是發 request 的工具，Collection 裡的 Tests 才是自動化價值。Newman 不會神奇理解你的 API，它只是忠實執行你在 Collection 裡寫好的斷言。"
    ],
    analogy: {
      title: "餐廳中央廚房標準檢驗",
      map: [
        ["主廚手動試吃一道菜", "Postman 手動送出單一 request"],
        ["標準化食譜與檢查表", "Collection + Tests"],
        ["每批出餐都自動量重量與溫度", "Newman 在 CI 重複執行"],
        ["不同分店的地址與食材供應", "Environment 變數"]
      ],
      detail: "這個類比對應的是「從手動探索到自動回歸」。Postman 幫你建立檢查表，Newman 讓檢查表不靠人工記得執行。"
    },
    code: {
      language: "js",
      body: [
        "// Postman Tests 分頁中的測試腳本",
        "pm.test('回傳成功狀態', () => {",
        "  pm.response.to.have.status(200); // 檢查 HTTP status",
        "});",
        "",
        "pm.test('回應符合訂單 schema', () => {",
        "  const json = pm.response.json(); // 解析 response body",
        "  pm.expect(json).to.have.property('orderId'); // 確認必要欄位存在",
        "  pm.expect(json.total).to.be.above(0); // 確認商業規則",
        "});",
        "",
        "// CI 中可執行：newman run collection.json -e staging.json"
      ]
    },
    caseStudy: "後端把欄位 totalAmount 改名為 amount，但前端仍讀 totalAmount。若只有人工測試，很可能等到 QA 才發現。若 Collection 裡明確斷言 response schema，Newman 會在 CI 立刻失敗，提醒 API 契約被破壞。",
    lab: { type: "postman" }
  },
  {
    id: "mutation",
    stage: "automation",
    title: "突變測試",
    subtitle: "不是測程式有沒有跑到，而是測你的測試有沒有真的抓得住錯誤。",
    takeaway: "突變測試會故意把程式改壞。如果測試沒有失敗，代表測試太弱。",
    prerequisites: [
      ["覆蓋率", "程式碼是否被測試執行過。執行過不代表有驗證對。"],
      ["突變體", "工具故意產生的一個小錯誤版本，例如 >= 改成 >。"],
      ["Killed", "突變體讓測試失敗，代表測試抓到這個錯。"],
      ["Survived", "突變體仍通過測試，代表測試沒有檢查到這個行為。"],
      ["等價突變體", "改了程式但外部行為其實不變，這種突變體不一定能被殺死。"]
    ],
    explanation: [
      "覆蓋率只能回答「測試有沒有跑過這行」。突變測試回答更重要的問題：「如果這行寫錯，測試會不會紅？」",
      "例如規格是滿 10 點可以兌換。程式寫 points >= 10。突變工具把 >= 改成 >。如果你的測試只有 11 點，突變後仍然通過，代表測試沒保護真正的邊界。",
      "所以突變測試不是取代單元測試，而是評估單元測試的斷言強度。分數低時，不一定代表產品錯，而是測試可能只檢查了表面。"
    ],
    analogy: {
      title: "防彈背心的實彈測試",
      map: [
        ["穿在假人身上", "覆蓋率：程式有被跑到"],
        ["朝縫線與盲點射擊", "突變工具製造小錯誤"],
        ["子彈被擋下", "Killed：測試抓到錯誤"],
        ["子彈穿過但警報沒響", "Survived：測試看起來有跑，卻沒有驗證關鍵行為"]
      ],
      detail: "這個類比對應的是「測試有效性」。你不是要證明背心被摸過，而是要證明它真的擋得住合理攻擊。"
    },
    code: {
      language: "js",
      body: [
        "function canRedeem(points) {",
        "  return points >= 10; // 原始程式：10 點可以兌換",
        "}",
        "",
        "// 弱測試：只測 11，突變成 points > 10 仍會通過",
        "expect(canRedeem(11)).toBe(true);",
        "",
        "// 強測試：補上邊界，>= 被改成 > 時會失敗",
        "expect(canRedeem(9)).toBe(false);",
        "expect(canRedeem(10)).toBe(true);",
        "expect(canRedeem(11)).toBe(true);"
      ]
    },
    caseStudy: "團隊看到 95% 覆蓋率，以為折扣功能安全。突變測試卻顯示多個條件邊界 survived：VIP 折扣、滿額免運、生日券都有測試跑過，但沒有測剛好踩線的輸入。修正方式不是追求 100% 分數，而是為 survived 的關鍵商業規則補上有意義的斷言。",
    lab: { type: "mutation" }
  },
  {
    id: "k6",
    stage: "performance",
    title: "k6 壓力測試",
    subtitle: "用可重現的流量模型檢查系統在負載下的延遲、錯誤率與容量。",
    takeaway: "k6 的核心不是把人數開很大，而是描述正確的負載情境與通過門檻。",
    prerequisites: [
      ["VU", "Virtual User，虛擬使用者，代表一條持續執行腳本的使用者流程。"],
      ["Arrival rate", "單位時間進來多少請求或流程，比單純 VU 數更接近真實流量。"],
      ["Threshold", "壓測成功條件，例如 p95 延遲小於 300ms、錯誤率小於 1%。"]
    ],
    explanation: [
      "壓測要先問：你是在找系統極限、驗證 SLA，還是測突發流量？不同目標需要不同 scenario。",
      "ramping-vus 適合逐步加壓找容量，constant-arrival-rate 適合固定到達率驗證穩定服務能力，spike 適合看突發流量下是否能降級。",
      "沒有 threshold 的壓測只是一堆數字。工程上要把可接受標準寫清楚，讓 CI 或壓測報告能判斷通過或失敗。"
    ],
    analogy: {
      title: "演唱會入場壓力測試",
      map: [
        ["逐步開放觀眾入場", "ramping-vus"],
        ["每分鐘固定 500 人通過安檢", "constant-arrival-rate"],
        ["開場前 5 分鐘人潮暴增", "spike test"],
        ["排隊不能超過 10 分鐘", "threshold"]
      ],
      detail: "這個類比對應的是「流量模型」。不是人越多越專業，而是壓力形狀要像真實事件。"
    },
    code: {
      language: "js",
      body: [
        "export const options = {",
        "  thresholds: {",
        "    http_req_failed: ['rate<0.01'], // 錯誤率必須低於 1%",
        "    http_req_duration: ['p(95)<300'] // 95% 請求要在 300ms 內",
        "  },",
        "  scenarios: {",
        "    checkout: { executor: 'constant-arrival-rate', rate: 50, timeUnit: '1s', duration: '5m', preAllocatedVUs: 100 }",
        "  }",
        "};"
      ]
    },
    caseStudy: "購物節前團隊只用 1000 VU 跑登入頁，卻沒有模擬結帳。正式流量來時，付款 API 的 p95 從 180ms 升到 2s。正確做法是根據真實漏斗建立 scenario：瀏覽、加購、套券、付款各自有比例，並對關鍵 API 設 threshold。",
    lab: { type: "k6" }
  },
  {
    id: "regression",
    stage: "performance",
    title: "效能退化測試",
    subtitle: "功能沒有壞，但速度或資源使用變差，也是一種回歸。",
    takeaway: "效能退化測試把新版本和基準線比較，避免慢慢變差卻沒人發現。",
    prerequisites: [
      ["Baseline", "作為比較基準的歷史版本或穩定數據。"],
      ["P95", "95 百分位延遲，表示 95% 請求快於這個值。"],
      ["統計顯著", "差異大到不太像自然波動，需要調查。"]
    ],
    explanation: [
      "功能測試只會告訴你結果對不對，不會告訴你變慢了多少。效能退化測試關心新版本是否比 baseline 明顯更慢、更耗 CPU 或更耗記憶體。",
      "不能只比較一次平均值，因為網路與機器負載會波動。更可靠的做法是固定環境、重複測量，並看百分位、分布與趨勢。",
      "退化門檻要和產品風險匹配。核心結帳 API 慢 10% 可能需要阻擋部署；後台匯出報表慢 10% 可能只需要追蹤。"
    ],
    analogy: {
      title: "馬拉松訓練紀錄",
      map: [
        ["過去 30 天配速", "Baseline"],
        ["今天成績突然慢 20%", "Performance Regression"],
        ["天氣、睡眠、路線", "測試環境變因"],
        ["連續多次測量確認", "降低偶然波動誤判"]
      ],
      detail: "這個類比對應的是「和自己過去比較」。不是問你有沒有跑完，而是問你是不是明顯退步。"
    },
    code: {
      language: "txt",
      body: [
        "baseline p95: 180ms",
        "new build p95: 245ms",
        "change: +36%",
        "policy: if p95 increases by more than 15%, block deployment",
        "result: fail, investigate before release"
      ]
    },
    caseStudy: "一次序列化函式重構讓 API 回傳內容相同，但 CPU 增加 25%。功能測試全綠，只有效能退化測試擋下部署。後來發現新版本在每筆資料上重複建立 formatter，修正後 p95 回到 baseline。",
    lab: { type: "regression" }
  },
  {
    id: "profiling",
    stage: "performance",
    title: "Profiling 效能剖析",
    subtitle: "用資料找出時間與資源花在哪裡，而不是靠猜。",
    takeaway: "Profiler 幫你定位瓶頸；最佳化前先量測，最佳化後再驗證。",
    prerequisites: [
      ["Sampling", "定期抽樣程式正在執行哪個函式，開銷較低。"],
      ["Instrumentation", "在函式進出時插入測量，較精準但開銷較高。"],
      ["Flame Graph", "用寬度表示資源占比的呼叫堆疊視覺化。"]
    ],
    explanation: [
      "效能問題常常和直覺不同。你以為是資料庫，結果是 JSON 序列化；你以為是演算法，結果是 logging 太多。",
      "Sampling profiler 適合生產或近生產環境低成本觀察；instrumentation profiler 適合受控環境細看函式成本。",
      "Flame graph 的寬度代表樣本比例，不是函式名稱長度。寬且靠上的區塊通常是值得先調查的熱點。"
    ],
    analogy: {
      title: "心臟超音波",
      map: [
        ["病人說胸悶", "使用者說系統慢"],
        ["超音波看血流", "Profiler 看 CPU/記憶體/等待時間"],
        ["找到堵塞血管", "定位瓶頸函式或依賴"],
        ["裝支架後再檢查", "最佳化後重新量測"]
      ],
      detail: "這個類比對應的是「先診斷再治療」。盲目改程式像沒檢查就開刀。"
    },
    code: {
      language: "txt",
      body: [
        "觀察：API p95 = 900ms",
        "Profile：serializeOrderList() 佔 CPU sample 48%",
        "原因：每筆訂單重複格式化同一份使用者資料",
        "修正：快取使用者格式化結果",
        "驗證：p95 降到 260ms，CPU 降 35%"
      ]
    },
    caseStudy: "客服系統查詢頁變慢，團隊一開始想加 DB index。Profiling 顯示 DB 只佔 80ms，模板渲染佔 700ms。真正問題是每列資料都重新計算權限樹。修正後不需要改資料庫。",
    lab: { type: "profiling" }
  },
  {
    id: "prometheus",
    stage: "observability",
    title: "Prometheus",
    subtitle: "用時間序列指標觀察系統狀態，並用標籤切分維度。",
    takeaway: "Prometheus 主要採 pull 模式抓 metrics，適合監控數值趨勢與告警。",
    prerequisites: [
      ["Metric", "隨時間記錄的數值，例如請求數、延遲、CPU。"],
      ["Label", "metric 的維度，例如 method='GET'、status='500'。"],
      ["Cardinality", "時間序列組合數。Label 值越多，序列越多，成本越高。"],
      ["Scrape", "Prometheus 定期向 target 抓取 metrics。"]
    ],
    explanation: [
      "Prometheus 會定期向服務的 /metrics endpoint 抓資料，形成時間序列。這讓它可以知道 target 消失、錯誤率上升或延遲分布改變。",
      "Counter 只能增加，適合累計請求數；Gauge 可增可減，適合目前記憶體或連線數；Histogram 把觀測值放進 bucket，常用於延遲分布。",
      "最大陷阱是高基數 label。不要把 user_id、order_id、trace_id 放進 Prometheus label，否則每個唯一值都可能變成新的時間序列。"
    ],
    analogy: {
      title: "氣象站網路",
      map: [
        ["各地氣象站", "各個服務或 pod"],
        ["中央定期讀取資料", "Prometheus scrape"],
        ["溫度、雨量、風速", "metrics"],
        ["地區、測站類型", "低基數 labels"],
        ["每個觀測員身分證字號", "高基數 label，應避免"]
      ],
      detail: "這個類比對應的是「可聚合的維度」。好的 label 能幫你分析，過細的 label 會把監控系統拖垮。"
    },
    code: {
      language: "txt",
      body: [
        "# 好：可聚合、低基數",
        "http_requests_total{method='POST', route='/checkout', status='500'} 42",
        "",
        "# 壞：user_id 造成大量唯一時間序列",
        "http_request_duration_seconds{user_id='U123456', route='/checkout'} 0.24"
      ]
    },
    caseStudy: "支付服務把 user_id 放進 latency histogram label，希望能查單一使用者慢在哪。上線後時間序列暴增，Prometheus 記憶體飆高。正確做法是用 trace/log 查單一請求，Prometheus 保留 route、status、region 等可聚合維度。",
    lab: { type: "prometheus" }
  },
  {
    id: "grafana",
    stage: "observability",
    title: "Grafana",
    subtitle: "把資料來源轉成可讀的 dashboard、查詢與告警視角。",
    takeaway: "Grafana 不是資料庫；它主要負責視覺化、查詢介面與儀表板協作。",
    prerequisites: [
      ["Data source", "Grafana 連接的資料來源，例如 Prometheus、Loki、Tempo、SQL。"],
      ["Panel", "Dashboard 中的一個圖表或表格。"],
      ["Dashboard as Code", "用 JSON、Terraform 或版本控制管理 dashboard。"]
    ],
    explanation: [
      "Prometheus 負責保存 metrics，Grafana 負責把 metrics 變成可讀的圖表與營運視角。兩者常一起使用，但職責不同。",
      "好的 dashboard 不是把所有數字塞上去，而是回答問題：現在是否健康？哪裡壞？影響多大？是否需要立即處理？",
      "常見做法是用四個黃金信號：延遲、流量、錯誤、飽和度。Dashboard as Code 可避免每個環境手動調出不同版本。"
    ],
    analogy: {
      title: "飛機玻璃駕艙",
      map: [
        ["感測器", "Prometheus、logs、traces 等資料來源"],
        ["駕艙螢幕", "Grafana dashboard"],
        ["高度、速度、油量集中顯示", "Panel 組合成營運視角"],
        ["標準化儀表配置", "Dashboard as Code"]
      ],
      detail: "這個類比對應的是「把原始數據變成決策畫面」。駕駛不該在緊急時翻原始資料表。"
    },
    code: {
      language: "promql",
      body: [
        "# 每秒 5xx 錯誤率",
        "sum(rate(http_requests_total{status=~'5..'}[5m]))",
        "/",
        "sum(rate(http_requests_total[5m]))",
        "",
        "# p95 延遲，資料通常來自 Prometheus histogram",
        "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))"
      ]
    },
    caseStudy: "值班工程師半夜收到告警。如果 dashboard 只有 CPU 圖，他仍要到處查。好的 Grafana 頁面會把錯誤率、p95、流量、飽和度與最近部署放在同一視角，讓他先判斷是流量暴增、依賴故障，還是剛部署造成。",
    lab: { type: "grafana" }
  },
  {
    id: "golden-triangle",
    stage: "observability",
    title: "效能黃金三角",
    subtitle: "吞吐量、延遲、資源利用率互相牽制，不能只追一個數字。",
    takeaway: "吞吐量是單位時間完成多少工作；延遲是單件工作花多久；利用率太高通常會讓排隊延遲急速上升。",
    prerequisites: [
      ["Throughput", "單位時間完成的工作量，例如 requests/sec。"],
      ["Latency", "單一請求從開始到完成的時間。"],
      ["Utilization", "資源忙碌比例，例如 CPU、連線池、工作執行緒使用率。"],
      ["Little's Law", "穩定系統中，平均在途工作量 L = 到達率 lambda x 平均等待時間 W。"]
    ],
    explanation: [
      "這裡的『黃金三角』是教學用框架，不是單一官方標準名詞。三個指標本身的定義必須分清楚：吞吐量看總量，延遲看單件等待，利用率看資源忙碌程度。",
      "利用率越高不一定越好。當系統接近飽和，新的請求需要排隊，延遲通常會非線性上升。這就是為什麼 70% CPU 可能穩，95% CPU 可能開始雪崩。",
      "Little's Law 幫你理解：如果到達率不變，但平均延遲變長，系統裡同時堆著的工作量就會變多，進一步吃掉記憶體、連線與執行緒。"
    ],
    analogy: {
      title: "咖啡店尖峰時刻",
      map: [
        ["每分鐘做幾杯咖啡", "Throughput"],
        ["客人從排隊到拿到咖啡多久", "Latency"],
        ["咖啡師是否幾乎沒有空檔", "Utilization"],
        ["隊伍越排越長", "在途工作量 L 增加"]
      ],
      detail: "這個類比對應的是「排隊效應」。咖啡師 100% 忙碌看似有效率，但只要新客人稍微增加，等待時間會急速惡化。"
    },
    code: {
      language: "txt",
      body: [
        "arrival rate lambda = 100 requests/sec",
        "average latency W = 0.2 sec",
        "in-flight work L = lambda * W = 20 requests",
        "",
        "如果 latency 變成 1 sec：",
        "L = 100 * 1 = 100 requests",
        "同樣流量下，系統內堆積工作量變成 5 倍。"
      ]
    },
    caseStudy: "API 團隊把 DB connection pool 從 50 調到 200，以為吞吐量會提升。短期看請求不再被入口阻擋，但 DB 飽和後每個查詢變慢，latency 上升，在途請求暴增，最後整個服務記憶體也被拖垮。正確做法是找瓶頸、限流、隔離資源，並同時看吞吐量、延遲與飽和度。",
    lab: { type: "golden" }
  }
];
