# 現代軟體工程互動心智圖

這個 repository 是可直接發布到 GitHub Pages 的互動式心智圖教材。

## 檔案

- `index.html`：主要頁面，保留原本 Canvas 心智圖、節點拖曳、階段篩選、搜尋、側邊欄詳情、進度標記等互動。
- `mindmap-enhancements.js`：教材補強腳本。目前加強了 `Newman / Postman`、`突變測試`、`k6 壓力測試` 這幾個節點的初學者說明、名詞補充、類比對應、程式碼註解與互動練習。

## 本機預覽

可以直接用瀏覽器開啟：

```text
index.html
```

或使用本機 server：

```bash
python -m http.server 8080
```

再開啟：

```text
http://localhost:8080
```

## 發布到 GitHub Pages

1. 到 repository 的 `Settings`
2. 點左側 `Pages`
3. `Source` 選 `Deploy from a branch`
4. `Branch` 選 `main`
5. 資料夾選 `/root`
6. 按 `Save`

部署完成後網址通常會是：

```text
https://polarbear0827.github.io/vibe_coding/
```

## 修改方向

後續若要繼續加強其他節點，建議先保留原本心智圖結構，再透過 `mindmap-enhancements.js` 逐步覆蓋指定節點內容。這樣可以避免破壞原有互動與視覺風格。
