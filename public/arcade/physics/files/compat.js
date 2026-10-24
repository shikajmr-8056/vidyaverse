// VidyaVerse Physics Studio Simulation Compatibility Layer & Unified Design System
(() => {
  let _onload = null;
  try {
    Object.defineProperty(window, 'onload', {
      get() { return _onload; },
      set(fn) {
        _onload = fn;
        if (typeof fn === 'function') {
          if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(() => {
              try { fn(); } catch (e) { console.error("[VidyaVerse Physics] onload error:", e); }
            }, 40);
          } else {
            window.addEventListener('load', () => {
              try { fn(); } catch (e) { console.error("[VidyaVerse Physics] onload error:", e); }
            }, { once: true });
          }
        }
      },
      configurable: true
    });
  } catch (err) {
    console.warn("[VidyaVerse Physics] onload interceptor failed:", err);
  }

  // Prevent unwanted outer scrollbars inside iframes and enforce theme
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.backgroundColor = '#070b14';
  });
})();
