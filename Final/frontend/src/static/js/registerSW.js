if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js')
            console.log('Service worker registered:', registration.scope);
        } catch (err) {
            console.error('Service worker registration failed:', err);
        }
    })
}