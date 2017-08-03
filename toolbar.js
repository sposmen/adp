function buildToolbarHtml() {
  return `
    <div class="adp-helper">
        <button disabled class="adp-helper__fill">Fill</button>
    </div>
  `;
}

function whenElementReady(cssSelector, context, callback, timer = 200) {
  setTimeout(() => {

    const el = context.querySelector(cssSelector);

    if (el) {
      callback(el);
      return;
    }

    whenElementReady(cssSelector, context, callback, timer);

  }, timer);
}

function init() {

  const appContainer = document.querySelector('#appContainer');
  const toolbarHtml = buildToolbarHtml();

  appContainer.insertAdjacentHTML('afterbegin', toolbarHtml);

  const helper = appContainer.querySelector('.adp-helper');

  const fill = helper.querySelector('.adp-helper__fill');

  whenElementReady('#TcGrid', appContainer, () => {
    fill.removeAttribute('disabled');
  });

  fill.addEventListener('click', evt => {

    const fieldsPatterns = /(?:PayCodeID|Value|Lcf3|Lcf4|TotalHours)$/;

    const table = appContainer.querySelector('#TcGrid');
    const rows = table.querySelectorAll('.dR');

    for (const row of rows) {
      const fields = row.querySelectorAll('.Editable');
      for (const field of fields) {
        if (fieldsPatterns.test(field.id)) {
          console.log('*** ' + field.id, field.textContent);
        }
      }
    }

  });
}



init();
