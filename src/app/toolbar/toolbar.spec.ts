import { init as initToolbar, myTimecardPath, copyRows } from './toolbar';

describe('toolbar', () => {

  beforeAll(() => {
    HTMLElement.prototype['showModal'] = function () {
      console.log('showModal');
    };
  });

  beforeEach(() => {
    prepareContext();
    initToolbar();
  });

  it('copyRows - from first', () => {

    // tslint:disable-next-line:no-require-imports
    const mockFirstRowOnly = require('./mock/toolbar-first.mock.json') as AdpRow[];
    parseDates(mockFirstRowOnly);
    // tslint:disable-next-line:no-require-imports
    const mockFilledRows = require('./mock/toolbar-filled.mock.json') as AdpRow[];
    parseDates(mockFilledRows);

    const targetRows = mockFirstRowOnly.slice(0);

    copyRows(targetRows, 'CO');

    expect(targetRows).toEqual(mockFilledRows);
  });

  it('copyRows - no copy if empty', () => {

    // tslint:disable-next-line:no-require-imports
    const mockEmptyRows = require('./mock/toolbar-empty.mock.json') as AdpRow[];
    parseDates(mockEmptyRows);

    const targetRows = mockEmptyRows.slice(0);

    copyRows(targetRows, 'CO');

    expect(targetRows).toEqual(mockEmptyRows);
  });
});


function prepareContext() {

  location.hash = myTimecardPath;

  document.body.innerHTML = `
    <div id="TimecardManager">
      <div id="TcGrid"></div>
    </div>
  `;

  window['TcGridUtil'] = {
    RefreshTCMGrid() {
      console.log('RefreshTCMGrid');
    },
    RecordTypes: {
      DatePlaceholder: 2
    }
  };

  window['TcGridTable'] = {
    DataGrid: {
      store: {
        data: undefined
      }
    }
  };
}

function parseDates(data: AdpRow[]) {
  data.forEach(it => {
    if (it.InDate) {
      if (!(it.InDate instanceof Date)) {
        it.InDate = new Date(it.InDate);
      }
    }
  });
}

