const extensionId = 'pmfanodcfkjkbikblghiieinjgmpmdjk';

export function getItem(key: string) {
  return new Promise<any>((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, { command: 'getItem', data: { key: key } }, response => {
      resolve(response);
    });
  });
}

export function setItem(key: string, value: any) {
  return new Promise<any>((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, { command: 'setItem', data: { key: key, value: value } }, response => {
      resolve(response);
    });
  });
}

export function removeItem(key: string) {
  return new Promise<any>((resolve, reject) => {
    chrome.runtime.sendMessage(extensionId, { command: 'removeItem', data: { key: key } }, response => {
      resolve(response);
    });
  });
}