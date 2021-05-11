"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlertsClient = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../src/core/server");

var _server2 = require("../../../../../src/plugins/data/server");

var _types = require("../types");

var _lib = require("../lib");

var _alert_task_instance = require("../task_runner/alert_task_instance");

var _authorization = require("../authorization");

var _iso_or_relative_date = require("../lib/iso_or_relative_date");

var _alert_instance_summary_from_event_log = require("../lib/alert_instance_summary_from_event_log");

var _server3 = require("../../../security/server");

var _parse_duration = require("../../common/parse_duration");

var _retry_if_conflicts = require("../lib/retry_if_conflicts");

var _saved_objects = require("../saved_objects");

var _mark_api_key_for_invalidation = require("../invalidate_pending_api_keys/mark_api_key_for_invalidation");

var _audit_events = require("./audit_events");

var _common = require("../../../../../src/plugins/data/common");

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

class AlertsClient {
  constructor({
    alertTypeRegistry,
    unsecuredSavedObjectsClient,
    authorization,
    taskManager,
    logger,
    spaceId,
    namespace,
    getUserName,
    createAPIKey,
    encryptedSavedObjectsClient,
    getActionsClient,
    actionsAuthorization,
    getEventLogClient,
    kibanaVersion,
    auditLogger
  }) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "getUserName", void 0);

    _defineProperty(this, "spaceId", void 0);

    _defineProperty(this, "namespace", void 0);

    _defineProperty(this, "taskManager", void 0);

    _defineProperty(this, "unsecuredSavedObjectsClient", void 0);

    _defineProperty(this, "authorization", void 0);

    _defineProperty(this, "alertTypeRegistry", void 0);

    _defineProperty(this, "createAPIKey", void 0);

    _defineProperty(this, "getActionsClient", void 0);

    _defineProperty(this, "actionsAuthorization", void 0);

    _defineProperty(this, "getEventLogClient", void 0);

    _defineProperty(this, "encryptedSavedObjectsClient", void 0);

    _defineProperty(this, "kibanaVersion", void 0);

    _defineProperty(this, "auditLogger", void 0);

    this.logger = logger;
    this.getUserName = getUserName;
    this.spaceId = spaceId;
    this.namespace = namespace;
    this.taskManager = taskManager;
    this.alertTypeRegistry = alertTypeRegistry;
    this.unsecuredSavedObjectsClient = unsecuredSavedObjectsClient;
    this.authorization = authorization;
    this.createAPIKey = createAPIKey;
    this.encryptedSavedObjectsClient = encryptedSavedObjectsClient;
    this.getActionsClient = getActionsClient;
    this.actionsAuthorization = actionsAuthorization;
    this.getEventLogClient = getEventLogClient;
    this.kibanaVersion = kibanaVersion;
    this.auditLogger = auditLogger;
  }

  async create({
    data,
    options
  }) {
    var _alertType$validate, _this$auditLogger2;

    const id = (options === null || options === void 0 ? void 0 : options.id) || _server.SavedObjectsUtils.generateId();

    try {
      await this.authorization.ensureAuthorized(data.alertTypeId, data.consumer, _authorization.WriteOperations.Create);
    } catch (error) {
      var _this$auditLogger;

      (_this$auditLogger = this.auditLogger) === null || _this$auditLogger === void 0 ? void 0 : _this$auditLogger.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.CREATE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    this.alertTypeRegistry.ensureAlertTypeEnabled(data.alertTypeId); // Throws an error if alert type isn't registered

    const alertType = this.alertTypeRegistry.get(data.alertTypeId);
    const validatedAlertTypeParams = (0, _lib.validateAlertTypeParams)(data.params, (_alertType$validate = alertType.validate) === null || _alertType$validate === void 0 ? void 0 : _alertType$validate.params);
    const username = await this.getUserName();
    const createdAPIKey = data.enabled ? await this.createAPIKey(this.generateAPIKeyName(alertType.id, data.name)) : null;
    this.validateActions(alertType, data.actions);
    const createTime = Date.now();
    const {
      references,
      actions
    } = await this.denormalizeActions(data.actions);
    const notifyWhen = (0, _lib.getAlertNotifyWhenType)(data.notifyWhen, data.throttle);
    const rawAlert = { ...data,
      ...this.apiKeyAsAlertAttributes(createdAPIKey, username),
      actions,
      createdBy: username,
      updatedBy: username,
      createdAt: new Date(createTime).toISOString(),
      updatedAt: new Date(createTime).toISOString(),
      params: validatedAlertTypeParams,
      muteAll: false,
      mutedInstanceIds: [],
      notifyWhen,
      executionStatus: {
        status: 'pending',
        lastExecutionDate: new Date().toISOString(),
        error: null
      }
    };
    (_this$auditLogger2 = this.auditLogger) === null || _this$auditLogger2 === void 0 ? void 0 : _this$auditLogger2.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.CREATE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    let createdAlert;

    try {
      createdAlert = await this.unsecuredSavedObjectsClient.create('alert', this.updateMeta(rawAlert), { ...options,
        references,
        id
      });
    } catch (e) {
      // Avoid unused API key
      (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
        apiKey: rawAlert.apiKey
      }, this.logger, this.unsecuredSavedObjectsClient);
      throw e;
    }

    if (data.enabled) {
      let scheduledTask;

      try {
        scheduledTask = await this.scheduleAlert(createdAlert.id, rawAlert.alertTypeId, data.schedule);
      } catch (e) {
        // Cleanup data, something went wrong scheduling the task
        try {
          await this.unsecuredSavedObjectsClient.delete('alert', createdAlert.id);
        } catch (err) {
          // Skip the cleanup error and throw the task manager error to avoid confusion
          this.logger.error(`Failed to cleanup alert "${createdAlert.id}" after scheduling task failed. Error: ${err.message}`);
        }

        throw e;
      }

      await this.unsecuredSavedObjectsClient.update('alert', createdAlert.id, {
        scheduledTaskId: scheduledTask.id
      });
      createdAlert.attributes.scheduledTaskId = scheduledTask.id;
    }

    return this.getAlertFromRaw(createdAlert.id, createdAlert.attributes, references);
  }

  async get({
    id
  }) {
    var _this$auditLogger4;

    const result = await this.unsecuredSavedObjectsClient.get('alert', id);

    try {
      await this.authorization.ensureAuthorized(result.attributes.alertTypeId, result.attributes.consumer, _authorization.ReadOperations.Get);
    } catch (error) {
      var _this$auditLogger3;

      (_this$auditLogger3 = this.auditLogger) === null || _this$auditLogger3 === void 0 ? void 0 : _this$auditLogger3.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.GET,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger4 = this.auditLogger) === null || _this$auditLogger4 === void 0 ? void 0 : _this$auditLogger4.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.GET,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    return this.getAlertFromRaw(result.id, result.attributes, result.references);
  }

  async getAlertState({
    id
  }) {
    const alert = await this.get({
      id
    });
    await this.authorization.ensureAuthorized(alert.alertTypeId, alert.consumer, _authorization.ReadOperations.GetAlertState);

    if (alert.scheduledTaskId) {
      const {
        state
      } = (0, _alert_task_instance.taskInstanceToAlertTaskInstance)(await this.taskManager.get(alert.scheduledTaskId), alert);
      return state;
    }
  }

  async getAlertInstanceSummary({
    id,
    dateStart
  }) {
    this.logger.debug(`getAlertInstanceSummary(): getting alert ${id}`);
    const alert = await this.get({
      id
    });
    await this.authorization.ensureAuthorized(alert.alertTypeId, alert.consumer, _authorization.ReadOperations.GetAlertInstanceSummary); // default duration of instance summary is 60 * alert interval

    const dateNow = new Date();
    const durationMillis = (0, _parse_duration.parseDuration)(alert.schedule.interval) * 60;
    const defaultDateStart = new Date(dateNow.valueOf() - durationMillis);
    const parsedDateStart = parseDate(dateStart, 'dateStart', defaultDateStart);
    const eventLogClient = await this.getEventLogClient();
    this.logger.debug(`getAlertInstanceSummary(): search the event log for alert ${id}`);
    let events;

    try {
      const queryResults = await eventLogClient.findEventsBySavedObjectIds('alert', [id], {
        page: 1,
        per_page: 10000,
        start: parsedDateStart.toISOString(),
        end: dateNow.toISOString(),
        sort_order: 'desc'
      });
      events = queryResults.data;
    } catch (err) {
      this.logger.debug(`alertsClient.getAlertInstanceSummary(): error searching event log for alert ${id}: ${err.message}`);
      events = [];
    }

    return (0, _alert_instance_summary_from_event_log.alertInstanceSummaryFromEventLog)({
      alert,
      events,
      dateStart: parsedDateStart.toISOString(),
      dateEnd: dateNow.toISOString()
    });
  }

  async find({
    options: {
      fields,
      ...options
    } = {}
  } = {}) {
    var _ref;

    let authorizationTuple;

    try {
      authorizationTuple = await this.authorization.getFindAuthorizationFilter();
    } catch (error) {
      var _this$auditLogger5;

      (_this$auditLogger5 = this.auditLogger) === null || _this$auditLogger5 === void 0 ? void 0 : _this$auditLogger5.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.FIND,
        error
      }));
      throw error;
    }

    const {
      filter: authorizationFilter,
      ensureAlertTypeIsAuthorized,
      logSuccessfulAuthorization
    } = authorizationTuple;
    const {
      page,
      per_page: perPage,
      total,
      saved_objects: data
    } = await this.unsecuredSavedObjectsClient.find({ ...options,
      filter: (_ref = authorizationFilter && options.filter ? _common.nodeBuilder.and([_server2.esKuery.fromKueryExpression(options.filter), authorizationFilter]) : authorizationFilter) !== null && _ref !== void 0 ? _ref : options.filter,
      fields: fields ? this.includeFieldsRequiredForAuthentication(fields) : fields,
      type: 'alert'
    });
    const authorizedData = data.map(({
      id,
      attributes,
      references
    }) => {
      try {
        ensureAlertTypeIsAuthorized(attributes.alertTypeId, attributes.consumer);
      } catch (error) {
        var _this$auditLogger6;

        (_this$auditLogger6 = this.auditLogger) === null || _this$auditLogger6 === void 0 ? void 0 : _this$auditLogger6.log((0, _audit_events.alertAuditEvent)({
          action: _audit_events.AlertAuditAction.FIND,
          savedObject: {
            type: 'alert',
            id
          },
          error
        }));
        throw error;
      }

      return this.getAlertFromRaw(id, fields ? (0, _lodash.pick)(attributes, fields) : attributes, references);
    });
    authorizedData.forEach(({
      id
    }) => {
      var _this$auditLogger7;

      return (_this$auditLogger7 = this.auditLogger) === null || _this$auditLogger7 === void 0 ? void 0 : _this$auditLogger7.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.FIND,
        savedObject: {
          type: 'alert',
          id
        }
      }));
    });
    logSuccessfulAuthorization();
    return {
      page,
      perPage,
      total,
      data: authorizedData
    };
  }

  async aggregate({
    options: {
      fields,
      ...options
    } = {}
  } = {}) {
    // Replace this when saved objects supports aggregations https://github.com/elastic/kibana/pull/64002
    const alertExecutionStatus = await Promise.all(_types.AlertExecutionStatusValues.map(async status => {
      var _ref2;

      const {
        filter: authorizationFilter,
        logSuccessfulAuthorization
      } = await this.authorization.getFindAuthorizationFilter();
      const filter = options.filter ? `${options.filter} and alert.attributes.executionStatus.status:(${status})` : `alert.attributes.executionStatus.status:(${status})`;
      const {
        total
      } = await this.unsecuredSavedObjectsClient.find({ ...options,
        filter: (_ref2 = authorizationFilter && filter ? _common.nodeBuilder.and([_server2.esKuery.fromKueryExpression(filter), authorizationFilter]) : authorizationFilter) !== null && _ref2 !== void 0 ? _ref2 : filter,
        page: 1,
        perPage: 0,
        type: 'alert'
      });
      logSuccessfulAuthorization();
      return {
        [status]: total
      };
    }));
    return {
      alertExecutionStatus: alertExecutionStatus.reduce((acc, curr) => Object.assign(acc, curr), {})
    };
  }

  async delete({
    id
  }) {
    var _this$auditLogger9;

    let taskIdToRemove;
    let apiKeyToInvalidate = null;
    let attributes;

    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      apiKeyToInvalidate = decryptedAlert.attributes.apiKey;
      taskIdToRemove = decryptedAlert.attributes.scheduledTaskId;
      attributes = decryptedAlert.attributes;
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`delete(): Failed to load API key to invalidate on alert ${id}: ${e.message}`); // Still attempt to load the scheduledTaskId using SOC

      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      taskIdToRemove = alert.attributes.scheduledTaskId;
      attributes = alert.attributes;
    }

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.Delete);
    } catch (error) {
      var _this$auditLogger8;

      (_this$auditLogger8 = this.auditLogger) === null || _this$auditLogger8 === void 0 ? void 0 : _this$auditLogger8.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.DELETE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger9 = this.auditLogger) === null || _this$auditLogger9 === void 0 ? void 0 : _this$auditLogger9.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.DELETE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    const removeResult = await this.unsecuredSavedObjectsClient.delete('alert', id);
    await Promise.all([taskIdToRemove ? this.taskManager.removeIfExists(taskIdToRemove) : null, apiKeyToInvalidate ? (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
      apiKey: apiKeyToInvalidate
    }, this.logger, this.unsecuredSavedObjectsClient) : null]);
    return removeResult;
  }

  async update({
    id,
    data
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.update('${id}')`, async () => await this.updateWithOCC({
      id,
      data
    }));
  }

  async updateWithOCC({
    id,
    data
  }) {
    var _this$auditLogger11;

    let alertSavedObject;

    try {
      alertSavedObject = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`update(): Failed to load API key to invalidate on alert ${id}: ${e.message}`); // Still attempt to load the object using SOC

      alertSavedObject = await this.unsecuredSavedObjectsClient.get('alert', id);
    }

    try {
      await this.authorization.ensureAuthorized(alertSavedObject.attributes.alertTypeId, alertSavedObject.attributes.consumer, _authorization.WriteOperations.Update);
    } catch (error) {
      var _this$auditLogger10;

      (_this$auditLogger10 = this.auditLogger) === null || _this$auditLogger10 === void 0 ? void 0 : _this$auditLogger10.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.UPDATE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger11 = this.auditLogger) === null || _this$auditLogger11 === void 0 ? void 0 : _this$auditLogger11.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.UPDATE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(alertSavedObject.attributes.alertTypeId);
    const updateResult = await this.updateAlert({
      id,
      data
    }, alertSavedObject);
    await Promise.all([alertSavedObject.attributes.apiKey ? (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
      apiKey: alertSavedObject.attributes.apiKey
    }, this.logger, this.unsecuredSavedObjectsClient) : null, (async () => {
      if (updateResult.scheduledTaskId && !(0, _lodash.isEqual)(alertSavedObject.attributes.schedule, updateResult.schedule)) {
        this.taskManager.runNow(updateResult.scheduledTaskId).then(() => {
          this.logger.debug(`Alert update has rescheduled the underlying task: ${updateResult.scheduledTaskId}`);
        }).catch(err => {
          this.logger.error(`Alert update failed to run its underlying task. TaskManager runNow failed with Error: ${err.message}`);
        });
      }
    })()]);
    return updateResult;
  }

  async updateAlert({
    id,
    data
  }, {
    attributes,
    version
  }) {
    var _alertType$validate2;

    const alertType = this.alertTypeRegistry.get(attributes.alertTypeId); // Validate

    const validatedAlertTypeParams = (0, _lib.validateAlertTypeParams)(data.params, (_alertType$validate2 = alertType.validate) === null || _alertType$validate2 === void 0 ? void 0 : _alertType$validate2.params);
    this.validateActions(alertType, data.actions);
    const {
      actions,
      references
    } = await this.denormalizeActions(data.actions);
    const username = await this.getUserName();
    const createdAPIKey = attributes.enabled ? await this.createAPIKey(this.generateAPIKeyName(alertType.id, data.name)) : null;
    const apiKeyAttributes = this.apiKeyAsAlertAttributes(createdAPIKey, username);
    const notifyWhen = (0, _lib.getAlertNotifyWhenType)(data.notifyWhen, data.throttle);
    let updatedObject;
    const createAttributes = this.updateMeta({ ...attributes,
      ...data,
      ...apiKeyAttributes,
      params: validatedAlertTypeParams,
      actions,
      notifyWhen,
      updatedBy: username,
      updatedAt: new Date().toISOString()
    });

    try {
      updatedObject = await this.unsecuredSavedObjectsClient.create('alert', createAttributes, {
        id,
        overwrite: true,
        version,
        references
      });
    } catch (e) {
      // Avoid unused API key
      (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
        apiKey: createAttributes.apiKey
      }, this.logger, this.unsecuredSavedObjectsClient);
      throw e;
    }

    return this.getPartialAlertFromRaw(id, updatedObject.attributes, updatedObject.references);
  }

  apiKeyAsAlertAttributes(apiKey, username) {
    return apiKey && apiKey.apiKeysEnabled ? {
      apiKeyOwner: username,
      apiKey: Buffer.from(`${apiKey.result.id}:${apiKey.result.api_key}`).toString('base64')
    } : {
      apiKeyOwner: null,
      apiKey: null
    };
  }

  async updateApiKey({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.updateApiKey('${id}')`, async () => await this.updateApiKeyWithOCC({
      id
    }));
  }

  async updateApiKeyWithOCC({
    id
  }) {
    var _this$auditLogger13;

    let apiKeyToInvalidate = null;
    let attributes;
    let version;

    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      apiKeyToInvalidate = decryptedAlert.attributes.apiKey;
      attributes = decryptedAlert.attributes;
      version = decryptedAlert.version;
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`updateApiKey(): Failed to load API key to invalidate on alert ${id}: ${e.message}`); // Still attempt to load the attributes and version using SOC

      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      attributes = alert.attributes;
      version = alert.version;
    }

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.UpdateApiKey);

      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger12;

      (_this$auditLogger12 = this.auditLogger) === null || _this$auditLogger12 === void 0 ? void 0 : _this$auditLogger12.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.UPDATE_API_KEY,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    const username = await this.getUserName();
    const updateAttributes = this.updateMeta({ ...attributes,
      ...this.apiKeyAsAlertAttributes(await this.createAPIKey(this.generateAPIKeyName(attributes.alertTypeId, attributes.name)), username),
      updatedAt: new Date().toISOString(),
      updatedBy: username
    });
    (_this$auditLogger13 = this.auditLogger) === null || _this$auditLogger13 === void 0 ? void 0 : _this$auditLogger13.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.UPDATE_API_KEY,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);

    try {
      await this.unsecuredSavedObjectsClient.update('alert', id, updateAttributes, {
        version
      });
    } catch (e) {
      // Avoid unused API key
      (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
        apiKey: updateAttributes.apiKey
      }, this.logger, this.unsecuredSavedObjectsClient);
      throw e;
    }

    if (apiKeyToInvalidate) {
      await (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
        apiKey: apiKeyToInvalidate
      }, this.logger, this.unsecuredSavedObjectsClient);
    }
  }

  async enable({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.enable('${id}')`, async () => await this.enableWithOCC({
      id
    }));
  }

  async enableWithOCC({
    id
  }) {
    var _this$auditLogger15;

    let apiKeyToInvalidate = null;
    let attributes;
    let version;

    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      apiKeyToInvalidate = decryptedAlert.attributes.apiKey;
      attributes = decryptedAlert.attributes;
      version = decryptedAlert.version;
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`enable(): Failed to load API key to invalidate on alert ${id}: ${e.message}`); // Still attempt to load the attributes and version using SOC

      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      attributes = alert.attributes;
      version = alert.version;
    }

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.Enable);

      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger14;

      (_this$auditLogger14 = this.auditLogger) === null || _this$auditLogger14 === void 0 ? void 0 : _this$auditLogger14.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.ENABLE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger15 = this.auditLogger) === null || _this$auditLogger15 === void 0 ? void 0 : _this$auditLogger15.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.ENABLE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);

    if (attributes.enabled === false) {
      const username = await this.getUserName();
      const updateAttributes = this.updateMeta({ ...attributes,
        enabled: true,
        ...this.apiKeyAsAlertAttributes(await this.createAPIKey(this.generateAPIKeyName(attributes.alertTypeId, attributes.name)), username),
        updatedBy: username,
        updatedAt: new Date().toISOString()
      });

      try {
        await this.unsecuredSavedObjectsClient.update('alert', id, updateAttributes, {
          version
        });
      } catch (e) {
        // Avoid unused API key
        (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
          apiKey: updateAttributes.apiKey
        }, this.logger, this.unsecuredSavedObjectsClient);
        throw e;
      }

      const scheduledTask = await this.scheduleAlert(id, attributes.alertTypeId, attributes.schedule);
      await this.unsecuredSavedObjectsClient.update('alert', id, {
        scheduledTaskId: scheduledTask.id
      });

      if (apiKeyToInvalidate) {
        await (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
          apiKey: apiKeyToInvalidate
        }, this.logger, this.unsecuredSavedObjectsClient);
      }
    }
  }

  async disable({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.disable('${id}')`, async () => await this.disableWithOCC({
      id
    }));
  }

  async disableWithOCC({
    id
  }) {
    var _this$auditLogger17;

    let apiKeyToInvalidate = null;
    let attributes;
    let version;

    try {
      const decryptedAlert = await this.encryptedSavedObjectsClient.getDecryptedAsInternalUser('alert', id, {
        namespace: this.namespace
      });
      apiKeyToInvalidate = decryptedAlert.attributes.apiKey;
      attributes = decryptedAlert.attributes;
      version = decryptedAlert.version;
    } catch (e) {
      // We'll skip invalidating the API key since we failed to load the decrypted saved object
      this.logger.error(`disable(): Failed to load API key to invalidate on alert ${id}: ${e.message}`); // Still attempt to load the attributes and version using SOC

      const alert = await this.unsecuredSavedObjectsClient.get('alert', id);
      attributes = alert.attributes;
      version = alert.version;
    }

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.Disable);
    } catch (error) {
      var _this$auditLogger16;

      (_this$auditLogger16 = this.auditLogger) === null || _this$auditLogger16 === void 0 ? void 0 : _this$auditLogger16.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.DISABLE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger17 = this.auditLogger) === null || _this$auditLogger17 === void 0 ? void 0 : _this$auditLogger17.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.DISABLE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);

    if (attributes.enabled === true) {
      await this.unsecuredSavedObjectsClient.update('alert', id, this.updateMeta({ ...attributes,
        enabled: false,
        scheduledTaskId: null,
        apiKey: null,
        apiKeyOwner: null,
        updatedBy: await this.getUserName(),
        updatedAt: new Date().toISOString()
      }), {
        version
      });
      await Promise.all([attributes.scheduledTaskId ? this.taskManager.removeIfExists(attributes.scheduledTaskId) : null, apiKeyToInvalidate ? await (0, _mark_api_key_for_invalidation.markApiKeyForInvalidation)({
        apiKey: apiKeyToInvalidate
      }, this.logger, this.unsecuredSavedObjectsClient) : null]);
    }
  }

  async muteAll({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.muteAll('${id}')`, async () => await this.muteAllWithOCC({
      id
    }));
  }

  async muteAllWithOCC({
    id
  }) {
    var _this$auditLogger19;

    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.MuteAll);

      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger18;

      (_this$auditLogger18 = this.auditLogger) === null || _this$auditLogger18 === void 0 ? void 0 : _this$auditLogger18.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.MUTE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger19 = this.auditLogger) === null || _this$auditLogger19 === void 0 ? void 0 : _this$auditLogger19.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.MUTE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);
    const updateAttributes = this.updateMeta({
      muteAll: true,
      mutedInstanceIds: [],
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }

  async unmuteAll({
    id
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.unmuteAll('${id}')`, async () => await this.unmuteAllWithOCC({
      id
    }));
  }

  async unmuteAllWithOCC({
    id
  }) {
    var _this$auditLogger21;

    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', id);

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.UnmuteAll);

      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger20;

      (_this$auditLogger20 = this.auditLogger) === null || _this$auditLogger20 === void 0 ? void 0 : _this$auditLogger20.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.UNMUTE,
        savedObject: {
          type: 'alert',
          id
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger21 = this.auditLogger) === null || _this$auditLogger21 === void 0 ? void 0 : _this$auditLogger21.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.UNMUTE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);
    const updateAttributes = this.updateMeta({
      muteAll: false,
      mutedInstanceIds: [],
      updatedBy: await this.getUserName(),
      updatedAt: new Date().toISOString()
    });
    const updateOptions = {
      version
    };
    await (0, _saved_objects.partiallyUpdateAlert)(this.unsecuredSavedObjectsClient, id, updateAttributes, updateOptions);
  }

  async muteInstance({
    alertId,
    alertInstanceId
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.muteInstance('${alertId}')`, async () => await this.muteInstanceWithOCC({
      alertId,
      alertInstanceId
    }));
  }

  async muteInstanceWithOCC({
    alertId,
    alertInstanceId
  }) {
    var _this$auditLogger23;

    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', alertId);

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.MuteInstance);

      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger22;

      (_this$auditLogger22 = this.auditLogger) === null || _this$auditLogger22 === void 0 ? void 0 : _this$auditLogger22.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.MUTE_INSTANCE,
        savedObject: {
          type: 'alert',
          id: alertId
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger23 = this.auditLogger) === null || _this$auditLogger23 === void 0 ? void 0 : _this$auditLogger23.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.MUTE_INSTANCE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id: alertId
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);
    const mutedInstanceIds = attributes.mutedInstanceIds || [];

    if (!attributes.muteAll && !mutedInstanceIds.includes(alertInstanceId)) {
      mutedInstanceIds.push(alertInstanceId);
      await this.unsecuredSavedObjectsClient.update('alert', alertId, this.updateMeta({
        mutedInstanceIds,
        updatedBy: await this.getUserName(),
        updatedAt: new Date().toISOString()
      }), {
        version
      });
    }
  }

  async unmuteInstance({
    alertId,
    alertInstanceId
  }) {
    return await (0, _retry_if_conflicts.retryIfConflicts)(this.logger, `alertsClient.unmuteInstance('${alertId}')`, async () => await this.unmuteInstanceWithOCC({
      alertId,
      alertInstanceId
    }));
  }

  async unmuteInstanceWithOCC({
    alertId,
    alertInstanceId
  }) {
    var _this$auditLogger25;

    const {
      attributes,
      version
    } = await this.unsecuredSavedObjectsClient.get('alert', alertId);

    try {
      await this.authorization.ensureAuthorized(attributes.alertTypeId, attributes.consumer, _authorization.WriteOperations.UnmuteInstance);

      if (attributes.actions.length) {
        await this.actionsAuthorization.ensureAuthorized('execute');
      }
    } catch (error) {
      var _this$auditLogger24;

      (_this$auditLogger24 = this.auditLogger) === null || _this$auditLogger24 === void 0 ? void 0 : _this$auditLogger24.log((0, _audit_events.alertAuditEvent)({
        action: _audit_events.AlertAuditAction.UNMUTE_INSTANCE,
        savedObject: {
          type: 'alert',
          id: alertId
        },
        error
      }));
      throw error;
    }

    (_this$auditLogger25 = this.auditLogger) === null || _this$auditLogger25 === void 0 ? void 0 : _this$auditLogger25.log((0, _audit_events.alertAuditEvent)({
      action: _audit_events.AlertAuditAction.UNMUTE_INSTANCE,
      outcome: _server3.EventOutcome.UNKNOWN,
      savedObject: {
        type: 'alert',
        id: alertId
      }
    }));
    this.alertTypeRegistry.ensureAlertTypeEnabled(attributes.alertTypeId);
    const mutedInstanceIds = attributes.mutedInstanceIds || [];

    if (!attributes.muteAll && mutedInstanceIds.includes(alertInstanceId)) {
      await this.unsecuredSavedObjectsClient.update('alert', alertId, this.updateMeta({
        updatedBy: await this.getUserName(),
        updatedAt: new Date().toISOString(),
        mutedInstanceIds: mutedInstanceIds.filter(id => id !== alertInstanceId)
      }), {
        version
      });
    }
  }

  async listAlertTypes() {
    return await this.authorization.filterByAlertTypeAuthorization(this.alertTypeRegistry.list(), [_authorization.ReadOperations.Get, _authorization.WriteOperations.Create]);
  }

  async scheduleAlert(id, alertTypeId, schedule) {
    return await this.taskManager.schedule({
      taskType: `alerting:${alertTypeId}`,
      schedule,
      params: {
        alertId: id,
        spaceId: this.spaceId
      },
      state: {
        previousStartedAt: null,
        alertTypeState: {},
        alertInstances: {}
      },
      scope: ['alerting']
    });
  }

  injectReferencesIntoActions(alertId, actions, references) {
    return actions.map(action => {
      const reference = references.find(ref => ref.name === action.actionRef);

      if (!reference) {
        throw new Error(`Action reference "${action.actionRef}" not found in alert id: ${alertId}`);
      }

      return { ...(0, _lodash.omit)(action, 'actionRef'),
        id: reference.id
      };
    });
  }

  getAlertFromRaw(id, rawAlert, references) {
    // In order to support the partial update API of Saved Objects we have to support
    // partial updates of an Alert, but when we receive an actual RawAlert, it is safe
    // to cast the result to an Alert
    return this.getPartialAlertFromRaw(id, rawAlert, references);
  }

  getPartialAlertFromRaw(id, {
    createdAt,
    updatedAt,
    meta,
    notifyWhen,
    scheduledTaskId,
    ...rawAlert
  }, references) {
    // Not the prettiest code here, but if we want to use most of the
    // alert fields from the rawAlert using `...rawAlert` kind of access, we
    // need to specifically delete the executionStatus as it's a different type
    // in RawAlert and Alert.  Probably next time we need to do something similar
    // here, we should look at redesigning the implementation of this method.
    const rawAlertWithoutExecutionStatus = { ...rawAlert
    };
    delete rawAlertWithoutExecutionStatus.executionStatus;
    const executionStatus = (0, _lib.alertExecutionStatusFromRaw)(this.logger, id, rawAlert.executionStatus);
    return {
      id,
      notifyWhen,
      ...rawAlertWithoutExecutionStatus,
      // we currently only support the Interval Schedule type
      // Once we support additional types, this type signature will likely change
      schedule: rawAlert.schedule,
      actions: rawAlert.actions ? this.injectReferencesIntoActions(id, rawAlert.actions, references || []) : [],
      ...(updatedAt ? {
        updatedAt: new Date(updatedAt)
      } : {}),
      ...(createdAt ? {
        createdAt: new Date(createdAt)
      } : {}),
      ...(scheduledTaskId ? {
        scheduledTaskId
      } : {}),
      ...(executionStatus ? {
        executionStatus
      } : {})
    };
  }

  validateActions(alertType, actions) {
    const {
      actionGroups: alertTypeActionGroups
    } = alertType;
    const usedAlertActionGroups = actions.map(action => action.group);
    const availableAlertTypeActionGroups = new Set((0, _lodash.map)(alertTypeActionGroups, 'id'));
    const invalidActionGroups = usedAlertActionGroups.filter(group => !availableAlertTypeActionGroups.has(group));

    if (invalidActionGroups.length) {
      throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerts.alertsClient.validateActions.invalidGroups', {
        defaultMessage: 'Invalid action groups: {groups}',
        values: {
          groups: invalidActionGroups.join(', ')
        }
      }));
    }
  }

  async denormalizeActions(alertActions) {
    const references = [];
    const actions = [];

    if (alertActions.length) {
      const actionsClient = await this.getActionsClient();
      const actionIds = [...new Set(alertActions.map(alertAction => alertAction.id))];
      const actionResults = await actionsClient.getBulk(actionIds);
      const actionTypeIds = [...new Set(actionResults.map(action => action.actionTypeId))];
      actionTypeIds.forEach(id => {
        // Notify action type usage via "isActionTypeEnabled" function
        actionsClient.isActionTypeEnabled(id, {
          notifyUsage: true
        });
      });
      alertActions.forEach(({
        id,
        ...alertAction
      }, i) => {
        const actionResultValue = actionResults.find(action => action.id === id);

        if (actionResultValue) {
          const actionRef = `action_${i}`;
          references.push({
            id,
            name: actionRef,
            type: 'action'
          });
          actions.push({ ...alertAction,
            actionRef,
            actionTypeId: actionResultValue.actionTypeId
          });
        } else {
          actions.push({ ...alertAction,
            actionRef: '',
            actionTypeId: ''
          });
        }
      });
    }

    return {
      actions,
      references
    };
  }

  includeFieldsRequiredForAuthentication(fields) {
    return (0, _lodash.uniq)([...fields, 'alertTypeId', 'consumer']);
  }

  generateAPIKeyName(alertTypeId, alertName) {
    return (0, _lodash.truncate)(`Alerting: ${alertTypeId}/${(0, _lodash.trim)(alertName)}`, {
      length: 256
    });
  }

  updateMeta(alertAttributes) {
    if (alertAttributes.hasOwnProperty('apiKey') || alertAttributes.hasOwnProperty('apiKeyOwner')) {
      var _alertAttributes$meta;

      alertAttributes.meta = (_alertAttributes$meta = alertAttributes.meta) !== null && _alertAttributes$meta !== void 0 ? _alertAttributes$meta : {};
      alertAttributes.meta.versionApiKeyLastmodified = this.kibanaVersion;
    }

    return alertAttributes;
  }

}

exports.AlertsClient = AlertsClient;

function parseDate(dateString, propertyName, defaultValue) {
  if (dateString === undefined) {
    return defaultValue;
  }

  const parsedDate = (0, _iso_or_relative_date.parseIsoOrRelativeDate)(dateString);

  if (parsedDate === undefined) {
    throw _boom.default.badRequest(_i18n.i18n.translate('xpack.alerts.alertsClient.invalidDate', {
      defaultMessage: 'Invalid date for parameter {field}: "{dateValue}"',
      values: {
        field: propertyName,
        dateValue: dateString
      }
    }));
  }

  return parsedDate;
}