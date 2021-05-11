"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RequestFailure = void 0;

var _common = require("../../../../../kibana_utils/common");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Request Failure - When an entire multi request fails
 * @param {Error} err - the Error that came back
 * @param {Object} resp - optional HTTP response
 */
class RequestFailure extends _common.KbnError {
  constructor(err = null, resp) {
    super(`Request to Elasticsearch failed: ${JSON.stringify(resp || (err === null || err === void 0 ? void 0 : err.message))}`);

    _defineProperty(this, "resp", void 0);

    this.resp = resp;
  }

}

exports.RequestFailure = RequestFailure;