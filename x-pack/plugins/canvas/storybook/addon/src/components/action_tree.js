"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionTree = void 0;

var _react = _interopRequireDefault(require("react"));

var _lodash = require("lodash");

var _v = _interopRequireDefault(require("uuid/v4"));

var _eui = require("@elastic/eui");

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


const actionToTree = recordedAction => {
  const {
    action,
    newState,
    previousState
  } = recordedAction;
  return [{
    label: 'Action',
    id: (0, _v.default)(),
    children: jsonToTree(action)
  }, {
    label: 'Previous State',
    id: (0, _v.default)(),
    children: jsonToTree(previousState)
  }, {
    label: 'Current State',
    id: (0, _v.default)(),
    children: jsonToTree(newState)
  }];
};

const jsonToTree = obj => {
  const keys = Object.keys(obj);
  const values = keys.map(label => {
    const value = obj[label];

    if (!value) {
      return null;
    }

    const id = (0, _v.default)();

    if ((0, _lodash.isDate)(value)) {
      return {
        label: `${label}: ${value.toDateString()}`
      };
    }

    if ((0, _lodash.isObject)(value)) {
      const children = jsonToTree(value);

      if (children !== null && Object.keys(children).length > 0) {
        return {
          label,
          id,
          children
        };
      } else {
        return {
          label,
          id
        };
      }
    }

    return {
      label: `${label}: ${value.toString().slice(0, 100)}`,
      id
    };
  });
  return values.filter(value => value !== null);
};

const ActionTree = ({
  action
}) => {
  const items = action ? actionToTree(action) : null;

  let tree = /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null);

  if (action && items) {
    tree = /*#__PURE__*/_react.default.createElement(_eui.EuiTreeView, {
      className: "panel__tree",
      display: "compressed",
      items: items,
      showExpansionArrows: true,
      "aria-label": "Result"
    });
  } else if (action) {
    tree = /*#__PURE__*/_react.default.createElement("div", null, "No change");
  }

  return tree;
};

exports.ActionTree = ActionTree;