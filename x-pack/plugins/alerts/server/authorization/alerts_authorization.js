"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsAuthorization = exports.WriteOperations = exports.ReadOperations = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _common = require("../../common");

var _audit_logger = require("./audit_logger");

var _alerts_authorization_kuery = require("./alerts_authorization_kuery");

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

let ReadOperations;
exports.ReadOperations = ReadOperations;

(function (ReadOperations) {
  ReadOperations["Get"] = "get";
  ReadOperations["GetAlertState"] = "getAlertState";
  ReadOperations["GetAlertInstanceSummary"] = "getAlertInstanceSummary";
  ReadOperations["Find"] = "find";
})(ReadOperations || (exports.ReadOperations = ReadOperations = {}));

let WriteOperations;
exports.WriteOperations = WriteOperations;

(function (WriteOperations) {
  WriteOperations["Create"] = "create";
  WriteOperations["Delete"] = "delete";
  WriteOperations["Update"] = "update";
  WriteOperations["UpdateApiKey"] = "updateApiKey";
  WriteOperations["Enable"] = "enable";
  WriteOperations["Disable"] = "disable";
  WriteOperations["MuteAll"] = "muteAll";
  WriteOperations["UnmuteAll"] = "unmuteAll";
  WriteOperations["MuteInstance"] = "muteInstance";
  WriteOperations["UnmuteInstance"] = "unmuteInstance";
})(WriteOperations || (exports.WriteOperations = WriteOperations = {}));

class AlertsAuthorization {
  constructor({
    alertTypeRegistry,
    request,
    authorization,
    features,
    auditLogger,
    getSpace
  }) {
    _defineProperty(this, "alertTypeRegistry", void 0);

    _defineProperty(this, "request", void 0);

    _defineProperty(this, "authorization", void 0);

    _defineProperty(this, "auditLogger", void 0);

    _defineProperty(this, "featuresIds", void 0);

    _defineProperty(this, "allPossibleConsumers", void 0);

    this.request = request;
    this.authorization = authorization;
    this.alertTypeRegistry = alertTypeRegistry;
    this.auditLogger = auditLogger;
    this.featuresIds = getSpace(request).then(maybeSpace => {
      var _maybeSpace$disabledF;

      return new Set((_maybeSpace$disabledF = maybeSpace === null || maybeSpace === void 0 ? void 0 : maybeSpace.disabledFeatures) !== null && _maybeSpace$disabledF !== void 0 ? _maybeSpace$disabledF : []);
    }).then(disabledFeatures => new Set(features.getKibanaFeatures().filter(({
      id,
      alerting
    }) => {
      var _alerting$length;

      return (// ignore features which are disabled in the user's space
        !disabledFeatures.has(id) && ( // ignore features which don't grant privileges to alerting
        (_alerting$length = alerting === null || alerting === void 0 ? void 0 : alerting.length) !== null && _alerting$length !== void 0 ? _alerting$length : 0 > 0)
      );
    }).map(feature => feature.id))).catch(() => {
      // failing to fetch the space means the user is likely not privileged in the
      // active space at all, which means that their list of features should be empty
      return new Set();
    });
    this.allPossibleConsumers = this.featuresIds.then(featuresIds => featuresIds.size ? asAuthorizedConsumers([_common.ALERTS_FEATURE_ID, ...featuresIds], {
      read: true,
      all: true
    }) : {});
  }

  shouldCheckAuthorization() {
    var _this$authorization$m, _this$authorization, _this$authorization$m2;

    return (_this$authorization$m = (_this$authorization = this.authorization) === null || _this$authorization === void 0 ? void 0 : (_this$authorization$m2 = _this$authorization.mode) === null || _this$authorization$m2 === void 0 ? void 0 : _this$authorization$m2.useRbacForRequest(this.request)) !== null && _this$authorization$m !== void 0 ? _this$authorization$m : false;
  }

  async ensureAuthorized(alertTypeId, consumer, operation) {
    const {
      authorization
    } = this;
    const isAvailableConsumer = (0, _lodash.has)(await this.allPossibleConsumers, consumer);

    if (authorization && this.shouldCheckAuthorization()) {
      const alertType = this.alertTypeRegistry.get(alertTypeId);
      const requiredPrivilegesByScope = {
        consumer: authorization.actions.alerting.get(alertTypeId, consumer, operation),
        producer: authorization.actions.alerting.get(alertTypeId, alertType.producer, operation)
      }; // We special case the Alerts Management `consumer` as we don't want to have to
      // manually authorize each alert type in the management UI

      const shouldAuthorizeConsumer = consumer !== _common.ALERTS_FEATURE_ID;
      const checkPrivileges = authorization.checkPrivilegesDynamicallyWithRequest(this.request);
      const {
        hasAllRequested,
        username,
        privileges
      } = await checkPrivileges({
        kibana: shouldAuthorizeConsumer && consumer !== alertType.producer ? [// check for access at consumer level
        requiredPrivilegesByScope.consumer, // check for access at producer level
        requiredPrivilegesByScope.producer] : [// skip consumer privilege checks under `alerts` as all alert types can
        // be created under `alerts` if you have producer level privileges
        requiredPrivilegesByScope.producer]
      });

      if (!isAvailableConsumer) {
        /**
         * Under most circumstances this would have been caught by `checkPrivileges` as
         * a user can't have Privileges to an unknown consumer, but super users
         * don't actually get "privilege checked" so the made up consumer *will* return
         * as Privileged.
         * This check will ensure we don't accidentally let these through
         */
        throw _boom.default.forbidden(this.auditLogger.alertsAuthorizationFailure(username, alertTypeId, _audit_logger.ScopeType.Consumer, consumer, operation));
      }

      if (hasAllRequested) {
        this.auditLogger.alertsAuthorizationSuccess(username, alertTypeId, _audit_logger.ScopeType.Consumer, consumer, operation);
      } else {
        const authorizedPrivileges = (0, _lodash.map)(privileges.kibana.filter(privilege => privilege.authorized), 'privilege');
        const unauthorizedScopes = (0, _lodash.mapValues)(requiredPrivilegesByScope, privilege => !authorizedPrivileges.includes(privilege));
        const [unauthorizedScopeType, unauthorizedScope] = shouldAuthorizeConsumer && unauthorizedScopes.consumer ? [_audit_logger.ScopeType.Consumer, consumer] : [_audit_logger.ScopeType.Producer, alertType.producer];
        throw _boom.default.forbidden(this.auditLogger.alertsAuthorizationFailure(username, alertTypeId, unauthorizedScopeType, unauthorizedScope, operation));
      }
    } else if (!isAvailableConsumer) {
      throw _boom.default.forbidden(this.auditLogger.alertsAuthorizationFailure('', alertTypeId, _audit_logger.ScopeType.Consumer, consumer, operation));
    }
  }

  async getFindAuthorizationFilter() {
    if (this.authorization && this.shouldCheckAuthorization()) {
      const {
        username,
        authorizedAlertTypes
      } = await this.augmentAlertTypesWithAuthorization(this.alertTypeRegistry.list(), [ReadOperations.Find]);

      if (!authorizedAlertTypes.size) {
        throw _boom.default.forbidden(this.auditLogger.alertsUnscopedAuthorizationFailure(username, 'find'));
      }

      const authorizedAlertTypeIdsToConsumers = new Set([...authorizedAlertTypes].reduce((alertTypeIdConsumerPairs, alertType) => {
        for (const consumer of Object.keys(alertType.authorizedConsumers)) {
          alertTypeIdConsumerPairs.push(`${alertType.id}/${consumer}`);
        }

        return alertTypeIdConsumerPairs;
      }, []));
      const authorizedEntries = new Map();
      return {
        filter: (0, _alerts_authorization_kuery.asFiltersByAlertTypeAndConsumer)(authorizedAlertTypes),
        ensureAlertTypeIsAuthorized: (alertTypeId, consumer) => {
          if (!authorizedAlertTypeIdsToConsumers.has(`${alertTypeId}/${consumer}`)) {
            throw _boom.default.forbidden(this.auditLogger.alertsAuthorizationFailure(username, alertTypeId, _audit_logger.ScopeType.Consumer, consumer, 'find'));
          } else {
            if (authorizedEntries.has(alertTypeId)) {
              authorizedEntries.get(alertTypeId).add(consumer);
            } else {
              authorizedEntries.set(alertTypeId, new Set([consumer]));
            }
          }
        },
        logSuccessfulAuthorization: () => {
          if (authorizedEntries.size) {
            this.auditLogger.alertsBulkAuthorizationSuccess(username, [...authorizedEntries.entries()].reduce((authorizedPairs, [alertTypeId, consumers]) => {
              for (const consumer of consumers) {
                authorizedPairs.push([alertTypeId, consumer]);
              }

              return authorizedPairs;
            }, []), _audit_logger.ScopeType.Consumer, 'find');
          }
        }
      };
    }

    return {
      ensureAlertTypeIsAuthorized: (alertTypeId, consumer) => {},
      logSuccessfulAuthorization: () => {}
    };
  }

  async filterByAlertTypeAuthorization(alertTypes, operations) {
    const {
      authorizedAlertTypes
    } = await this.augmentAlertTypesWithAuthorization(alertTypes, operations);
    return authorizedAlertTypes;
  }

  async augmentAlertTypesWithAuthorization(alertTypes, operations) {
    const featuresIds = await this.featuresIds;

    if (this.authorization && this.shouldCheckAuthorization()) {
      const checkPrivileges = this.authorization.checkPrivilegesDynamicallyWithRequest(this.request); // add an empty `authorizedConsumers` array on each alertType

      const alertTypesWithAuthorization = this.augmentWithAuthorizedConsumers(alertTypes, {}); // map from privilege to alertType which we can refer back to when analyzing the result
      // of checkPrivileges

      const privilegeToAlertType = new Map(); // as we can't ask ES for the user's individual privileges we need to ask for each feature
      // and alertType in the system whether this user has this privilege

      for (const alertType of alertTypesWithAuthorization) {
        for (const feature of featuresIds) {
          for (const operation of operations) {
            privilegeToAlertType.set(this.authorization.actions.alerting.get(alertType.id, feature, operation), [alertType, feature, hasPrivilegeByOperation(operation), alertType.producer === feature]);
          }
        }
      }

      const {
        username,
        hasAllRequested,
        privileges
      } = await checkPrivileges({
        kibana: [...privilegeToAlertType.keys()]
      });
      return {
        username,
        hasAllRequested,
        authorizedAlertTypes: hasAllRequested ? // has access to all features
        this.augmentWithAuthorizedConsumers(alertTypes, await this.allPossibleConsumers) : // only has some of the required privileges
        privileges.kibana.reduce((authorizedAlertTypes, {
          authorized,
          privilege
        }) => {
          if (authorized && privilegeToAlertType.has(privilege)) {
            const [alertType, feature, hasPrivileges, isAuthorizedAtProducerLevel] = privilegeToAlertType.get(privilege);
            alertType.authorizedConsumers[feature] = mergeHasPrivileges(hasPrivileges, alertType.authorizedConsumers[feature]);

            if (isAuthorizedAtProducerLevel) {
              // granting privileges under the producer automatically authorized the Alerts Management UI as well
              alertType.authorizedConsumers[_common.ALERTS_FEATURE_ID] = mergeHasPrivileges(hasPrivileges, alertType.authorizedConsumers[_common.ALERTS_FEATURE_ID]);
            }

            authorizedAlertTypes.add(alertType);
          }

          return authorizedAlertTypes;
        }, new Set())
      };
    } else {
      return {
        hasAllRequested: true,
        authorizedAlertTypes: this.augmentWithAuthorizedConsumers(new Set([...alertTypes].filter(alertType => featuresIds.has(alertType.producer))), await this.allPossibleConsumers)
      };
    }
  }

  augmentWithAuthorizedConsumers(alertTypes, authorizedConsumers) {
    return new Set(Array.from(alertTypes).map(alertType => ({ ...alertType,
      authorizedConsumers: { ...authorizedConsumers
      }
    })));
  }

}

exports.AlertsAuthorization = AlertsAuthorization;

function mergeHasPrivileges(left, right) {
  var _ref, _ref2;

  return {
    read: (_ref = left.read || (right === null || right === void 0 ? void 0 : right.read)) !== null && _ref !== void 0 ? _ref : false,
    all: (_ref2 = left.all || (right === null || right === void 0 ? void 0 : right.all)) !== null && _ref2 !== void 0 ? _ref2 : false
  };
}

function hasPrivilegeByOperation(operation) {
  const read = Object.values(ReadOperations).includes(operation);
  const all = Object.values(WriteOperations).includes(operation);
  return {
    read: read || all,
    all
  };
}

function asAuthorizedConsumers(consumers, hasPrivileges) {
  return (0, _lodash.fromPairs)(consumers.map(feature => [feature, hasPrivileges]));
}