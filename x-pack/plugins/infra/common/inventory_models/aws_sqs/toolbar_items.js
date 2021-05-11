"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AwsSQSToolbarItems = exports.sqsGroupByFields = exports.sqsMetricTypes = void 0;

var _react = _interopRequireDefault(require("react"));

var _metrics_and_groupby_toolbar_items = require("../shared/components/metrics_and_groupby_toolbar_items");

var _cloud_toolbar_items = require("../shared/components/cloud_toolbar_items");

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

const sqsMetricTypes = ['sqsMessagesVisible', 'sqsMessagesDelayed', 'sqsMessagesSent', 'sqsMessagesEmpty', 'sqsOldestMessage'];
exports.sqsMetricTypes = sqsMetricTypes;
const sqsGroupByFields = ['cloud.region'];
exports.sqsGroupByFields = sqsGroupByFields;

const AwsSQSToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_cloud_toolbar_items.CloudToolbarItems, props), /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, _extends({}, props, {
    metricTypes: sqsMetricTypes,
    groupByFields: sqsGroupByFields
  })));
};

exports.AwsSQSToolbarItems = AwsSQSToolbarItems;