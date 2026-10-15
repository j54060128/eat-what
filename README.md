# 🧞 神燈吃什麼

美食版的神燈問答遊戲，純前端、零後端，部署在 GitHub Pages。

| 玩法 | 說明 |
|---|---|
| 🔮 **猜謎模式** | 你心裡想一道料理，神燈用是非題猜出來（先猜類型，再猜料理） |
| 🍽️ **推薦模式** | 不知道吃什麼？回答情境題＋美食心理測驗，神燈推薦一道料理並給你一張人格卡 |

目前收錄 **18 種類型、115 道台灣日常料理**。

## 技術架構

- Vue 3 + TypeScript + Vite
- Vue Router（hash 模式，GitHub Pages 重新整理不會 404）、Pinia
- Tailwind CSS v4、@vueuse/core
- Vitest（引擎單元測試、資料完整性測試、模擬玩家測試）
- GitHub Actions 自動部署到 GitHub Pages

**沒有資料庫、沒有後端 API。** 食物資料是寫在 `src/data/` 的 TypeScript 檔，跟著前端一起打包；
推理演算法在瀏覽器裡計算。改資料＝改檔案 → push → 自動部署。

## 本機開發

需要 Node.js 22.18+ 或 24.12+。

```sh
npm install
npm run dev        # 開發伺服器 http://localhost:5173
npm test           # 跑全部測試
npm run lint       # 檢查並自動修正
npm run format     # Prettier 格式化
npm run build      # 型別檢查＋正式建置
```

## 專案結構

```
src/
├─ data/
│  ├─ traits.ts            # 猜謎用的特徵＝是非題（49 題）
│  ├─ vibes.ts             # 推薦用的情境維度（熱/冰、飽足/清爽、辣…）
│  ├─ categories/*.ts      # 一個檔案＝一個類型＋底下的料理
│  ├─ recommend/           # 推薦模式的題庫與人格
│  └─ index.ts             # 合併資料、解析繼承
├─ engine/
│  ├─ guess/               # 猜謎引擎（純函式，不依賴 Vue）
│  └─ recommend/           # 推薦引擎
├─ stores/guessGame.ts     # 猜謎模式的狀態
├─ views/                  # 首頁、猜謎、推薦、結果頁
└─ components/             # 神燈、對話框、料理卡…
```

## 維護資料

### 新增一道料理

打開對應類型的檔案（例如 `src/data/categories/nightMarket.ts`），在 `dishes` 加一筆：

```ts
{
  id: 'salty-chicken',          // 英文 id，不可重複
  name: '鹹水雞',
  emoji: '🐔',
  traits: { chicken: 1, cold: 1, veggie: 0.7, fried: 0 },  // 只寫跟類型不一樣的地方
  vibes: { warm: -0.6, healthy: 0.3 },                      // 推薦模式用，可不寫
},
```

**特徵值的意思**：`1`＝一定是、`0`＝一定不是、`0.5`＝不一定。
解析順序是「特徵預設值 → 類型設定 → 料理覆寫」，所以只需要寫例外的部分。

### 新增一個類型

在 `src/data/categories/` 建一個新檔案（可複製現有的改），再加進 `src/data/index.ts` 的 `CATEGORY_MODULES`。

### 新增一道題目

在 `src/data/traits.ts` 的 `TRAITS` 加一筆，`default` 填「大多數料理的答案」，再到有例外的類型或料理補上數值。

### 改完記得跑測試

```sh
npm test
```

測試會檢查：

- id 不重複、數值都在範圍內
- 每一題至少對某道料理有用
- **同類型內任兩道料理至少有一題答案不同**（不然永遠分不出來，測試會列出衝突的組合）
- **模擬玩家**：每道料理都玩一次，完美玩家需 ≥ 95% 在 25 題內猜中、10% 答錯的玩家成功率需 ≥ 80%
- 推薦模式：忌口一定被遵守、每個類型與人格都推薦得到、推薦不會過度集中

## 演算法

### 猜謎模式

1. 每道料理有一組特徵值，玩家每回答一題就用貝氏定理更新每道料理的機率。
   答案和特徵相反時機率不會直接歸零（容錯 ε），所以答錯一題還救得回來。
2. 挑題：計算每一題的**期望資訊增益**，選最能縮小範圍的題目（前幾名中隨機挑，讓每局問法有變化）。
3. **兩階段**：第一階段以「類型」為目標挑題，把握度夠高就問「是 X 類嗎？」；
   確認後只在該類型內猜料理。猜錯就排除、繼續問，連錯 3 次會列出候選清單。
4. 遊戲狀態完全由「事件歷史」重算，所以「上一步」就是拿掉最後一個事件。

### 推薦模式

1. 情境題（用餐時段、預算、人數、忌口）負責硬性篩選；趣味題從題庫隨機抽 5 題，每個選項會調整「口味輪廓」。
2. 料理分數＝口味輪廓 · 料理的情境維度＋特徵偏好，再用 softmax 依分數抽樣，避免每次都推同一道。
3. 口味輪廓和 8 種人格原型比相似度，決定人格卡。
4. 分享連結只帶題目 id 與選項序號（例如 `#/result?a=meal.3_budget.1&d=beef-noodle`），不含個人資料。

## 部署到 GitHub Pages

1. 在 GitHub 建立一個**公開** repo（免費帳號的 Pages 需要公開 repo）。
2. 把本機專案推上去：

   ```sh
   git remote add origin https://github.com/<帳號>/<repo名>.git
   git push -u origin main
   ```

3. 到 repo 的 **Settings → Pages → Build and deployment → Source** 選 **GitHub Actions**。
4. 之後每次 push 到 `main`，`.github/workflows/deploy.yml` 會自動跑 lint、測試、建置並部署。
   網址是 `https://<帳號>.github.io/<repo名>/`。

子路徑由 workflow 依 repo 名稱自動設定（`BASE_PATH`），改 repo 名稱不用改程式。
「告訴神燈你想的料理」按鈕會連到這個 repo 的 Issue 表單（`.github/ISSUE_TEMPLATE/new-food.yml`）。

## 之後可以做的

- 讓猜輸的玩家直接在網頁上教神燈新料理（需要可寫入的儲存，例如 Supabase 的 insert-only 資料表）
- 自繪神燈角色 SVG、分享用的 OG 圖片
- PWA 離線使用
