"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppClientFactory = void 0;

var _client = require("./client");

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

class AppClientFactory {
  constructor() {
    _defineProperty(this, "getSpaceId", void 0);

    _defineProperty(this, "config", void 0);
  }

  setup({
    getSpaceId,
    config
  }) {
    this.getSpaceId = getSpaceId;
    this.config = config;
  }

  create(request) {
    var _this$getSpaceId, _this$getSpaceId2;

    if (this.config == null) {
      throw new Error('Cannot create AppClient as config is not present. Did you forget to call setup()?');
    }

    const spaceId = (_this$getSpaceId = (_this$getSpaceId2 = this.getSpaceId) === null || _this$getSpaceId2 === void 0 ? void 0 : _this$getSpaceId2.call(this, request)) !== null && _this$getSpaceId !== void 0 ? _this$getSpaceId : 'default';
    return new _client.AppClient(spaceId, this.config);
  }

}

exports.AppClientFactory = AppClientFactory;