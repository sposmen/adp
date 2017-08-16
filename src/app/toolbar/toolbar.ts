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
  const form = toolbar.querySelector('.adp-next__form');
  const copy = toolbar.querySelector('.adp-next__copy');
  const country = toolbar.querySelector('.adp-next__country') as HTMLSelectElement;

  const countryCodeKey = 'adp-next__countryCode';

  const countryCode = await store.getItem(countryCodeKey);
  if (countryCode) {
    country.value = countryCode;
    holidaysHelper.init(countryCode);
  }

  form.addEventListener('submit', evt => {
    evt.preventDefault();
    copyAll(!!country.value);
  });

  country.addEventListener('change', async () => {
    const countryCode = country.value;
    if (countryCode) {
      holidaysHelper.init(countryCode);
      await store.setItem(countryCodeKey, countryCode);
    } else {
      await store.removeItem(countryCodeKey);
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
  let isFilled = checkIsFilled(srcRow);

  while (!isFilled && srcIdx < n) {
    srcRow = rows[srcIdx];
    srcIdx++;
    isFilled = checkIsFilled(srcRow);
  }

  if (!isFilled) {
    showAlertNoSource();
    return;
  }

  let plusDays = 1;
  let newIdx = srcIdx + 1;
  const ONE_DAY_IN_MILLIS = 864e5;

  while (newIdx < n) {

    let nextRow = rows[newIdx];
    let isWeekday = checkIsWeekday(nextRow.InDate);

    while (!isWeekday && newIdx < n) {
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
  return holidaysHelper.isHoliday(date);
}

function checkIsFilled(row: any) {
  return row.InDate && row.PayCodeID;
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
