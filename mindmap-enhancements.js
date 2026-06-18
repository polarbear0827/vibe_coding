(function enhanceMindmapLessons() {
  if (!Array.isArray(window.concepts || concepts)) return;

  const byId = (id) => concepts.find((item) => item.id === id);

  function noteBox(title, html, color) {
    return `
      <div style="border-left:3px solid ${color};padding:10px 12px;margin:10px 0;background:rgba(15,23,42,0.58);border-radius:0 8px 8px 0">
        <b style="color:${color};font-size:0.875em">${title}</b><br><br>
        ${html}
      </div>`;
  }

  function termList(items) {
    return items.map(([term, desc]) => `<b>${term}</b>：${desc}<br>`).join('');
  }

  function setPostmanLesson() {
    const postman = byId(5);
    if (!postman) return;

    postman.tagline = '從手動發 API 到 CI 自動回歸：Postman 建立檢查表，Newman 負責重複執行';
    postman.intro = `
      <p><b>先用一句話說清楚：</b>Postman 是用來建立、保存、執行 API 請求與測試的工具；Newman 是 Postman Collection 的命令列執行器，讓同一組 API 測試可以在 CI 裡自動跑。</p>

      ${noteBox('初學者必補名詞', termList([
        ['API', '系統之間交換資料的介面。例如前端送出 <code>POST /checkout</code>，請後端建立訂單。'],
        ['Request', '一次 API 呼叫，包含 method、URL、headers、body。'],
        ['Response', '伺服器回傳的結果，包含 status code、headers、body。'],
        ['Collection', 'Postman 裡的一組 request、測試腳本與流程。你可以把它想成「API 檢查表」。'],
        ['Environment', '不同環境的變數集合，例如本機、staging、production-like 各自有不同 <code>baseUrl</code>。'],
        ['Assertion', '測試中的明確檢查，例如「必須回 200」、「必須有 transactionId」、「amount 必須大於 0」。'],
        ['CI', '每次提交程式後自動建置與測試的流程，例如 GitHub Actions。']
      ]), '#38bdf8')}

      <p><b>很多人卡住的地方：</b>只會在 Postman 按 Send，不等於會做 API 測試。按 Send 只是手動探索；真正的測試要把預期寫成 Tests。也就是說，你要讓 Postman 不只「看到 response」，還要「判斷 response 對不對」。</p>

      <p><b>Newman 的角色：</b>Newman 不會替你發明測試，它只是忠實執行 Postman Collection。當 Collection 裡有明確斷言，Newman 就能在 CI 伺服器上自動跑，並在測試失敗時讓 pipeline 失敗，阻止破壞 API 合約的改動部署。</p>

      ${noteBox('閱讀這頁時請抓住這條主線', `
        <b>Postman</b>：設計 API 請求與測試。<br>
        <b>Collection</b>：把一串 API 測試保存成可分享、可版本控制的檢查表。<br>
        <b>Newman</b>：在命令列或 CI 執行同一份檢查表。<br>
        <b>API 合約測試</b>：確認 API 回應仍符合消費方依賴的格式與規則。
      `, '#818cf8')}`;

    postman.case = `
      <p><b>案例一：欄位改名造成前端白屏</b><br>
      後端原本回傳 <code>{ "transactionId": "TXN-123" }</code>，重構後改成 <code>{ "txId": "TXN-123" }</code>。後端自己的測試可能仍然通過，因為付款邏輯沒有壞；但前端仍讀 <code>transactionId</code>，畫面會拿不到資料。若 Collection 裡有「必須存在 transactionId」的斷言，Newman 在 CI 就會立刻失敗。</p>

      <p><b>案例二：只檢查 200 OK 的假安全感</b><br>
      訂單 API 回傳 200，但 <code>items</code> 從 array 變成 object。只測 status code 會通過；測 schema 才會發現資料形狀被破壞。這就是為什麼 API 測試不能只停在「有回應」，而要檢查欄位、型別、格式與商業規則。</p>

      <p><b>案例三：Environment 讓同一份測試跑在不同環境</b><br>
      如果 Collection 裡把 URL 寫死成 <code>http://localhost:3000</code>，到 staging 就不能用。正確做法是用 <code>{{baseUrl}}</code>，再用 environment 決定目前要打本機、staging 還是測試環境。這樣同一份 Collection 才能被 Newman 重複使用。</p>`;

    postman.analogies = [
      { icon: '🍱', title: '中央廚房檢查表', body: '<b>Postman</b> 像主廚建立菜品檢查表；<b>Tests</b> 是每條驗收規則，例如重量、溫度、過敏原標示；<b>Collection</b> 是整本檢查表；<b>Newman</b> 是自動檢驗機。這對應到「把人工 API 驗收變成可重複執行的自動檢查」。' },
      { icon: '📦', title: '物流出貨掃描', body: '<b>Request</b> 像包裹配送指令，<b>Response</b> 像物流系統回覆。只看到「已出貨」不夠，還要檢查收件地址、品項、數量、追蹤碼。這對應到為什麼 API 測試不能只看 HTTP 200，還要檢查 body 內容。' },
      { icon: '🏭', title: '工廠自動品管線', body: '你在 Postman 按 Send 是人工抽查；Newman 在 CI 裡跑是自動品管線。只要規格壞掉，CI 就停線。這對應到 Newman 用失敗 exit code 阻止不合格版本部署。' },
      { icon: '🧾', title: '公文格式審查', body: '<b>API 合約</b> 像公文格式規定：必填欄位、日期格式、簽核欄位都不能亂改。Postman Tests 把規定寫成斷言，Newman 每次送審自動檢查。這對應到 schema validation 與 contract testing。' }
    ];

    postman.solution = `
      <p><b>落地做法：</b>先用 Postman 把 API 檢查表寫清楚，再用 Newman 讓 CI 自動執行。重點不是工具名字，而是把「我手動看起來正常」變成「機器每次都能判斷是否正常」。</p>

      <p><b>1. Postman Tests：從 200 OK 升級成合約檢查</b></p>
      <pre style="background:#020617;color:#34d399;padding:10px;border-radius:8px;font-size:0.75em;overflow-x:auto;margin:8px 0">// 寫在 Postman 的 Tests 分頁
pm.test("HTTP 狀態碼必須是 200", () => {
  pm.response.to.have.status(200); // 只代表伺服器成功處理請求
});

pm.test("回應必須包含交易編號", () => {
  const json = pm.response.json(); // 把 response body 轉成 JS 物件
  pm.expect(json).to.have.property("transactionId"); // 防止欄位被改名或刪除
  pm.expect(json.transactionId).to.match(/^TXN-/); // 防止格式不符合約定
});

pm.test("金額必須是正數", () => {
  const json = pm.response.json();
  pm.expect(json.amount).to.be.a("number"); // 檢查型別
  pm.expect(json.amount).to.be.above(0); // 檢查商業規則
});</pre>

      <p><b>2. Newman：把同一份 Collection 放進 CI</b></p>
      <pre style="background:#020617;color:#34d399;padding:10px;border-radius:8px;font-size:0.75em;overflow-x:auto;margin:8px 0">newman run payment-api.postman_collection.json \\
  --environment staging.postman_environment.json \\
  --reporters cli,junit \\
  --reporter-junit-export newman-report.xml \\
  --bail

# --environment：套用 staging 的 baseUrl、token 等變數
# --reporters：輸出命令列與 JUnit 報告，方便 CI 顯示
# --bail：遇到第一個關鍵失敗就停止，避免一串連鎖假錯誤</pre>`;
  }

  function setK6Lesson() {
    const k6 = byId(7);
    if (!k6) return;

    k6.tagline = '用可重現的流量模型驗證系統容量、延遲、錯誤率與部署門檻';
    k6.intro = `
      <p><b>先用一句話說清楚：</b>k6 是用 JavaScript 撰寫腳本的負載測試工具。它不是單純「把人數開很大」，而是讓你用程式描述流量模型，並用 thresholds 自動判斷這次壓測是否通過。</p>

      ${noteBox('初學者必補名詞', termList([
        ['VU', 'Virtual User，虛擬使用者。可以想成一個反覆執行測試流程的使用者。'],
        ['Iteration', '一次完整腳本流程。例如登入、查商品、加入購物車、結帳跑完一次。'],
        ['Scenario', '一段負載情境設定，描述要跑哪個函式、跑多久、用哪種流量模型。'],
        ['Executor', 'k6 用來排程負載的模式。例如固定 VU、逐步增加 VU、固定到達率。'],
        ['Arrival rate', '單位時間開始多少次 iteration。這比「有多少 VU」更接近真實流量入口。'],
        ['Threshold', '壓測通過/失敗條件，例如 <code>p(95)&lt;300</code> 或錯誤率 <code>rate&lt;0.01</code>。'],
        ['P95', '95 百分位延遲。意思是 95% 的請求都比這個數字快，常比平均值更能反映使用者體感。']
      ]), '#34d399')}

      <p><b>為什麼初學者會看不懂 k6？</b><br>
      因為壓測不是只問「幾個人同時在線」。你要先知道測試目的：是找容量上限、驗證 SLA、測突發流量，還是看部署前有沒有退化。不同目的要選不同 executor。</p>

      <p><b>三種常見情境：</b><br>
      <b>ramping-vus</b>：逐步增加虛擬使用者，常用來觀察系統什麼時候開始撐不住。<br>
      <b>constant-arrival-rate</b>：固定每秒開始多少次 iteration，常用來模擬穩定真實流量。<br>
      <b>thresholds</b>：把「可接受」寫成條件，例如 p95 必須低於 300ms、錯誤率低於 1%。</p>

      ${noteBox('閱讀這頁時請抓住這條主線', `
        <b>流量模型</b>回答「壓力怎麼來」。<br>
        <b>指標</b>回答「系統表現如何」。<br>
        <b>threshold</b>回答「這次能不能部署」。<br>
        沒有 threshold 的壓測只是報告；有 threshold 的壓測才會變成品質閘門。
      `, '#fbbf24')}`;

    k6.case = `
      <p><b>案例一：只看 VU 數導致誤判</b><br>
      團隊說「我們用 1000 VU 壓測過，所以沒問題」。但每個 VU 都在等很久，實際每秒請求數很低。正式上線時，真實流量是每秒固定湧入大量請求，系統排隊爆掉。這時應該用 arrival-rate 類型的 scenario，更直接描述「每秒有多少工作進來」。</p>

      <p><b>案例二：沒有 threshold 的報告沒辦法自動決策</b><br>
      壓測報告顯示 p95 = 420ms，但沒有人知道這算不算失敗。若腳本寫明 <code>http_req_duration: ['p(95)&lt;300']</code>，k6 就會在超標時用失敗狀態結束，CI 可以自動阻擋部署。</p>

      <p><b>案例三：突發流量測試不是平常流量測試</b><br>
      演唱會開賣、限量商品、政府補助申請都不是慢慢增加的流量，而是短時間尖峰。這種情境要測 spike 或快速 ramp，並觀察錯誤率、排隊、HPA 擴容時間、下游依賴是否被打爆。</p>`;

    k6.analogies = [
      { icon: '🚇', title: '捷運尖峰人流', body: '<b>VU</b> 像正在站內移動的乘客，<b>arrival rate</b> 像每分鐘進站的新乘客數。只知道站內有多少人不夠，入口每分鐘湧入多少人才是壓力來源。這對應到 k6 裡「VU 模型」和「到達率模型」的差別。' },
      { icon: '🏟️', title: '演唱會入場安檢', body: '<b>constant-arrival-rate</b> 像每秒固定 50 人到安檢口，不管安檢變慢，入口壓力仍維持。這對應到穩定流量下驗證 SLA：系統必須在固定到達率下維持低延遲與低錯誤率。' },
      { icon: '🌊', title: '水庫洪峰測試', body: '<b>spike</b> 像上游洪峰突然到達，重點不是平常水流，而是閘門、溢洪道、警報和分流能否快速反應。這對應到突發流量下的熔斷、限流與擴容能力。' },
      { icon: '🏁', title: '賽車測功機', body: '<b>threshold</b> 像工程師事先訂下「引擎溫度不能超過 110 度、輸出不能低於某馬力」。測完不是只看圖，而是直接判定合格或不合格。這對應到 k6 thresholds 讓 CI 自動判斷壓測結果。' }
    ];

    k6.solution = `
      <p><b>落地做法：</b>先寫清楚測試目的，再選 executor，最後用 thresholds 定義通過條件。不要一開始就追求超大 VU；先問這個測試要回答哪個問題。</p>

      <p><b>1. 用 constant-arrival-rate 驗證穩定流量</b></p>
      <pre style="background:#020617;color:#34d399;padding:10px;border-radius:8px;font-size:0.75em;overflow-x:auto;margin:8px 0">import http from 'k6/http';
import { check } from 'k6';

export const options = {
  scenarios: {
    checkout_steady_load: {
      executor: 'constant-arrival-rate', // 固定 iteration 到達率
      rate: 50,                          // 每秒開始 50 次結帳流程
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 100,              // 預先準備 VU，避免測試中臨時建立不足
      maxVUs: 300                        // 系統變慢時最多可擴到 300 VU 維持到達率
    }
  },
  thresholds: {
    http_req_failed: ['rate&lt;0.01'],       // 錯誤率必須低於 1%
    http_req_duration: ['p(95)&lt;300']      // 95% 請求必須低於 300ms
  }
};

export default function () {
  const res = http.post('https://api.example.com/checkout', JSON.stringify({
    sku: 'COURSE-001',
    quantity: 1
  }));

  check(res, {
    'checkout returns 200': (r) =&gt; r.status === 200
  });
}</pre>

      <p><b>2. 如何解讀結果</b><br>
      如果錯誤率超過 1%，代表使用者會看到失敗；如果 p95 超過 300ms，代表尾端使用者體感變差；如果 VU 被推到 maxVUs 仍維持不了 rate，代表系統或壓測機已經跟不上目標到達率，要降低測試目標或擴充壓測資源。</p>`;
  }

  function setMutationLesson() {
    const mutation = byId(6);
    if (!mutation) return;

    mutation.tagline = '測試的測試：故意把程式改壞，檢查你的測試是否真的抓得住錯誤';
    mutation.intro = `
      <p><b>先用一句話說清楚：</b>突變測試不是在測產品功能，而是在測「你的測試有沒有用」。它會故意把程式做小幅錯誤修改，再重新跑測試；如果測試沒有失敗，代表測試沒有保護到那個行為。</p>

      ${noteBox('初學者必補名詞', termList([
        ['覆蓋率 Coverage', '測試有沒有執行到某段程式。執行到不代表有驗證對。'],
        ['斷言 Assertion', '測試明確檢查結果，例如 <code>expect(canRedeem(10)).toBe(true)</code>。'],
        ['突變體 Mutant', '工具故意產生的錯誤版本，例如把 <code>&gt;=</code> 改成 <code>&gt;</code>。'],
        ['Killed', '突變體讓測試失敗，表示測試抓到錯。'],
        ['Survived', '突變體仍然通過測試，表示測試沒有抓到這種錯。'],
        ['等價突變體', '程式被改了，但外部行為沒有差異，因此測試不一定能殺死。這不是測試弱，而是突變本身等價。']
      ]), '#38bdf8')}

      <p><b>為什麼覆蓋率可能騙人？</b><br>
      假設規格是「滿 10 點可以兌換」。你的測試只測 <code>11</code> 點會成功，這行程式確實被覆蓋了。但如果工程師把 <code>&gt;= 10</code> 寫成 <code>&gt; 10</code>，11 點仍然成功，測試不會紅。真正能抓到這個錯的是 <code>10</code> 點這個邊界測試。</p>

      <p><b>突變測試的思考順序：</b><br>
      1. 先有一組正常測試。<br>
      2. 工具產生很多小錯誤版本。<br>
      3. 每個錯誤版本都重新跑測試。<br>
      4. 測試失敗代表 killed；測試通過代表 survived。<br>
      5. 對 survived 的重要商業規則補上更精準的斷言。</p>

      ${noteBox('不要誤解', '突變分數不是越接近 100 越值得盲目追。真實專案會有等價突變體，也會有效能成本。重點是把高風險邏輯，例如金額、權限、狀態轉換、邊界條件，補到足夠有保護力。', '#fbbf24')}`;

    mutation.case = `
      <p><b>案例一：集點兌換的邊界錯誤</b><br>
      規格是滿 10 點可兌換。原始程式是 <code>points &gt;= 10</code>。突變工具改成 <code>points &gt; 10</code>。如果測試只有 11 點，突變體會 survived；如果測試包含 9、10、11，10 點案例會失敗，突變體就 killed。</p>

      <p><b>案例二：金融折扣與費率計算</b><br>
      某費率函式測試覆蓋率 95%，但突變測試發現把 <code>fee + tax</code> 改成 <code>fee - tax</code> 仍通過。原因是測試只檢查結果不是 null，沒有檢查具體金額。補上明確金額斷言後，這類突變才會 killed。</p>

      <p><b>案例三：前端顯示測試的盲點</b><br>
      React 測試只檢查按鈕有渲染，沒有檢查點擊後計算值是否正確。突變工具把 <code>&gt;=</code> 改成 <code>&gt;</code>，測試仍通過。這代表測試只保護 UI 存在，不保護商業邏輯。</p>`;

    mutation.analogies = [
      { icon: '🛡️', title: '防彈衣實彈測試', body: '<b>覆蓋率</b> 像確認防彈衣有穿在假人身上；<b>突變測試</b> 是真的朝接縫和薄弱處射擊。子彈被擋下就是 <b>Killed</b>，表示測試抓到錯；子彈穿過但警報沒響就是 <b>Survived</b>。這對應到「測試有跑」和「測試有效」的差別。' },
      { icon: '🚪', title: '門禁卡邊界測試', body: '規則是 18 歲可入場。把 <code>&gt;= 18</code> 突變成 <code>&gt; 18</code>，17 與 19 的測試都看不出問題，只有 18 會抓到。這對應到突變測試常常暴露「缺少邊界測資」。' },
      { icon: '💊', title: '藥物對照組', body: '病人有吃藥只等於程式被執行，不能證明藥有效。突變體像把藥方改一點點，如果療效評估完全不變，代表你的評估指標太弱。這對應到沒有斷言或斷言太寬鬆的測試。' },
      { icon: '🎯', title: '靶心偏移', body: '把靶心偷偷往旁邊移，如果成績完全沒變，代表射手本來就沒有瞄準靶心。把程式邏輯偷偷改壞，測試仍通過，代表測試沒有瞄準真正的商業規則。' }
    ];

    mutation.solution = `
      <p><b>落地做法：</b>不要先追分數，先追 survived 背後的風險。看到 survived mutant 時，問的是：這個突變是否代表真實可能發生的 bug？如果是，就補測試；如果是等價突變體或低價值程式碼，可以排除或降低優先度。</p>

      <pre style="background:#020617;color:#34d399;padding:10px;border-radius:8px;font-size:0.75em;overflow-x:auto;margin:8px 0">function canRedeem(points) {
  return points >= 10; // 規格：10 點「含以上」可以兌換
}

// 弱測試：只測 11 點
expect(canRedeem(11)).toBe(true);
// 突變成 points > 10 後，11 仍然是 true，所以突變體 survived。

// 強測試：測邊界外、邊界點、邊界內
expect(canRedeem(9)).toBe(false);  // 邊界外
expect(canRedeem(10)).toBe(true);  // 邊界本身，能殺死 >= 改成 > 的突變
expect(canRedeem(11)).toBe(true);  // 邊界內</pre>`;
  }

  setPostmanLesson();
  setMutationLesson();
  setK6Lesson();

  const oldRenderDiagram = renderDiagram;
  renderDiagram = function enhancedRenderDiagram(id) {
    if (id === 5) return renderPostmanDiagram();
    if (id === 6) return renderMutationDiagram();
    if (id === 7) return renderK6Diagram();
    return oldRenderDiagram(id);
  };

  function renderPostmanDiagram() {
    const cont = document.getElementById('diagram-container');
    cont.innerHTML = `
      <div style="width:100%;font-size:0.875em">
        <div style="font-size:0.6875em;color:#64748b;margin-bottom:8px">點擊流程步驟：理解 Postman 到 Newman 的責任分工</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:8px">
          <button onclick="pmFlow(1)" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#7dd3fc;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">1. 建 request</button>
          <button onclick="pmFlow(2)" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#c7d2fe;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">2. 寫 Tests</button>
          <button onclick="pmFlow(3)" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#86efac;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">3. 存 Collection</button>
          <button onclick="pmFlow(4)" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#fbbf24;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">4. Newman CI</button>
        </div>
        <div id="d-pm-flow" style="padding:10px;border-radius:8px;background:rgba(15,23,42,0.7);border:1px solid #1e293b;color:#cbd5e1;font-size:0.75em;line-height:1.7">
          先點第一步。重點：Postman 建立可重複檢查表，Newman 把檢查表拿到 CI 自動跑。
        </div>
      </div>`;
  }

  function renderMutationDiagram() {
    const cont = document.getElementById('diagram-container');
    cont.innerHTML = `
      <div style="width:100%;font-size:0.875em">
        <div style="font-size:0.6875em;color:#64748b;margin-bottom:6px">突變測試互動：選測資，看 >= 變成 > 時會 Killed 還是 Survived</div>
        <div style="background:#020617;border:1px solid #1e293b;padding:10px;border-radius:8px;font-family:monospace;font-size:0.75em;line-height:1.8;margin-bottom:8px">
          <div style="color:#64748b">// 規格：points >= 10 可以兌換</div>
          <div>原始：return points <span style="color:#38bdf8;font-weight:900">&gt;=</span> 10;</div>
          <div>突變：return points <span style="color:#f87171;font-weight:900">&gt;</span> 10;</div>
        </div>
        <div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-bottom:8px">
          <label style="padding:5px 8px;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#cbd5e1;font-size:0.72em"><input type="checkbox" class="mut-case" value="9"> 測 9 點</label>
          <label style="padding:5px 8px;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#cbd5e1;font-size:0.72em"><input type="checkbox" class="mut-case" value="10"> 測 10 點</label>
          <label style="padding:5px 8px;background:#0f172a;border:1px solid #334155;border-radius:6px;color:#cbd5e1;font-size:0.72em"><input type="checkbox" class="mut-case" value="11" checked> 測 11 點</label>
        </div>
        <div id="d-mut2" style="font-size:0.75em;color:#fbbf24;text-align:center;line-height:1.6">只測 11 點時，>= 改成 > 仍然通過，所以突變體 Survived。</div>
      </div>`;
    setTimeout(bindMutationTeachingLab, 0);
  }

  function renderK6Diagram() {
    const cont = document.getElementById('diagram-container');
    cont.innerHTML = `
      <div style="width:100%;font-size:0.875em">
        <div style="font-size:0.6875em;color:#64748b;margin-bottom:8px">選擇壓測目的：不同目的要選不同 executor</div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:8px">
          <button onclick="k6Goal('capacity')" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#7dd3fc;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">找容量上限</button>
          <button onclick="k6Goal('sla')" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#86efac;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">驗證 SLA</button>
          <button onclick="k6Goal('spike')" style="padding:8px;background:#0f172a;border:1px solid #1e293b;color:#fbbf24;border-radius:6px;font-size:0.72em;font-weight:800;cursor:pointer">測突發流量</button>
        </div>
        <div id="d-k6-goal" style="padding:10px;border-radius:8px;background:rgba(15,23,42,0.7);border:1px solid #1e293b;color:#cbd5e1;font-size:0.75em;line-height:1.7">
          先選一個測試目的。不要先問「要開幾個 VU」，先問「我要回答哪個問題」。
        </div>
        <div style="margin-top:10px">
          <div style="display:flex;justify-content:space-between;font-size:0.72em;color:#94a3b8;margin-bottom:4px">
            <span>目標到達率</span><span><b id="d-k6-rate" style="color:#34d399">50</b> iterations/s</span>
          </div>
          <input type="range" min="10" max="300" value="50" oninput="k6Rate(this.value)" style="width:100%;accent-color:#34d399">
          <div id="d-k6-rate-fb" style="font-size:0.72em;color:#64748b;text-align:center;margin-top:6px">到達率越高，若系統變慢，需要更多 VU 才能維持流量；若超過 maxVUs，測試會跟不上目標。</div>
        </div>
      </div>`;
  }

  window.pmFlow = function pmFlow(step) {
    const el = document.getElementById('d-pm-flow');
    if (!el) return;
    const copy = {
      1: '<b style="color:#7dd3fc">Postman 建 request：</b>明確設定 method、URL、headers、body。這一步是把「我要怎麼呼叫 API」保存下來。',
      2: '<b style="color:#c7d2fe">Tests 寫斷言：</b>不要只看 200 OK。要檢查必要欄位、型別、格式、商業規則。這一步才讓 request 變成真正測試。',
      3: '<b style="color:#86efac">Collection：</b>把多個 request、tests、變數流程收成一組可分享、可版本控制的 API 檢查表。',
      4: '<b style="color:#fbbf24">Newman CI：</b>在命令列執行 Collection。測試失敗時用 exit code 讓 CI 失敗，阻止破壞 API 合約的改動部署。'
    };
    el.innerHTML = copy[step];
  };

  window.k6Goal = function k6Goal(kind) {
    const el = document.getElementById('d-k6-goal');
    if (!el) return;
    const copy = {
      capacity: '<b style="color:#7dd3fc">找容量上限：</b>用 ramping-vus 或 ramping-arrival-rate 逐步加壓，觀察 p95、錯誤率、CPU、DB、Redis 等哪個指標先失控。目標是找到 knee point，不是證明系統永遠沒問題。',
      sla: '<b style="color:#86efac">驗證 SLA：</b>用 constant-arrival-rate 固定每秒進來多少工作，再用 thresholds 判定是否通過。例如 p95 &lt; 300ms、錯誤率 &lt; 1%。',
      spike: '<b style="color:#fbbf24">測突發流量：</b>快速拉高流量，觀察限流、熔斷、HPA 擴容、下游依賴是否撐得住。這測的是恢復能力與保護機制，不是日常平均流量。'
    };
    el.innerHTML = copy[kind];
  };

  window.k6Rate = function k6Rate(value) {
    const rate = Number(value);
    const rateEl = document.getElementById('d-k6-rate');
    const fb = document.getElementById('d-k6-rate-fb');
    if (rateEl) rateEl.textContent = rate;
    if (!fb) return;
    const suggestedVUs = Math.ceil(rate * 0.8);
    if (rate < 80) {
      fb.style.color = '#86efac';
      fb.innerHTML = `低到中等流量：若一次流程約 0.8 秒，粗估需要 ${suggestedVUs} 個左右 VU 維持到達率。`;
    } else if (rate < 180) {
      fb.style.color = '#fbbf24';
      fb.innerHTML = `中高流量：粗估需要 ${suggestedVUs} 個以上 VU。請觀察 p95 是否升高，以及 VU 是否逼近 maxVUs。`;
    } else {
      fb.style.color = '#f87171';
      fb.innerHTML = `高流量：粗估需要 ${suggestedVUs} 個以上 VU。若壓測機或被測系統先到瓶頸，結果會失真。`;
    }
  };

  function bindMutationTeachingLab() {
    const boxes = document.querySelectorAll('.mut-case');
    const out = document.getElementById('d-mut2');
    if (!boxes.length || !out) return;
    const update = () => {
      const selected = Array.from(boxes).filter((box) => box.checked).map((box) => box.value);
      if (selected.includes('10')) {
        out.style.color = '#86efac';
        out.innerHTML = '<b>Killed：</b>你測了 10 點這個邊界。原始程式回 true，突變後回 false，測試會失敗，所以抓到錯。';
      } else {
        out.style.color = '#fbbf24';
        out.innerHTML = '<b>Survived：</b>你沒有測 10 點。只測 9 或 11 都看不出 >= 被改成 >，所以測試保護力不足。';
      }
    };
    boxes.forEach((box) => box.addEventListener('change', update));
    update();
  }

  function installMindmapUsabilityTools() {
    const originalLoadDetails = loadDetails;
    loadDetails = function enhancedLoadDetails(node) {
      originalLoadDetails(node);
      if (node && node.id) {
        const nextHash = `#node-${node.id}`;
        if (location.hash !== nextHash) {
          history.replaceState(null, '', nextHash);
        }
        document.title = `${node.label}｜現代軟體工程互動心智圖`;
      }
    };

    const controls = document.getElementById('canvas-controls');
    if (controls && !document.getElementById('learning-mini-tools')) {
      const tools = document.createElement('div');
      tools.id = 'learning-mini-tools';
      tools.className = 'learning-mini-tools';
      tools.innerHTML = `
        <button type="button" id="copy-node-link">複製目前節點連結</button>
        <button type="button" id="toggle-focus-mode">閱讀聚焦模式</button>
      `;
      controls.appendChild(tools);

      document.getElementById('copy-node-link').addEventListener('click', async (event) => {
        const button = event.currentTarget;
        if (!selectedNode) {
          button.textContent = '請先選一個節點';
          setTimeout(() => { button.textContent = '複製目前節點連結'; }, 1200);
          return;
        }
        const url = `${location.origin}${location.pathname}#node-${selectedNode.id}`;
        try {
          await navigator.clipboard.writeText(url);
          button.textContent = '已複製連結';
          button.classList.add('tool-success');
        } catch (err) {
          button.textContent = `節點連結：#node-${selectedNode.id}`;
        }
        setTimeout(() => {
          button.textContent = '複製目前節點連結';
          button.classList.remove('tool-success');
        }, 1500);
      });

      document.getElementById('toggle-focus-mode').addEventListener('click', (event) => {
        const active = document.body.classList.toggle('enhanced-focus');
        event.currentTarget.textContent = active ? '退出聚焦模式' : '閱讀聚焦模式';
      });
    }

    window.addEventListener('hashchange', selectNodeFromHash);
    document.addEventListener('keydown', (event) => {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (event.key === 'ArrowRight') {
        navigateStep(1);
        event.preventDefault();
      }
      if (event.key === 'ArrowLeft') {
        navigateStep(-1);
        event.preventDefault();
      }
    });

    selectNodeFromHash();
  }

  function selectNodeFromHash() {
    const match = location.hash.match(/^#node-(\d+)$/);
    if (!match) return;
    const node = concepts.find((item) => item.id === Number(match[1]));
    if (!node) return;
    selectedNode = node;
    loadDetails(node);
  }

  installMindmapUsabilityTools();

  if (typeof selectedNode !== 'undefined' && selectedNode && (selectedNode.id === 5 || selectedNode.id === 6 || selectedNode.id === 7)) {
    loadDetails(selectedNode);
  }
})();
