function goToMyTimecard() {
  const url = `https://workforcenow.adp.com/portal/theme#/Myself_ttd_MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard/MyselfTabTimecardsAttendanceSchCategoryTLMWebMyTimecard`;
  chrome.tabs.update(undefined, {
    url: url
  });
}


const link = document.querySelector('#link-to-my-timecard');
link.addEventListener('click', evt => {
  evt.preventDefault();
  goToMyTimecard();
  window.close();
});
