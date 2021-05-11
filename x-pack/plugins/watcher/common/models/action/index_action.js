"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IndexAction = void 0;

var _base_action = require("./base_action");

var _constants = require("../../constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class IndexAction extends _base_action.BaseAction {
  constructor(props, errors) {
    props.type = _constants.ACTION_TYPES.INDEX;
    super(props, errors);
    this.index = props.index;
  } // To Kibana


  get downstreamJson() {
    const result = super.downstreamJson;
    Object.assign(result, {
      index: this.index
    });
    return result;
  } // From Kibana


  static fromDownstreamJson(json) {
    const props = super.getPropsFromDownstreamJson(json);
    const {
      errors
    } = this.validateJson(json);
    Object.assign(props, {
      index: json.index
    });
    const action = new IndexAction(props, errors);
    return {
      action,
      errors
    };
  } // To Elasticsearch


  get upstreamJson() {
    const result = super.upstreamJson;
    result[this.id] = {
      index: this.index
    };
    return result;
  } // From Elasticsearch


  static fromUpstreamJson(json) {
    const props = super.getPropsFromUpstreamJson(json);
    const {
      errors
    } = this.validateJson(json.actionJson);
    Object.assign(props, {
      index: json.actionJson.index.index
    });
    const action = new IndexAction(props, errors);
    return {
      action,
      errors
    };
  }

  static validateJson(json) {
    const errors = [];

    if (!json.index) {
      errors.push({
        code: _constants.ERROR_CODES.ERR_PROP_MISSING,
        message: _i18n.i18n.translate('xpack.watcher.models.indexAction.actionJsonIndexPropertyMissingBadRequestMessage', {
          defaultMessage: 'JSON argument must contain an {actionJsonIndex} property',
          values: {
            actionJsonIndex: 'actionJson.index'
          }
        })
      });
    }

    return {
      errors: errors.length ? errors : null
    };
  }

}

exports.IndexAction = IndexAction;