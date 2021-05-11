"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreadPoolSearchRejectionsAlert = void 0;

var _thread_pool_rejections_alert_base = require("./thread_pool_rejections_alert_base");

var _constants = require("../../common/constants");

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

class ThreadPoolSearchRejectionsAlert extends _thread_pool_rejections_alert_base.ThreadPoolRejectionsAlertBase {
  constructor(rawAlert) {
    super(rawAlert, ThreadPoolSearchRejectionsAlert.TYPE, ThreadPoolSearchRejectionsAlert.THREAD_POOL_TYPE, ThreadPoolSearchRejectionsAlert.LABEL, _thread_pool_rejections_alert_base.ThreadPoolRejectionsAlertBase.createActionVariables(ThreadPoolSearchRejectionsAlert.THREAD_POOL_TYPE));
  }

}

exports.ThreadPoolSearchRejectionsAlert = ThreadPoolSearchRejectionsAlert;

_defineProperty(ThreadPoolSearchRejectionsAlert, "TYPE", _constants.ALERT_THREAD_POOL_SEARCH_REJECTIONS);

_defineProperty(ThreadPoolSearchRejectionsAlert, "THREAD_POOL_TYPE", 'search');

_defineProperty(ThreadPoolSearchRejectionsAlert, "LABEL", _constants.ALERT_DETAILS[_constants.ALERT_THREAD_POOL_SEARCH_REJECTIONS].label);