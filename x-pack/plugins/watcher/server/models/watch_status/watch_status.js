"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WatchStatus = void 0;

var _lodash = require("lodash");

var _boom = require("@hapi/boom");

var _get_moment = require("../../../common/lib/get_moment");

var _action_status = require("../action_status");

var _constants = require("../../../common/constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getActionStatusTotals(watchStatus) {
  const result = {};
  (0, _lodash.forEach)(_constants.ACTION_STATES, state => {
    result[state] = 0;
  });
  (0, _lodash.forEach)(watchStatus.actionStatuses, actionStatus => {
    result[actionStatus.state] = result[actionStatus.state] + 1;
  });
  return result;
}

const WATCH_STATE_FAILED = 'failed';

class WatchStatus {
  constructor(props) {
    this.id = props.id;
    this.watchState = props.state;
    this.watchStatusJson = props.watchStatusJson;
    this.watchErrors = props.watchErrors || {};
    this.isActive = Boolean((0, _lodash.get)(this.watchStatusJson, 'state.active'));
    this.lastChecked = (0, _get_moment.getMoment)((0, _lodash.get)(this.watchStatusJson, 'last_checked'));
    this.lastMetCondition = (0, _get_moment.getMoment)((0, _lodash.get)(this.watchStatusJson, 'last_met_condition'));
    const actionStatusesJson = (0, _lodash.get)(this.watchStatusJson, 'actions', {});
    this.actionStatuses = (0, _lodash.map)(actionStatusesJson, (actionStatusJson, id) => {
      const json = {
        id,
        actionStatusJson,
        errors: this.watchErrors.actions && this.watchErrors.actions[id],
        lastCheckedRawFormat: (0, _lodash.get)(this.watchStatusJson, 'last_checked')
      };
      return _action_status.ActionStatus.fromUpstreamJson(json);
    });
  }

  get state() {
    if (!this.isActive) {
      return _constants.WATCH_STATES.DISABLED;
    }

    if (this.watchState === WATCH_STATE_FAILED) {
      return _constants.WATCH_STATES.ERROR;
    }

    const totals = getActionStatusTotals(this);

    if (totals[_constants.ACTION_STATES.ERROR] > 0) {
      return _constants.WATCH_STATES.ERROR;
    }

    if (totals[_constants.ACTION_STATES.CONFIG_ERROR] > 0) {
      return _constants.WATCH_STATES.CONFIG_ERROR;
    }

    const firingTotal = totals[_constants.ACTION_STATES.FIRING] + totals[_constants.ACTION_STATES.ACKNOWLEDGED] + totals[_constants.ACTION_STATES.THROTTLED];

    if (firingTotal > 0) {
      return _constants.WATCH_STATES.FIRING;
    }

    return _constants.WATCH_STATES.OK;
  }

  get comment() {
    const totals = getActionStatusTotals(this);
    const totalActions = this.actionStatuses.length;
    let result = _constants.WATCH_STATE_COMMENTS.OK;

    if (totals[_constants.ACTION_STATES.THROTTLED] > 0 && totals[_constants.ACTION_STATES.THROTTLED] < totalActions) {
      result = _constants.WATCH_STATE_COMMENTS.PARTIALLY_THROTTLED;
    }

    if (totals[_constants.ACTION_STATES.THROTTLED] > 0 && totals[_constants.ACTION_STATES.THROTTLED] === totalActions) {
      result = _constants.WATCH_STATE_COMMENTS.THROTTLED;
    }

    if (totals[_constants.ACTION_STATES.ACKNOWLEDGED] > 0 && totals[_constants.ACTION_STATES.ACKNOWLEDGED] < totalActions) {
      result = _constants.WATCH_STATE_COMMENTS.PARTIALLY_ACKNOWLEDGED;
    }

    if (totals[_constants.ACTION_STATES.ACKNOWLEDGED] > 0 && totals[_constants.ACTION_STATES.ACKNOWLEDGED] === totalActions) {
      result = _constants.WATCH_STATE_COMMENTS.ACKNOWLEDGED;
    }

    if (totals[_constants.ACTION_STATES.ERROR] > 0) {
      result = _constants.WATCH_STATE_COMMENTS.FAILING;
    }

    if (!this.isActive) {
      result = _constants.WATCH_STATE_COMMENTS.OK;
    }

    return result;
  }

  get lastFired() {
    const actionStatus = (0, _lodash.maxBy)(this.actionStatuses, 'lastExecution');

    if (actionStatus) {
      return actionStatus.lastExecution;
    }
  } // generate object to send to kibana


  get downstreamJson() {
    const json = {
      id: this.id,
      state: this.state,
      comment: this.comment,
      isActive: this.isActive,
      lastChecked: this.lastChecked,
      lastMetCondition: this.lastMetCondition,
      lastFired: this.lastFired,
      actionStatuses: (0, _lodash.map)(this.actionStatuses, actionStatus => actionStatus.downstreamJson)
    };
    return json;
  } // generate object from elasticsearch response


  static fromUpstreamJson(json) {
    if (!json.id) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchStatus.idPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain an {id} property',
        values: {
          id: 'id'
        }
      }));
    }

    if (!json.watchStatusJson) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchStatus.watchStatusJsonPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {watchStatusJson} property',
        values: {
          watchStatusJson: 'watchStatusJson'
        }
      }));
    }

    return new WatchStatus(json);
  }
  /*
  json.watchStatusJson should have the following structure:
  {
    "state": {
      "active": true,
      "timestamp": "2017-03-01T19:05:49.400Z"
    },
    "actions": {
      "log-me-something": {
        "ack": {
          "timestamp": "2017-03-01T20:56:58.442Z",
          "state": "acked"
        },
        "last_execution": {
          "timestamp": "2017-03-01T20:55:49.679Z",
          "successful": true
        },
        "last_successful_execution": {
          "timestamp": "2017-03-01T20:55:49.679Z",
          "successful": true
        }
      }
    },
    "version": 15,
    "last_checked": "2017-03-02T14:25:31.139Z",
    "last_met_condition": "2017-03-02T14:25:31.139Z"
  }
  */


}

exports.WatchStatus = WatchStatus;