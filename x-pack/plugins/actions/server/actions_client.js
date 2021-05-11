"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionsClient = exports.MAX_ACTIONS_RETURNED = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _i18n = require("@kbn/i18n");

var _lodash = require("lodash");

var _server = require("../../../../src/core/server");

var _server2 = require("../../security/server");

var _lib = require("./lib");

var _preconfigured_action_disabled_modification = require("./lib/errors/preconfigured_action_disabled_modification");

var _get_authorization_mode_by_source = require("./authorization/get_authorization_mode_by_source");

var _audit_events = require("./lib/audit_events");

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
} // We are assuming there won't be many actions. This is why we will load
// all the actions in advance and assume the total count to not go over 10000.
// We'll set this max setting assuming it's never reached.


const MAX_ACTIONS_RETURNED = 10000;
exports.MAX_ACTIONS_RETURNED = MAX_ACTIONS_RETURNED;

class ActionsClient {
  constructor({
    actionTypeRegistry,
    defaultKibanaIndex,
    scopedClusterClient,
    unsecuredSavedObjectsClient,
    preconfiguredActions,
    actionExecutor,
    executionEnqueuer,
    request,
    authorization,
    auditLogger
  }) {
    _defineProperty(this, "defaultKibanaIndex", void 0);

    _defineProperty(this, "scopedClusterClient", void 0);

    _defineProperty(this, "unsecuredSavedObjectsClient", void 0);

    _defineProperty(this, "actionTypeRegistry", void 0);

    _defineProperty(this, "preconfiguredActions", void 0);

    _defineProperty(this, "actionExecutor", void 0);

    _defineProperty(this, "request", void 0);

    _defineProperty(this, "authorization", void 0);

    _defineProperty(this, "executionEnqueuer", void 0);

    _defineProperty(this, "auditLogger", void 0);

    this.actionTypeRegistry = actionTypeRegistry;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.scopedClusterClient = scopedClusterClient;
    this.defaultKibanaIndex = defaultKibanaIndex;
    this.preconfiguredActions = preconfiguredActions;
    this.actionExecutor = actionExecutor;
    this.executionEnqueuer = executionEnqueuer;
    this.request = request;
    this.authorization = authorization;
    this.auditLogger = auditLogger;
  }
  /**
   * Create an action
   */


  async create({
    action: {
      actionTypeId,
      name,
      config,
      secrets
    }
  }) {
    var _this$auditLogger2;

    const id = _server.SavedObjectsUtils.generateId();

    try {
      await this.authorization.ensureAuthorized('create', actionTypeId);
    } catch (error) {
      var _this$auditLogger;

      (_this$auditLogger = this.auditLogger) === null || _this$auditLogger === void 0 ? void 0 : _this$auditLogger.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.CREATE,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }

    const actionType = this.actionTypeRegistry.get(actionTypeId);
    const validatedActionTypeConfig = (0, _lib.validateConfig)(actionType, config);
    const validatedActionTypeSecrets = (0, _lib.validateSecrets)(actionType, secrets);
    this.actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    (_this$auditLogger2 = this.auditLogger) === null || _this$auditLogger2 === void 0 ? void 0 : _this$auditLogger2.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.CREATE,
      savedObject: {
        type: 'action',
        id
      },
      outcome: _server2.EventOutcome.UNKNOWN
    }));
    const result = await this.unsecuredSavedObjectsClient.create('action', {
      actionTypeId,
      name,
      config: validatedActionTypeConfig,
      secrets: validatedActionTypeSecrets
    }, {
      id
    });
    return {
      id: result.id,
      actionTypeId: result.attributes.actionTypeId,
      name: result.attributes.name,
      config: result.attributes.config,
      isPreconfigured: false
    };
  }
  /**
   * Update action
   */


  async update({
    id,
    action
  }) {
    var _this$auditLogger4;

    try {
      await this.authorization.ensureAuthorized('update');

      if (this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === id) !== undefined) {
        throw new _preconfigured_action_disabled_modification.PreconfiguredActionDisabledModificationError(_i18n.i18n.translate('xpack.actions.serverSideErrors.predefinedActionUpdateDisabled', {
          defaultMessage: 'Preconfigured action {id} is not allowed to update.',
          values: {
            id
          }
        }), 'update');
      }
    } catch (error) {
      var _this$auditLogger3;

      (_this$auditLogger3 = this.auditLogger) === null || _this$auditLogger3 === void 0 ? void 0 : _this$auditLogger3.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.UPDATE,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }

    const {
      attributes,
      references,
      version
    } = await this.unsecuredSavedObjectsClient.get('action', id);
    const {
      actionTypeId
    } = attributes;
    const {
      name,
      config,
      secrets
    } = action;
    const actionType = this.actionTypeRegistry.get(actionTypeId);
    const validatedActionTypeConfig = (0, _lib.validateConfig)(actionType, config);
    const validatedActionTypeSecrets = (0, _lib.validateSecrets)(actionType, secrets);
    this.actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    (_this$auditLogger4 = this.auditLogger) === null || _this$auditLogger4 === void 0 ? void 0 : _this$auditLogger4.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.UPDATE,
      savedObject: {
        type: 'action',
        id
      },
      outcome: _server2.EventOutcome.UNKNOWN
    }));
    const result = await this.unsecuredSavedObjectsClient.create('action', { ...attributes,
      actionTypeId,
      name,
      config: validatedActionTypeConfig,
      secrets: validatedActionTypeSecrets
    }, (0, _lodash.omitBy)({
      id,
      overwrite: true,
      references,
      version
    }, _lodash.isUndefined));
    return {
      id,
      actionTypeId: result.attributes.actionTypeId,
      name: result.attributes.name,
      config: result.attributes.config,
      isPreconfigured: false
    };
  }
  /**
   * Get an action
   */


  async get({
    id
  }) {
    var _this$auditLogger7;

    try {
      await this.authorization.ensureAuthorized('get');
    } catch (error) {
      var _this$auditLogger5;

      (_this$auditLogger5 = this.auditLogger) === null || _this$auditLogger5 === void 0 ? void 0 : _this$auditLogger5.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.GET,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }

    const preconfiguredActionsList = this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === id);

    if (preconfiguredActionsList !== undefined) {
      var _this$auditLogger6;

      (_this$auditLogger6 = this.auditLogger) === null || _this$auditLogger6 === void 0 ? void 0 : _this$auditLogger6.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.GET,
        savedObject: {
          type: 'action',
          id
        }
      }));
      return {
        id,
        actionTypeId: preconfiguredActionsList.actionTypeId,
        name: preconfiguredActionsList.name,
        isPreconfigured: true
      };
    }

    const result = await this.unsecuredSavedObjectsClient.get('action', id);
    (_this$auditLogger7 = this.auditLogger) === null || _this$auditLogger7 === void 0 ? void 0 : _this$auditLogger7.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.GET,
      savedObject: {
        type: 'action',
        id
      }
    }));
    return {
      id,
      actionTypeId: result.attributes.actionTypeId,
      name: result.attributes.name,
      config: result.attributes.config,
      isPreconfigured: false
    };
  }
  /**
   * Get all actions with preconfigured list
   */


  async getAll() {
    try {
      await this.authorization.ensureAuthorized('get');
    } catch (error) {
      var _this$auditLogger8;

      (_this$auditLogger8 = this.auditLogger) === null || _this$auditLogger8 === void 0 ? void 0 : _this$auditLogger8.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.FIND,
        error
      }));
      throw error;
    }

    const savedObjectsActions = (await this.unsecuredSavedObjectsClient.find({
      perPage: MAX_ACTIONS_RETURNED,
      type: 'action'
    })).saved_objects.map(actionFromSavedObject);
    savedObjectsActions.forEach(({
      id
    }) => {
      var _this$auditLogger9;

      return (_this$auditLogger9 = this.auditLogger) === null || _this$auditLogger9 === void 0 ? void 0 : _this$auditLogger9.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.FIND,
        savedObject: {
          type: 'action',
          id
        }
      }));
    });
    const mergedResult = [...savedObjectsActions, ...this.preconfiguredActions.map(preconfiguredAction => ({
      id: preconfiguredAction.id,
      actionTypeId: preconfiguredAction.actionTypeId,
      name: preconfiguredAction.name,
      isPreconfigured: true
    }))].sort((a, b) => a.name.localeCompare(b.name));
    return await injectExtraFindData(this.defaultKibanaIndex, this.scopedClusterClient, mergedResult);
  }
  /**
   * Get bulk actions with preconfigured list
   */


  async getBulk(ids) {
    try {
      await this.authorization.ensureAuthorized('get');
    } catch (error) {
      ids.forEach(id => {
        var _this$auditLogger10;

        return (_this$auditLogger10 = this.auditLogger) === null || _this$auditLogger10 === void 0 ? void 0 : _this$auditLogger10.log((0, _audit_events.connectorAuditEvent)({
          action: _audit_events.ConnectorAuditAction.GET,
          savedObject: {
            type: 'action',
            id
          },
          error
        }));
      });
      throw error;
    }

    const actionResults = new Array();

    for (const actionId of ids) {
      const action = this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === actionId);

      if (action !== undefined) {
        actionResults.push(action);
      }
    } // Fetch action objects in bulk
    // Excluding preconfigured actions to avoid an not found error, which is already added


    const actionSavedObjectsIds = [...new Set(ids.filter(actionId => !actionResults.find(actionResult => actionResult.id === actionId)))];
    const bulkGetOpts = actionSavedObjectsIds.map(id => ({
      id,
      type: 'action'
    }));
    const bulkGetResult = await this.unsecuredSavedObjectsClient.bulkGet(bulkGetOpts);
    bulkGetResult.saved_objects.forEach(({
      id,
      error
    }) => {
      if (!error && this.auditLogger) {
        this.auditLogger.log((0, _audit_events.connectorAuditEvent)({
          action: _audit_events.ConnectorAuditAction.GET,
          savedObject: {
            type: 'action',
            id
          }
        }));
      }
    });

    for (const action of bulkGetResult.saved_objects) {
      if (action.error) {
        throw _boom.default.badRequest(`Failed to load action ${action.id} (${action.error.statusCode}): ${action.error.message}`);
      }

      actionResults.push(actionFromSavedObject(action));
    }

    return actionResults;
  }
  /**
   * Delete action
   */


  async delete({
    id
  }) {
    var _this$auditLogger12;

    try {
      await this.authorization.ensureAuthorized('delete');

      if (this.preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === id) !== undefined) {
        throw new _preconfigured_action_disabled_modification.PreconfiguredActionDisabledModificationError(_i18n.i18n.translate('xpack.actions.serverSideErrors.predefinedActionDeleteDisabled', {
          defaultMessage: 'Preconfigured action {id} is not allowed to delete.',
          values: {
            id
          }
        }), 'delete');
      }
    } catch (error) {
      var _this$auditLogger11;

      (_this$auditLogger11 = this.auditLogger) === null || _this$auditLogger11 === void 0 ? void 0 : _this$auditLogger11.log((0, _audit_events.connectorAuditEvent)({
        action: _audit_events.ConnectorAuditAction.DELETE,
        savedObject: {
          type: 'action',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger12 = this.auditLogger) === null || _this$auditLogger12 === void 0 ? void 0 : _this$auditLogger12.log((0, _audit_events.connectorAuditEvent)({
      action: _audit_events.ConnectorAuditAction.DELETE,
      outcome: _server2.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'action',
        id
      }
    }));
    return await this.unsecuredSavedObjectsClient.delete('action', id);
  }

  async execute({
    actionId,
    params,
    source
  }) {
    if ((await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(this.unsecuredSavedObjectsClient, source)) === _get_authorization_mode_by_source.AuthorizationMode.RBAC) {
      await this.authorization.ensureAuthorized('execute');
    }

    return this.actionExecutor.execute({
      actionId,
      params,
      source,
      request: this.request
    });
  }

  async enqueueExecution(options) {
    const {
      source
    } = options;

    if ((await (0, _get_authorization_mode_by_source.getAuthorizationModeBySource)(this.unsecuredSavedObjectsClient, source)) === _get_authorization_mode_by_source.AuthorizationMode.RBAC) {
      await this.authorization.ensureAuthorized('execute');
    }

    return this.executionEnqueuer(this.unsecuredSavedObjectsClient, options);
  }

  async listTypes() {
    return this.actionTypeRegistry.list();
  }

  isActionTypeEnabled(actionTypeId, options = {
    notifyUsage: false
  }) {
    return this.actionTypeRegistry.isActionTypeEnabled(actionTypeId, options);
  }

}

exports.ActionsClient = ActionsClient;

function actionFromSavedObject(savedObject) {
  return {
    id: savedObject.id,
    ...savedObject.attributes,
    isPreconfigured: false
  };
}

async function injectExtraFindData(defaultKibanaIndex, scopedClusterClient, actionResults) {
  const aggs = {};

  for (const actionResult of actionResults) {
    aggs[actionResult.id] = {
      filter: {
        bool: {
          must: {
            nested: {
              path: 'references',
              query: {
                bool: {
                  filter: {
                    bool: {
                      must: [{
                        term: {
                          'references.id': actionResult.id
                        }
                      }, {
                        term: {
                          'references.type': 'action'
                        }
                      }]
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }

  const aggregationResult = await scopedClusterClient.callAsInternalUser('search', {
    index: defaultKibanaIndex,
    body: {
      aggs,
      size: 0,
      query: {
        match_all: {}
      }
    }
  });
  return actionResults.map(actionResult => ({ ...actionResult,
    referencedByCount: aggregationResult.aggregations[actionResult.id].doc_count
  }));
}