"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestResponder = void 0;

var _i18n = require("@kbn/i18n");

var _types = require("./types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * An API to specify information about a specific request that will be logged.
 * Create a new instance to log a request using {@link RequestAdapter#start}.
 */
class RequestResponder {
  constructor(request, onChange) {
    _defineProperty(this, "request", void 0);

    _defineProperty(this, "onChange", void 0);

    this.request = request;
    this.onChange = onChange;
  }

  json(reqJson) {
    this.request.json = reqJson;
    this.onChange();
    return this;
  }

  stats(stats) {
    this.request.stats = { ...(this.request.stats || {}),
      ...stats
    };
    const startDate = new Date(this.request.startTime);
    this.request.stats.requestTimestamp = {
      label: _i18n.i18n.translate('inspector.reqTimestampKey', {
        defaultMessage: 'Request timestamp'
      }),
      value: startDate.toISOString(),
      description: _i18n.i18n.translate('inspector.reqTimestampDescription', {
        defaultMessage: 'Time when the start of the request has been logged'
      })
    };
    this.onChange();
    return this;
  }

  finish(status, response) {
    this.request.time = Date.now() - this.request.startTime;
    this.request.status = status;
    this.request.response = response;
    this.onChange();
  }

  ok(response) {
    this.finish(_types.RequestStatus.OK, response);
  }

  error(response) {
    this.finish(_types.RequestStatus.ERROR, response);
  }

}

exports.RequestResponder = RequestResponder;