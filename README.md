# 現代軟體工程互動學習地圖

這是一個可直接發布到 GitHub Pages 的靜態教材網站，內容聚焦在測試、自動化、效能診斷與生產觀測。

## 檔案

- `index.html`：頁面骨架
- `styles.css`：視覺與響應式樣式
- `content.js`：12 個學習單元、名詞解釋、案例、來源
- `app.js`：篩選、搜尋、互動練習、進度保存
- `software-engineering-mindmap-v6-factchecked.html`：原始單檔版本，已保留未修改

## 本機預覽

因為這是純靜態網站，可以直接用瀏覽器開啟 `index.html`。

若想用本機 server 預覽，可在此資料夾執行：

```bash
python -m http.server 8080
```

然後開啟：

```text
http://localhost:8080
```

## 發布到 GitHub Pages

1. 建立一個 GitHub repository。
2. 將本資料夾內的 `index.html`、`styles.css`、`content.js`、`app.js`、`README.md` 推上 repository。
3. 到 GitHub repository 的 Settings。
4. 進入 Pages。
5. Source 選擇 `Deploy from a branch`。
6. Branch 選擇 `main`，資料夾選擇 `/root`。
7. 儲存後等待 GitHub Pages 部署完成。

## 內容校對原則

教材中的技術定義以官方文件與常見工程文獻為主。案例是教學化改寫，用來輔助理解，不等同於完整事故報告。

如果要繼續擴充，建議優先修改 `content.js`，每個單元都有固定欄位：

- `takeaway`：一句話核心觀念
- `prerequisites`：前置名詞
- `explanation`：詳細講解
- `analogy`：生活類比與名詞對應
- `code`：有註解的程式碼或偽代碼
- `caseStudy`：實際案例拆解
- `lab`：互動練習類型
