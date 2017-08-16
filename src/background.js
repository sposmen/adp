const storage = chrome.storage.sync;

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {

  const key = request.data.key;

  switch (request.command) {
    case 'setItem':
      const value = request.data.value;
      storage.set({ [key]: value }, () => {
        const error = chrome.runtime.lastError;
        sendResponse(error);
      });
      break;
    case 'getItem':
      storage.get(key, items => {
        const resp = items ? items[key] : undefined;
        sendResponse(resp);
      });
      break;
    case 'removeItem':
      storage.remove(key, () => {
        const error = chrome.runtime.lastError;        
        sendResponse(error);
      });
      break;
    default:
      sendResponse('* background.js received bad request: ' + JSON.stringify(request));
  }

  return true;

});
