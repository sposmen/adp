import { whenElementReady } from '../shared/dom.util';
import { holidaysUtil } from '../shared/holidays.util';
import * as store from '../shared/store.util';
import { AdpRow } from './models';
import './toolbar.style';


function addToolbar() {

  // tslint:disable-next-line:no-require-imports
  const toolbarHtml = require('./toolbar.tpl') as string;
  document.querySelector('#appContainer').insertAdjacentHTML('afterbegin', toolbarHtml);

  const countryCodeKey = 'adp-next__countryCode';
  const toolbar = document.querySelector('.adp-next') as HTMLElement;
  const country = toolbar.querySelector('.adp-next__country') as HTMLSelectElement;
  const copy = toolbar.querySelector('.adp-next__copy') as HTMLButtonElement;

  country.addEventListener('change', async () => {
    const countryCode = country.value;
    if (countryCode) {
      holidaysUtil.init(countryCode);
      await store.setItem(countryCodeKey, countryCode);
    } else {
      await store.removeItem(countryCodeKey);
    }
    enableActionControls(toolbar, !!countryCode);
  });

  copy.addEventListener('click', evt => {
    copyRows(TcGridTable.DataGrid.store.data);
  });

  store.getItem(countryCodeKey).then(countryCode => {
    if (countryCode) {
      country.value = countryCode;
      holidaysUtil.init(countryCode);      
    }
  });

  whenElementReady('TcGrid', () => {
    country.removeAttribute('disabled');
    enableActionControls(toolbar, !!country.value);
  });
}

function enableActionControls(toolbar: HTMLElement, enable: boolean) {
  const actionControls = Array.from(toolbar.querySelectorAll('.adp-next__form button'));
  if (enable) {
    for (const actionControl of actionControls) {
      actionControl.removeAttribute('disabled');
    }
  } else {
    for (const actionControl of actionControls) {
      actionControl.setAttribute('disabled', 'disabled');
    }
  }
}

function copyRows(rows: AdpRow[]) {

  const firstFilledResp = findFirstFilledRow(rows);

  if (!firstFilledResp) {
    showAlert('Fill a source row before copy.');
    return;
  }

  const { srcIdx, srcRow } = firstFilledResp;

  // Set status as changed  
  const clonedRow: AdpRow = { ProcessDTOStatus: 1 };
  // Only clone the needed properties
  ['PayCodeID', 'Lcf3', 'Lcf4', 'RecordType', 'TotalHours', 'Value'].forEach(prop => {
    clonedRow[prop] = srcRow[prop];
  });

  // TODO: To Implement the always persistant clone information avoiding the always first row being required
  // store.setItem('dataToClone', JSON.stringify(dataToClone));

  const rowsToProcess: AdpRow[] = rows.slice(srcIdx + 1);

  rowsToProcess.forEach(row => {
    const inDate = row.InDate;
    if (row.RecordType === TcGridUtil.RecordTypes.DatePlaceholder && holidaysUtil.isWeekday(inDate)) {
      Object.assign(row, clonedRow);
      if (holidaysUtil.isHoliday(inDate)) {
        row.PayCodeID = 'HOLIDAY';
      }
    }
  });

  // Render in the View
  TcGridUtil.RefreshTCMGrid();
}

function checkIsFilledRow(row: AdpRow) {
  return row.PayCodeID && row.Lcf3 && row.Lcf4 && row.TotalHours > 0 && row.Value > 0;
}

function showAlert(message: string) {

  const alertCmp = document.querySelector('.adp-next__alert') as any;

  alertCmp.querySelector('.adp-next__alert-message').textContent = message;

  alertCmp.querySelector('.adp-next__close').onclick = () => {
    alertCmp.close();
  };

  alertCmp.showModal();
}

function findFirstFilledRow(rows: AdpRow[]) {

  let srcRow: AdpRow;
  let isFilled: boolean;
  let srcIdx = 0;
  const rowsLimit = rows.length - 1;

  do {
    srcIdx++;
    srcRow = rows[srcIdx];
    isFilled = checkIsFilledRow(srcRow);
  } while (!isFilled && srcIdx < rowsLimit);

  return isFilled ? { srcIdx, srcRow } : undefined;
}

function checkToolbar() {

  const path = location.hash;
  const myTimecardPath = '#/Myself_ttd_MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard/MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard';
  const toolbar = document.querySelector('.adp-next') as HTMLElement;

  if (path === myTimecardPath) {
    if (!toolbar) {
      addToolbar();
    }
  } else if (toolbar) {
    toolbar.parentNode.removeChild(toolbar);
  }
}

function init() {
  checkToolbar();
  window.addEventListener('hashchange', checkToolbar);
}


init();
