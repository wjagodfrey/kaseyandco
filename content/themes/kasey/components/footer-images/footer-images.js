'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const config = require('../config/config');

let containerId = 'js-component__footer-images';
let containerEl = document.getElementById(containerId);

console.log(containerEl);

let images = global.footerImages;

if (containerEl && footerImages instanceof Array) {
  let Images = React.createClass({
    // get initial state object
    getInitialState: function() {
      return {
        images
      };
    },

    // render the blog list
    render: function() {
      console.log(this.state.images);
      return <div className="footer-images">
        {this.state.images.map(function(image, i) {
          let imageStyle = {
            backgroundImage: `url(${image.imageUrl})`
          }
          return <a className="footer-images__image-link" style={imageStyle} href={image.linkUrl} key={i}>
          </a>
        })}
      </div>
    },
  });

  ReactDOM.render(<Images />, containerEl);
}

