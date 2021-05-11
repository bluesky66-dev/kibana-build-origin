"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scrubber = exports.ScrubberComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _page_preview = require("./page_preview");

var _context = require("../../context");

var _scrubberModule = _interopRequireDefault(require("./scrubber.module.scss"));

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

const THUMBNAIL_HEIGHT = 100;
/**
 * The panel of previews of the pages in the workpad, allowing one to select and
 * navigate to a specific page.
 */

const ScrubberComponent = ({
  isScrubberVisible,
  pages
}) => {
  const className = isScrubberVisible ? (0, _classnames.default)(_scrubberModule.default.root, _scrubberModule.default.visible) : _scrubberModule.default.root;
  const slides = pages.map((page, index) => /*#__PURE__*/_react.default.createElement(_page_preview.PagePreview, _extends({
    key: page.id,
    height: THUMBNAIL_HEIGHT
  }, {
    index
  })));
  return /*#__PURE__*/_react.default.createElement("div", {
    className: className
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _scrubberModule.default.slideContainer
  }, slides));
};
/**
 * A store-connected container for the `Scrubber` component.
 */


exports.ScrubberComponent = ScrubberComponent;

const Scrubber = () => {
  const [{
    workpad,
    footer
  }] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const {
    pages
  } = workpad;
  const {
    isScrubberVisible
  } = footer;
  return /*#__PURE__*/_react.default.createElement(ScrubberComponent, {
    pages,
    isScrubberVisible
  });
};

exports.Scrubber = Scrubber;