"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThreadPoolWriteRejectionsAlert = void 0;

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

class ThreadPoolWriteRejectionsAlert extends _thread_pool_rejections_alert_base.ThreadPoolRejectionsAlertBase {
  constructor(rawAlert) {
    super(rawAlert, ThreadPoolWriteRejectionsAlert.TYPE, ThreadPoolWriteRejectionsAlert.THREAD_POOL_TYPE, ThreadPoolWriteRejectionsAlert.LABEL, _thread_pool_rejections_alert_base.ThreadPoolRejectionsAlertBase.createActionVariables(ThreadPoolWriteRejectionsAlert.THREAD_POOL_TYPE));
  }

}

exports.ThreadPoolWriteRejectionsAlert = ThreadPoolWriteRejectionsAlert;

_defineProperty(ThreadPoolWriteRejectionsAlert, "TYPE", _constants.ALERT_THREAD_POOL_WRITE_REJECTIONS);

_defineProperty(ThreadPoolWriteRejectionsAlert, "THREAD_POOL_TYPE", 'write');

_defineProperty(ThreadPoolWriteRejectionsAlert, "LABEL", _constants.ALERT_DETAILS[_constants.ALERT_THREAD_POOL_WRITE_REJECTIONS].label);