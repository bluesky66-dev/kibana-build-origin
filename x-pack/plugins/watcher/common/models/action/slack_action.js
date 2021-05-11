"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlackAction = void 0;

var _base_action = require("./base_action");

var _constants = require("../../constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SlackAction extends _base_action.BaseAction {
  constructor(props, errors) {
    props.type = _constants.ACTION_TYPES.SLACK;
    super(props, errors);
    this.to = props.to;
    this.text = props.text;
  } // To Kibana


  get downstreamJson() {
    const result = super.downstreamJson;
    Object.assign(result, {
      to: this.to,
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
      to: json.to,
      text: json.text
    });
    const action = new SlackAction(props, errors);
    return {
      action,
      errors
    };
  } // To Elasticsearch


  get upstreamJson() {
    const result = super.upstreamJson;
    result[this.id] = {
      slack: {
        message: {
          to: this.to,
          text: this.text
        }
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
      to: json.actionJson.slack.message.to,
      text: json.actionJson.slack.message.text
    });
    const action = new SlackAction(props, errors);
    return {
      action,
      errors
    };
  }

  static validateJson(json) {
    const errors = [];

    if (!json.slack) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.slackAction.actionJsonSlackPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonSlack} property',
          values: {
            actionJsonSlack: 'actionJson.slack'
          }
        })
      });
    }

    if (json.slack && !json.slack.message) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.slackAction.actionJsonSlackMessagePropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonSlackMessage} property',
          values: {
            actionJsonSlackMessage: 'actionJson.slack.message'
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
    "slack" : {
      "message" : {
        "to" : "#channel_name, @user"
        "text" : "executed at {{ctx.execution_time}}",
      }
    }
  }
  */


}

exports.SlackAction = SlackAction;