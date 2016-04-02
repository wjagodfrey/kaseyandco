'use strict';
/*
 * Scroll Watch
 * ------------
 * Watch window scroll, and add class to body when 10 pixels from the top
 */

(function() {
  global.onscroll = function(e) {
    const body = global.document.body;
    const scrollY = global.scrollY;
    const scrollLimit = 40;
    const className = ' scrolled ';

    if (scrollY <= scrollLimit) {
      body.className = body.className.replace(className, '');
    } else if (scrollY > scrollLimit) {
      if (!body.className.match(className)) {
        body.className += className;
      }
    }
  }
})()
