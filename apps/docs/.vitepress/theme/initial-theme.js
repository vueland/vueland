(() => {
    const preference = localStorage.getItem('vitepress-theme-appearance') || 'auto'
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = !preference || preference === 'auto' ? prefersDark : preference === 'dark'
    const theme = isDark ? 'dark' : 'light'

    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.setAttribute('data-theme', theme)
})()
