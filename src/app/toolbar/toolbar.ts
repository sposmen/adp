import * as Holidays from 'date-holidays';
import { whenElementReady } from '../shared/dom.util';
import * as store from '../shared/store.util';
import './toolbar.style';


const holidaysHelper = new Holidays();


async function addToolbar() {

  // tslint:disable-next-line:no-require-imports
  const toolbarHtml = require('./toolbar.tpl');
  document.querySelector('#appContainer').insertAdjacentHTML('afterbegin', toolbarHtml);

  const toolbar = document.querySelector('.adp-next');
  const copy = toolbar.querySelector('.adp-next__copy');
  const country = toolbar.querySelector('.adp-next__country') as HTMLSelectElement;

  const countryCodeKey = 'adp-next__countryCode';

  const countryCode = await store.getItem(countryCodeKey);
  if (countryCode) {
    country.value = countryCode;
    holidaysHelper.init(countryCode);
  }

  copy.addEventListener('click', evt => {
    copyAll();
  });

  country.addEventListener('change', async () => {
    const countryCode = country.value;
    if (countryCode) {
      holidaysHelper.init(countryCode);
      await store.setItem(countryCodeKey, countryCode);
    } else {
      await store.removeItem(countryCodeKey);
    }
    enableToolbar(!!countryCode);
  });

  whenElementReady('TcGrid', () => {
    country.removeAttribute('disabled');
    enableToolbar(!!country.value);
  });
}

function enableToolbar(enable: boolean) {
  const toolbar = document.querySelector('.adp-next');
  const copy = toolbar.querySelector('.adp-next__copy');
  if (enable) {
    copy.removeAttribute('disabled');
  } else {
    copy.setAttribute('disabled', 'disabled');
  }
}

function postGridUpdate() {
  TcGridUtil.ResetStoreArrayPositions();
  TcGridUtil.CreateDTORecordXReferences();
  dojo.destroy(TcGridTable.DataGrid.grid);
  TcGridUtil.renderNewAndAdjustLayout();
}

function findFirstWeekday(rows: any[]) {
  
    let srcRow;
    let isFilled;
    let srcIdx = 0;
    const rowsLimit = rows.length - 1;
  
    do {
      srcIdx++;
      srcRow = rows[srcIdx];
      isFilled = checkIsWeekdayRow(srcRow);
    } while (!isFilled && srcIdx < rowsLimit);
  
    return isFilled ? { srcIdx, srcRow } : undefined;
  }

function findFirstFilled(rows: any[]) {

  let srcRow;
  let isFilled;
  let srcIdx = 0;
  const rowsLimit = rows.length - 1;

  do {
    srcIdx++;
    srcRow = rows[srcIdx];
    isFilled = checkIsFilledRow(srcRow);
  } while (!isFilled && srcIdx < rowsLimit);

  return isFilled ? { srcIdx, srcRow } : undefined;
}

function copyAll() {

  const rows = TcGridView.ProcessedServerResponse.items;
  
  const firstFilledResp = findFirstFilled(rows);
  
  if (!firstFilledResp) {
    showAlert('Fill a source row before copy.');
    return;
  }
  
  const { srcIdx, srcRow } = firstFilledResp;

  store.setItem('srcRow', JSON.stringify(srcRow));
  
  let plusDays = 1;
  let newIdx = srcIdx + 1;
  const rowsLimit = rows.length - 1;
  const ONE_DAY_IN_MILLIS = 864e5;

  while (newIdx < rowsLimit) {

    let nextRow = rows[newIdx];
    let isWeekday = checkIsWeekday(nextRow.InDate);

    while (!isWeekday && newIdx < rowsLimit) {
      plusDays++;
      newIdx++;
      nextRow = rows[newIdx];
      isWeekday = checkIsWeekday(nextRow.InDate);
    }

    // each new week starts with two extra rows for the headers, ignore them.
    const headersCount = nextRow.InDate.getDay() === 1 ? 2 : 0;

    plusDays -= headersCount;

    const days = ONE_DAY_IN_MILLIS * plusDays;
    const date = new Date(srcRow.InDate.valueOf() + days);

    const newRow = { ...srcRow };
    newRow.PayDate = new Date(date);
    newRow.InDate = new Date(date);
    newRow.OutDate = new Date(date);

    const isHoliday = checkIsHoliday(date);
    if (isHoliday) {
      newRow.PayCodeID = 'HOLIDAY';
    }

    const newCopiedRow = TcGridUtil.CopyRow(newRow, true, true);
    newCopiedRow.WeekNumber = TcGridUtil.IdentifyWeekNumber(newCopiedRow.InDate);

    const newPos = TcGridUtil.StoreItemLocation(rows, newIdx);
    rows[newPos] = newCopiedRow;

    plusDays++;
    newIdx++;
  }

  postGridUpdate();
}

export function checkIsWeekday(date: Date) {
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export function checkIsHoliday(date: Date) {
  return holidaysHelper.isHoliday(date);
}

function checkIsFilledRow(row: any) {
  return row.InDate && row.PayCodeID;
}

function checkIsWeekdayRow(row: any) {
  return checkIsWeekday(row.InDate);
}

function showAlert(message: string) {

  const alert = document.querySelector('.adp-next__alert') as any;

  alert.querySelector('.adp-next__alert-message').textContent = message;

  alert.querySelector('.adp-next__close').onclick = () => {
    alert.close();
  };

  alert.showModal();
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

function init() {
  checkToolbar();
  window.addEventListener('hashchange', checkToolbar);
}


init();
