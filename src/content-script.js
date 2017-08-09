(function (document) {

  function injectScript(src) {
    const script = document.createElement('script');
    script.onload = function () {
      this.remove();
    };
    script.src = chrome.extension.getURL(src);;
    document.head.appendChild(script);
  }

  injectScript('toolbar.js');

}(document));
