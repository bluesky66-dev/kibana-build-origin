"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsAuthorization = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _saved_objects = require("../saved_objects");

var _get_authorization_mode_by_source = require("./get_authorization_mode_by_source");

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

const operationAlias = {
  execute: authorization => [authorization.actions.savedObject.get(_saved_objects.ACTION_SAVED_OBJECT_TYPE, 'get'), authorization.actions.savedObject.get(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, 'create')],
  list: authorization => authorization.actions.savedObject.get(_saved_objects.ACTION_SAVED_OBJECT_TYPE, 'find')
};
const LEGACY_RBAC_EXEMPT_OPERATIONS = new Set(['get', 'execute']);

class ActionsAuthorization {
  constructor({
    request,
    authorization,
    authentication,
    auditLogger,
    authorizationMode = _get_authorization_mode_by_source.AuthorizationMode.RBAC
  }) {
    _defineProperty(this, "request", void 0);

    _defineProperty(this, "authorization", void 0);

    _defineProperty(this, "authentication", void 0);

    _defineProperty(this, "auditLogger", void 0);

    _defineProperty(this, "authorizationMode", void 0);

    this.request = request;
    this.authorization = authorization;
    this.authentication = authentication;
    this.auditLogger = auditLogger;
    this.authorizationMode = authorizationMode;
  }

  async ensureAuthorized(operation, actionTypeId) {
    var _authorization$mode;

    const {
      authorization
    } = this;

    if (authorization !== null && authorization !== void 0 && (_authorization$mode = authorization.mode) !== null && _authorization$mode !== void 0 && _authorization$mode.useRbacForRequest(this.request)) {
      if (this.isOperationExemptDueToLegacyRbac(operation)) {
        var _this$authentication$, _this$authentication, _this$authentication$2;

        this.auditLogger.actionsAuthorizationSuccess((_this$authentication$ = (_this$authentication = this.authentication) === null || _this$authentication === void 0 ? void 0 : (_this$authentication$2 = _this$authentication.getCurrentUser(this.request)) === null || _this$authentication$2 === void 0 ? void 0 : _this$authentication$2.username) !== null && _this$authentication$ !== void 0 ? _this$authentication$ : '', operation, actionTypeId);
      } else {
        const checkPrivileges = authorization.checkPrivilegesDynamicallyWithRequest(this.request);
        const {
          hasAllRequested,
          username
        } = await checkPrivileges({
          kibana: operationAlias[operation] ? operationAlias[operation](authorization) : authorization.actions.savedObject.get(_saved_objects.ACTION_SAVED_OBJECT_TYPE, operation)
        });

        if (hasAllRequested) {
          this.auditLogger.actionsAuthorizationSuccess(username, operation, actionTypeId);
        } else {
          throw _boom.default.forbidden(this.auditLogger.actionsAuthorizationFailure(username, operation, actionTypeId));
        }
      }
    }
  }

  isOperationExemptDueToLegacyRbac(operation) {
    return this.authorizationMode === _get_authorization_mode_by_source.AuthorizationMode.Legacy && LEGACY_RBAC_EXEMPT_OPERATIONS.has(operation);
  }

}

exports.ActionsAuthorization = ActionsAuthorization;