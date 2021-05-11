"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostToolbarItems = exports.hostGroupByFields = exports.hostMetricTypes = void 0;

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

const hostMetricTypes = ['cpu', 'memory', 'load', 'rx', 'tx', 'logRate'];
exports.hostMetricTypes = hostMetricTypes;
const hostGroupByFields = ['cloud.availability_zone', 'cloud.machine.type', 'cloud.project.id', 'cloud.provider', 'service.type'];
exports.hostGroupByFields = hostGroupByFields;

const HostToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, _extends({}, props, {
    metricTypes: hostMetricTypes,
    groupByFields: hostGroupByFields
  }));
};

exports.HostToolbarItems = HostToolbarItems;