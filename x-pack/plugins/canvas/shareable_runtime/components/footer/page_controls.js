"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageControls = exports.PageControlsComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _context = require("../../context");

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

/**
 * The page count and paging controls within the footer of the Shareable Canvas Workpad.
 */


const PageControlsComponent = ({
  onSetPageNumber,
  page,
  totalPages,
  onToggleScrubber
}) => {
  const currentPage = page + 1;
  return /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
    alignItems: "center",
    gutterSize: "none",
    style: {
      margin: '0 12px'
    }
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiButtonIcon, {
    color: "ghost",
    "data-test-subj": "pageControlsPrevPage",
    onClick: () => onSetPageNumber(page - 1),
    iconType: "arrowLeft",
    disabled: currentPage <= 1,
    "aria-label": "Previous Page"
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiButtonEmpty, {
    color: "ghost",
    size: "s",
    onClick: onToggleScrubber,
    "data-test-subj": "pageControlsCurrentPage"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
    color: "ghost",
    size: "s"
  }, "Page ", currentPage, totalPages > 1 ? ` of ${totalPages}` : null))), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiButtonIcon, {
    color: "ghost",
    "data-test-subj": "pageControlsNextPage",
    onClick: () => onSetPageNumber(page + 1),
    iconType: "arrowRight",
    disabled: currentPage >= totalPages,
    "aria-label": "Next Page"
  })));
};
/**
 * A store-connected container for the `PageControls` component.
 */


exports.PageControlsComponent = PageControlsComponent;

const PageControls = () => {
  const [{
    workpad,
    footer,
    stage
  }, dispatch] = (0, _context.useCanvasShareableState)();

  if (!workpad) {
    return null;
  }

  const {
    isScrubberVisible
  } = footer;
  const {
    page
  } = stage;
  const totalPages = workpad.pages.length;

  const onToggleScrubber = () => {
    dispatch((0, _context.setAutoplayAction)(false));
    dispatch((0, _context.setScrubberVisibleAction)(!isScrubberVisible));
  };

  const onSetPageNumber = number => dispatch((0, _context.setPageAction)(number));

  return /*#__PURE__*/_react.default.createElement(PageControlsComponent, {
    onToggleScrubber,
    onSetPageNumber,
    page,
    totalPages
  });
};

exports.PageControls = PageControls;