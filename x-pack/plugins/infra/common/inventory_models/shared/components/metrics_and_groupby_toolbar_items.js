"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsAndGroupByToolbarItems = void 0;

var _react = _interopRequireWildcard(require("react"));

var _eui = require("@elastic/eui");

var _snapshot_metric_i18n = require("../../../snapshot_metric_i18n");

var _waffle_sort_controls = require("../../../../public/pages/metrics/inventory_view/components/waffle/waffle_sort_controls");

var _metric_control = require("../../../../public/pages/metrics/inventory_view/components/waffle/metric_control");

var _waffle_group_by_controls = require("../../../../public/pages/metrics/inventory_view/components/waffle/waffle_group_by_controls");

var _toolbar_wrapper = require("../../../../public/pages/metrics/inventory_view/components/toolbars/toolbar_wrapper");

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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const MetricsAndGroupByToolbarItems = props => {
  const metricOptions = (0, _react.useMemo)(() => props.metricTypes.map(_snapshot_metric_i18n.toMetricOpt).filter(v => v), [props.metricTypes]);
  const groupByOptions = (0, _react.useMemo)(() => props.groupByFields.map(_toolbar_wrapper.toGroupByOpt), [props.groupByFields]);
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_metric_control.WaffleMetricControls, {
    fields: props.createDerivedIndexPattern('metrics').fields,
    options: metricOptions,
    metric: props.metric,
    onChange: props.changeMetric,
    onChangeCustomMetrics: props.changeCustomMetrics,
    customMetrics: props.customMetrics
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_waffle_group_by_controls.WaffleGroupByControls, {
    options: groupByOptions,
    groupBy: props.groupBy,
    nodeType: props.nodeType,
    onChange: props.changeGroupBy,
    fields: props.createDerivedIndexPattern('metrics').fields,
    onChangeCustomOptions: props.changeCustomOptions,
    customOptions: props.customOptions
  })), props.view === 'map' && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
    grow: false
  }, /*#__PURE__*/_react.default.createElement(_waffle_sort_controls.WaffleSortControls, {
    sort: props.sort,
    onChange: props.changeSort
  })));
};

exports.MetricsAndGroupByToolbarItems = MetricsAndGroupByToolbarItems;