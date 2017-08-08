import { whenElementReady } from './dom.util';
import { checkIsWeekend } from './date.util';
import './toolbar.style';
declare const require: any;


function addToolbar() {

  const appContainer = document.querySelector('#appContainer');

  // tslint:disable-next-line:no-require-imports
  const toolbarHtml = require('./toolbar.tpl');
  appContainer.insertAdjacentHTML('afterbegin', toolbarHtml);

  const toolbar = appContainer.querySelector('.adp-next');
  const copy = toolbar.querySelector('.adp-next__copy');
  const omitNonWorking = toolbar.querySelector('.adp-next__omit-non-working') as HTMLInputElement;
  const clear = toolbar.querySelector('.adp-next__clear');

  copy.addEventListener('click', () => {
    copyFirstRowToAll();
    // TODO "remove" should be called before "copy" (avoid copying unwanted rows).
    // I.e.: check why "copy" doesn't work fine if "delete" is called first (it should).
    if (omitNonWorking.checked) {
      deleteNonWorkingRows();
    }
  });

  clear.addEventListener('click', () => {
    deleteAllRows();
  });

  whenElementReady('TcGrid', () => {
    copy.removeAttribute('disabled');
    clear.removeAttribute('disabled');
    omitNonWorking.removeAttribute('disabled');
  });
}

function deleteAllRows() {
  removeRowsByPoller(obtainRow);
}

function deleteNonWorkingRows() {
  removeRowsByPoller(obtainNonWorkingRow);
}

function removeRowsByPoller(next: Function) {
  let row = next();
  while (row) {
    deleteRow(row);
    row = next();
  }
}

function copyFirstRowToAll() {
  const rows = obtainRows();
  const rowsLength = rows.length - 1;
  const firstRow = rows[0];
  const valid = checkIfRowIsFilled(firstRow);
  if (!valid) {
    const alert = document.querySelector('#alert') as any;
    alert.querySelector('.adp-next__close').onclick = () => {
      alert.close();
    };
    alert.showModal();
    return;
  }
  for (let i = 0; i < rowsLength; i++) {
    const row = obtainRow(i);
    copyRowToNextDay(row);
  }
}

function copyRowToNextDay(row: HTMLElement) {
  executeRowAction(row, 'Copy Row to Next Day');
}

function deleteRow(row: HTMLElement) {
  executeRowAction(row, 'Delete Row');
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

function obtainNonWorkingRow() {
  const year = new Date().getFullYear();
  // TODO consider holidays according to the country.
  const rows = obtainRows();
  const weekend = rows.find(row => {
    const dateStr = row.querySelector('.Editable[id$=_InDate]').textContent;
    const dateArr = dateStr.split('/');
    const month = +dateArr[0] - 1;
    const dateOfMonth = +dateArr[1];
    const date = new Date(year, month, dateOfMonth);
    return checkIsWeekend(date);
  });
  return weekend;
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
