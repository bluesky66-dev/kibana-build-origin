"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderActionParameterTemplates = renderActionParameterTemplates;
exports.ActionsPlugin = exports.EVENT_LOG_ACTIONS = void 0;

var _lib = require("./lib");

var _actions_client = require("./actions_client");

var _action_type_registry = require("./action_type_registry");

var _create_execute_function = require("./create_execute_function");

var _builtin_action_types = require("./builtin_action_types");

var _usage = require("./usage");

var _actions_config = require("./actions_config");

var _routes = require("./routes");

var _task = require("./usage/task");

var _saved_objects = require("./saved_objects");

var _feature = require("./feature");

var _actions_authorization = require("./authorization/actions_authorization");

var _audit_logger = require("./authorization/audit_logger");

var _get_authorization_mode_by_source = require("./authorization/get_authorization_mode_by_source");

var _ensure_sufficient_license = require("./lib/ensure_sufficient_license");

var _mustache_renderer = require("./lib/mustache_renderer");

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

const EVENT_LOG_PROVIDER = 'actions';
const EVENT_LOG_ACTIONS = {
  execute: 'execute',
  executeViaHttp: 'execute-via-http'
};
exports.EVENT_LOG_ACTIONS = EVENT_LOG_ACTIONS;
const includedHiddenTypes = [_saved_objects.ACTION_SAVED_OBJECT_TYPE, _saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, _saved_objects.ALERT_SAVED_OBJECT_TYPE];

class ActionsPlugin {
  constructor(initContext) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "actionsConfig", void 0);

    _defineProperty(this, "taskRunnerFactory", void 0);

    _defineProperty(this, "actionTypeRegistry", void 0);

    _defineProperty(this, "actionExecutor", void 0);

    _defineProperty(this, "licenseState", null);

    _defineProperty(this, "security", void 0);

    _defineProperty(this, "eventLogService", void 0);

    _defineProperty(this, "eventLogger", void 0);

    _defineProperty(this, "isESOCanEncrypt", void 0);

    _defineProperty(this, "telemetryLogger", void 0);

    _defineProperty(this, "preconfiguredActions", void 0);

    _defineProperty(this, "kibanaIndexConfig", void 0);

    _defineProperty(this, "getUnsecuredSavedObjectsClient", (savedObjects, request) => savedObjects.getScopedClient(request, {
      excludedWrappers: ['security'],
      includedHiddenTypes
    }));

    _defineProperty(this, "instantiateAuthorization", (request, authorizationMode) => {
      var _this$security, _this$security2, _this$security3;

      return new _actions_authorization.ActionsAuthorization({
        request,
        authorizationMode,
        authorization: (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authz,
        authentication: (_this$security2 = this.security) === null || _this$security2 === void 0 ? void 0 : _this$security2.authc,
        auditLogger: new _audit_logger.ActionsAuthorizationAuditLogger((_this$security3 = this.security) === null || _this$security3 === void 0 ? void 0 : _this$security3.audit.getLogger(_feature.ACTIONS_FEATURE.id))
      });
    });

    _defineProperty(this, "createRouteHandlerContext", (core, defaultKibanaIndex) => {
      const {
        actionTypeRegistry,
        isESOCanEncrypt,
        preconfiguredActions,
        actionExecutor,
        instantiateAuthorization,
        security
      } = this;
      return async function actionsRouteHandlerContext(context, request) {
        const [{
          savedObjects
        }, {
          taskManager
        }] = await core.getStartServices();
        return {
          getActionsClient: () => {
            if (isESOCanEncrypt !== true) {
              throw new Error(`Unable to create actions client because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
            }

            return new _actions_client.ActionsClient({
              unsecuredSavedObjectsClient: savedObjects.getScopedClient(request, {
                excludedWrappers: ['security'],
                includedHiddenTypes
              }),
              actionTypeRegistry: actionTypeRegistry,
              defaultKibanaIndex,
              scopedClusterClient: context.core.elasticsearch.legacy.client,
              preconfiguredActions,
              request,
              authorization: instantiateAuthorization(request),
              actionExecutor: actionExecutor,
              executionEnqueuer: (0, _create_execute_function.createExecutionEnqueuerFunction)({
                taskManager,
                actionTypeRegistry: actionTypeRegistry,
                isESOCanEncrypt: isESOCanEncrypt,
                preconfiguredActions
              }),
              auditLogger: security === null || security === void 0 ? void 0 : security.audit.asScoped(request)
            });
          },
          listTypes: actionTypeRegistry.list.bind(actionTypeRegistry)
        };
      };
    });

    this.actionsConfig = initContext.config.get();
    this.logger = initContext.logger.get('actions');
    this.telemetryLogger = initContext.logger.get('usage');
    this.preconfiguredActions = [];
    this.kibanaIndexConfig = initContext.config.legacy.get();
  }

  setup(core, plugins) {
    this.licenseState = new _lib.LicenseState(plugins.licensing.license$);
    this.isESOCanEncrypt = plugins.encryptedSavedObjects.canEncrypt;

    if (!this.isESOCanEncrypt) {
      this.logger.warn('APIs are disabled because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.');
    }

    plugins.features.registerKibanaFeature(_feature.ACTIONS_FEATURE);
    (0, _saved_objects.setupSavedObjects)(core.savedObjects, plugins.encryptedSavedObjects);
    this.eventLogService = plugins.eventLog;
    plugins.eventLog.registerProviderActions(EVENT_LOG_PROVIDER, Object.values(EVENT_LOG_ACTIONS));
    this.eventLogger = plugins.eventLog.getLogger({
      event: {
        provider: EVENT_LOG_PROVIDER
      }
    });
    const actionExecutor = new _lib.ActionExecutor({
      isESOCanEncrypt: this.isESOCanEncrypt
    }); // get executions count

    const taskRunnerFactory = new _lib.TaskRunnerFactory(actionExecutor);
    const actionsConfigUtils = (0, _actions_config.getActionsConfigurationUtilities)(this.actionsConfig);

    for (const preconfiguredId of Object.keys(this.actionsConfig.preconfigured)) {
      this.preconfiguredActions.push({ ...this.actionsConfig.preconfigured[preconfiguredId],
        id: preconfiguredId,
        isPreconfigured: true
      });
    }

    const actionTypeRegistry = new _action_type_registry.ActionTypeRegistry({
      licensing: plugins.licensing,
      taskRunnerFactory,
      taskManager: plugins.taskManager,
      actionsConfigUtils,
      licenseState: this.licenseState,
      preconfiguredActions: this.preconfiguredActions
    });
    this.taskRunnerFactory = taskRunnerFactory;
    this.actionTypeRegistry = actionTypeRegistry;
    this.actionExecutor = actionExecutor;
    this.security = plugins.security;
    (0, _builtin_action_types.registerBuiltInActionTypes)({
      logger: this.logger,
      actionTypeRegistry,
      actionsConfigUtils,
      publicBaseUrl: core.http.basePath.publicBaseUrl
    });
    const usageCollection = plugins.usageCollection;

    if (usageCollection) {
      (0, _usage.registerActionsUsageCollector)(usageCollection, core.getStartServices().then(([_, {
        taskManager
      }]) => taskManager));
    }

    core.http.registerRouteHandlerContext('actions', this.createRouteHandlerContext(core, this.kibanaIndexConfig.kibana.index));

    if (usageCollection) {
      (0, _task.initializeActionsTelemetry)(this.telemetryLogger, plugins.taskManager, core, this.kibanaIndexConfig.kibana.index);
    } // Routes


    const router = core.http.createRouter();
    (0, _routes.createActionRoute)(router, this.licenseState);
    (0, _routes.deleteActionRoute)(router, this.licenseState);
    (0, _routes.getActionRoute)(router, this.licenseState);
    (0, _routes.getAllActionRoute)(router, this.licenseState);
    (0, _routes.updateActionRoute)(router, this.licenseState);
    (0, _routes.listActionTypesRoute)(router, this.licenseState);
    (0, _routes.executeActionRoute)(router, this.licenseState);
    return {
      registerType: actionType => {
        (0, _ensure_sufficient_license.ensureSufficientLicense)(actionType);
        actionTypeRegistry.register(actionType);
      }
    };
  }

  start(core, plugins) {
    var _plugins$spaces;

    const {
      logger,
      licenseState,
      actionExecutor,
      actionTypeRegistry,
      taskRunnerFactory,
      kibanaIndexConfig,
      isESOCanEncrypt,
      preconfiguredActions,
      instantiateAuthorization,
      getUnsecuredSavedObjectsClient
    } = this;
    licenseState === null || licenseState === void 0 ? void 0 : licenseState.setNotifyUsage(plugins.licensing.featureUsage.notifyUsage);
    const encryptedSavedObjectsClient = plugins.encryptedSavedObjects.getClient({
      includedHiddenTypes
    });

    const getActionsClientWithRequest = async (request, authorizationContext) => {
      var _this$security4;

      if (isESOCanEncrypt !== true) {
        throw new Error(`Unable to create actions client because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
      }

      const unsecuredSavedObjectsClient = getUnsecuredSavedObjectsClient(core.savedObjects, request);
      const kibanaIndex = kibanaIndexConfig.kibana.index;
      return new _actions_client.ActionsClient({
        unsecuredSavedObjectsClient,
        actionTypeRegistry: actionTypeRegistry,
        defaultKibanaIndex: kibanaIndex,
        scopedClusterClient: core.elasticsearch.legacy.client.asScoped(request),
        preconfiguredActions,
        request,
        authorization: instantiateAuthorization(request, await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(unsecuredSavedObjectsClient, authorizationContext)),
        actionExecutor: actionExecutor,
        executionEnqueuer: (0, _create_execute_function.createExecutionEnqueuerFunction)({
          taskManager: plugins.taskManager,
          actionTypeRegistry: actionTypeRegistry,
          isESOCanEncrypt: isESOCanEncrypt,
          preconfiguredActions
        }),
        auditLogger: (_this$security4 = this.security) === null || _this$security4 === void 0 ? void 0 : _this$security4.audit.asScoped(request)
      });
    }; // Ensure the public API cannot be used to circumvent authorization
    // using our legacy exemption mechanism by passing in a legacy SO
    // as authorizationContext which would then set a Legacy AuthorizationMode


    const secureGetActionsClientWithRequest = request => getActionsClientWithRequest(request);

    this.eventLogService.registerSavedObjectProvider('action', request => {
      const client = secureGetActionsClientWithRequest(request);
      return objects => objects ? Promise.all(objects.map(async objectItem => await (await client).get({
        id: objectItem.id
      }))) : Promise.resolve([]);
    });

    const getScopedSavedObjectsClientWithoutAccessToActions = request => core.savedObjects.getScopedClient(request);

    actionExecutor.initialize({
      logger,
      eventLogger: this.eventLogger,
      spaces: (_plugins$spaces = plugins.spaces) === null || _plugins$spaces === void 0 ? void 0 : _plugins$spaces.spacesService,
      getActionsClientWithRequest,
      getServices: this.getServicesFactory(getScopedSavedObjectsClientWithoutAccessToActions, core.elasticsearch),
      encryptedSavedObjectsClient,
      actionTypeRegistry: actionTypeRegistry,
      preconfiguredActions
    });

    const spaceIdToNamespace = spaceId => {
      return plugins.spaces && spaceId ? plugins.spaces.spacesService.spaceIdToNamespace(spaceId) : undefined;
    };

    taskRunnerFactory.initialize({
      logger,
      actionTypeRegistry: actionTypeRegistry,
      encryptedSavedObjectsClient,
      basePathService: core.http.basePath,
      spaceIdToNamespace,
      getUnsecuredSavedObjectsClient: request => this.getUnsecuredSavedObjectsClient(core.savedObjects, request)
    });
    (0, _task.scheduleActionsTelemetry)(this.telemetryLogger, plugins.taskManager);
    return {
      isActionTypeEnabled: (id, options = {
        notifyUsage: false
      }) => {
        return this.actionTypeRegistry.isActionTypeEnabled(id, options);
      },
      isActionExecutable: (actionId, actionTypeId, options = {
        notifyUsage: false
      }) => {
        return this.actionTypeRegistry.isActionExecutable(actionId, actionTypeId, options);
      },

      getActionsAuthorizationWithRequest(request) {
        return instantiateAuthorization(request);
      },

      getActionsClientWithRequest: secureGetActionsClientWithRequest,
      preconfiguredActions,
      renderActionParameterTemplates: (...args) => renderActionParameterTemplates(actionTypeRegistry, ...args)
    };
  }

  getServicesFactory(getScopedClient, elasticsearch) {
    return request => ({
      callCluster: elasticsearch.legacy.client.asScoped(request).callAsCurrentUser,
      savedObjectsClient: getScopedClient(request),
      scopedClusterClient: elasticsearch.client.asScoped(request).asCurrentUser,

      getLegacyScopedClusterClient(clusterClient) {
        return clusterClient.asScoped(request);
      }

    });
  }

  stop() {
    if (this.licenseState) {
      this.licenseState.clean();
    }
  }

}

exports.ActionsPlugin = ActionsPlugin;

function renderActionParameterTemplates(actionTypeRegistry, actionTypeId, params, variables) {
  const actionType = actionTypeRegistry === null || actionTypeRegistry === void 0 ? void 0 : actionTypeRegistry.get(actionTypeId);

  if (actionType !== null && actionType !== void 0 && actionType.renderParameterTemplates) {
    return actionType.renderParameterTemplates(params, variables);
  } else {
    return (0, _mustache_renderer.renderMustacheObject)(params, variables);
  }
}