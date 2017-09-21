import * as Holidays from 'date-holidays';
import {whenElementReady} from '../shared/dom.util';
import * as store from '../shared/store.util';
import './toolbar.style';

const holidaysHelper = new Holidays();

class Toolbar {

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
    this.countryCodeKey = 'adp-next__countryCode';

    this.checkToolbar();
    window.addEventListener('hashchange', this.checkToolbar);
  }

  checkToolbar = () => {

    const path = location.hash;
    const myTimecardPath = '#/Myself_ttd_MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard/MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard';

    if (path === myTimecardPath) {
      if (!this.toolbar) {
        this.domSelectors();
        this.addToolbar();
      }
    } else if (this.toolbar) {
      this.toolbar.parentNode.removeChild(this.toolbar);
      this.toolbar = undefined;
    }
  }

  domSelectors() {

    this.appContainer.insertAdjacentHTML('afterbegin', this.toolbarHtml);
    this.toolbar = document.querySelector('.adp-next');
    this.copy = this.toolbar.querySelector('.adp-next__copy');
    this.country = this.toolbar.querySelector('.adp-next__country') as HTMLSelectElement;

  }

  async addToolbar() {

    const countryCode = await store.getItem(this.countryCodeKey);
    if (countryCode) {
      this.country.value = countryCode;
      holidaysHelper.init(countryCode);
    }

    this.copy.addEventListener('click', this.copyAll);

    this.country.addEventListener('change', this.setCountryCode);

    whenElementReady('TcGrid', this.postGrid);
  }

  setCountryCode = async () => {
    const countryCode = this.country.value;
    if (countryCode) {
      this.countryCode = countryCode;
      holidaysHelper.init(countryCode);
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

  enableControls() {
    this.country.removeAttribute('disabled');
    this.enableToolbar(!!this.country.value);
  }

  postGrid = () => {
    this.enableControls();
    // TODO: Create a new method to assign the holiday class .isHoliday to view
  }

  copyAll = () => {

    let rowsToProcess;

    const rows = TcGridTable.DataGrid.store.data;

    const firstFilledResp = findFirstFilled(rows);

    if (!firstFilledResp) {
      return showAlert('Fill a source row before copy.');
    }

    const {srcIdx, srcRow} = firstFilledResp;

    const dataToClone = _.pick(srcRow, ["PayCodeID", "Lcf3", "Lcf4", "RecordType", "TotalHours", "Value"]);

    // Set status as changed
    dataToClone.ProcessDTOStatus = 1;

    // TODO: To Implement the always persistant clone information avoiding the always first row being required
    // store.setItem('dataToClone', JSON.stringify(dataToClone));

    rowsToProcess = rows.slice(srcIdx + 1);

    rowsToProcess.forEach((row: any) => {
      const date = row.InDate;
      if (row.RecordType === TcGridUtil.RecordTypes.DatePlaceholder && checkIsWeekday(date)) {
        Object.assign(row, dataToClone);
        if (checkIsHoliday(date)) {
          row.PayCodeID = "HOLIDAY";
        }
      }
    });

    // Render in the View
    TcGridUtil.RefreshTCMGrid();
  }

}

// "Statics"

function checkIsWeekday(date: Date) {
  const dayOfWeek = date.getUTCDay();
  return dayOfWeek !== 0 && dayOfWeek !== 6;
}

function checkIsWeekdayRow(row: any) {
  return checkIsWeekday(row.InDate);
}

function checkIsFilledRow(row: any) {
  return row.TotalHours > 0 && row.Value > 0 && row.PayCodeID && row.Lcf3 && row.Lcf4;
}

function checkIsHoliday(date: Date) {
  return holidaysHelper.isHoliday(date);
}

function showAlert(message: string) {
  const alert = document.querySelector('.adp-next__alert') as any;

  alert.querySelector('.adp-next__alert-message').textContent = message;

  alert.querySelector('.adp-next__close').onclick = () => {
    alert.close();
  };

  alert.showModal();
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

  return isFilled ? {srcIdx, srcRow} : undefined;
}

export const toolbar = new Toolbar();
