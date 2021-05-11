"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ActionExecutor = void 0;

var _validate_with_schema = require("./validate_with_schema");

var _plugin = require("../plugin");

var _server = require("../../../event_log/server");

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

class ActionExecutor {
  constructor({
    isESOCanEncrypt
  }) {
    _defineProperty(this, "isInitialized", false);

    _defineProperty(this, "actionExecutorContext", void 0);

    _defineProperty(this, "isESOCanEncrypt", void 0);

    this.isESOCanEncrypt = isESOCanEncrypt;
  }

  initialize(actionExecutorContext) {
    if (this.isInitialized) {
      throw new Error('ActionExecutor already initialized');
    }

    this.isInitialized = true;
    this.actionExecutorContext = actionExecutorContext;
  }

  async execute({
    actionId,
    params,
    request,
    source
  }) {
    if (!this.isInitialized) {
      throw new Error('ActionExecutor not initialized');
    }

    if (!this.isESOCanEncrypt) {
      throw new Error(`Unable to execute action because the Encrypted Saved Objects plugin is missing encryption key. Please set xpack.encryptedSavedObjects.encryptionKey in the kibana.yml or use the bin/kibana-encryption-keys command.`);
    }

    const {
      logger,
      spaces,
      getServices,
      encryptedSavedObjectsClient,
      actionTypeRegistry,
      eventLogger,
      preconfiguredActions,
      getActionsClientWithRequest
    } = this.actionExecutorContext;
    const services = getServices(request);
    const spaceId = spaces && spaces.getSpaceId(request);
    const namespace = spaceId && spaceId !== 'default' ? {
      namespace: spaceId
    } : {};
    const {
      actionTypeId,
      name,
      config,
      secrets
    } = await getActionInfo(await getActionsClientWithRequest(request, source), encryptedSavedObjectsClient, preconfiguredActions, actionId, namespace.namespace);

    if (!actionTypeRegistry.isActionExecutable(actionId, actionTypeId, {
      notifyUsage: true
    })) {
      actionTypeRegistry.ensureActionTypeEnabled(actionTypeId);
    }

    const actionType = actionTypeRegistry.get(actionTypeId);
    let validatedParams;
    let validatedConfig;
    let validatedSecrets;

    try {
      validatedParams = (0, _validate_with_schema.validateParams)(actionType, params);
      validatedConfig = (0, _validate_with_schema.validateConfig)(actionType, config);
      validatedSecrets = (0, _validate_with_schema.validateSecrets)(actionType, secrets);
    } catch (err) {
      return {
        status: 'error',
        actionId,
        message: err.message,
        retry: false
      };
    }

    const actionLabel = `${actionTypeId}:${actionId}: ${name}`;
    logger.debug(`executing action ${actionLabel}`);
    const event = {
      event: {
        action: _plugin.EVENT_LOG_ACTIONS.execute
      },
      kibana: {
        saved_objects: [{
          rel: _server.SAVED_OBJECT_REL_PRIMARY,
          type: 'action',
          id: actionId,
          ...namespace
        }]
      }
    };
    eventLogger.startTiming(event);
    let rawResult;

    try {
      rawResult = await actionType.executor({
        actionId,
        services,
        params: validatedParams,
        config: validatedConfig,
        secrets: validatedSecrets
      });
    } catch (err) {
      rawResult = {
        actionId,
        status: 'error',
        message: 'an error occurred while running the action executor',
        serviceMessage: err.message,
        retry: false
      };
    }

    eventLogger.stopTiming(event); // allow null-ish return to indicate success

    const result = rawResult || {
      actionId,
      status: 'ok'
    };
    event.event = event.event || {};

    if (result.status === 'ok') {
      event.event.outcome = 'success';
      event.message = `action executed: ${actionLabel}`;
    } else if (result.status === 'error') {
      event.event.outcome = 'failure';
      event.message = `action execution failure: ${actionLabel}`;
      event.error = event.error || {};
      event.error.message = actionErrorToMessage(result);
      logger.warn(`action execution failure: ${actionLabel}: ${event.error.message}`);
    } else {
      event.event.outcome = 'failure';
      event.message = `action execution returned unexpected result: ${actionLabel}: "${result.status}"`;
      event.error = event.error || {};
      event.error.message = 'action execution returned unexpected result';
      logger.warn(`action execution failure: ${actionLabel}: returned unexpected result "${result.status}"`);
    }

    eventLogger.logEvent(event);
    return result;
  }

}

exports.ActionExecutor = ActionExecutor;

function actionErrorToMessage(result) {
  let message = result.message || 'unknown error running action';

  if (result.serviceMessage) {
    message = `${message}: ${result.serviceMessage}`;
  }

  if (result.retry instanceof Date) {
    message = `${message}; retry at ${result.retry.toISOString()}`;
  } else if (result.retry) {
    message = `${message}; retry: ${JSON.stringify(result.retry)}`;
  }

  return message;
}

async function getActionInfo(actionsClient, encryptedSavedObjectsClient, preconfiguredActions, actionId, namespace) {
  // check to see if it's a pre-configured action first
  const pcAction = preconfiguredActions.find(preconfiguredAction => preconfiguredAction.id === actionId);

  if (pcAction) {
    return {
      actionTypeId: pcAction.actionTypeId,
      name: pcAction.name,
      config: pcAction.config,
      secrets: pcAction.secrets
    };
  } // if not pre-configured action, should be a saved object
  // ensure user can read the action before processing


  const {
    actionTypeId,
    config,
    name
  } = await actionsClient.get({
    id: actionId
  });
  const {
    attributes: {
      secrets
    }
  } = await encryptedSavedObjectsClient.getDecryptedAsInternalUser('action', actionId, {
    namespace: namespace === 'default' ? undefined : namespace
  });
  return {
    actionTypeId,
    name,
    config,
    secrets
  };
}