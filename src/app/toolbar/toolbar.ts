import * as Holidays from 'date-holidays';
import {whenElementReady} from '../shared/dom.util';
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
    return row.TotalHours > 0 && row.Value > 0 && row.PayCodeID && row.Lcf3 && row.Lcf4;
  }

  static checkIsHoliday(date: Date) {
    return Toolbar.holidaysHelper.isHoliday(date);
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
  }

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
  }

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
  }

  copyAll = () => {

    let rowsToProcess;

    const rows = TcGridTable.DataGrid.store.data;

    const firstFilledResp = Toolbar.findFirstFilled(rows);

    if (!firstFilledResp) {
      return Toolbar.showAlert('Fill a source row before copy.');
    }

    const {srcIdx, srcRow} = firstFilledResp;

    const dataToClone = _.pick(srcRow, ["PayCodeID", "Lcf3", "Lcf4", "RecordType", "TotalHours", "Value"]);

    // Set status as changed
    dataToClone.ProcessDTOStatus = 1;

    store.setItem('dataToClone', JSON.stringify(dataToClone));

    rowsToProcess = rows.slice(srcIdx + 1);

    rowsToProcess.forEach((row: any) => {
      const date = row.InDate;
      if (row.RecordType === TcGridUtil.RecordTypes.DatePlaceholder && Toolbar.checkIsWeekday(date)) {
        _.assign(row, dataToClone);
        if (Toolbar.checkIsHoliday(date)) {
          row.PayCodeID = "HOLIDAY";
        }
      }
    });

    TcGridUtil.RefreshTCMGrid();
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
