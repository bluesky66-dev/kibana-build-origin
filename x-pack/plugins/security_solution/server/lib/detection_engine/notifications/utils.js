"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNotificationResultsLink = void 0;

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNotificationResultsLink = ({
  kibanaSiemAppUrl = _constants.APP_PATH,
  id,
  from,
  to
}) => {
  if (from == null || to == null) return '';
  return `${kibanaSiemAppUrl}/detections/rules/id/${id}?timerange=(global:(linkTo:!(timeline),timerange:(from:${from},kind:absolute,to:${to})),timeline:(linkTo:!(global),timerange:(from:${from},kind:absolute,to:${to})))`;
};

exports.getNotificationResultsLink = getNotificationResultsLink;