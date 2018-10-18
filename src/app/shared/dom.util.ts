export function whenElementReady(id: string, callback: Function, timeout = 100) {
  window.requestIdleCallback(() => {

    const el = document.getElementById(id);

    if (el) {
      callback(el);
      return;
    }

    whenElementReady(id, callback, timeout);
  }, { timeout });
}
