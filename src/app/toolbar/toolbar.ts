import './toolbar.style';
import { whenElementReady } from '../shared/dom.util';
import { holidaysUtil } from '../shared/holidays.util';

export const myTimecardPath = 'Myself_ttd_MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard/MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard';


function addToolbar() {

  console.log('Loading ADP-Next...');

  const countryCodeKey = 'adpNext__countryCode';

  // tslint:disable-next-line:no-require-imports
  const toolbarHtml = require('./toolbar.tpl') as string;
  document.querySelector('#TimecardManager').insertAdjacentHTML('afterbegin', toolbarHtml);

  const toolbar = document.querySelector('.adp-next');
  const country = toolbar.querySelector('.adp-next__country') as HTMLSelectElement;
  const copy = toolbar.querySelector('.adp-next__copy');

  const countryCode = localStorage.getItem(countryCodeKey);
  if (countryCode) {
    country.value = countryCode;
  }

  whenElementReady('TcGrid', () => {
    country.removeAttribute('disabled');
    enableActionControls(toolbar, !!country.value);
  });

  country.addEventListener('change', () => {
    const countryCode = country.value;
    localStorage.setItem(countryCodeKey, countryCode);
    enableActionControls(toolbar, !!countryCode);
  });

  copy.addEventListener('click', evt => {
    copyRows(TcGridTable.DataGrid.store.data, country.value);
  });
}

export function enableActionControls(toolbar: Element, enable: boolean) {
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

export function copyRows(rows: AdpRow[], countryCode: string) {

  const firstFilledResp = findFirstFilledRow(rows);

  if (!firstFilledResp) {
    showAlert('Fill a source row before copy.');
    return;
  }

  holidaysUtil.init(countryCode);

  const { srcIdx, srcRow } = firstFilledResp;

  // Set status as changed
  const clonedRow: AdpRow = {};

  // Only clone the needed properties
  ['Lcf3', 'Lcf4', 'RecordType', 'TotalHours', 'Value'].forEach(prop => {
    clonedRow[prop] = srcRow[prop];
  });

  clonedRow['ProcessDTOStatus'] = 1;
  clonedRow['PayCodeID'] = 'REGULAR';

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

export function checkIsFilledRow(row: AdpRow) {
  return row.PayCodeID && row.Lcf3 && row.Lcf4 && row.TotalHours > 0 && row.Value > 0;
}

export function showAlert(message: string) {

  const alertCmp = document.querySelector('.adp-next__alert') as any;

  alertCmp.querySelector('.adp-next__alert-message').textContent = message;

  alertCmp.querySelector('.adp-next__close').onclick = () => {
    alertCmp.close();
  };

  alertCmp.showModal();
}

export function findFirstFilledRow(rows: AdpRow[]) {

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

export function checkToolbar() {

  const path = location.hash;
  const toolbar = document.querySelector('.adp-next');

  if (path.includes(myTimecardPath)) {
    if (!toolbar) {
      whenElementReady('TimecardManager', () => {
        addToolbar();
      });
    }
  } else if (toolbar) {
    toolbar.parentNode.removeChild(toolbar);
  }
}

export function init() {
  checkToolbar();
  window.addEventListener('hashchange', checkToolbar);
}


init();
