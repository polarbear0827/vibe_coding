(function enhanceMindmapLessons() {
  if (!Array.isArray(concepts)) return;

  const byId = (id) => concepts.find((item) => item.id === id);

  const postman = byId(5);
  if (postman) {
    postman.tagline = 'API 測試從手動探索到 CI 自動回歸：Postman 建立檢查表，Newman 負責重複執行';
    postman.intro = `
      <p><b>先用一句話說清楚：</b>Postman 是讓工程師用圖形介面建立、保存、執行 API 請求的工具；Newman 是 Postman Collection 的命令列執行器，讓同一組測試可以在 CI/CD 裡自動跑。</p>

      <div style="border-left:3px solid #38bdf8;padding:10px 12px;margin:10px 0;background:rgba(56,189,248,0.05);border-radius:0 8px 8px 0">
        <b style="color:#7dd3fc">初學者必補名詞</b><br><br>
        <b>API</b>：系統之間交換資料的介面。例如前端呼叫 <code>POST /checkout</code> 請後端建立訂單。<br>
        <b>Request</b>：一次 API 呼叫，包含 method、URL、headers、body。<br>
        <b>Response</b>：伺服器回傳的結果，包含 status code、headers、body。<br>
        <b>Collection</b>：Postman 裡保存的一組 request、測試腳本與流程。可以把它想成「API 檢查表」。<br>
        <b>Environment</b>：不同環境的變數，例如 <code>baseUrl</code> 在本機是 localhost，在 staging 是另一個網址。<br>
        <b>Assertion</b>：測試中的明確檢查，例如「status 必須是 200」、「response 必須有 transactionId」。<br>
        <b>CI/CD</b>：每次提交程式後，自動建置、測試、部署的流程。
      </div>

      <p><b>為什麼只會用 Postman 發 request 還不夠？</b><br>
      很多人第一次用 Postman，只是按 Send 看 API 有沒有回東西。這只能算「手動探索」，還不是可靠測試。可靠的 API 測試要把預期寫成 Tests：狀態碼對不對、欄位是否存在、欄位型別是否正確、商業規則是否成立。</p>

      <p><b>Newman 解決什麼痛點？</b><br>
      人會忘記按測試，CI 不會。當 Collection 裡已經寫好斷言，Newman 就能在沒有 GUI 的伺服器中執行同一份 Collection。只要 API 回應破壞合約，Newman 會讓 CI 失敗，阻止錯誤進入部署流程。</p>

      <div style="border:1px solid rgba(129,140,248,0.3);background:rgba(67,56,202,0.09);padding:10px;border-radius:8px;margin-top:10px">
        <b style="color:#c7d2fe">最重要的理解：</b><br>
        Postman 不是只用來「手動戳 API」；它真正有價值的地方，是把 request、環境變數、前置腳本、測試斷言存成 Collection。Newman 不是另一套測試語言；它只是把同一份 Collection 帶到命令列和 CI 裡執行。
      </div>`;

    postman.case = `
      <p><b>案例一：欄位改名造成前端白屏</b><br>
      後端原本回傳 <code>{ "transactionId": "TXN-123" }</code>，重構後改成 <code>{ "txId": "TXN-123" }</code>。後端單元測試可能仍然通過，因為它只驗證付款服務內部邏輯；但前端仍讀 <code>transactionId</code>，畫面會拿不到交易編號。若 Postman Collection 裡有 schema 或欄位斷言，Newman 在 CI 就會報錯：缺少 <code>transactionId</code>。這就是 API 合約測試的價值。</p>

      <p><b>案例二：只檢查 200 OK 的假安全感</b><br>
      某查詢訂單 API 回傳 200，但 body 裡的 <code>items</code> 從 array 變成 object。若測試只寫 <code>pm.response.to.have.status(200)</code>，Newman 會通過；若測試補上 <code>items</code> 必須是 array、每筆 item 必須有 sku/quantity/price，CI 才會抓到破壞性變更。</p>

      <p><b>案例三：Environment 避免測試寫死</b><br>
      初學者常把 URL 寫死成 <code>http://localhost:3000</code>。這樣 Collection 到 staging 就不能用。正確做法是使用 <code>{{baseUrl}}</code>，本機、staging、production-like 測試各自用不同 environment。這讓同一份 Collection 可以在多個環境重複驗證。</p>`;

    postman.analogies = [
      { icon: '🍱', title: '中央廚房檢查表', body: '<b>Postman</b> 就像主廚建立一道菜的檢查表：份量、溫度、擺盤、過敏原標示都寫清楚。<b>Collection</b> 是整本檢查表，<b>Tests</b> 是每一條驗收規則。<b>Newman</b> 則是自動檢驗機，每批出餐都照同一份檢查表跑一次。這對應到 API 測試裡「把人工驗收變成可重複執行的自動檢查」。' },
      { icon: '📦', title: '物流出貨掃描', body: '<b>Request</b> 像包裹上的配送指令，<b>Response</b> 像物流系統回傳的狀態。只看到「已出貨」不夠，還要檢查收件地址、品項、數量、追蹤碼。這對應到為什麼不能只測 HTTP 200，還要檢查 response body 的欄位和商業規則。' },
      { icon: '🏭', title: '工廠自動品管線', body: '人工抽查就是你在 Postman 裡按 Send；自動品管線就是 Newman 在 CI 裡每次 commit 都跑。若新品規格被改壞，品管線會立刻停線，對應到 Newman 用非零 exit code 讓 CI 失敗。' },
      { icon: '🧾', title: '公文格式審查', body: '<b>API 合約</b> 像公文格式規定：日期格式、必填欄位、簽核欄位都不能亂改。Postman Tests 把規定寫成斷言，Newman 每次送審都自動檢查。這對應到 schema validation 與 contract testing。' }
    ];

    postman.solution = `
      <p><b>落地做法：先讓測試說人話，再讓 CI 自動跑。</b>一個好的 Collection 不只是 request 清單，而是包含環境變數、前置資料、明確斷言、錯誤訊息與報告輸出。</p>

      <p><b>1. Postman Tests：從 200 OK 升級成合約檢查</b></p>
      <pre style="background:#020617;color:#34d399;padding:10px;border-radius:8px;font-size:0.75em;overflow-x:auto;margin:8px 0">// 這段寫在 Postman 的 Tests 分頁
pm.test("HTTP 狀態碼必須是 200", () => {
  pm.response.to.have.status(200); // 只代表伺服器說「請求成功」
});

pm.test("回應必須包含交易編號", () => {
  const json = pm.response.json(); // 把 response body 轉成 JS 物件
  pm.expect(json).to.have.property("transactionId"); // 防止欄位被改名或刪除
  pm.expect(json.transactionId).to.match(/^TXN-/); // 防止格式錯誤
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

# --environment：套用 staging 的 baseUrl/token 等變數
# --reporters：輸出命令列與 JUnit 報告，方便 CI 顯示
# --bail：第一個關鍵失敗就停止，避免後面出現一串連鎖假錯誤</pre>`;
  }

  const mutation = byId(6);
  if (mutation) {
    mutation.tagline = '測試的測試：故意把程式改壞，檢查你的測試是否真的抓得住錯誤';
    mutation.intro = `
      <p><b>先用一句話說清楚：</b>突變測試不是在測產品功能，而是在測「你的測試有沒有用」。它會故意把程式做小幅錯誤修改，再重新跑測試；如果測試沒有失敗，代表測試沒有保護到那個行為。</p>

      <div style="border-left:3px solid #38bdf8;padding:10px 12px;margin:10px 0;background:rgba(56,189,248,0.05);border-radius:0 8px 8px 0">
        <b style="color:#7dd3fc">初學者必補名詞</b><br><br>
        <b>覆蓋率 Coverage</b>：測試有沒有執行到某段程式。執行到不代表有驗證對。<br>
        <b>斷言 Assertion</b>：測試明確檢查結果，例如 <code>expect(canRedeem(10)).toBe(true)</code>。沒有斷言，測試常常只是「跑過」。<br>
        <b>突變體 Mutant</b>：工具故意產生的錯誤版本，例如把 <code>&gt;=</code> 改成 <code>&gt;</code>。<br>
        <b>Killed</b>：突變體讓測試失敗，表示測試抓到錯。<br>
        <b>Survived</b>：突變體仍然通過測試，表示測試沒有抓到這種錯。<br>
        <b>等價突變體 Equivalent Mutant</b>：程式被改了，但外部行為沒有差異，因此測試不一定能殺死；這不是測試弱，而是突變本身等價。
      </div>

      <p><b>為什麼覆蓋率可能騙人？</b><br>
      假設規格是「滿 10 點可以兌換」。你的測試只測 <code>11</code> 點會成功，這行程式確實被覆蓋了。但如果工程師把 <code>&gt;= 10</code> 寫成 <code>&gt; 10</code>，11 點仍然成功，測試不會紅。真正能抓到這個錯的是 <code>10</code> 點這個邊界測試。</p>

      <p><b>突變測試的思考順序：</b><br>
      1. 先有一組正常測試。<br>
      2. 工具產生很多小錯誤版本。<br>
      3. 每個錯誤版本都重新跑測試。<br>
      4. 測試失敗代表 killed；測試通過代表 survived。<br>
      5. 對 survived 的重要商業規則補上更精準的斷言。</p>

      <div style="border:1px solid rgba(251,191,36,0.3);background:rgba(251,191,36,0.08);padding:10px;border-radius:8px;margin-top:10px">
        <b style="color:#fbbf24">不要誤解：</b>突變分數不是越接近 100 越值得盲目追。真實專案會有等價突變體，也會有效能成本。重點是把高風險邏輯，例如金額、權限、狀態轉換、邊界條件，補到足夠有保護力。
      </div>`;

    mutation.case = `
      <p><b>案例一：集點兌換的邊界錯誤</b><br>
      規格是滿 10 點可兌換。原始程式是 <code>points &gt;= 10</code>。突變工具改成 <code>points &gt; 10</code>。如果測試只有 11 點，突變體會 survived；如果測試包含 9、10、11，10 點案例會失敗，突變體就 killed。這個例子對應到邊界測試與突變測試的關係。</p>

      <p><b>案例二：金融折扣與費率計算</b><br>
      某費率函式測試覆蓋率 95%，但突變測試發現把 <code>fee + tax</code> 改成 <code>fee - tax</code> 仍通過。原因是測試只檢查結果不是 null，沒有檢查具體金額。補上明確金額斷言後，這類突變才會 killed。這說明覆蓋率只能說「跑到」，不能說「驗證到」。</p>

      <p><b>案例三：前端顯示測試的盲點</b><br>
      React 測試只檢查按鈕有渲染，沒有檢查點擊後計算值是否正確。突變工具把 <code>&gt;=</code> 改成 <code>&gt;</code>，測試仍通過。這代表測試只保護 UI 存在，不保護商業邏輯。修正方式是補上使用者操作後的結果斷言。</p>`;

    mutation.analogies = [
      { icon: '🛡️', title: '防彈衣實彈測試', body: '<b>覆蓋率</b> 像確認防彈衣有穿在假人身上；<b>突變測試</b> 是真的朝接縫和薄弱處射擊。子彈被擋下就是 <b>Killed</b>，表示測試抓到錯；子彈穿過但警報沒響就是 <b>Survived</b>，表示測試沒有保護那個行為。這對應到「測試有跑」和「測試有效」的差別。' },
      { icon: '🚪', title: '門禁卡邊界測試', body: '規則是 18 歲可入場。把 <code>&gt;= 18</code> 突變成 <code>&gt; 18</code>，17 與 19 的測試都看不出問題，只有 18 會抓到。這對應到突變測試常常暴露「缺少邊界測資」。' },
      { icon: '💊', title: '藥物對照組', body: '病人有吃藥只等於程式被執行，不能證明藥有效。突變體像把藥方改一點點，如果療效評估完全不變，代表你的評估指標太弱。這對應到沒有斷言或斷言太寬鬆的測試。' },
      { icon: '🎯', title: '靶心偏移', body: '把靶心偷偷往旁邊移，如果成績完全沒變，代表射手本來就沒有瞄準靶心。把程式邏輯偷偷改壞，測試仍通過，代表測試沒有瞄準真正的商業規則。' }
    ];

    mutation.solution = `
      <p><b>落地做法：不要先追分數，先追 survived 背後的風險。</b>看到 survived mutant 時，問的是：這個突變是否代表真實可能發生的 bug？如果是，就補測試；如果是等價突變體或低價值程式碼，可以排除或降低優先度。</p>

      <p><b>1. 用最小例子看懂 killed / survived</b></p>
      <pre style="background:#020617;color:#34d399;padding:10px;border-radius:8px;font-size:0.75em;overflow-x:auto;margin:8px 0">function canRedeem(points) {
  return points >= 10; // 規格：10 點「含以上」可以兌換
}

// 弱測試：只測 11 點
expect(canRedeem(11)).toBe(true);
// 突變成 points > 10 後，11 仍然是 true，所以突變體 survived。

// 強測試：測邊界外、邊界點、邊界內
expect(canRedeem(9)).toBe(false);  // 邊界外
expect(canRedeem(10)).toBe(true);  // 邊界本身，能殺死 >= 改成 > 的突變
expect(canRedeem(11)).toBe(true);  // 邊界內</pre>

      <p><b>2. 導入時的務實策略</b><br>
      先挑核心商業邏輯，不要一開始掃整個專案。金額、權限、狀態機、庫存、合約欄位最值得做。CI 可以先產報告不擋部署，等團隊理解 survived 類型後，再對核心模組設定門檻。</p>`;
  }

  const oldRenderDiagram = renderDiagram;
  renderDiagram = function enhancedRenderDiagram(id) {
    if (id === 5) {
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
            先點第一步。重點：Postman 是建立可重複檢查表，Newman 是把檢查表拿到 CI 自動跑。
          </div>
        </div>`;
      return;
    }
    if (id === 6) {
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
      return;
    }
    oldRenderDiagram(id);
  };

  window.pmFlow = function pmFlow(step) {
    const el = document.getElementById('d-pm-flow');
    if (!el) return;
    const copy = {
      1: '<b style="color:#7dd3fc">Postman 建 request：</b>明確設定 method、URL、headers、body。這一步是把「我要怎麼呼叫 API」保存下來，不再靠記憶手動輸入。',
      2: '<b style="color:#c7d2fe">Tests 寫斷言：</b>不要只看 200 OK。要檢查必要欄位、型別、格式、商業規則。這一步才讓 request 變成真正測試。',
      3: '<b style="color:#86efac">Collection：</b>把多個 request、tests、變數流程收成一組可分享、可版本控制的 API 檢查表。',
      4: '<b style="color:#fbbf24">Newman CI：</b>在命令列執行 Collection。測試失敗時用 exit code 讓 CI 失敗，阻止破壞 API 合約的改動部署。'
    };
    el.innerHTML = copy[step];
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

  if (selectedNode && (selectedNode.id === 5 || selectedNode.id === 6)) {
    loadDetails(selectedNode);
  }
})();
