function init() {
    const toolbarHtml = buildToolbarHtml();
    const appContainer = document.querySelector('body');
    appContainer.insertAdjacentHTML('afterbegin', toolbarHtml);
    const toolbar = appContainer.querySelector('.adp-next');
    const fill = toolbar.querySelector('.adp-next__fill');
    fill.addEventListener('click', cloneAll);
    whenElementReady('TcGrid', () => {
        fill.removeAttribute('disabled');
    });
}
function cloneAll() {
    obtainRows().forEach(cloneLastFilledRow);
}
function cloneLastFilledRow() {
    const lastFilledRow = obtainRows()
        .reverse()
        .find(checkIfRowIsFilled);
    if (!lastFilledRow) {
        console.warn('No filled row present.');
        return;
    }
    cloneRow(lastFilledRow);
}
function checkIfRowIsFilled(row) {
    const fields = obtainEditableFields(row);
    for (const field of fields) {
        if (!field.id.endsWith('_InDate')
            && !field.id.endsWith('_Value')
            && field.textContent.trim()) {
            return true;
        }
    }
}
function cloneRow(row) {
    const menuIcon = row.querySelector('.menuIcon');
    menuIcon.click();
    const menu = Array.from(document.querySelectorAll('.dijitPopup'))
        .find(it => it.style.display !== 'none');
    const copy = menu.querySelectorAll('tr')[2];
    copy.click();
}
function whenElementReady(id, callback, timer = 200) {
    setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
            callback(el);
            return;
        }
        whenElementReady(id, callback, timer);
    }, timer);
}
function obtainEditableFields(row) {
    return Array.from(row.querySelectorAll('.Editable'));
}
function obtainRows() {
    return Array.from(document.querySelectorAll('#TcGrid .dR'));
}
function buildToolbarHtml() {
    return `
    <div class="adp-next">
      <button class="adp-next__fill adp-next__btn" disabled>Fill</button>
    </div>
  `;
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvb2xiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFFRSxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO0lBRXZDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDcEQsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUUzRCxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXhELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN0RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXpDLGdCQUFnQixDQUFDLFFBQVEsRUFBRTtRQUN6QixJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ25DLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEO0lBQ0UsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDM0MsQ0FBQztBQUVEO0lBRUUsTUFBTSxhQUFhLEdBQUcsVUFBVSxFQUFFO1NBQy9CLE9BQU8sRUFBRTtTQUNULElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRTVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDO0lBQ1QsQ0FBQztJQUVELFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBRUQsNEJBQTRCLEdBQWdCO0lBQzFDLE1BQU0sTUFBTSxHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7ZUFDNUIsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7ZUFDNUIsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELGtCQUFrQixHQUFnQjtJQUVoQyxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBZ0IsQ0FBQztJQUMvRCxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFakIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUE0QixDQUFDO1NBQ3pGLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUM7SUFFM0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzVDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFFRCwwQkFBMEIsRUFBVSxFQUFFLFFBQWtCLEVBQUUsS0FBSyxHQUFHLEdBQUc7SUFDbkUsVUFBVSxDQUFDO1FBRVQsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV2QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1AsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELGdCQUFnQixDQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFeEMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ1osQ0FBQztBQUVELDhCQUE4QixHQUFnQjtJQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQ7SUFDRSxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUE0QixDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVEO0lBQ0UsTUFBTSxDQUFDOzs7O0dBSU4sQ0FBQztBQUNKLENBQUM7QUFHRCxJQUFJLEVBQUUsQ0FBQyJ9