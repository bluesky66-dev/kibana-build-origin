"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRules = exports.getFilter = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFilter = filter => {
  if (filter == null) {
    return `alert.attributes.alertTypeId: ${_constants.SIGNALS_ID}`;
  } else {
    return `alert.attributes.alertTypeId: ${_constants.SIGNALS_ID} AND ${filter}`;
  }
};

exports.getFilter = getFilter;

const findRules = async ({
  alertsClient,
  perPage,
  page,
  fields,
  filter,
  sortField,
  sortOrder
}) => {
  return alertsClient.find({
    options: {
      fields,
      page,
      perPage,
      filter: getFilter(filter),
      sortOrder,
      sortField
    }
  });
};

exports.findRules = findRules;