"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CasePlugin = void 0;

var _constants = require("../common/constants");

var _api = require("./routes/api");

var _saved_object_types = require("./saved_object_types");

var _services = require("./services");

var _client = require("./client");

var _connectors = require("./connectors");

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

function createConfig(context) {
  return context.config.get();
}

class CasePlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "caseConfigureService", void 0);

    _defineProperty(this, "caseService", void 0);

    _defineProperty(this, "connectorMappingsService", void 0);

    _defineProperty(this, "userActionService", void 0);

    _defineProperty(this, "alertsService", void 0);

    _defineProperty(this, "createRouteHandlerContext", ({
      core,
      caseService,
      caseConfigureService,
      connectorMappingsService,
      userActionService,
      alertsService,
      logger
    }) => {
      return async (context, request, response) => {
        const [{
          savedObjects
        }] = await core.getStartServices();
        const user = await caseService.getUser({
          request
        });
        return {
          getCaseClient: () => {
            return new _client.CaseClientHandler({
              scopedClusterClient: context.core.elasticsearch.client.asCurrentUser,
              savedObjectsClient: savedObjects.getScopedClient(request),
              caseService,
              caseConfigureService,
              connectorMappingsService,
              userActionService,
              alertsService,
              user,
              logger
            });
          }
        };
      };
    });

    this.log = this.initializerContext.logger.get();
  }

  async setup(core, plugins) {
    const config = createConfig(this.initializerContext);

    if (!config.enabled) {
      return;
    }

    core.savedObjects.registerType(_saved_object_types.caseCommentSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseConfigureSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseConnectorMappingsSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.subCaseSavedObjectType);
    core.savedObjects.registerType(_saved_object_types.caseUserActionSavedObjectType);
    this.log.debug(`Setting up Case Workflow with core contract [${Object.keys(core)}] and plugins [${Object.keys(plugins)}]`);
    this.caseService = new _services.CaseService(this.log, plugins.security != null ? plugins.security.authc : undefined);
    this.caseConfigureService = await new _services.CaseConfigureService(this.log).setup();
    this.connectorMappingsService = await new _services.ConnectorMappingsService(this.log).setup();
    this.userActionService = await new _services.CaseUserActionService(this.log).setup();
    this.alertsService = new _services.AlertService();
    core.http.registerRouteHandlerContext(_constants.APP_ID, this.createRouteHandlerContext({
      core,
      caseService: this.caseService,
      caseConfigureService: this.caseConfigureService,
      connectorMappingsService: this.connectorMappingsService,
      userActionService: this.userActionService,
      alertsService: this.alertsService,
      logger: this.log
    }));
    const router = core.http.createRouter();
    (0, _api.initCaseApi)({
      logger: this.log,
      caseService: this.caseService,
      caseConfigureService: this.caseConfigureService,
      connectorMappingsService: this.connectorMappingsService,
      userActionService: this.userActionService,
      router
    });
    (0, _connectors.registerConnectors)({
      actionsRegisterType: plugins.actions.registerType,
      logger: this.log,
      caseService: this.caseService,
      caseConfigureService: this.caseConfigureService,
      connectorMappingsService: this.connectorMappingsService,
      userActionService: this.userActionService,
      alertsService: this.alertsService
    });
  }

  start(core) {
    this.log.debug(`Starting Case Workflow`);

    const getCaseClientWithRequestAndContext = async (context, request) => {
      const user = await this.caseService.getUser({
        request
      });
      return (0, _client.createExternalCaseClient)({
        scopedClusterClient: context.core.elasticsearch.client.asCurrentUser,
        savedObjectsClient: core.savedObjects.getScopedClient(request),
        user,
        caseService: this.caseService,
        caseConfigureService: this.caseConfigureService,
        connectorMappingsService: this.connectorMappingsService,
        userActionService: this.userActionService,
        alertsService: this.alertsService,
        logger: this.log
      });
    };

    return {
      getCaseClientWithRequestAndContext
    };
  }

  stop() {
    this.log.debug(`Stopping Case Workflow`);
  }

}

exports.CasePlugin = CasePlugin;