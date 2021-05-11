"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TelemetryDiagTask = exports.TelemetryDiagTaskConstants = void 0;

var _moment = _interopRequireDefault(require("moment"));

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

const TelemetryDiagTaskConstants = {
  TIMEOUT: '1m',
  TYPE: 'security:endpoint-diagnostics',
  INTERVAL: '5m',
  VERSION: '1.0.0'
};
exports.TelemetryDiagTaskConstants = TelemetryDiagTaskConstants;

class TelemetryDiagTask {
  constructor(logger, _taskManager, sender) {
    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "sender", void 0);

    _defineProperty(this, "start", async taskManager => {
      try {
        await taskManager.ensureScheduled({
          id: this.getTaskId(),
          taskType: TelemetryDiagTaskConstants.TYPE,
          scope: ['securitySolution'],
          schedule: {
            interval: TelemetryDiagTaskConstants.INTERVAL
          },
          state: {
            runs: 0
          },
          params: {
            version: TelemetryDiagTaskConstants.VERSION
          }
        });
      } catch (e) {
        this.logger.error(`Error scheduling task, received ${e.message}`);
      }
    });

    _defineProperty(this, "getTaskId", () => {
      return `${TelemetryDiagTaskConstants.TYPE}:${TelemetryDiagTaskConstants.VERSION}`;
    });

    _defineProperty(this, "runTask", async (taskId, searchFrom, searchTo) => {
      var _response$hits;

      this.logger.debug(`Running task ${taskId}`);

      if (taskId !== this.getTaskId()) {
        this.logger.debug(`Outdated task running: ${taskId}`);
        return 0;
      }

      const isOptedIn = await this.sender.isTelemetryOptedIn();

      if (!isOptedIn) {
        this.logger.debug(`Telemetry is not opted-in.`);
        return 0;
      }

      const response = await this.sender.fetchDiagnosticAlerts(searchFrom, searchTo);
      const hits = ((_response$hits = response.hits) === null || _response$hits === void 0 ? void 0 : _response$hits.hits) || [];

      if (!Array.isArray(hits) || !hits.length) {
        this.logger.debug('no diagnostic alerts retrieved');
        return 0;
      }

      this.logger.debug(`Received ${hits.length} diagnostic alerts`);
      const diagAlerts = hits.map(h => h._source);
      this.sender.queueTelemetryEvents(diagAlerts);
      return diagAlerts.length;
    });

    this.logger = logger;
    this.sender = sender;

    _taskManager.registerTaskDefinitions({
      [TelemetryDiagTaskConstants.TYPE]: {
        title: 'Security Solution Telemetry Diagnostics task',
        timeout: TelemetryDiagTaskConstants.TIMEOUT,
        createTaskRunner: ({
          taskInstance
        }) => {
          const {
            state
          } = taskInstance;
          return {
            run: async () => {
              var _taskInstance$state;

              const executeTo = (0, _moment.default)().utc().toISOString();
              const executeFrom = this.getLastExecutionTimestamp(executeTo, (_taskInstance$state = taskInstance.state) === null || _taskInstance$state === void 0 ? void 0 : _taskInstance$state.lastExecutionTimestamp);
              const hits = await this.runTask(taskInstance.id, executeFrom, executeTo);
              return {
                state: {
                  lastExecutionTimestamp: executeTo,
                  lastDiagAlertCount: hits,
                  runs: (state.runs || 0) + 1
                }
              };
            },
            cancel: async () => {}
          };
        }
      }
    });
  }

  getLastExecutionTimestamp(executeTo, lastExecutionTimestamp) {
    if (lastExecutionTimestamp === undefined) {
      this.logger.debug(`No last execution timestamp defined`);
      return (0, _moment.default)(executeTo).subtract(5, 'minutes').toISOString();
    }

    if ((0, _moment.default)(executeTo).diff(lastExecutionTimestamp, 'minutes') >= 10) {
      this.logger.debug(`last execution timestamp was greater than 10 minutes`);
      return (0, _moment.default)(executeTo).subtract(10, 'minutes').toISOString();
    }

    return lastExecutionTimestamp;
  }

}

exports.TelemetryDiagTask = TelemetryDiagTask;