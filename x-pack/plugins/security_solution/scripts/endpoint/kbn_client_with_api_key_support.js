"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KbnClientWithApiKeySupport = void 0;

var _url = require("url");

var _test = require("@kbn/test");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

class KbnClientWithApiKeySupport extends _test.KbnClient {
  constructor(options) {
    super(options); // strip auth from url

    _defineProperty(this, "kibanaUrlNoAuth", void 0);

    const url = new _url.URL(this.resolveUrl('/'));
    url.username = '';
    url.password = '';
    this.kibanaUrlNoAuth = url;
  }
  /**
   * The fleet api to enroll and agent requires an api key when you make
   * the request, however KbnClient currently does not support sending
   * an api key with the request. This function allows you to send an
   * api key with a request.
   */


  requestWithApiKey(path, init) {
    return (0, _nodeFetch.default)(new _url.URL(path, this.kibanaUrlNoAuth), init);
  }

}

exports.KbnClientWithApiKeySupport = KbnClientWithApiKeySupport;