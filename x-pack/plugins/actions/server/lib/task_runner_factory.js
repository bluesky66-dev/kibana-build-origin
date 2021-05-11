"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskRunnerFactory = void 0;

var _lodash = require("lodash");

var _pipeable = require("fp-ts/lib/pipeable");

var _Option = require("fp-ts/lib/Option");

var _server = require("../../../spaces/server");

var _server2 = require("../../../../../src/core/server");

var _executor_error = require("./executor_error");

var _errors = require("./errors");

var _saved_objects = require("../saved_objects");

var _action_execution_source = require("./action_execution_source");

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

class TaskRunnerFactory {
  constructor(actionExecutor) {
    _defineProperty(this, "isInitialized", false);

    _defineProperty(this, "taskRunnerContext", void 0);

    _defineProperty(this, "actionExecutor", void 0);

    this.actionExecutor = actionExecutor;
  }

  initialize(taskRunnerContext) {
    if (this.isInitialized) {
      throw new Error('TaskRunnerFactory already initialized');
    }

    this.isInitialized = true;
    this.taskRunnerContext = taskRunnerContext;
  }

  create({
    taskInstance
  }) {
    if (!this.isInitialized) {
      throw new Error('TaskRunnerFactory not initialized');
    }

    const {
      actionExecutor
    } = this;
    const {
      logger,
      encryptedSavedObjectsClient,
      spaceIdToNamespace,
      basePathService,
      getUnsecuredSavedObjectsClient
    } = this.taskRunnerContext;
    return {
      async run() {
        const {
          spaceId,
          actionTaskParamsId
        } = taskInstance.params;
        const namespace = spaceIdToNamespace(spaceId);
        const {
          attributes: {
            actionId,
            params,
            apiKey
          },
          references
        } = await encryptedSavedObjectsClient.getDecryptedAsInternalUser(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, actionTaskParamsId, {
          namespace
        });
        const requestHeaders = {};

        if (apiKey) {
          requestHeaders.authorization = `ApiKey ${apiKey}`;
        }

        const path = (0, _server.addSpaceIdToPath)('/', spaceId); // Since we're using API keys and accessing elasticsearch can only be done
        // via a request, we're faking one with the proper authorization headers.

        const fakeRequest = _server2.KibanaRequest.from({
          headers: requestHeaders,
          path: '/',
          route: {
            settings: {}
          },
          url: {
            href: '/'
          },
          raw: {
            req: {
              url: '/'
            }
          }
        });

        basePathService.set(fakeRequest, path);
        let executorResult;

        try {
          executorResult = await actionExecutor.execute({
            params,
            actionId,
            request: fakeRequest,
            ...getSourceFromReferences(references)
          });
        } catch (e) {
          if (e instanceof _errors.ActionTypeDisabledError) {
            // We'll stop re-trying due to action being forbidden
            throw new _executor_error.ExecutorError(e.message, {}, false);
          }

          throw e;
        }

        if (executorResult.status === 'error') {
          // Task manager error handler only kicks in when an error thrown (at this time)
          // So what we have to do is throw when the return status is `error`.
          throw new _executor_error.ExecutorError(executorResult.message, executorResult.data, executorResult.retry == null ? false : executorResult.retry);
        } // Cleanup action_task_params object now that we're done with it


        try {
          // If the request has reached this far we can assume the user is allowed to run clean up
          // We would idealy secure every operation but in order to support clean up of legacy alerts
          // we allow this operation in an unsecured manner
          // Once support for legacy alert RBAC is dropped, this can be secured
          await getUnsecuredSavedObjectsClient(fakeRequest).delete(_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE, actionTaskParamsId);
        } catch (e) {
          // Log error only, we shouldn't fail the task because of an error here (if ever there's retry logic)
          logger.error(`Failed to cleanup ${_saved_objects.ACTION_TASK_PARAMS_SAVED_OBJECT_TYPE} object [id="${actionTaskParamsId}"]: ${e.message}`);
        }
      }

    };
  }

}

exports.TaskRunnerFactory = TaskRunnerFactory;

function getSourceFromReferences(references) {
  return (0, _pipeable.pipe)((0, _Option.fromNullable)(references.find(ref => ref.name === 'source')), (0, _Option.map)(source => ({
    source: (0, _action_execution_source.asSavedObjectExecutionSource)((0, _lodash.pick)(source, 'id', 'type'))
  })), (0, _Option.getOrElse)(() => ({})));
}