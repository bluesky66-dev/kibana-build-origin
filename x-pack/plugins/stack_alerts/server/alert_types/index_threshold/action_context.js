"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMessages = addMessages;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function addMessages(alertInfo, baseContext, params) {
  const title = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeContextSubjectTitle', {
    defaultMessage: 'alert {name} group {group} met threshold',
    values: {
      name: alertInfo.name,
      group: baseContext.group
    }
  });

  const window = `${params.timeWindowSize}${params.timeWindowUnit}`;

  const message = _i18n.i18n.translate('xpack.stackAlerts.indexThreshold.alertTypeContextMessageDescription', {
    defaultMessage: `alert '{name}' is active for group '{group}':

- Value: {value}
- Conditions Met: {conditions} over {window}
- Timestamp: {date}`,
    values: {
      name: alertInfo.name,
      group: baseContext.group,
      value: baseContext.value,
      conditions: baseContext.conditions,
      window,
      date: baseContext.date
    }
  });

  return { ...baseContext,
    title,
    message
  };
}