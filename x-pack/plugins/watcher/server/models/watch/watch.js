"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Watch = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _boom = require("@hapi/boom");

var _constants = require("../../../common/constants");

var _json_watch = require("./json_watch");

var _monitoring_watch = require("./monitoring_watch");

var _threshold_watch = require("./threshold_watch");

var _get_watch_type = require("./lib/get_watch_type");

var _i18n = require("@kbn/i18n");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

const WatchTypes = {};
(0, _saferLodashSet.set)(WatchTypes, _constants.WATCH_TYPES.JSON, _json_watch.JsonWatch);
(0, _saferLodashSet.set)(WatchTypes, _constants.WATCH_TYPES.MONITORING, _monitoring_watch.MonitoringWatch);
(0, _saferLodashSet.set)(WatchTypes, _constants.WATCH_TYPES.THRESHOLD, _threshold_watch.ThresholdWatch);

class Watch {
  // from Kibana
  static fromDownstreamJson(json) {
    if (!json.type) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watch.typePropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain an {type} property',
        values: {
          type: 'type'
        }
      }));
    }

    const WatchType = WatchTypes[json.type];

    if (!WatchType) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watch.unknownWatchTypeLoadingAttemptBadRequestMessage', {
        defaultMessage: 'Attempted to load unknown type {jsonType}',
        values: {
          jsonType: json.type
        }
      }));
    }

    return WatchType.fromDownstreamJson(json);
  } // from Elasticsearch


  static fromUpstreamJson(json, options) {
    if (!json.watchJson) {
      throw (0, _boom.badRequest)(_i18n.i18n.translate('xpack.watcher.models.watch.watchJsonPropertyMissingBadRequestMessage', {
        defaultMessage: 'JSON argument must contain a {watchJson} property',
        values: {
          watchJson: 'watchJson'
        }
      }));
    }

    const type = (0, _get_watch_type.getWatchType)(json.watchJson);
    const WatchType = WatchTypes[type];
    return WatchType.fromUpstreamJson(json, options);
  }

}

exports.Watch = Watch;

_defineProperty(Watch, "getWatchTypes", () => {
  return WatchTypes;
});