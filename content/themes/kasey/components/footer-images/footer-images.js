'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const config = require('../config/config');

let containerId = 'js-component__footer-images';
let containerEl = document.getElementById(containerId);

let images = global.footerImages;

if (containerEl && footerImages instanceof Array) {
  let Images = React.createClass({
    // get initial state object
    getInitialState: function() {
      return {
        images: images.slice(0,6)
      };
    },

    // render the blog list
    render: function() {
      return <div className="footer-images">
        {this.state.images.map(function(image, i) {
          let mobileHideClass = (i >= 3) ? 'footer-images__image-link--mobile-hide' : '';
          let imageStyle = {
            backgroundImage: `url(${image.imageUrl})`
          }
          return <a className={'footer-images__image-link ' + mobileHideClass} style={imageStyle} href={image.linkUrl} key={i}></a>
        })}
      </div>
    },
  });

  ReactDOM.render(<Images />, containerEl);
}

