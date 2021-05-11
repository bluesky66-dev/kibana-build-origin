"use strict";

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _time_filter = require("../time_filter");

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


const timeRanges = [{
  start: 'now/d',
  end: 'now/d',
  label: 'Today'
}, {
  start: 'now/w',
  end: 'now/w',
  label: 'This week'
}, {
  start: 'now-15m',
  end: 'now',
  label: 'Last 15 minutes'
}, {
  start: 'now-30m',
  end: 'now',
  label: 'Last 30 minutes'
}, {
  start: 'now-1h',
  end: 'now',
  label: 'Last 1 hour'
}, {
  start: 'now-24h',
  end: 'now',
  label: 'Last 24 hours'
}, {
  start: 'now-7d',
  end: 'now',
  label: 'Last 7 days'
}, {
  start: 'now-30d',
  end: 'now',
  label: 'Last 30 days'
}, {
  start: 'now-90d',
  end: 'now',
  label: 'Last 90 days'
}, {
  start: 'now-1y',
  end: 'now',
  label: 'Last 1 year'
}];
(0, _react.storiesOf)('renderers/TimeFilter', module).addDecorator(story => /*#__PURE__*/_react2.default.createElement("div", {
  style: {
    width: '600px'
  }
}, story())).add('default', () => /*#__PURE__*/_react2.default.createElement(_time_filter.TimeFilter, {
  filter: "timefilter from=now-1y to=now column=@timestamp",
  commit: (0, _addonActions.action)('commit')
})).add('with relative time bounds', () => /*#__PURE__*/_react2.default.createElement(_time_filter.TimeFilter, {
  filter: "timefilter from=now/w to=now/w column=@timestamp",
  commit: (0, _addonActions.action)('commit')
})).add('with absolute time bounds', () => /*#__PURE__*/_react2.default.createElement(_time_filter.TimeFilter, {
  filter: "timefilter from='01/01/2019' to='12/31/2019' column=@timestamp",
  commit: (0, _addonActions.action)('commit')
})).add('with dateFormat', () => /*#__PURE__*/_react2.default.createElement(_time_filter.TimeFilter, {
  filter: "timefilter from=now-24h to=now column=@timestamp",
  commit: (0, _addonActions.action)('commit'),
  dateFormat: "MM/DD/YY HH:MM:SSA"
})).add('with commonlyUsedRanges', () => /*#__PURE__*/_react2.default.createElement(_time_filter.TimeFilter, {
  filter: "timefilter from=now-30d to=now column=@timestamp",
  commit: (0, _addonActions.action)('commit'),
  commonlyUsedRanges: timeRanges
}));