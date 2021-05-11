"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MonitoringWatch = void 0;

var _lodash = require("lodash");

var _boom = require("@hapi/boom");

var _base_watch = require("./base_watch");

var _constants = require("../../../common/constants");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MonitoringWatch extends _base_watch.BaseWatch {
  // This constructor should not be used directly.
  // JsonWatch objects should be instantiated using the
  // fromUpstreamJson and fromDownstreamJson static methods
  constructor(props) {
    super(props);
    this.isSystemWatch = true;
  }

  get watchJson() {
    const result = (0, _lodash.merge)({}, super.watchJson);
    return result;
  }

  getVisualizeQuery() {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.monitoringWatch.getVisualizeQueryCalledBadRequestMessage', {
      defaultMessage: '{getVisualizeQuery} called for monitoring watch',
      values: {
        getVisualizeQuery: 'getVisualizeQuery'
      }
    }));
  }

  formatVisualizeData() {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.monitoringWatch.formatVisualizeDataCalledBadRequestMessage', {
      defaultMessage: '{formatVisualizeData} called for monitoring watch',
      values: {
        formatVisualizeData: 'formatVisualizeData'
      }
    }));
  } // To Elasticsearch


  get upstreamJson() {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.monitoringWatch.upstreamJsonCalledBadRequestMessage', {
      defaultMessage: '{upstreamJson} called for monitoring watch',
      values: {
        upstreamJson: 'upstreamJson'
      }
    }));
  } // To Kibana


  get downstreamJson() {
    const result = (0, _lodash.merge)({}, super.downstreamJson);
    return result;
  } // From Elasticsearch


  static fromUpstreamJson(json) {
    const props = (0, _lodash.merge)({}, super.getPropsFromUpstreamJson(json), {
      type: _constants.WATCH_TYPES.MONITORING
    });
    return new MonitoringWatch(props);
  } // From Kibana


  static fromDownstreamJson() {
    throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.monitoringWatch.fromDownstreamJsonCalledBadRequestMessage', {
      defaultMessage: '{fromDownstreamJson} called for monitoring watch',
      values: {
        fromDownstreamJson: 'fromDownstreamJson'
      }
    }));
  }

}

exports.MonitoringWatch = MonitoringWatch;