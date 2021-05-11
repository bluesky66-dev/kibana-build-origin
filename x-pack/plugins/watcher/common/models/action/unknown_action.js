"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnknownAction = void 0;

var _base_action = require("./base_action");

var _constants = require("../../constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class UnknownAction extends _base_action.BaseAction {
  constructor(props, errors) {
    props.type = _constants.ACTION_TYPES.UNKNOWN;
    super(props, errors);
    this.actionJson = props.actionJson;
  } // To Kibana


  get downstreamJson() {
    const result = super.downstreamJson;
    Object.assign(result, {
      actionJson: this.actionJson
    });
    return result;
  } // From Kibana


  static fromDownstreamJson(json) {
    const props = super.getPropsFromDownstreamJson(json);
    Object.assign(props, {
      actionJson: json.actionJson
    });
    return new UnknownAction(props);
  } // To Elasticsearch


  get upstreamJson() {
    const result = super.upstreamJson;
    result[this.id] = this.actionJson;
    return result;
  } // From Elasticsearch


  static fromUpstreamJson(json) {
    const props = super.getPropsFromUpstreamJson(json);
    const {
      errors
    } = this.validateJson(json);
    Object.assign(props, {
      actionJson: json.actionJson
    });
    const action = new UnknownAction(props, errors);
    return {
      action,
      errors
    };
  }

  static validateJson(json) {
    const errors = [];

    if (!json.actionJson) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.unknownAction.actionJsonPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJson} property',
          values: {
            actionJson: 'actionJson'
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
  NOTE: The structure will actually vary considerably from type to type.
  {
    "logging": {
      ...
    }
  }
  */


}

exports.UnknownAction = UnknownAction;