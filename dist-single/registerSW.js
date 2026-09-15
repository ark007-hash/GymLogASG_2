// Service Worker registration script
if ('serviceWorker' in navigator) {
  const register = () => {
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then((reg) => {
        console.log('SW registered successfully:', reg.scope);
      })
      .catch((err) => {
        console.warn('SW registration failed:', err);
      });
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    register();
  } else {
    window.addEventListener('DOMContentLoaded', register);
  }
}
