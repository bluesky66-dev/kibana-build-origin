"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = exports.PageComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _rendered_element = require("./rendered_element");

var _context = require("../context");

var _pageModule = _interopRequireDefault(require("./page.module.scss"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}
/**
 * A Page in the Shareable Workpad is conceptually identical to a Page in a Workpad.
 */


const PageComponent = ({
  page,
  height,
  width
}) => {
  const {
    elements,
    style,
    id
  } = page;
  const output = elements.map((element, i) => /*#__PURE__*/_react.default.createElement(_rendered_element.RenderedElement, {
    key: element.id,
    element: element,
    index: i + 1
  }));
  return /*#__PURE__*/_react.default.createElement("div", _extends({
    id
  }, {
    className: _pageModule.default.root,
    style: {
      height,
      width,
      ...style
    }
  }), output);
};

exports.PageComponent = PageComponent;
/**
 * A store-connected container for the `Page` component.
 */

const Page = ({
  index
}) => {
  const [{
    workpad
  }] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const {
    height,
    width,
    pages
  } = workpad;
  const page = pages[index];
  return /*#__PURE__*/_react.default.createElement(PageComponent, {
    page,
    height,
    width
  });
};

exports.Page = Page;