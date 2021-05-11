"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TimelineObject = void 0;

var _timeline = require("../../../../../common/types/timeline");

var _create_timelines = require("./create_timelines");

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

class TimelineObject {
  constructor({
    id = null,
    type = _timeline.TimelineType.default,
    version = null,
    frameworkRequest
  }) {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "version", void 0);

    _defineProperty(this, "frameworkRequest", void 0);

    _defineProperty(this, "data", void 0);

    this.id = id;
    this.type = type;
    this.version = version;
    this.frameworkRequest = frameworkRequest;
    this.data = null;
  }

  async getTimeline() {
    this.data = this.id != null ? this.type === _timeline.TimelineType.template ? await (0, _create_timelines.getTemplateTimeline)(this.frameworkRequest, this.id) : await (0, _create_timelines.getTimeline)(this.frameworkRequest, this.id) : null;
    return this.data;
  }

  get getData() {
    return this.data;
  }

  get isImmutable() {
    var _this$data;

    return ((_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.status) === _timeline.TimelineStatus.immutable;
  }

  get isExists() {
    return this.data != null;
  }

  get isUpdatable() {
    return this.isExists && !this.isImmutable;
  }

  get isCreatable() {
    return !this.isExists;
  }

  get isUpdatableViaImport() {
    return this.type === _timeline.TimelineType.template && this.isExists;
  }

  get getVersion() {
    return this.version;
  }

  get getId() {
    return this.id;
  }

}

exports.TimelineObject = TimelineObject;