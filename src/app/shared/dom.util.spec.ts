import { whenElementReady } from './dom.util';

describe('dom.util', () => {

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
