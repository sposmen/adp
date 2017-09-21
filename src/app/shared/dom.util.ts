export function whenElementReady(id: string, callback: Function, timer = 200) {
  setTimeout(() => {

    const el = document.getElementById(id);

    if (el) {
      callback(el);
      return;
    }

    whenElementReady(id, callback, timer);

  }, timer);
}
