"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.injectActionParams = injectActionParams;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function injectActionParams({
  alertId,
  actionTypeId,
  actionParams
}) {
  // Inject kibanaFooterLink if action type is email. This is used by the email action type
  // to inject a "View alert in Kibana" with a URL in the email's footer.
  if (actionTypeId === '.email') {
    return { ...actionParams,
      kibanaFooterLink: {
        path: `/app/management/insightsAndAlerting/triggersActions/alert/${alertId}`,
        text: _i18n.i18n.translate('xpack.alerts.injectActionParams.email.kibanaFooterLinkText', {
          defaultMessage: 'View alert in Kibana'
        })
      }
    };
  } // Fallback, return action params unchanged


  return actionParams;
}