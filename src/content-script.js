(function (document) {

  function injectCss(href) {
    const link = document.createElement('link');
    link.href = chrome.extension.getURL(href);
    link.type = 'text/css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  function injectJs(src) {
    const script = document.createElement('script');
    script.onload = function () {
      this.remove();
    };
    script.src = chrome.extension.getURL(src);;
    document.head.appendChild(script);
  }
  

  injectCss('toolbar.css');
  injectJs('toolbar.js');

}(document));
