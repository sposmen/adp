import * as Holidays from 'date-holidays';
import { whenElementReady } from '../shared/dom.util';
import * as store from '../shared/store.util';
import './toolbar.style';

class Toolbar {

  static holidaysHelper = new Holidays();
  toolbar: any;
  copy: any;
  country: any;
  countryCodeKey: string;
  countryCode: string;
  toolbarHtml: string;
  appContainer: any;

  constructor() {
    // tslint:disable-next-line:no-require-imports
    this.toolbarHtml = require('./toolbar.tpl');
    this.appContainer = document.querySelector('#appContainer');

    this.checkToolbar();
    window.addEventListener('hashchange', this.checkToolbar);
  }

  static checkIsWeekday(date: Date) {
    const dayOfWeek = date.getUTCDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
  }

  static checkIsWeekdayRow(row: any) {
    return Toolbar.checkIsWeekday(row.InDate);
  }

  static checkIsFilledRow(row: any) {
    return row.InDate && row.PayCodeID;
  }

  static checkIsHoliday(date: Date) {
    return Toolbar.holidaysHelper.isHoliday(date);
  }

  static postGridUpdate() {
    TcGridUtil.ResetStoreArrayPositions();
    TcGridUtil.CreateDTORecordXReferences();
    dojo.destroy(TcGridTable.DataGrid.grid);
    TcGridUtil.renderNewAndAdjustLayout();
  }

  static showAlert(message: string) {
    const alert = document.querySelector('.adp-next__alert') as any;

    alert.querySelector('.adp-next__alert-message').textContent = message;

    alert.querySelector('.adp-next__close').onclick = () => {
      alert.close();
    };

    alert.showModal();
  }

  static findFirstFilled(rows: any[]) {

    let srcRow;
    let isFilled;
    let srcIdx = 0;
    const rowsLimit = rows.length - 1;

    do {
      srcIdx++;
      srcRow = rows[srcIdx];
      isFilled = Toolbar.checkIsFilledRow(srcRow);
    } while (!isFilled && srcIdx < rowsLimit);

    return isFilled ? {srcIdx, srcRow} : undefined;
  }

  checkToolbar = () => {

    const path = location.hash;
    const myTimecardPath = '#/Myself_ttd_MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard/MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard';

    if (path === myTimecardPath) {
      if (!this.toolbar) {
        this.setSelectors();
        this.addToolbar();
      }
    } else if (this.toolbar) {
      this.toolbar.parentNode.removeChild(this.toolbar);
      this.toolbar = undefined;
    }
  };

  setSelectors() {

    this.appContainer.insertAdjacentHTML('afterbegin', this.toolbarHtml);

    this.toolbar = document.querySelector('.adp-next');
    this.copy = this.toolbar.querySelector('.adp-next__copy');
    this.country = this.toolbar.querySelector('.adp-next__country') as HTMLSelectElement;
    this.countryCodeKey = 'adp-next__countryCode';

  }

  async addToolbar() {

    const countryCode = await store.getItem(this.countryCodeKey);
    if (countryCode) {
      this.country.value = countryCode;
      Toolbar.holidaysHelper.init(countryCode);
    }

    this.copy.addEventListener('click', this.copyAll);

    this.country.addEventListener('change', this.setCountryCode);

    whenElementReady('TcGrid', this.enableControls);
  }

  setCountryCode = async () => {
    const countryCode = this.country.value;
    if (countryCode) {
      this.countryCode = countryCode;
      Toolbar.holidaysHelper.init(countryCode);
      await store.setItem(this.countryCodeKey, countryCode);
    } else {
      await store.removeItem(this.countryCodeKey);
    }

    this.enableToolbar(!!countryCode);
  };

  enableToolbar(enable: boolean) {
    if (enable) {
      this.copy.removeAttribute('disabled');
    } else {
      this.copy.setAttribute('disabled', 'disabled');
    }
  }

  enableControls = () => {
    this.country.removeAttribute('disabled');
    this.enableToolbar(!!this.country.value);
  };

  copyAll = () => {

    const rows = TcGridView.ProcessedServerResponse.items;

    const firstFilledResp = Toolbar.findFirstFilled(rows);

    if (!firstFilledResp) {
      Toolbar.showAlert('Fill a source row before copy.');
      return;
    }

    const {srcIdx, srcRow} = firstFilledResp;

    store.setItem('srcRow', JSON.stringify(srcRow));

    let plusDays = 1;
    let newIdx = srcIdx + 1;
    const rowsLimit = rows.length - 1;
    const ONE_DAY_IN_MILLIS = 864e5;

    while (newIdx < rowsLimit) {

      let nextRow = rows[newIdx];

      while (!Toolbar.checkIsWeekday(nextRow.InDate) && newIdx < rowsLimit) {
        plusDays++;
        newIdx++;
        nextRow = rows[newIdx];
      }

      // each new week starts with two extra rows for the headers, ignore them.
      const headersCount = nextRow.InDate.getDay() === 1 ? 2 : 0;

      plusDays -= headersCount;

      const days = ONE_DAY_IN_MILLIS * plusDays;
      const date = new Date(srcRow.InDate.valueOf() + days);

      const newCopiedRow = TcGridUtil.CopyRow(this.cloneRowForDate(srcRow, date), true, true);
      newCopiedRow.WeekNumber = TcGridUtil.IdentifyWeekNumber(newCopiedRow.InDate);

      const newPos = TcGridUtil.StoreItemLocation(rows, newIdx);
      rows[newPos] = newCopiedRow;

      plusDays++;
      newIdx++;
    }

    Toolbar.postGridUpdate();
  };

  cloneRowForDate(srcRow: any, date: Date) {
    const newRow = {...srcRow};
    newRow.PayDate = new Date(date);
    newRow.InDate = new Date(date);
    newRow.OutDate = new Date(date);

    if (!!this.country.value) {
      const isHoliday = Toolbar.checkIsHoliday(date);
      if (isHoliday) {
        newRow.PayCodeID = 'HOLIDAY';
      }
    }
    return newRow;
  }

  // TODO: Check if this method could be removed. Came from the refactor
  findFirstWeekday(rows: any[]) {

    let srcRow;
    let isFilled;
    let srcIdx = 0;
    const rowsLimit = rows.length - 1;

    do {
      srcIdx++;
      srcRow = rows[srcIdx];
      isFilled = Toolbar.checkIsWeekdayRow(srcRow);
    } while (!isFilled && srcIdx < rowsLimit);

    return isFilled ? {srcIdx, srcRow} : undefined;
  }

}

export const toolbar = new Toolbar();
