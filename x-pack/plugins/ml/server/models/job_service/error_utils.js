"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRequestTimeout = isRequestTimeout;
exports.fillResultsWithTimeouts = fillResultsWithTimeouts;

var _i18n = require("@kbn/i18n");

var _states = require("../../../common/constants/states");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const REQUEST_TIMEOUT_NAME = 'RequestTimeout';

function isRequestTimeout(error) {
  return error.name === REQUEST_TIMEOUT_NAME;
} // populate a results object with timeout errors
// for the ids which haven't already been set


function fillResultsWithTimeouts(results, id, ids, status) {
  const action = getAction(status);
  const extra = ids.length - Object.keys(results).length > 1 ? _i18n.i18n.translate('xpack.ml.models.jobService.allOtherRequestsCancelledDescription', {
    defaultMessage: ' All other requests cancelled.'
  }) : '';
  const error = {
    response: {
      error: {
        root_cause: [{
          reason: _i18n.i18n.translate('xpack.ml.models.jobService.requestToActionTimedOutErrorMessage', {
            defaultMessage: `Request to {action} '{id}' timed out.{extra}`,
            values: {
              id,
              action,
              extra
            }
          })
        }]
      }
    }
  };
  return ids.reduce((acc, cur) => {
    if (results[cur] === undefined) {
      acc[cur] = {
        [status]: false,
        error
      };
    } else {
      acc[cur] = results[cur];
    }

    return acc;
  }, {});
}

function getAction(status) {
  let action = '';

  if (status === _states.DATAFEED_STATE.STARTED) {
    action = 'start';
  } else if (status === _states.DATAFEED_STATE.STOPPED) {
    action = 'stop';
  } else if (status === _states.DATAFEED_STATE.DELETED) {
    action = 'delete';
  } else if (status === _states.JOB_STATE.OPENED) {
    action = 'open';
  } else if (status === _states.JOB_STATE.CLOSED) {
    action = 'close';
  }

  return action;
}