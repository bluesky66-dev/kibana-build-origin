"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsClientFactory = void 0;

var _alerts_client = require("./alerts_client");

var _common = require("../common");

var _alerts_authorization = require("./authorization/alerts_authorization");

var _audit_logger = require("./authorization/audit_logger");

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

class AlertsClientFactory {
  constructor() {
    _defineProperty(this, "isInitialized", false);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "taskManager", void 0);

    _defineProperty(this, "alertTypeRegistry", void 0);

    _defineProperty(this, "securityPluginSetup", void 0);

    _defineProperty(this, "securityPluginStart", void 0);

    _defineProperty(this, "getSpaceId", void 0);

    _defineProperty(this, "getSpace", void 0);

    _defineProperty(this, "spaceIdToNamespace", void 0);

    _defineProperty(this, "encryptedSavedObjectsClient", void 0);

    _defineProperty(this, "actions", void 0);

    _defineProperty(this, "features", void 0);

    _defineProperty(this, "eventLog", void 0);

    _defineProperty(this, "kibanaVersion", void 0);
  }

  initialize(options) {
    if (this.isInitialized) {
      throw new Error('AlertsClientFactory already initialized');
    }

    this.isInitialized = true;
    this.logger = options.logger;
    this.getSpaceId = options.getSpaceId;
    this.getSpace = options.getSpace;
    this.taskManager = options.taskManager;
    this.alertTypeRegistry = options.alertTypeRegistry;
    this.securityPluginSetup = options.securityPluginSetup;
    this.securityPluginStart = options.securityPluginStart;
    this.spaceIdToNamespace = options.spaceIdToNamespace;
    this.encryptedSavedObjectsClient = options.encryptedSavedObjectsClient;
    this.actions = options.actions;
    this.features = options.features;
    this.eventLog = options.eventLog;
    this.kibanaVersion = options.kibanaVersion;
  }

  create(request, savedObjects) {
    const {
      securityPluginSetup,
      securityPluginStart,
      actions,
      eventLog,
      features
    } = this;
    const spaceId = this.getSpaceId(request);
    const authorization = new _alerts_authorization.AlertsAuthorization({
      authorization: securityPluginStart === null || securityPluginStart === void 0 ? void 0 : securityPluginStart.authz,
      request,
      getSpace: this.getSpace,
      alertTypeRegistry: this.alertTypeRegistry,
      features: features,
      auditLogger: new _audit_logger.AlertsAuthorizationAuditLogger(securityPluginSetup === null || securityPluginSetup === void 0 ? void 0 : securityPluginSetup.audit.getLogger(_common.ALERTS_FEATURE_ID))
    });
    return new _alerts_client.AlertsClient({
      spaceId,
      kibanaVersion: this.kibanaVersion,
      logger: this.logger,
      taskManager: this.taskManager,
      alertTypeRegistry: this.alertTypeRegistry,
      unsecuredSavedObjectsClient: savedObjects.getScopedClient(request, {
        excludedWrappers: ['security'],
        includedHiddenTypes: ['alert', 'api_key_pending_invalidation']
      }),
      authorization,
      actionsAuthorization: actions.getActionsAuthorizationWithRequest(request),
      namespace: this.spaceIdToNamespace(spaceId),
      encryptedSavedObjectsClient: this.encryptedSavedObjectsClient,
      auditLogger: securityPluginSetup === null || securityPluginSetup === void 0 ? void 0 : securityPluginSetup.audit.asScoped(request),

      async getUserName() {
        if (!securityPluginStart) {
          return null;
        }

        const user = await securityPluginStart.authc.getCurrentUser(request);
        return user ? user.username : null;
      },

      async createAPIKey(name) {
        if (!securityPluginStart) {
          return {
            apiKeysEnabled: false
          };
        } // Create an API key using the new grant API - in this case the Kibana system user is creating the
        // API key for the user, instead of having the user create it themselves, which requires api_key
        // privileges


        const createAPIKeyResult = await securityPluginStart.authc.apiKeys.grantAsInternalUser(request, {
          name,
          role_descriptors: {}
        });

        if (!createAPIKeyResult) {
          return {
            apiKeysEnabled: false
          };
        }

        return {
          apiKeysEnabled: true,
          result: createAPIKeyResult
        };
      },

      async getActionsClient() {
        return actions.getActionsClientWithRequest(request);
      },

      async getEventLogClient() {
        return eventLog.getClient(request);
      }

    });
  }

}

exports.AlertsClientFactory = AlertsClientFactory;