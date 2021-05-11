"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _context_example = require("../../test/context_example");

var _image = require("../../../canvas_plugin_src/renderers/image");

var _test = require("../../test");

var _rendered_element = require("../rendered_element");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  austin,
  hello
} = _test.sharedWorkpads;
(0, _react.storiesOf)('shareables/RenderedElement', module).add('contextual: hello', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style: {
    height: 720
  }
}, /*#__PURE__*/_react2.default.createElement(_rendered_element.RenderedElement, {
  element: hello.pages[0].elements[0],
  index: 0
}))).add('contextual: austin', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style: {
    height: 720,
    background: '#000'
  }
}, /*#__PURE__*/_react2.default.createElement(_rendered_element.RenderedElement, {
  element: austin.pages[0].elements[0],
  index: 0
}))).add('component', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style: {
    height: 100,
    width: 100
  }
}, /*#__PURE__*/_react2.default.createElement(_rendered_element.RenderedElementComponent, {
  index: 0,
  fn: (0, _image.image)(),
  element: {
    id: '123',
    position: {
      left: 0,
      top: 0,
      height: 100,
      width: 100,
      angle: 0,
      parent: null
    },
    expressionRenderable: {
      state: 'ready',
      value: {
        type: 'render',
        as: 'image',
        value: {
          type: 'image',
          mode: 'contain',
          dataurl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NC42MiA1MS4wMyI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOiNmZmY7fS5jbHMtMSwuY2xzLTJ7c3Ryb2tlOiNmMzY7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjJweDt9LmNscy0ye2ZpbGw6bm9uZTt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPkZsYWcgSWNvbjwvdGl0bGU+PGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+PGcgaWQ9IkxheWVyXzEtMiIgZGF0YS1uYW1lPSJMYXllciAxIj48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iNDIuOTMgMjguMTUgMSAyOC4xNSAxIDEgNDIuOTMgMSAzNS40NyAxNC41OCA0Mi45MyAyOC4xNSIvPjxsaW5lIGNsYXNzPSJjbHMtMiIgeDE9IjEiIHkxPSIxIiB4Mj0iMSIgeTI9IjUxLjAzIi8+PC9nPjwvZz48L3N2Zz4='
        },
        css: '.canvasRenderEl{\n\n}',
        containerStyle: {
          type: 'containerStyle',
          overflow: 'hidden'
        }
      },
      error: null
    }
  }
})));