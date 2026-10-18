import { describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { DISHES, DISH_BY_ID } from '@/data'
import { dishTags } from '@/engine/recommend/tags'
import DexView from '../DexView.vue'

function mountDex() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/dex', component: DexView },
    ],
  })
  return mount(DexView, { global: { plugins: [router] } })
}

describe('料理標籤', () => {
  it('牛肉麵的標籤包含牛肉、有湯、吃麵、台式', () => {
    expect(dishTags(DISH_BY_ID['beef-noodle']!)).toEqual(
      expect.arrayContaining(['牛肉', '有湯', '吃麵', '台式']),
    )
  })

  it('每道料理至少有一個標籤（否則圖鑑裡會是空白）', () => {
    const empty = DISHES.filter((d) => dishTags(d).length === 0).map((d) => d.name)
    expect(empty).toEqual([])
  })
})

describe('料理圖鑑頁', () => {
  it('列出所有料理', () => {
    const wrapper = mountDex()
    const text = wrapper.text()
    const missing = DISHES.filter((d) => !text.includes(d.name)).map((d) => d.name)
    expect(missing).toEqual([])
  })

  it('搜尋料理名稱只留下符合的料理', async () => {
    const wrapper = mountDex()
    await wrapper.find('input[type="search"]').setValue('關東')
    expect(wrapper.text()).toContain('關東煮')
    expect(wrapper.text()).toContain('找到 1 道')
    expect(wrapper.text()).not.toContain('滷肉飯')
  })

  it('搜尋類型名稱會列出整個類型', async () => {
    const wrapper = mountDex()
    await wrapper.find('input[type="search"]').setValue('便利商店')
    for (const name of ['關東煮', '茶葉蛋', '御飯糰']) expect(wrapper.text()).toContain(name)
  })

  it('搜尋不到時顯示提示', async () => {
    const wrapper = mountDex()
    await wrapper.find('input[type="search"]').setValue('不存在的料理')
    expect(wrapper.text()).toContain('神燈還不認得')
  })

  it('點料理會展開「神燈眼中的它」標籤', async () => {
    const wrapper = mountDex()
    await wrapper.find('input[type="search"]').setValue('牛肉麵')
    const button = wrapper.findAll('button').find((b) => b.text() === '🍜牛肉麵')!
    await button.trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('神燈眼中的它')
    expect(button.attributes('aria-expanded')).toBe('true')
    expect(wrapper.text()).toContain('附近找找')
  })
})
