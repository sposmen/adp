import { whenElementReady } from './dom.util';

describe('dom.util', () => {

  beforeAll(() => {

    const htmlElementsCache = {};

    document.querySelector = jasmine.createSpy('document - querySelector').and.callFake((selector: string) => {
      if (!selector) {
        return undefined;
      }
      if (!htmlElementsCache[selector]) {
        const newElement = document.createElement('div');
        htmlElementsCache[selector] = newElement;
      }
      return htmlElementsCache[selector];
    });
  });

  it('whenElementReady', (done) => {
    
    whenElementReady('some-id', () => {
      done();
    }, 100);

    setTimeout(() => {
      const newElement = document.createElement('div');
      newElement.id = 'some-id';
      document.body.appendChild(newElement);
    }, 100);
  });

});
