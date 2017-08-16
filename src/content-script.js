(async function (document) {

  function injectJs(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.onload = function () {
        this.remove();
        resolve();
      };
      script.src = chrome.extension.getURL(src);;
      document.head.appendChild(script);
    });
  }

  await injectJs('vendor.js');
  await injectJs('app.js');

}(document));
