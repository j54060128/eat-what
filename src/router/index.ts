import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// GitHub Pages 沒有伺服器端 rewrite，用 hash 模式避免重新整理時 404
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/guess', name: 'guess', component: () => import('@/views/GuessView.vue') },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import('@/views/RecommendView.vue'),
    },
    { path: '/result', name: 'result', component: () => import('@/views/ResultView.vue') },
    { path: '/dex', name: 'dex', component: () => import('@/views/DexView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router
