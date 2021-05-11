"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeTypeMessage = getRangeTypeMessage;

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _amount_and_unit = require("../amount_and_unit");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getRangeType(min, max) {
  if ((0, _lodash.isFinite)(min) && (0, _lodash.isFinite)(max)) {
    return 'between';
  } else if ((0, _lodash.isFinite)(min)) {
    return 'gt'; // greater than
  } else if ((0, _lodash.isFinite)(max)) {
    return 'lt'; // less than
  }
}

function getRangeTypeMessage(min, max) {
  return _i18n.i18n.translate('xpack.apm.agentConfig.range.errorText', {
    defaultMessage: `{rangeType, select,
        between {Must be between {min} and {max}}
        gt {Must be greater than {min}}
        lt {Must be less than {max}}
        other {Must be an integer}
      }`,
    values: {
      min,
      max,
      rangeType: getRangeType(typeof min === 'string' ? (0, _amount_and_unit.amountAndUnitToObject)(min).amount : min, typeof max === 'string' ? (0, _amount_and_unit.amountAndUnitToObject)(max).amount : max)
    }
  });
}