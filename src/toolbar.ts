import { whenElementReady } from './dom.util';
import { checkIsWorkingDate } from './date.util';
import './toolbar.style';
declare const require: any;


function addToolbar() {

  // tslint:disable-next-line:no-require-imports
  const toolbarHtml = require('./toolbar.tpl');
  document.querySelector('#appContainer').insertAdjacentHTML('afterbegin', toolbarHtml);

  const toolbar = document.querySelector('.adp-next');
  const copy = toolbar.querySelector('.adp-next__copy');
  const omitNonWorking = toolbar.querySelector('.adp-next__omit-non-working') as HTMLInputElement;

  copy.addEventListener('click', () => {
    copyAll();
  });

  whenElementReady('TcGrid', () => {
    copy.removeAttribute('disabled');
    omitNonWorking.removeAttribute('disabled');
  });
}

function copyAll() {
  busy(true);
  const length = obtainRows().length;
  copyRows(0, length, () => {
    deleteNonWorkingRows(0, length, () => {
      busy(false);
    });
  });
}

function copyRows(idx: number, length: number, callback?: Function) {

  if (idx >= length) {
    if (callback) {
      callback();
    }
    return;
  }

  const row = obtainRow(idx);
  const isFilled = checkIfRowIsFilled(row);
  if (!isFilled) {
    const alert = document.querySelector('#alert') as any;
    alert.querySelector('.adp-next__row-number').textContent = idx + 1;
    alert.querySelector('.adp-next__close').onclick = () => {
      alert.close();
    };
    alert.showModal();
    return;
  }

  executeRowAction(row, 'Copy Row to Next Day');

  setTimeout(() => {
    copyRows(idx + 1, length, callback);
  }, 0);
}

function busy(show: boolean) {
  const toolbar = document.querySelector('.adp-next');
  const copy = toolbar.querySelector('.adp-next__copy');
  const omitNonWorking = toolbar.querySelector('.adp-next__omit-non-working') as HTMLInputElement;
  const grid = document.querySelector('#gridDiv');
  const busyBox = grid.querySelector('#adp-next__busy');
  if (show) {
    if (!busyBox) {
      const busyBoxHtml = `<div id="adp-next__busy" class="LoadingPanel"><div class="revitLoadingContentPane">Loading...</div></div>`;
      grid.insertAdjacentHTML('afterbegin', busyBoxHtml);
      copy.setAttribute('disabled', 'disabled');
      omitNonWorking.setAttribute('disabled', 'disabled');
    }
  } else if (busyBox) {
    grid.removeChild(busyBox);
    copy.removeAttribute('disabled');
    omitNonWorking.removeAttribute('disabled');
  }
}

function deleteNonWorkingRows(idx: number, length: number, callback?: Function) {

  if (idx >= length) {
    if (callback) {
      callback(length);
    }
    return;
  }

  const row = obtainRow(idx);
  const isWorking = checkIsWorkingRow(row);

  if (isWorking) {
    idx++;
  } else {
    executeRowAction(row, 'Delete Row');
    length--;
  }

  setTimeout(() => {
    deleteNonWorkingRows(idx, length, callback);
  }, 0);
}

function executeRowAction(row: HTMLElement, commandText: string) {

  const command = commandText.toLocaleLowerCase();

  const menuIcon = row.querySelector('.menuIcon') as HTMLElement;
  menuIcon.click();
  const menu = Array.from(document.querySelectorAll('.dijitPopup') as NodeListOf<HTMLElement>)
    .find(it => it.style.display !== 'none');
  if (!menu) {
    console.warn('Menu not found', row);
    return;
  }

  const items = Array.from(menu.querySelectorAll('.dijitMenuItemLabel') as NodeListOf<HTMLElement>);
  const actionItem = items.find(it => it.textContent.trim().toLowerCase() === command);
  if (!actionItem) {
    console.warn('Action not found', menu, command);
    return;
  }

  actionItem.click();
}

function checkIsWorkingRow(row: HTMLElement) {
  const year = new Date().getFullYear();
  const dateStr = row.querySelector('.Editable[id$=_InDate]').textContent;
  const dateArr = dateStr.split('/');
  const month = +dateArr[0] - 1;
  const dateOfMonth = +dateArr[1];
  const date = new Date(year, month, dateOfMonth);
  return checkIsWorkingDate(date);
}

function obtainRows() {
  return Array.from(document.querySelectorAll('#TcGrid .dR') as NodeListOf<HTMLElement>);
}

function obtainRow(idx = 0) {
  const rows = obtainRows();
  return rows[idx];
}

function checkIfRowIsFilled(row: HTMLElement) {
  const fields = Array.from(row.querySelectorAll('.Editable'));
  for (const field of fields) {
    if (!field.id.endsWith('_InDate')
      && !field.id.endsWith('_Value')
      && field.textContent.trim()) {
      return true;
    }
  }
}

function checkToolbar() {

  const path = location.hash;
  const myTimecardPath = '#/Myself_ttd_MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard/MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard';
  const toolbar = document.querySelector('.adp-next');

  if (path === myTimecardPath) {
    if (!toolbar) {
      addToolbar();
    }
  } else if (toolbar) {
    toolbar.parentNode.removeChild(toolbar);
  }
}


checkToolbar();

window.addEventListener('hashchange', checkToolbar);
