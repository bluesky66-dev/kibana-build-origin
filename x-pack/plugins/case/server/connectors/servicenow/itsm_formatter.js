"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serviceNowITSMExternalServiceFormatter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const format = theCase => {
  var _ref;

  const {
    severity = null,
    urgency = null,
    impact = null,
    category = null,
    subcategory = null
  } = (_ref = theCase.connector.fields) !== null && _ref !== void 0 ? _ref : {};
  return {
    severity,
    urgency,
    impact,
    category,
    subcategory
  };
};

const serviceNowITSMExternalServiceFormatter = {
  format
};
exports.serviceNowITSMExternalServiceFormatter = serviceNowITSMExternalServiceFormatter;