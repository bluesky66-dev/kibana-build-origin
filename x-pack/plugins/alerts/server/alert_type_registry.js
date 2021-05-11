"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertTypeRegistry = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

var _typeDetect = _interopRequireDefault(require("type-detect"));

var _lodash = require("lodash");

var _common = require("../common");

var _get_alert_type_feature_usage_name = require("./lib/get_alert_type_feature_usage_name");

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
/**
 * AlertType IDs are used as part of the authorization strings used to
 * grant users privileged operations. There is a limited range of characters
 * we can use in these auth strings, so we apply these same limitations to
 * the AlertType Ids.
 * If you wish to change this, please confer with the Kibana security team.
 */


const alertIdSchema = _configSchema.schema.string({
  validate(value) {
    if (typeof value !== 'string') {
      return `expected AlertType Id of type [string] but got [${(0, _typeDetect.default)(value)}]`;
    } else if (!value.match(/^[a-zA-Z0-9_\-\.]*$/)) {
      const invalid = value.match(/[^a-zA-Z0-9_\-\.]+/g);
      return `expected AlertType Id not to include invalid character${invalid.length > 1 ? `s` : ``}: ${invalid === null || invalid === void 0 ? void 0 : invalid.join(`, `)}`;
    }
  }

});

class AlertTypeRegistry {
  constructor({
    taskManager,
    taskRunnerFactory,
    licenseState,
    licensing
  }) {
    _defineProperty(this, "taskManager", void 0);

    _defineProperty(this, "alertTypes", new Map());

    _defineProperty(this, "taskRunnerFactory", void 0);

    _defineProperty(this, "licenseState", void 0);

    _defineProperty(this, "licensing", void 0);

    this.taskManager = taskManager;
    this.taskRunnerFactory = taskRunnerFactory;
    this.licenseState = licenseState;
    this.licensing = licensing;
  }

  has(id) {
    return this.alertTypes.has(id);
  }

  ensureAlertTypeEnabled(id) {
    this.licenseState.ensureLicenseForAlertType(this.get(id));
  }

  register(alertType) {
    if (this.has(alertType.id)) {
      throw new Error(_i18n.i18n.translate('xpack.alerts.alertTypeRegistry.register.duplicateAlertTypeError', {
        defaultMessage: 'Alert type "{id}" is already registered.',
        values: {
          id: alertType.id
        }
      }));
    }

    alertType.actionVariables = normalizedActionVariables(alertType.actionVariables);
    const normalizedAlertType = augmentActionGroupsWithReserved(alertType);
    this.alertTypes.set(alertIdSchema.validate(alertType.id),
    /** stripping the typing is required in order to store the AlertTypes in a Map */
    normalizedAlertType);
    this.taskManager.registerTaskDefinitions({
      [`alerting:${alertType.id}`]: {
        title: alertType.name,
        createTaskRunner: context => this.taskRunnerFactory.create(normalizedAlertType, context)
      }
    }); // No need to notify usage on basic alert types

    if (alertType.minimumLicenseRequired !== 'basic') {
      this.licensing.featureUsage.register((0, _get_alert_type_feature_usage_name.getAlertTypeFeatureUsageName)(alertType.name), alertType.minimumLicenseRequired);
    }
  }

  get(id) {
    if (!this.has(id)) {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerts.alertTypeRegistry.get.missingAlertTypeError', {
        defaultMessage: 'Alert type "{id}" is not registered.',
        values: {
          id
        }
      }));
    }
    /**
     * When we store the AlertTypes in the Map we strip the typing.
     * This means that returning a typed AlertType in `get` is an inherently
     * unsafe operation. Down casting to `unknown` is the only way to achieve this.
     */


    return this.alertTypes.get(id);
  }

  list() {
    return new Set(Array.from(this.alertTypes).map(([id, {
      name,
      actionGroups,
      recoveryActionGroup,
      defaultActionGroupId,
      actionVariables,
      producer,
      minimumLicenseRequired
    }]) => ({
      id,
      name,
      actionGroups,
      recoveryActionGroup,
      defaultActionGroupId,
      actionVariables,
      producer,
      minimumLicenseRequired,
      enabledInLicense: !!this.licenseState.getLicenseCheckForAlertType(id, name, minimumLicenseRequired).isValid
    })));
  }

}

exports.AlertTypeRegistry = AlertTypeRegistry;

function normalizedActionVariables(actionVariables) {
  var _actionVariables$cont, _actionVariables$stat, _actionVariables$para;

  return {
    context: (_actionVariables$cont = actionVariables === null || actionVariables === void 0 ? void 0 : actionVariables.context) !== null && _actionVariables$cont !== void 0 ? _actionVariables$cont : [],
    state: (_actionVariables$stat = actionVariables === null || actionVariables === void 0 ? void 0 : actionVariables.state) !== null && _actionVariables$stat !== void 0 ? _actionVariables$stat : [],
    params: (_actionVariables$para = actionVariables === null || actionVariables === void 0 ? void 0 : actionVariables.params) !== null && _actionVariables$para !== void 0 ? _actionVariables$para : []
  };
}

function augmentActionGroupsWithReserved(alertType) {
  const reservedActionGroups = (0, _common.getBuiltinActionGroups)(alertType.recoveryActionGroup);
  const {
    id,
    actionGroups,
    recoveryActionGroup
  } = alertType;
  const activeActionGroups = new Set(actionGroups.map(item => item.id));
  const intersectingReservedActionGroups = (0, _lodash.intersection)([...activeActionGroups.values()], reservedActionGroups.map(item => item.id));

  if (recoveryActionGroup && activeActionGroups.has(recoveryActionGroup.id)) {
    throw new Error(_i18n.i18n.translate('xpack.alerts.alertTypeRegistry.register.customRecoveryActionGroupUsageError', {
      defaultMessage: 'Alert type [id="{id}"] cannot be registered. Action group [{actionGroup}] cannot be used as both a recovery and an active action group.',
      values: {
        actionGroup: recoveryActionGroup.id,
        id
      }
    }));
  } else if (intersectingReservedActionGroups.length > 0) {
    throw new Error(_i18n.i18n.translate('xpack.alerts.alertTypeRegistry.register.reservedActionGroupUsageError', {
      defaultMessage: 'Alert type [id="{id}"] cannot be registered. Action groups [{actionGroups}] are reserved by the framework.',
      values: {
        actionGroups: intersectingReservedActionGroups.join(', '),
        id
      }
    }));
  }

  return { ...alertType,
    actionGroups: [...actionGroups, ...reservedActionGroups],
    recoveryActionGroup: recoveryActionGroup !== null && recoveryActionGroup !== void 0 ? recoveryActionGroup : _common.RecoveredActionGroup
  };
}