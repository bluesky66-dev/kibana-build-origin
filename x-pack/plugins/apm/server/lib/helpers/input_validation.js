"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withDefaultValidators = exports.dateValidation = void 0;

var _joi = _interopRequireDefault(require("joi"));

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


const dateValidation = _joi.default.alternatives().try(_joi.default.date().iso(), _joi.default.number()).required();

exports.dateValidation = dateValidation;

const withDefaultValidators = (validators = {}) => {
  return _joi.default.object().keys({
    _debug: _joi.default.bool(),
    start: dateValidation,
    end: dateValidation,
    uiFilters: _joi.default.string(),
    ...validators
  });
};

exports.withDefaultValidators = withDefaultValidators;