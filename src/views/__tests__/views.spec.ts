import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import { DISH_BY_ID, getCategory } from '@/data'
import { ANSWERS } from '@/engine/guess/likelihood'
import { truthfulAnswer } from '@/engine/guess/simulate'
import { useGuessGameStore } from '@/stores/guessGame'
import GuessView from '../GuessView.vue'
import RecommendView from '../RecommendView.vue'
import ResultView from '../ResultView.vue'

function makeRouter(): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/guess', name: 'guess', component: GuessView },
      { path: '/recommend', name: 'recommend', component: RecommendView },
      { path: '/result', name: 'result', component: ResultView },
    ],
  })
}

async function clickButton(wrapper: VueWrapper, text: string) {
  const button = wrapper.findAll('button').find((b) => b.text().includes(text))
  if (!button) throw new Error(`找不到按鈕「${text}」\n畫面內容：${wrapper.text()}`)
  await button.trigger('click')
  await flushPromises()
}

describe('猜謎模式畫面', () => {
  let pinia: ReturnType<typeof createPinia>
  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  it.each(['beef-noodle', 'bubble-tea', 'pizza'])('從開始一路玩到猜中 %s', async (dishId) => {
    const target = DISH_BY_ID[dishId]!
    const router = makeRouter()
    await router.push('/guess')
    const wrapper = mount(GuessView, { global: { plugins: [pinia, router] } })
    const game = useGuessGameStore()

    await clickButton(wrapper, '想好了，開始！')

    for (let guard = 0; guard < 60 && game.step.kind !== 'won'; guard++) {
      const step = game.step
      if (step.kind === 'question') {
        const answer = truthfulAnswer(target.traits[step.traitId])
        await clickButton(wrapper, ANSWERS.find((a) => a.id === answer)!.label)
      } else if (step.kind === 'confirmCategory') {
        if (!wrapper.text().includes(getCategory(step.categoryId).name)) {
          throw new Error(`猜類型畫面沒有顯示類型名稱：${wrapper.text()}`)
        }
        await clickButton(
          wrapper,
          step.categoryId === target.categoryId ? '對，就是這類！' : '不是這類',
        )
      } else if (step.kind === 'guessDish') {
        await clickButton(wrapper, step.dishId === target.id ? '猜對了！' : '不對喔')
      } else {
        throw new Error(`沒預期的步驟：${step.kind}`)
      }
    }

    expect(game.step).toEqual({ kind: 'won', dishId })
    expect(wrapper.text()).toContain(target.name)
    expect(wrapper.text()).toContain('再玩一次')
  })

  it('上一步會回到前一題', async () => {
    const router = makeRouter()
    await router.push('/guess')
    const wrapper = mount(GuessView, { global: { plugins: [pinia, router] } })
    const game = useGuessGameStore()

    await clickButton(wrapper, '想好了，開始！')
    const first = wrapper.text()
    await clickButton(wrapper, '不知道')
    expect(game.state.questionCount).toBe(1)
    await clickButton(wrapper, '上一步')
    expect(game.state.questionCount).toBe(0)
    expect(wrapper.text()).toBe(first)
  })
})

describe('推薦模式畫面', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('做完測驗後跳到結果頁，結果頁顯示人格與料理', async () => {
    const router = makeRouter()
    await router.push('/recommend')
    const wrapper = mount(RecommendView, { global: { plugins: [router] } })

    await clickButton(wrapper, '開始測驗')
    for (let i = 0; i < 9; i++) {
      if (wrapper.text().includes('可複選')) {
        await clickButton(wrapper, '不吃辣')
        await clickButton(wrapper, '下一題')
      } else {
        // 每題都選第一個選項
        const options = wrapper.findAll('section button')
        await options[0]!.trigger('click')
        await flushPromises()
      }
    }

    const route = router.currentRoute.value
    expect(route.name).toBe('result')
    expect(String(route.query.a)).toContain('diet.5')
    const dish = DISH_BY_ID[String(route.query.d)]
    expect(dish).toBeDefined()
    expect(dish!.traits.spicy).toBeLessThan(0.6)

    const result = mount(ResultView, { global: { plugins: [router] } })
    expect(result.text()).toContain('神燈施法中')
    await vi.advanceTimersByTimeAsync(1500)
    expect(result.text()).toContain('測驗結果')
    expect(result.text()).toContain(dish!.name)

    // 換一個會換成別的料理
    await clickButton(result, '換一個')
    await vi.advanceTimersByTimeAsync(800)
    expect(router.currentRoute.value.query.d).not.toBe(dish!.id)
  })
})
