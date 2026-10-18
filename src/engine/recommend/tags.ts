import type { ResolvedDish } from '@/data/types'
import { PREFERENCE_QUESTIONS } from '@/data/recommend/preferences'
import { sourceValue } from './session'

/**
 * 料理圖鑑用的「神燈眼中的它」標籤：偏好題的值 ≥ 0.75 就列出該題的短語（例如：台式、有湯、吃麵）。
 * 推薦模式回答「想」時就是看這些值，所以也能拿來檢查資料準不準。
 */
export function dishTags(dish: ResolvedDish): string[] {
  return PREFERENCE_QUESTIONS.filter((q) => sourceValue(dish, q.source) >= 0.75).map((q) => q.yes)
}
