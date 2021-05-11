"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PagerDutyAction = void 0;

var _base_action = require("./base_action");

var _constants = require("../../constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class PagerDutyAction extends _base_action.BaseAction {
  constructor(props, errors) {
    props.type = _constants.ACTION_TYPES.PAGERDUTY;
    super(props, errors);
    this.description = props.description;
  } // To Kibana


  get downstreamJson() {
    const result = super.downstreamJson;
    Object.assign(result, {
      description: this.description
    });
    return result;
  } // From Kibana


  static fromDownstreamJson(json) {
    const props = super.getPropsFromDownstreamJson(json);
    const {
      errors
    } = this.validateJson(json);
    Object.assign(props, {
      description: json.description
    });
    const action = new PagerDutyAction(props, errors);
    return {
      action,
      errors
    };
  } // To Elasticsearch


  get upstreamJson() {
    const result = super.upstreamJson;
    result[this.id] = {
      pagerduty: {
        description: this.description
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
      description: json.actionJson.pagerduty.description
    });
    const action = new PagerDutyAction(props, errors);
    return {
      action,
      errors
    };
  }

  static validateJson(json) {
    const errors = [];

    if (!json.pagerduty) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.pagerDutyAction.actionJsonPagerDutyPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonPagerDuty} property',
          values: {
            actionJsonPagerDuty: 'actionJson.pagerduty'
          }
        })
      });
    }

    if (json.pagerduty && !json.pagerduty.description) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.pagerDutyAction.actionJsonPagerDutyDescriptionPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonPagerDutyText} property',
          values: {
            actionJsonPagerDutyText: 'actionJson.pagerduty.description'
          }
        })
      });
    }

    return {
      errors: errors.length ? errors : null
    };
  }

}

exports.PagerDutyAction = PagerDutyAction;