"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PodToolbarItems = exports.podGroupByFields = exports.podMetricTypes = void 0;

var _react = _interopRequireDefault(require("react"));

var _metrics_and_groupby_toolbar_items = require("../shared/components/metrics_and_groupby_toolbar_items");

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

const podMetricTypes = ['cpu', 'memory', 'rx', 'tx'];
exports.podMetricTypes = podMetricTypes;
const podGroupByFields = ['kubernetes.namespace', 'kubernetes.node.name', 'service.type'];
exports.podGroupByFields = podGroupByFields;

const PodToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, _extends({}, props, {
    metricTypes: podMetricTypes,
    groupByFields: podGroupByFields
  }));
};

exports.PodToolbarItems = PodToolbarItems;