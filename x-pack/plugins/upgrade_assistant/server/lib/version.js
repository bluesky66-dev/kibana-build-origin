"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.versionService = exports.Version = void 0;

var _semver = _interopRequireDefault(require("semver/classes/semver"));

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

class Version {
  constructor() {
    _defineProperty(this, "version", void 0);
  }

  setup(version) {
    this.version = new _semver.default(version);
  }

  getCurrentVersion() {
    return this.version;
  }

  getMajorVersion() {
    var _this$version;

    return (_this$version = this.version) === null || _this$version === void 0 ? void 0 : _this$version.major;
  }

  getNextMajorVersion() {
    var _this$version2;

    return ((_this$version2 = this.version) === null || _this$version2 === void 0 ? void 0 : _this$version2.major) + 1;
  }

  getPrevMajorVersion() {
    var _this$version3;

    return ((_this$version3 = this.version) === null || _this$version3 === void 0 ? void 0 : _this$version3.major) - 1;
  }

}

exports.Version = Version;
const versionService = new Version();
exports.versionService = versionService;