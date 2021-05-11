"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggingAction = void 0;

var _base_action = require("./base_action");

var _constants = require("../../constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class LoggingAction extends _base_action.BaseAction {
  constructor(props, errors) {
    props.type = _constants.ACTION_TYPES.LOGGING;
    super(props, errors);
    this.text = props.text;
  } // To Kibana


  get downstreamJson() {
    const result = super.downstreamJson;
    Object.assign(result, {
      text: this.text
    });
    return result;
  } // From Kibana


  static fromDownstreamJson(json) {
    const props = super.getPropsFromDownstreamJson(json);
    const {
      errors
    } = this.validateJson(json);
    Object.assign(props, {
      text: json.text
    });
    const action = new LoggingAction(props, errors);
    return {
      action,
      errors
    };
  } // To Elasticsearch


  get upstreamJson() {
    const result = super.upstreamJson;
    result[this.id] = {
      logging: {
        text: this.text
      }
    };
    return result;
  } // From Elasticsearch


  static fromUpstreamJson(json) {
    const props = super.getPropsFromUpstreamJson(json);
    const {
      errors
    } = this.validateJson(json.actionJson);
    Object.assign(props, {
      text: json.actionJson.logging.text
    });
    const action = new LoggingAction(props, errors);
    return {
      action,
      errors
    };
  }

  static validateJson(json) {
    const errors = [];

    if (!json.logging) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.loggingAction.actionJsonLoggingPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonLogging} property',
          values: {
            actionJsonLogging: 'actionJson.logging'
          }
        })
      });
    }

    if (json.logging && !json.logging.text) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.loggingAction.actionJsonLoggingTextPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonLoggingText} property',
          values: {
            actionJsonLoggingText: 'actionJson.logging.text'
          }
        })
      });
    }

    return {
      errors: errors.length ? errors : null
    };
  }
  /*
  json.actionJson should have the following structure:
  {
    "logging" : {
      "text" : "executed at {{ctx.execution_time}}",
      ["category" : "xpack.watcher.actions.logging",]
      ["level" : "info"]
    }
  }
  */


}

exports.LoggingAction = LoggingAction;