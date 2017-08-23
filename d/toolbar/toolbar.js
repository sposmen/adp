var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "date-holidays", "../shared/dom.util", "../shared/store.util", "./toolbar.style"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Holidays = require("date-holidays");
    const dom_util_1 = require("../shared/dom.util");
    const store = require("../shared/store.util");
    require("./toolbar.style");
    const holidaysHelper = new Holidays();
    function addToolbar() {
        return __awaiter(this, void 0, void 0, function* () {
            // tslint:disable-next-line:no-require-imports
            const toolbarHtml = require('./toolbar.tpl');
            document.querySelector('#appContainer').insertAdjacentHTML('afterbegin', toolbarHtml);
            const toolbar = document.querySelector('.adp-next');
            const copy = toolbar.querySelector('.adp-next__copy');
            const country = toolbar.querySelector('.adp-next__country');
            const countryCodeKey = 'adp-next__countryCode';
            const countryCode = yield store.getItem(countryCodeKey);
            if (countryCode) {
                country.value = countryCode;
                holidaysHelper.init(countryCode);
            }
            copy.addEventListener('click', evt => {
                copyAll();
            });
            country.addEventListener('change', () => __awaiter(this, void 0, void 0, function* () {
                const countryCode = country.value;
                if (countryCode) {
                    holidaysHelper.init(countryCode);
                    yield store.setItem(countryCodeKey, countryCode);
                }
                else {
                    yield store.removeItem(countryCodeKey);
                }
                enableToolbar(!!countryCode);
            }));
            dom_util_1.whenElementReady('TcGrid', () => {
                country.removeAttribute('disabled');
                enableToolbar(!!country.value);
            });
        });
    }
    function enableToolbar(enable) {
        const toolbar = document.querySelector('.adp-next');
        const copy = toolbar.querySelector('.adp-next__copy');
        if (enable) {
            copy.removeAttribute('disabled');
        }
        else {
            copy.setAttribute('disabled', 'disabled');
        }
    }
    function postGridUpdate() {
        TcGridUtil.ResetStoreArrayPositions();
        TcGridUtil.CreateDTORecordXReferences();
        dojo.destroy(TcGridTable.DataGrid.grid);
        TcGridUtil.renderNewAndAdjustLayout();
    }
    function findFirstWeekday(rows) {
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
    function findFirstFilled(rows) {
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
            const newRow = Object.assign({}, srcRow);
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
    function checkIsWeekday(date) {
        const dayOfWeek = date.getUTCDay();
        return dayOfWeek !== 0 && dayOfWeek !== 6;
    }
    exports.checkIsWeekday = checkIsWeekday;
    function checkIsHoliday(date) {
        return holidaysHelper.isHoliday(date);
    }
    exports.checkIsHoliday = checkIsHoliday;
    function checkIsFilledRow(row) {
        return row.InDate && row.PayCodeID;
    }
    function checkIsWeekdayRow(row) {
        return checkIsWeekday(row.InDate);
    }
    function showAlert(message) {
        const alert = document.querySelector('.adp-next__alert');
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
        }
        else if (toolbar) {
            toolbar.parentNode.removeChild(toolbar);
        }
    }
    function init() {
        checkToolbar();
        window.addEventListener('hashchange', checkToolbar);
    }
    init();
});
//# sourceMappingURL=toolbar.js.map