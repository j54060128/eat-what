import { ref } from 'vue'

/** 分享結果：手機用系統分享選單，不支援時改為複製到剪貼簿 */
export function useShareResult() {
  const copied = ref(false)

  async function share(text: string, url: string) {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: '神燈吃什麼', text, url })
        return
      } catch (e) {
        // 使用者自己取消分享就不用再複製
        if (e instanceof DOMException && e.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      copied.value = true
      setTimeout(() => (copied.value = false), 2000)
    } catch {
      window.prompt('複製下面的文字分享給朋友：', `${text}\n${url}`)
    }
  }

  return { share, copied }
}

/** 網站首頁網址（含 GitHub Pages 子路徑） */
export function homeUrl(): string {
  return new URL(import.meta.env.BASE_URL, window.location.origin).href
}

/** 「建議新增料理」的 GitHub Issue 表單網址；沒設定 repo 網址（本機開發）時回傳 null */
export function suggestFoodUrl(): string | null {
  const repo = import.meta.env.VITE_REPO_URL
  return repo ? `${repo}/issues/new?template=new-food.yml` : null
}
