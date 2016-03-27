'use strict';
require('es6-promise').polyfill();
require('isomorphic-fetch');
const React = require('react');
const ReactDOM = require('react-dom');
const queryString = require('query-string');
const striptags = require('striptags');
const config = require('../config/config');

const defaultPreviewParagraphCount = 2;
const allowedHtmlTags = '<p><b><strong><i><em><a><ul><ol><li>';

let containerId = 'js-component__blog-list';
let containerEl = document.getElementById(containerId);

if (containerEl) {
  let List = React.createClass({
    // get initial state object
    getInitialState: function() {
      return {
        posts: [],
        pagination: {
          limit: 0,
          page: 0,
          pages: 0,
          prev: null,
          next: null,
          total: 0
        }
      };
    },

    _onPaginationClick: function(e, pageNumber) {
      e.preventDefault();
      this._updatePage(pageNumber);
    },

    // run fetch on component mount
    componentDidMount: function() {
      // get page number query
      let pageNumber = (queryString.parse(global.location.hash)).page;

      this._updatePage(pageNumber);
    },

    // render the blog list
    render: function() {
      let pagination = this.state.pagination;

      // pagination
      let Pagination = <div>
        <nav className="pagination" role="navigation">
          {(pagination.prev) ? (
            <a
              className="pagination__link pagination__link--newer-posts"
              onClick={(e)=>this._onPaginationClick(e, pagination.prev)}
              href={"#page=" + pagination.prev}
            >&larr; Newer Posts</a>
          ) : ''}

          {(pagination.next) ? (
            <a
              className="pagination__link pagination__link--older-posts"
              onClick={(e)=>this._onPaginationClick(e, pagination.next)}
              href={"#page=" + pagination.next}
            >Older Posts &rarr;</a>
          ) : ''}
        </nav>
      </div>

      // post list
      let Posts = this.state.posts.map((post) => {
        return <article key={post.id}>
          <header className="blog-list__header">
            <h2 className="blog-list__title"><a href={post.url}>{post.title}</a></h2>
          </header>
          <section className="blog-list__excerpt">
            <div>
              <div dangerouslySetInnerHTML={post.preview_html} />
              <a className="blog-list__read-more" href={post.url}>Read more..</a>
            </div>
          </section>
        </article>
      });

      return (this.state.posts.length) ? (
        <div className="blog-list">
          {Pagination}
          {Posts}
          {Pagination}
        </div>
      ) : <div />;
    },


    /*
     * ======================
     * CHANGE PAGINATION PAGE
     * ======================
     */
    _updatePage: function(pageNumber) {
      // update hash params
      let queryParams = queryString.parse(global.location.hash);
      queryParams.page = pageNumber;
      global.location.hash = queryString.stringify(queryParams);

      let request = ghost.url.api('posts', {
        limit: global._GhostConfiguration.postsPerPage || 4,
        page: pageNumber || 1,
        include: 'tags, author'
      });

      fetch(request)
        .then(function(response) {
          if (response.status >= 400) {
            throw new Error("Bad response from server");
          }
          return response.json();
        })
      .then((result) => {
        result.posts = result.posts.map(function(post) {
          // format post preview html
          post.preview_html = {__html: ''};

          let parser = global.document.createElement('span');
          parser.innerHTML = post.html;

          // attempt to find the '#post-preview-end' element
          let previewEndMarker = parser.querySelector('p > #post-preview-end');

          // if we have a marker, get its parent
          if (previewEndMarker) {
            previewEndMarker = previewEndMarker.parentNode;
          // otherwise attemtpt to get up to second paragraph if no '#post-preview-end' element
          } else {
            previewEndMarker = parser.querySelector(`p:nth-child(${defaultPreviewParagraphCount + 1})`);
          }

          // get HTML up to '#post-preview-end' element
          if (previewEndMarker) {
            let parserChildren = Array.prototype.slice.call(parser.children);
            let indexOfMarker = parserChildren.indexOf(previewEndMarker);
            if (indexOfMarker > -1) {
              let previewChildren = parserChildren.splice(0,indexOfMarker);
              let previewParser = global.document.createElement('span');
              previewChildren.forEach((child) => {
                previewParser.appendChild(child);
              });
              post.preview_html.__html = previewParser.innerHTML;
            }
          // Otherwise, get whole document text.
          } else {
            post.preview_html.__html = post.html;
          }

          // strip all but the allowed tags
          post.preview_html.__html = striptags(post.preview_html.__html, allowedHtmlTags);

          // return post with preview_html
          return post;
        });

        // set state to contain new posts and pagination
        this.setState({
          posts: result.posts,
          pagination: result.meta.pagination
        });
      });
    },
  });

  ReactDOM.render(<List />, containerEl);
}
