"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AwsEC2ToolbarItems = exports.ec2groupByFields = exports.ec2MetricTypes = void 0;

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

const ec2MetricTypes = ['cpu', 'rx', 'tx', 'diskIOReadBytes', 'diskIOWriteBytes'];
exports.ec2MetricTypes = ec2MetricTypes;
const ec2groupByFields = ['cloud.availability_zone', 'cloud.machine.type', 'aws.ec2.instance.image.id', 'aws.ec2.instance.state.name'];
exports.ec2groupByFields = ec2groupByFields;

const AwsEC2ToolbarItems = props => {
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_cloud_toolbar_items.CloudToolbarItems, props), /*#__PURE__*/_react.default.createElement(_metrics_and_groupby_toolbar_items.MetricsAndGroupByToolbarItems, _extends({}, props, {
    metricTypes: ec2MetricTypes,
    groupByFields: ec2groupByFields
  })));
};

exports.AwsEC2ToolbarItems = AwsEC2ToolbarItems;