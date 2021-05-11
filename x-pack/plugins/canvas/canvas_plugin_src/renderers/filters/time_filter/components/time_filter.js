"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimeFilter = void 0;

var _eui = require("@elastic/eui");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _lodash = require("lodash");

var _common = require("@kbn/interpreter/common");

var _units = require("../../../../../i18n/units");

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


const {
  quickRanges: strings
} = _units.UnitStrings;
const defaultQuickRanges = [{
  start: 'now-1d/d',
  end: 'now-1d/d',
  label: strings.getYesterdayLabel()
}, {
  start: 'now/d',
  end: 'now',
  label: strings.getTodayLabel()
}, {
  start: 'now-24h',
  end: 'now',
  label: strings.getLast24HoursLabel()
}, {
  start: 'now-7d',
  end: 'now',
  label: strings.getLast7DaysLabel()
}, {
  start: 'now-14d',
  end: 'now',
  label: strings.getLast2WeeksLabel()
}, {
  start: 'now-30d',
  end: 'now',
  label: strings.getLast30DaysLabel()
}, {
  start: 'now-90d',
  end: 'now',
  label: strings.getLast90DaysLabel()
}, {
  start: 'now-1y',
  end: 'now',
  label: strings.getLast1YearLabel()
}];

function getFilterMeta(filter) {
  const ast = (0, _common.fromExpression)(filter);
  const column = (0, _lodash.get)(ast, 'chain[0].arguments.column[0]');
  const start = (0, _lodash.get)(ast, 'chain[0].arguments.from[0]');
  const end = (0, _lodash.get)(ast, 'chain[0].arguments.to[0]');
  return {
    column,
    start,
    end
  };
}

const TimeFilter = ({
  filter,
  commit,
  dateFormat,
  commonlyUsedRanges = []
}) => {
  const setFilter = column => ({
    start,
    end
  }) => {
    commit(`timefilter from="${start}" to=${end} column=${column}`);
  };

  const {
    column,
    start,
    end
  } = getFilterMeta(filter);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "canvasTimeFilter"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSuperDatePicker, {
    start: start,
    end: end,
    isPaused: false,
    onTimeChange: setFilter(column),
    showUpdateButton: false,
    dateFormat: dateFormat,
    commonlyUsedRanges: commonlyUsedRanges.length ? commonlyUsedRanges : defaultQuickRanges
  }));
};

exports.TimeFilter = TimeFilter;
TimeFilter.propTypes = {
  filter: _propTypes.default.string.isRequired,
  commit: _propTypes.default.func.isRequired,
  // Canvas filter
  dateFormat: _propTypes.default.string,
  commonlyUsedRanges: _propTypes.default.arrayOf(_propTypes.default.shape({
    start: _propTypes.default.string.isRequired,
    end: _propTypes.default.string.isRequired,
    label: _propTypes.default.string.isRequired
  }))
};