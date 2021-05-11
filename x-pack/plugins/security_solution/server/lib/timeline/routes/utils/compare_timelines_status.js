"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CompareTimelinesStatus = void 0;

var _fp = require("lodash/fp");

var _timeline = require("../../../../../common/types/timeline");

var _common = require("./common");

var _timeline_object = require("./timeline_object");

var _failure_cases = require("./failure_cases");

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

class CompareTimelinesStatus {
  constructor({
    status = _timeline.TimelineStatus.active,
    title,
    timelineType = _timeline.TimelineType.default,
    timelineInput,
    templateTimelineInput,
    frameworkRequest
  }) {
    var _timelineInput$type, _templateTimelineInpu;

    _defineProperty(this, "timelineObject", void 0);

    _defineProperty(this, "templateTimelineObject", void 0);

    _defineProperty(this, "timelineType", void 0);

    _defineProperty(this, "title", void 0);

    _defineProperty(this, "status", void 0);

    this.timelineObject = new _timeline_object.TimelineObject({
      id: timelineInput.id,
      type: (_timelineInput$type = timelineInput.type) !== null && _timelineInput$type !== void 0 ? _timelineInput$type : _timeline.TimelineType.default,
      version: timelineInput.version,
      frameworkRequest
    });
    this.templateTimelineObject = new _timeline_object.TimelineObject({
      id: templateTimelineInput.id,
      type: (_templateTimelineInpu = templateTimelineInput.type) !== null && _templateTimelineInpu !== void 0 ? _templateTimelineInpu : _timeline.TimelineType.template,
      version: templateTimelineInput.version,
      frameworkRequest
    });
    this.timelineType = timelineType !== null && timelineType !== void 0 ? timelineType : _timeline.TimelineType.default;
    this.title = title !== null && title !== void 0 ? title : null;
    this.status = status !== null && status !== void 0 ? status : _timeline.TimelineStatus.active;
  }

  get isCreatable() {
    var _this$timelineObject$;

    const noExistingTimeline = this.timelineObject.isCreatable && !this.isHandlingTemplateTimeline;
    const templateCreatable = this.isHandlingTemplateTimeline && this.templateTimelineObject.isCreatable;
    const noExistingTimelineOrTemplate = templateCreatable && this.timelineObject.isCreatable; // From Line 87-91 is the condition for creating a template via import without given a templateTimelineId or templateTimelineVersion,
    // but keep the existing savedObjectId and version there.
    // Therefore even the timeline exists, we still allow it to create a new timeline template by assigning a templateTimelineId and templateTimelineVersion.
    // https://github.com/elastic/kibana/pull/67496#discussion_r454337222
    // Line 90-91 means that we want to make sure the existing timeline retrieved by savedObjectId is atemplate.
    // If it is not a template, we show an error this timeline is already exist instead.

    const retriveTemplateViaSavedObjectId = templateCreatable && !this.timelineObject.isCreatable && ((_this$timelineObject$ = this.timelineObject.getData) === null || _this$timelineObject$ === void 0 ? void 0 : _this$timelineObject$.timelineType) === this.timelineType;
    return this.isTitleValid && !this.isSavedObjectVersionConflict && (noExistingTimeline || noExistingTimelineOrTemplate || retriveTemplateViaSavedObjectId);
  }

  get isCreatableViaImport() {
    return this.isCreatedStatusValid && (this.isCreatable && !this.isHandlingTemplateTimeline || this.isCreatable && this.isHandlingTemplateTimeline && this.isTemplateVersionValid);
  }

  get isCreatedStatusValid() {
    var _obj$getData;

    const obj = this.isHandlingTemplateTimeline ? this.templateTimelineObject : this.timelineObject;
    return obj.isExists ? this.status === ((_obj$getData = obj.getData) === null || _obj$getData === void 0 ? void 0 : _obj$getData.status) && this.status !== _timeline.TimelineStatus.draft : this.status !== _timeline.TimelineStatus.draft;
  }

  get isUpdatable() {
    return this.isTitleValid && !this.isSavedObjectVersionConflict && (this.timelineObject.isUpdatable && !this.isHandlingTemplateTimeline || this.templateTimelineObject.isUpdatable && this.isHandlingTemplateTimeline);
  }

  get isTimelineTypeValid() {
    var _obj$getData$timeline, _obj$getData2;

    const obj = this.isHandlingTemplateTimeline ? this.templateTimelineObject : this.timelineObject;
    const existintTimelineType = (_obj$getData$timeline = (_obj$getData2 = obj.getData) === null || _obj$getData2 === void 0 ? void 0 : _obj$getData2.timelineType) !== null && _obj$getData$timeline !== void 0 ? _obj$getData$timeline : _timeline.TimelineType.default;
    return obj.isExists ? this.timelineType === existintTimelineType : true;
  }

  get isUpdatableViaImport() {
    return this.isTimelineTypeValid && this.isTitleValid && this.isUpdatedTimelineStatusValid && (this.timelineObject.isUpdatableViaImport || this.templateTimelineObject.isUpdatableViaImport && this.isTemplateVersionValid && this.isHandlingTemplateTimeline);
  }

  get isTitleValid() {
    return this.status !== _timeline.TimelineStatus.draft && !(0, _fp.isEmpty)(this.title) || this.status === _timeline.TimelineStatus.draft;
  }

  getFailureChecker(action) {
    if (action === _common.TimelineStatusActions.create) {
      return _failure_cases.checkIsCreateFailureCases;
    } else if (action === _common.TimelineStatusActions.createViaImport) {
      return _failure_cases.checkIsCreateViaImportFailureCases;
    } else if (action === _common.TimelineStatusActions.update) {
      return _failure_cases.checkIsUpdateFailureCases;
    } else {
      return _failure_cases.checkIsUpdateViaImportFailureCases;
    }
  }

  checkIsFailureCases(action) {
    var _this$timelineObject$2, _this$timelineObject$3;

    const failureChecker = this.getFailureChecker(action);
    const version = this.templateTimelineObject.getVersion;
    const commonError = (0, _failure_cases.commonFailureChecker)(this.status, this.title);

    if (commonError != null) {
      return commonError;
    }

    const msg = failureChecker(this.isHandlingTemplateTimeline, this.status, this.timelineType, (_this$timelineObject$2 = (_this$timelineObject$3 = this.timelineObject.getVersion) === null || _this$timelineObject$3 === void 0 ? void 0 : _this$timelineObject$3.toString()) !== null && _this$timelineObject$2 !== void 0 ? _this$timelineObject$2 : null, version != null && typeof version === 'string' ? parseInt(version, 10) : version, this.templateTimelineObject.getId, this.timelineObject.getData, this.templateTimelineObject.getData);
    return msg;
  }

  get templateTimelineInput() {
    return this.templateTimelineObject;
  }

  get timelineInput() {
    return this.timelineObject;
  }

  getTimelines() {
    return Promise.all([this.timelineObject.getTimeline(), this.templateTimelineObject.getTimeline()]);
  }

  get isHandlingTemplateTimeline() {
    return this.timelineType === _timeline.TimelineType.template;
  }

  get isSavedObjectVersionConflict() {
    var _this$timelineObject, _this$timelineObject2, _this$timelineObject3;

    const version = (_this$timelineObject = this.timelineObject) === null || _this$timelineObject === void 0 ? void 0 : _this$timelineObject.getVersion;
    const existingVersion = (_this$timelineObject2 = this.timelineObject) === null || _this$timelineObject2 === void 0 ? void 0 : (_this$timelineObject3 = _this$timelineObject2.data) === null || _this$timelineObject3 === void 0 ? void 0 : _this$timelineObject3.version;

    if (version != null && this.timelineObject.isExists) {
      return version !== existingVersion;
    } else if (this.timelineObject.isExists && version == null) {
      return true;
    }

    return false;
  }

  get isTemplateVersionConflict() {
    var _this$templateTimelin, _this$templateTimelin2, _this$templateTimelin3;

    const templateTimelineVersion = (_this$templateTimelin = this.templateTimelineObject) === null || _this$templateTimelin === void 0 ? void 0 : _this$templateTimelin.getVersion;
    const existingTemplateTimelineVersion = (_this$templateTimelin2 = this.templateTimelineObject) === null || _this$templateTimelin2 === void 0 ? void 0 : (_this$templateTimelin3 = _this$templateTimelin2.data) === null || _this$templateTimelin3 === void 0 ? void 0 : _this$templateTimelin3.templateTimelineVersion;

    if (templateTimelineVersion != null && this.templateTimelineObject.isExists && existingTemplateTimelineVersion != null) {
      return templateTimelineVersion <= existingTemplateTimelineVersion;
    } else if (this.templateTimelineObject.isExists && templateTimelineVersion == null) {
      return true;
    }

    return false;
  }

  get isTemplateVersionValid() {
    var _this$templateTimelin4;

    const templateTimelineVersion = (_this$templateTimelin4 = this.templateTimelineObject) === null || _this$templateTimelin4 === void 0 ? void 0 : _this$templateTimelin4.getVersion;
    return templateTimelineVersion == null || (0, _fp.isInteger)(templateTimelineVersion) && !this.isTemplateVersionConflict;
  }

  get isUpdatedTimelineStatusValid() {
    var _this$templateTimelin5, _this$timelineInput$d;

    const status = this.status;
    const existingStatus = this.isHandlingTemplateTimeline ? (_this$templateTimelin5 = this.templateTimelineInput.data) === null || _this$templateTimelin5 === void 0 ? void 0 : _this$templateTimelin5.status : (_this$timelineInput$d = this.timelineInput.data) === null || _this$timelineInput$d === void 0 ? void 0 : _this$timelineInput$d.status;
    return (existingStatus == null || existingStatus === _timeline.TimelineStatus.active) && (status == null || status === _timeline.TimelineStatus.active) || existingStatus != null && status === existingStatus;
  }

  get timelineId() {
    var _this$timelineInput$d2, _this$timelineInput$d3;

    if (this.isHandlingTemplateTimeline) {
      var _this$templateTimelin6, _this$templateTimelin7;

      return (_this$templateTimelin6 = (_this$templateTimelin7 = this.templateTimelineInput.data) === null || _this$templateTimelin7 === void 0 ? void 0 : _this$templateTimelin7.savedObjectId) !== null && _this$templateTimelin6 !== void 0 ? _this$templateTimelin6 : this.templateTimelineInput.getId;
    }

    return (_this$timelineInput$d2 = (_this$timelineInput$d3 = this.timelineInput.data) === null || _this$timelineInput$d3 === void 0 ? void 0 : _this$timelineInput$d3.savedObjectId) !== null && _this$timelineInput$d2 !== void 0 ? _this$timelineInput$d2 : this.timelineInput.getId;
  }

  get timelineVersion() {
    var _this$templateTimelin8, _this$templateTimelin9, _this$timelineInput$d4, _this$timelineInput$d5;

    const version = this.isHandlingTemplateTimeline ? (_this$templateTimelin8 = (_this$templateTimelin9 = this.templateTimelineInput.data) === null || _this$templateTimelin9 === void 0 ? void 0 : _this$templateTimelin9.version) !== null && _this$templateTimelin8 !== void 0 ? _this$templateTimelin8 : this.timelineInput.getVersion : (_this$timelineInput$d4 = (_this$timelineInput$d5 = this.timelineInput.data) === null || _this$timelineInput$d5 === void 0 ? void 0 : _this$timelineInput$d5.version) !== null && _this$timelineInput$d4 !== void 0 ? _this$timelineInput$d4 : this.timelineInput.getVersion;
    return version != null ? version.toString() : null;
  }

  async init() {
    await this.getTimelines();
  }

}

exports.CompareTimelinesStatus = CompareTimelinesStatus;