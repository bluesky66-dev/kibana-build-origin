"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Actions = void 0;

var _api = require("./api");

var _app = require("./app");

var _saved_object = require("./saved_object");

var _space = require("./space");

var _ui = require("./ui");

var _alerting = require("./alerting");

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
/** Actions are used to create the "actions" that are associated with Elasticsearch's
 * application privileges, and are used to perform the authorization checks implemented
 * by the various `checkPrivilegesWithRequest` derivatives
 */


class Actions {
  constructor(versionNumber) {
    this.versionNumber = versionNumber;

    _defineProperty(this, "api", new _api.ApiActions(this.versionNumber));

    _defineProperty(this, "app", new _app.AppActions(this.versionNumber));

    _defineProperty(this, "login", 'login:');

    _defineProperty(this, "savedObject", new _saved_object.SavedObjectActions(this.versionNumber));

    _defineProperty(this, "alerting", new _alerting.AlertingActions(this.versionNumber));

    _defineProperty(this, "space", new _space.SpaceActions(this.versionNumber));

    _defineProperty(this, "ui", new _ui.UIActions(this.versionNumber));

    _defineProperty(this, "version", `version:${this.versionNumber}`);

    if (versionNumber === '') {
      throw new Error(`version can't be an empty string`);
    }
  }

}

exports.Actions = Actions;