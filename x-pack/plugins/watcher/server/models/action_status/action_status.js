"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionStatus = void 0;

var _lodash = require("lodash");

var _boom = require("@hapi/boom");

var _get_moment = require("../../../common/lib/get_moment");

var _constants = require("../../../common/constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ActionStatus {
  constructor(props) {
    this.id = props.id;
    this.actionStatusJson = props.actionStatusJson;
    this.errors = props.errors;
    this.lastCheckedRawFormat = props.lastCheckedRawFormat;
    this.lastExecutionRawFormat = (0, _lodash.get)(this.actionStatusJson, 'last_execution.timestamp');
    this.lastAcknowledged = (0, _get_moment.getMoment)((0, _lodash.get)(this.actionStatusJson, 'ack.timestamp'));
    this.lastExecution = (0, _get_moment.getMoment)((0, _lodash.get)(this.actionStatusJson, 'last_execution.timestamp'));
    this.lastExecutionSuccessful = (0, _lodash.get)(this.actionStatusJson, 'last_execution.successful');
    this.lastExecutionReason = (0, _lodash.get)(this.actionStatusJson, 'last_execution.reason');
    this.lastThrottled = (0, _get_moment.getMoment)((0, _lodash.get)(this.actionStatusJson, 'last_throttle.timestamp'));
    this.lastSuccessfulExecution = (0, _get_moment.getMoment)((0, _lodash.get)(this.actionStatusJson, 'last_successful_execution.timestamp'));
  }

  get state() {
    const actionStatusJson = this.actionStatusJson;
    const ackState = actionStatusJson.ack.state;

    if (this.lastExecutionSuccessful === false && this.lastCheckedRawFormat === this.lastExecutionRawFormat) {
      return _constants.ACTION_STATES.ERROR;
    }

    if (this.errors) {
      return _constants.ACTION_STATES.CONFIG_ERROR;
    }

    if (ackState === 'awaits_successful_execution') {
      return _constants.ACTION_STATES.OK;
    }

    if (ackState === 'acked' && this.lastAcknowledged >= this.lastExecution) {
      return _constants.ACTION_STATES.ACKNOWLEDGED;
    } // A user could potentially land in this state if running on multiple nodes and timing is off


    if (ackState === 'acked' && this.lastAcknowledged < this.lastExecution) {
      return _constants.ACTION_STATES.ERROR;
    }

    if (ackState === 'ackable' && this.lastThrottled >= this.lastExecution) {
      return _constants.ACTION_STATES.THROTTLED;
    }

    if (ackState === 'ackable' && this.lastSuccessfulExecution >= this.lastExecution) {
      return _constants.ACTION_STATES.FIRING;
    }

    if (ackState === 'ackable' && this.lastSuccessfulExecution < this.lastExecution) {
      return _constants.ACTION_STATES.ERROR;
    } // At this point, we cannot determine the action status so mark it as "unknown".
    // We should never get to this point in the code. If we do, it means we are
    // missing an action status and the logic to determine it.


    return _constants.ACTION_STATES.UNKNOWN;
  }

  get isAckable() {
    if (this.state === _constants.ACTION_STATES.THROTTLED || this.state === _constants.ACTION_STATES.FIRING) {
      return true;
    }

    return false;
  } // generate object to send to kibana


  get downstreamJson() {
    const json = {
      id: this.id,
      state: this.state,
      isAckable: this.isAckable,
      lastAcknowledged: this.lastAcknowledged,
      lastThrottled: this.lastThrottled,
      lastExecution: this.lastExecution,
      lastExecutionSuccessful: this.lastExecutionSuccessful,
      lastExecutionReason: this.lastExecutionReason,
      lastSuccessfulExecution: this.lastSuccessfulExecution
    };
    return json;
  } // generate object from elasticsearch response


  static fromUpstreamJson(json) {
    const missingPropertyError = missingProperty => _i18n.i18n.translate('xpack.watcher.models.actionStatus.actionStatusJsonPropertyMissingBadRequestMessage', {
      defaultMessage: 'JSON argument must contain an "{missingProperty}" property',
      values: {
        missingProperty
      }
    });

    if (!json.id) {
      throw (0, _boom.badRequest)(missingPropertyError('id'));
    }

    if (!json.actionStatusJson) {
      throw (0, _boom.badRequest)(missingPropertyError('actionStatusJson'));
    }

    return new ActionStatus(json);
  }
  /*
  json.actionStatusJson should have the following structure:
  {
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
  */


}

exports.ActionStatus = ActionStatus;