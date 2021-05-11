"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagePreview = exports.PagePreviewComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _page = require("../page");

var _context = require("../../context");

var _actions = require("../../context/actions");

var _page_previewModule = _interopRequireDefault(require("./page_preview.module.scss"));

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
 * The small preview of the page shown within the `Scrubber`.
 */


const PagePreviewComponent = ({
  height,
  index,
  onClick,
  page,
  workpadHeight,
  workpadWidth
}) => {
  const scale = height / workpadHeight;
  const transform = {
    height: workpadHeight,
    width: workpadWidth,
    transform: `scale3d(${scale}, ${scale}, 1)`
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: _page_previewModule.default.root,
    onClick: () => onClick(index),
    onKeyPress: () => onClick(index),
    style: {
      height: workpadHeight * scale,
      width: workpadWidth * scale
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _page_previewModule.default.preview,
    style: transform
  }, /*#__PURE__*/_react.default.createElement(_page.PageComponent, _extends({
    page
  }, {
    height: workpadHeight,
    width: workpadWidth
  }))));
};
/**
 * A store-connected container for the `PagePreview` component.
 */


exports.PagePreviewComponent = PagePreviewComponent;

const PagePreview = ({
  index,
  height
}) => {
  const [{
    workpad
  }, dispatch] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const page = workpad.pages[index];

  const onClick = pageIndex => dispatch((0, _actions.setPageAction)(pageIndex));

  const {
    height: workpadHeight,
    width: workpadWidth
  } = workpad;
  return /*#__PURE__*/_react.default.createElement(PagePreviewComponent, {
    onClick,
    height,
    workpadHeight,
    workpadWidth,
    page,
    index
  });
};

exports.PagePreview = PagePreview;