import { whenElementReady } from './dom.util';
import { checkIsWorkingDate } from './date.util';
import './toolbar.style';
declare const require: any;
declare const TcGridUtil: any;
declare const TcGridView: any;
declare const TcGridTable: any;
declare const TLMJS: any;
declare const dojo: any;


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

  const ONE_DAY = 864e5;
  const rows = TcGridView.ProcessedServerResponse.items;
  const n = rows.length - 1;
  let srcIdx = 1;

  let srcRow = rows[srcIdx];
  let isWorkingDate = checkIsWorkingDate(new Date(srcRow.InDate.valueOf()));

  while (!isWorkingDate && srcIdx < n) {
    srcRow = rows[srcIdx];
    srcIdx++;
    isWorkingDate = checkIsWorkingDate(new Date(srcRow.InDate.valueOf()));
  }

  let plusDays = 1;
  let newIdx = srcIdx + 1;

  while (newIdx < n) {

    let nextRow = rows[newIdx];
    isWorkingDate = checkIsWorkingDate(new Date(nextRow.InDate.valueOf()));    

    let c = 0;

    while (!isWorkingDate && newIdx < n) {
      plusDays++;
      newIdx++;
      nextRow = rows[newIdx];
      isWorkingDate = checkIsWorkingDate(new Date(nextRow.InDate.valueOf()));
      c = 2;
    }

    if (c) {
      plusDays -= c;
    }

    const days = ONE_DAY * plusDays;

    const newRow = dojo.clone(srcRow);
    newRow.PayDate = TLMJS.IsDate(newRow.PayDate) ? new Date(newRow.PayDate.valueOf() + days) : undefined;
    newRow.InDate = TLMJS.IsDate(newRow.InDate) ? new Date(srcRow.InDate.valueOf() + days) : undefined;
    newRow.OutDate = TLMJS.IsDate(newRow.OutDate) ? new Date(newRow.OutDate.valueOf() + days) : undefined;

    const newPos = TcGridUtil.StoreItemLocation(rows, newIdx);

    console.log('* idx', plusDays);
    console.log('* newIdx', newIdx);
    console.log('* newPos', newPos);

    const newCopiedRow = TcGridUtil.CopyRow(newRow, true, true);
    newCopiedRow.WeekNumber = TcGridUtil.IdentifyWeekNumber(newCopiedRow.InDate);
    rows[newPos] = newCopiedRow;

    plusDays++;
    newIdx++;
  }

  TcGridUtil.ResetStoreArrayPositions();
  TcGridUtil.CreateDTORecordXReferences();
  dojo.destroy(TcGridTable.DataGrid.grid);
  TcGridUtil.renderNewAndAdjustLayout();
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
