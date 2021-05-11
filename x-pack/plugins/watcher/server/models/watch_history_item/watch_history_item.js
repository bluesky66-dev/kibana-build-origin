"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WatchHistoryItem = void 0;

var _boom = require("@hapi/boom");

var _get_moment = require("../../../common/lib/get_moment");

var _lodash = require("lodash");

var _watch_status = require("../watch_status");

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class WatchHistoryItem {
  constructor(props) {
    this.id = props.id;
    this.watchId = props.watchId;
    this.watchHistoryItemJson = props.watchHistoryItemJson;
    this.includeDetails = Boolean(props.includeDetails);
    this.details = (0, _lodash.cloneDeep)(this.watchHistoryItemJson);
    this.startTime = (0, _get_moment.getMoment)((0, _lodash.get)(this.watchHistoryItemJson, 'result.execution_time'));
    const watchStatusJson = (0, _lodash.get)(this.watchHistoryItemJson, 'status');
    const state = (0, _lodash.get)(this.watchHistoryItemJson, 'state');
    this.watchStatus = _watch_status.WatchStatus.fromUpstreamJson({
      id: this.watchId,
      watchStatusJson,
      state
    });
  }

  get downstreamJson() {
    return {
      id: this.id,
      watchId: this.watchId,
      details: this.includeDetails ? this.details : null,
      startTime: this.startTime.toISOString(),
      watchStatus: this.watchStatus.downstreamJson
    };
  } // generate object from elasticsearch response


  static fromUpstreamJson(json, opts) {
    if (!json.id) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchHistoryItem.idPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain an {id} property',
        values: {
          id: 'id'
        }
      }));
    }

    if (!json.watchId) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchHistoryItem.watchIdPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {watchId} property',
        values: {
          watchId: 'watchId'
        }
      }));
    }

    if (!json.watchHistoryItemJson) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watchHistoryItem.watchHistoryItemJsonPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {watchHistoryItemJson} property',
        values: {
          watchHistoryItemJson: 'watchHistoryItemJson'
        }
      }));
    }

    const props = { ...json,
      ...opts
    };
    return new WatchHistoryItem(props);
  }

}

exports.WatchHistoryItem = WatchHistoryItem;