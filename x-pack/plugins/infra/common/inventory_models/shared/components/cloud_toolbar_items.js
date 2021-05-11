"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudToolbarItems = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _waffle_accounts_controls = require("../../../../public/pages/metrics/inventory_view/components/waffle/waffle_accounts_controls");

var _waffle_region_controls = require("../../../../public/pages/metrics/inventory_view/components/waffle/waffle_region_controls");

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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const CloudToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, props.accounts.length > 0 && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_waffle_accounts_controls.WaffleAccountsControls, {
    changeAccount: props.changeAccount,
    accountId: props.accountId,
    options: props.accounts
  })), props.regions.length > 0 && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_waffle_region_controls.WaffleRegionControls, {
    changeRegion: props.changeRegion,
    region: props.region,
    options: props.regions
  })));
};

exports.CloudToolbarItems = CloudToolbarItems;