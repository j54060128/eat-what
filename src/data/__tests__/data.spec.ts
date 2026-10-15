import { describe, expect, it } from 'vitest'
import { CATEGORIES, DISHES, RAW_DISHES, CATEGORY_MODULES } from '@/data'
import { TRAITS, TRAIT_IDS } from '@/data/traits'
import { VIBE_IDS } from '@/data/vibes'
import { truthfulAnswer } from '@/engine/guess/simulate'

describe('資料完整性', () => {
  it('類型與料理的 id 不重複', () => {
    const categoryIds = CATEGORIES.map((c) => c.id)
    const dishIds = RAW_DISHES.map((d) => d.id)
    expect(new Set(categoryIds).size).toBe(categoryIds.length)
    expect(new Set(dishIds).size).toBe(dishIds.length)
  })

  it('每個類型至少有 3 道料理', () => {
    for (const m of CATEGORY_MODULES) {
      expect(m.dishes.length, m.category.id).toBeGreaterThanOrEqual(3)
    }
  })

  it('特徵值都在 0~1、vibe 都在 -1~1', () => {
    for (const d of DISHES) {
      for (const t of TRAIT_IDS) {
        expect(d.traits[t], `${d.id}.${t}`).toBeGreaterThanOrEqual(0)
        expect(d.traits[t], `${d.id}.${t}`).toBeLessThanOrEqual(1)
      }
      for (const v of VIBE_IDS) {
        expect(Math.abs(d.vibes[v]), `${d.id}.${v}`).toBeLessThanOrEqual(1)
      }
      expect(d.meals.length, d.id).toBeGreaterThan(0)
    }
  })

  it('每一題都有料理的答案跟預設值不同（否則這題永遠沒用）', () => {
    for (const t of TRAITS) {
      const used = DISHES.some((d) => d.traits[t.id] !== t.default)
      expect(used, t.id).toBe(true)
    }
  })

  it('同類型內任兩道料理，至少有一題的如實回答不同（否則永遠分不出來）', () => {
    const conflicts: string[] = []
    for (const c of CATEGORIES) {
      const inCategory = DISHES.filter((d) => d.categoryId === c.id)
      for (let i = 0; i < inCategory.length; i++) {
        for (let j = i + 1; j < inCategory.length; j++) {
          const a = inCategory[i]!
          const b = inCategory[j]!
          const distinct = TRAIT_IDS.some((t) => {
            const ra = truthfulAnswer(a.traits[t])
            const rb = truthfulAnswer(b.traits[t])
            return ra !== rb && ra !== 'unknown' && rb !== 'unknown'
          })
          if (!distinct) conflicts.push(`${a.name} ↔ ${b.name}`)
        }
      }
    }
    expect(conflicts).toEqual([])
  })
})
