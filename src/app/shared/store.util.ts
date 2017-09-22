const extensionId = 'pmfanodcfkjkbikblghiieinjgmpmdjk';

export function getItem(key: string, callback: (response: any) => void) {
  chrome.runtime.sendMessage(extensionId, { command: 'getItem', data: { key: key } }, callback);
}

export function setItem(key: string, value: any, callback?: (response: any) => void) {
  chrome.runtime.sendMessage(extensionId, { command: 'setItem', data: { key: key, value: value } }, callback);
}

export function removeItem(key: string, callback?: (response: any) => void) {
  chrome.runtime.sendMessage(extensionId, { command: 'removeItem', data: { key: key } }, callback);
}