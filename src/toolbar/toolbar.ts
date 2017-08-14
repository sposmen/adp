import * as Holidays from 'date-holidays';
import { whenElementReady } from './dom.util';
import './toolbar.style';
declare const require: any;
declare const TcGridUtil: any;
declare const TcGridView: any;
declare const TcGridTable: any;
declare const TLMJS: any;
declare const dojo: any;

const hd = new Holidays();


function addToolbar() {

  // tslint:disable-next-line:no-require-imports
  const toolbarHtml = require('./toolbar.tpl');
  document.querySelector('#appContainer').insertAdjacentHTML('afterbegin', toolbarHtml);

  const toolbar = document.querySelector('.adp-next');
  const copy = toolbar.querySelector('.adp-next__copy');
  const country = toolbar.querySelector('.adp-next__country') as HTMLSelectElement;

  const countryCodeKey = 'adp-next__countryCode';

  const countryCode = localStorage.getItem(countryCodeKey);
  if (countryCode) {
    country.value = countryCode;
    hd.init(countryCode);
  }

  copy.addEventListener('click', () => {
    copyAll(!!country.value);
  });

  country.addEventListener('change', () => {
    const countryCode = country.value;
    if (countryCode) {
      hd.init(countryCode);
      localStorage.setItem(countryCodeKey, countryCode);
    } else {
      localStorage.removeItem(countryCodeKey);
    }
  });

  whenElementReady('TcGrid', () => {
    copy.removeAttribute('disabled');
    country.removeAttribute('disabled');
  });
}

function copyAll(detectHolidays: boolean) {

  const rows = TcGridView.ProcessedServerResponse.items;
  const n = rows.length - 1;
  let srcIdx = 1;

  let srcRow = rows[srcIdx];
  let isWeekday = checkIsWeekday(srcRow.InDate);

  while (!isWeekday && srcIdx < n) {
    srcRow = rows[srcIdx];
    srcIdx++;
    isWeekday = checkIsWeekday(srcRow.InDate);
  }

  let plusDays = 1;
  let newIdx = srcIdx + 1;
  const ONE_DAY_IN_MILLIS = 864e5;

  while (newIdx < n) {

    let nextRow = rows[newIdx];
    isWeekday = checkIsWeekday(nextRow.InDate);

    while (!isWeekday && newIdx < n) {
      plusDays++;
      newIdx++;
      nextRow = rows[newIdx];
      isWeekday = checkIsWeekday(nextRow.InDate);
    }

    // each new week has two additionals rows for headers, ignore them.
    const headersCount = nextRow.InDate.getDay() === 1 ? 2 : 0;

    plusDays -= headersCount;

    const days = ONE_DAY_IN_MILLIS * plusDays;
    const date = new Date(srcRow.InDate.valueOf() + days);

    const newRow = { ...srcRow };
    newRow.PayDate = new Date(date);
    newRow.InDate = new Date(date);
    newRow.OutDate = new Date(date);

    if (detectHolidays) {
      const isHoliday = checkIsHoliday(date);
      if (isHoliday) {
        newRow.PayCodeID = 'HOLIDAY';
      }
    }

    const newCopiedRow = TcGridUtil.CopyRow(newRow, true, true);
    newCopiedRow.WeekNumber = TcGridUtil.IdentifyWeekNumber(newCopiedRow.InDate);

    const newPos = TcGridUtil.StoreItemLocation(rows, newIdx);
    rows[newPos] = newCopiedRow;

    plusDays++;
    newIdx++;
  }

  TcGridUtil.ResetStoreArrayPositions();
  TcGridUtil.CreateDTORecordXReferences();
  dojo.destroy(TcGridTable.DataGrid.grid);
  TcGridUtil.renderNewAndAdjustLayout();
}

export function checkIsWeekday(date: Date) {
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

export function checkIsHoliday(date: Date) {
  return hd.isHoliday(date);
}

function checkIsEmpty() {
  return false;
}

function showAlertNoSource() {
  const alert = document.querySelector('#alert') as any;
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
