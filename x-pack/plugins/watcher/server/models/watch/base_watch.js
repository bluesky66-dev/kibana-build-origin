"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseWatch = void 0;

var _lodash = require("lodash");

var _boom = require("@hapi/boom");

var _action = require("../../../common/models/action");

var _watch_status = require("../watch_status");

var _i18n = require("@kbn/i18n");

var _watch_errors = require("../watch_errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class BaseWatch {
  // This constructor should not be used directly.
  // JsonWatch objects should be instantiated using the
  // fromUpstreamJson and fromDownstreamJson static methods
  constructor(props) {
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.isSystemWatch = false;
    this.watchStatus = props.watchStatus;
    this.watchErrors = props.watchErrors;
    this.actions = props.actions;
  }

  get watchJson() {
    const result = {
      metadata: {
        xpack: {
          type: this.type
        }
      }
    };

    if (this.name) {
      result.metadata.name = this.name;
    }

    return result;
  }

  getVisualizeQuery() {
    return {};
  }

  formatVisualizeData() {
    return [];
  } // to Kibana


  get downstreamJson() {
    const json = {
      id: this.id,
      name: this.name,
      type: this.type,
      isSystemWatch: this.isSystemWatch,
      watchStatus: this.watchStatus ? this.watchStatus.downstreamJson : undefined,
      watchErrors: this.watchErrors ? this.watchErrors.downstreamJson : undefined,
      actions: (0, _lodash.map)(this.actions, action => action.downstreamJson)
    };
    return json;
  } // from Kibana


  static getPropsFromDownstreamJson(json) {
    const actions = (0, _lodash.map)(json.actions, action => {
      return _action.Action.fromDownstreamJson(action);
    });
    return {
      id: json.id,
      name: json.name,
      actions
    };
  } // from Elasticsearch


  static getPropsFromUpstreamJson(json, options) {
    if (!json.id) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.baseWatch.idPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain an {id} property',
        values: {
          id: 'id'
        }
      }));
    }

    if (!json.watchJson) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.baseWatch.watchJsonPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {watchJson} property',
        values: {
          watchJson: 'watchJson'
        }
      }));
    }

    if (!json.watchStatusJson) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.baseWatch.watchStatusJsonPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {watchStatusJson} property',
        values: {
          watchStatusJson: 'watchStatusJson'
        }
      }));
    }

    const id = json.id;
    const watchJson = (0, _lodash.pick)(json.watchJson, ['trigger', 'input', 'condition', 'actions', 'metadata', 'transform', 'throttle_period', 'throttle_period_in_millis']);
    const watchStatusJson = json.watchStatusJson;
    const name = (0, _lodash.get)(watchJson, 'metadata.name');
    const actionsJson = (0, _lodash.get)(watchJson, 'actions', {});
    const actions = (0, _lodash.map)(actionsJson, (actionJson, actionId) => {
      return _action.Action.fromUpstreamJson({
        id: actionId,
        actionJson
      }, options);
    });

    const watchErrors = _watch_errors.WatchErrors.fromUpstreamJson(this.getWatchErrors(actions));

    const watchStatus = _watch_status.WatchStatus.fromUpstreamJson({
      id,
      watchStatusJson,
      watchErrors
    });

    return {
      id,
      name,
      watchJson,
      watchStatus,
      watchErrors,
      actions
    };
  }
  /**
   * Retrieve all the errors in the watch
   *
   * @param {array} actions - Watch actions
   */


  static getWatchErrors(actions) {
    const watchErrors = {}; // Check for errors in Actions

    const actionsErrors = actions.reduce((acc, action) => {
      if (action.errors) {
        acc[action.id] = action.errors;
      }

      return acc;
    }, {});

    if (Object.keys(actionsErrors).length) {
      watchErrors.actions = actionsErrors;
    }

    return watchErrors;
  }

}

exports.BaseWatch = BaseWatch;