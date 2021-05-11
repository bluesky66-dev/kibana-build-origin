"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EcsEventType = exports.EcsEventCategory = exports.EcsEventKind = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Typings for some ECS fields which core uses internally.
 * These are not a complete set of ECS typings and should not
 * be used externally; the only types included here are ones
 * currently used in core.
 *
 * @internal
 */

/** @internal */
let EcsEventKind;
/** @internal */

exports.EcsEventKind = EcsEventKind;

(function (EcsEventKind) {
  EcsEventKind["ALERT"] = "alert";
  EcsEventKind["EVENT"] = "event";
  EcsEventKind["METRIC"] = "metric";
  EcsEventKind["STATE"] = "state";
  EcsEventKind["PIPELINE_ERROR"] = "pipeline_error";
  EcsEventKind["SIGNAL"] = "signal";
})(EcsEventKind || (exports.EcsEventKind = EcsEventKind = {}));

let EcsEventCategory;
/** @internal */

exports.EcsEventCategory = EcsEventCategory;

(function (EcsEventCategory) {
  EcsEventCategory["AUTHENTICATION"] = "authentication";
  EcsEventCategory["CONFIGURATION"] = "configuration";
  EcsEventCategory["DATABASE"] = "database";
  EcsEventCategory["DRIVER"] = "driver";
  EcsEventCategory["FILE"] = "file";
  EcsEventCategory["HOST"] = "host";
  EcsEventCategory["IAM"] = "iam";
  EcsEventCategory["INTRUSION_DETECTION"] = "intrusion_detection";
  EcsEventCategory["MALWARE"] = "malware";
  EcsEventCategory["NETWORK"] = "network";
  EcsEventCategory["PACKAGE"] = "package";
  EcsEventCategory["PROCESS"] = "process";
  EcsEventCategory["WEB"] = "web";
})(EcsEventCategory || (exports.EcsEventCategory = EcsEventCategory = {}));

let EcsEventType;
exports.EcsEventType = EcsEventType;

(function (EcsEventType) {
  EcsEventType["ACCESS"] = "access";
  EcsEventType["ADMIN"] = "admin";
  EcsEventType["ALLOWED"] = "allowed";
  EcsEventType["CHANGE"] = "change";
  EcsEventType["CONNECTION"] = "connection";
  EcsEventType["CREATION"] = "creation";
  EcsEventType["DELETION"] = "deletion";
  EcsEventType["DENIED"] = "denied";
  EcsEventType["END"] = "end";
  EcsEventType["ERROR"] = "error";
  EcsEventType["GROUP"] = "group";
  EcsEventType["INFO"] = "info";
  EcsEventType["INSTALLATION"] = "installation";
  EcsEventType["PROTOCOL"] = "protocol";
  EcsEventType["START"] = "start";
  EcsEventType["USER"] = "user";
})(EcsEventType || (exports.EcsEventType = EcsEventType = {}));