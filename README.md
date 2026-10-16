# 🧞 神燈吃什麼

美食版的神燈問答遊戲，純前端、零後端，部署在 GitHub Pages。

| 玩法 | 說明 |
|---|---|
| 🔮 **猜謎模式** | 你心裡想一道料理，神燈用是非題猜出來（先猜類型，再猜料理） |
| 🍽️ **推薦模式** | 不知道吃什麼？先確認時段、預算、忌口，神燈再一題題追問「想不想吃」，幫你縮小範圍後推薦 |

目前收錄 **26 種類型、198 道料理**（台灣在地、異國、早午餐、甜點與飲料）。

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
│  ├─ traits.ts            # 料理的客觀特徵＝猜謎的是非題（55 題）
│  ├─ vibes.ts             # 料理的情境維度（熱/冰、飽足/清爽、健康…）
│  ├─ categories/*.ts      # 一個檔案＝一個類型＋底下的料理
│  ├─ recommend/           # 推薦模式的情境題（questions.ts）與偏好追問題庫（preferences.ts）
│  └─ index.ts             # 合併資料、解析繼承
├─ engine/
│  ├─ guess/               # 猜謎引擎（純函式，不依賴 Vue）
│  └─ recommend/           # 推薦引擎（共用猜謎的機率模型與挑題函式）
├─ stores/                 # 兩種模式的遊戲狀態（Pinia）
├─ views/                  # 首頁、猜謎、推薦、結果頁
└─ components/             # 神燈、對話框、料理卡…
```

## 維護資料

### 新增一道料理

打開對應類型的檔案（例如 `src/data/categories/nightMarket.ts`），在 `dishes` 加一筆：

```ts
{
  id: 'grilled-corn',           // 英文 id，不可重複
  name: '烤玉米',
  emoji: '🌽',
  traits: { grilled: 1, sweet: 0.4, meatless: 1, veggie: 0.6 },  // 只寫跟類型不一樣的地方
  vibes: { healthy: 0.2 },                                        // 推薦模式用，可不寫
},
```

**特徵值的意思**：`1`＝一定是、`0`＝一定不是、`0.5`＝不一定。
解析順序是「特徵預設值 → 類型設定 → 料理覆寫」，所以只需要寫例外的部分。

### 新增一個類型

在 `src/data/categories/` 建一個新檔案（可複製現有的改），再加進 `src/data/index.ts` 的 `CATEGORY_MODULES`。

### 新增一道題目

在 `src/data/traits.ts` 的 `TRAITS` 加一筆，`default` 填「大多數料理的答案」，再到有例外的類型或料理補上數值。

### 新增一道推薦追問題

在 `src/data/recommend/preferences.ts` 加一筆，`source` 指向一個特徵（例如 `{ trait: 'soup' }`）或情境維度（例如 `{ vibe: 'warm' }`），
`yes` / `no` 是結果頁「你的選擇」顯示的短語。神燈會自己判斷什麼時候問這題最有用。

### 改完記得跑測試

```sh
npm test
```

測試會檢查：

- id 不重複、數值都在範圍內
- 每一題至少對某道料理有用
- **同類型內任兩道料理至少有一題答案不同**（不然永遠分不出來，測試會列出衝突的組合）
- **模擬玩家**：每道料理都玩一次，完美玩家需 ≥ 95% 在 25 題內猜中、10% 答錯的玩家成功率需 ≥ 80%
- **模擬推薦**：假裝「其實想吃 X」如實回答，X 需 ≥ 90% 進前 3 名、平均 ≤ 9 題；10% 答錯時 ≥ 65%
- 推薦模式：忌口一定被遵守、每個類型都推薦得到、換一個不會重複

## 演算法

### 猜謎模式

1. 每道料理有一組特徵值，玩家每回答一題就用貝氏定理更新每道料理的機率。
   答案和特徵相反時機率不會直接歸零（容錯 ε），所以答錯一題還救得回來。
2. 挑題：計算每一題的**期望資訊增益**，選最能縮小範圍的題目（前幾名中隨機挑，讓每局問法有變化）。
3. **兩階段**：第一階段以「類型」為目標挑題，把握度夠高就問「是 X 類嗎？」；
   確認後只在該類型內猜料理。猜錯就排除、繼續問，連錯 3 次會列出候選清單。
4. 遊戲狀態完全由「事件歷史」重算，所以「上一步」就是拿掉最後一個事件。

### 推薦模式

1. 情境題（用餐時段、預算、忌口）負責硬性篩選；條件太嚴時依序放寬預算、時段，忌口永遠不放寬。人數是軟性證據。
2. 偏好追問和猜謎模式用**同一套機率模型**：把「你現在最想吃的那道」當成要猜的目標，
   每題挑資訊增益最大的「想不想吃」題（想／有點想／都可以／不太想／不想）。
3. 機率夠集中（最高 ≥ 30% 或前 3 名合計 ≥ 65%）或問滿 12 題就推薦；也可以隨時按「夠了，直接幫我選」。
4. 主推＝機率最高的料理，「換一個」＝下一名；結果頁列出「你的選擇」與主推料理符合的項目。
5. 分享連結只帶題目 id 與回答代號（例如 `#/result?a=meal.3_budget.1&p=warm.y_soup.y&d=beef-noodle`），不含個人資料。

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
