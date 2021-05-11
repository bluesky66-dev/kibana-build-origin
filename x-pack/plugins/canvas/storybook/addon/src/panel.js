"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Panel = void 0;

var _react = _interopRequireWildcard(require("react"));

var _eui = require("@elastic/eui");

var _state_change = require("./components/state_change");

require("@elastic/eui/dist/eui_theme_light.css");

require("./panel.css");

var _components = require("./components");

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


const Panel = () => {
  const [selectedAction, setSelectedAction] = (0, _react.useState)(null);
  return /*#__PURE__*/_react.default.createElement(_eui.EuiResizableContainer, {
    className: "panel__resizeableContainer"
  }, (EuiResizablePanel, EuiResizableButton) => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(EuiResizablePanel, {
    initialSize: 50
  }, /*#__PURE__*/_react.default.createElement(_components.ActionList, {
    onSelect: setSelectedAction
  })), /*#__PURE__*/_react.default.createElement(EuiResizableButton, null), /*#__PURE__*/_react.default.createElement(EuiResizablePanel, {
    initialSize: 50
  }, /*#__PURE__*/_react.default.createElement(_state_change.StateChange, {
    action: selectedAction
  }), /*#__PURE__*/_react.default.createElement(_components.ActionTree, {
    action: selectedAction
  }))));
};

exports.Panel = Panel;