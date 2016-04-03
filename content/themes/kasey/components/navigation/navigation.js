'use strict';
/*
 * Navigation
 * ----------
 */

(function() {
  const body = global.document.body;
  const noScrollClass = ' no-scroll__navigation--mobile-menu ';

  const wrapperEl = global.document.querySelectorAll('.navigation__wrapper')[0];
  const mobileTriggerEls = Array.prototype.slice.call(global.document.querySelectorAll('.navigation__mobile-trigger'));
  const mobileMenuShowClass = ' navigation__wrapper--show-mobile ';

  mobileTriggerEls.forEach((mobileTriggerEl) => {
    mobileTriggerEl.addEventListener('click', function(e) {
      // toggle the mobile menu show class and body noscroll
      if (!wrapperEl.className.match(mobileMenuShowClass)) {
        // add the body noscroll
        if (!body.className.match(noScrollClass)) {
          body.className += noScrollClass;
        }
        // add the mobile menu show class
        wrapperEl.className += mobileMenuShowClass;
      } else {
        // remove body noscroll
        body.className = body.className.replace(noScrollClass, '');
        // remove mobile menu show class
        wrapperEl.className = wrapperEl.className.replace(mobileMenuShowClass, '');
      }
    });
  });
})();
