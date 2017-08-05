function init() {
    const toolbarHtml = buildToolbarHtml();
    const appContainer = document.querySelector('#appContainer');
    appContainer.insertAdjacentHTML('afterbegin', toolbarHtml);
    const toolbar = appContainer.querySelector('.adp-next');
    const fill = toolbar.querySelector('.adp-next__fill');
    fill.addEventListener('click', cloneAll);
    whenElementReady('#TcGrid', appContainer, () => {
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
function obtainEditableFields(row) {
    return Array.from(row.querySelectorAll('.Editable'));
}
function obtainRows() {
    return Array.from(document.querySelectorAll('#TcGrid .dR'));
}
function buildToolbarHtml() {
    return `
    <div class="adp-next">
      <button disabled class="adp-next__fill adp-next__btn">Fill</button>
    </div>
  `;
}
init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRvb2xiYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFFRSxNQUFNLFdBQVcsR0FBRyxnQkFBZ0IsRUFBRSxDQUFDO0lBRXZDLE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDN0QsWUFBWSxDQUFDLGtCQUFrQixDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUUzRCxNQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXhELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN0RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRXpDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUU7UUFDeEMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDtJQUNFLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNDLENBQUM7QUFFRDtJQUVFLE1BQU0sYUFBYSxHQUFHLFVBQVUsRUFBRTtTQUMvQixPQUFPLEVBQUU7U0FDVCxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUU1QixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQztJQUNULENBQUM7SUFFRCxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQUVELDRCQUE0QixHQUFnQjtJQUMxQyxNQUFNLE1BQU0sR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN6QyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO2VBQzVCLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO2VBQzVCLEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFFRCxrQkFBa0IsR0FBZ0I7SUFFaEMsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQWdCLENBQUM7SUFDL0QsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRWpCLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBNEIsQ0FBQztTQUN6RixJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLE1BQU0sQ0FBQyxDQUFDO0lBRTNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDZixDQUFDO0FBRUQsMEJBQTBCLFdBQW1CLEVBQUUsT0FBZ0IsRUFBRSxRQUFrQixFQUFFLEtBQUssR0FBRyxHQUFHO0lBQzlGLFVBQVUsQ0FBQztRQUVULE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFOUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNQLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUUxRCxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDWixDQUFDO0FBRUQsOEJBQThCLEdBQWdCO0lBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUFFRDtJQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQTRCLENBQUMsQ0FBQztBQUN6RixDQUFDO0FBRUQ7SUFDRSxNQUFNLENBQUM7Ozs7R0FJTixDQUFDO0FBQ0osQ0FBQztBQUdELElBQUksRUFBRSxDQUFDIn0=