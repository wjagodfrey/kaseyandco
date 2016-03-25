'use strict';

var req = require.context(
    './components',
    true,
    /.*\.(js|scss)$/
  );

req.keys().forEach(function(key){
  req(key);
});
