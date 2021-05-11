"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Canvas = exports.CanvasComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _context = require("../context");

var _page = require("./page");

var _footer = require("./footer");

var _time_interval = require("../../public/lib/time_interval");

var _canvasModule = _interopRequireDefault(require("./canvas.module.scss"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let timeout = 0; // eslint-disable-next-line @typescript-eslint/naming-convention

/**
 * The "canvas" for a workpad, which composes the toolbar and other components.
 */

const CanvasComponent = ({
  onSetPage,
  onSetScrubberVisible,
  refs,
  settings,
  stage,
  workpad
}) => {
  const {
    toolbar,
    autoplay
  } = settings;
  const {
    height: stageHeight,
    width: stageWidth,
    page
  } = stage;
  const {
    height: workpadHeight,
    width: workpadWidth
  } = workpad;
  const ratio = Math.max(workpadWidth / stageWidth, workpadHeight / stageHeight);
  const transform = `scale3d(${stageHeight / (stageHeight * ratio)}, ${stageWidth / (stageWidth * ratio)}, 1)`;
  const pageStyle = {
    height: workpadHeight,
    transform,
    width: workpadWidth
  };

  if (autoplay.isEnabled && autoplay.interval) {
    // We need to clear the timeout every time, even if it doesn't need to be or
    // it's null.  Since one could select a different page from the scrubber at
    // any point, or change the interval, we need to make sure the interval is
    // killed on React re-render-- otherwise the pages will start bouncing around
    // as timeouts are accumulated.
    clearTimeout(timeout);
    timeout = setTimeout(() => onSetPage(page >= workpad.pages.length - 1 ? 0 : page + 1), (0, _time_interval.getTimeInterval)(autoplay.interval));
  }

  const [toolbarHidden, setToolbarHidden] = (0, _react.useState)(toolbar.isAutohide);
  const rootHeight = stageHeight + (toolbar.isAutohide ? 0 : _footer.FOOTER_HEIGHT);

  const hideToolbar = hidden => {
    if (toolbar.isAutohide) {
      if (hidden) {
        // Hide the scrubber if we hide the toolbar.
        onSetScrubberVisible(false);
      }

      setToolbarHidden(hidden);
    }
  };

  return /*#__PURE__*/_react.default.createElement("div", {
    className: _canvasModule.default.root,
    style: {
      height: rootHeight,
      width: stageWidth
    },
    onMouseEnter: () => hideToolbar(false),
    onMouseLeave: () => hideToolbar(true),
    ref: refs.stage
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _canvasModule.default.container,
    style: {
      height: stageHeight,
      width: stageWidth
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: _canvasModule.default.page,
    style: pageStyle
  }, /*#__PURE__*/_react.default.createElement(_page.Page, {
    index: page
  }))), /*#__PURE__*/_react.default.createElement(_footer.Footer, {
    isHidden: toolbarHidden
  }));
};
/**
 * A store-connected container for the `Canvas` component.
 */


exports.CanvasComponent = CanvasComponent;

const Canvas = () => {
  const [{
    workpad,
    stage,
    settings,
    refs
  }, dispatch] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const onSetPage = page => {
    dispatch((0, _context.setPageAction)(page));
  };

  const onSetScrubberVisible = visible => {
    dispatch((0, _context.setScrubberVisibleAction)(visible));
  };

  return /*#__PURE__*/_react.default.createElement(CanvasComponent, {
    onSetPage,
    onSetScrubberVisible,
    refs,
    settings,
    stage,
    workpad
  });
};

exports.Canvas = Canvas;