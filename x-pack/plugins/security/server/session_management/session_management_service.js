"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SessionManagementService = exports.SESSION_INDEX_CLEANUP_TASK_NAME = void 0;

var _server = require("../../../../../src/core/server");

var _session_cookie = require("./session_cookie");

var _session_index = require("./session_index");

var _session = require("./session");

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
 * Name of the task that is periodically run and performs session index cleanup.
 */


const SESSION_INDEX_CLEANUP_TASK_NAME = 'session_cleanup';
/**
 * Service responsible for the user session management.
 */

exports.SESSION_INDEX_CLEANUP_TASK_NAME = SESSION_INDEX_CLEANUP_TASK_NAME;

class SessionManagementService {
  constructor(logger) {
    this.logger = logger;

    _defineProperty(this, "statusSubscription", void 0);

    _defineProperty(this, "sessionIndex", void 0);

    _defineProperty(this, "sessionCookie", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "isCleanupTaskScheduled", false);
  }

  setup({
    config,
    http,
    taskManager
  }) {
    this.config = config;
    this.sessionCookie = new _session_cookie.SessionCookie({
      config,
      createCookieSessionStorageFactory: http.createCookieSessionStorageFactory,
      serverBasePath: http.basePath.serverBasePath || '/',
      logger: this.logger.get('cookie')
    }); // Register task that will perform periodic session index cleanup.

    taskManager.registerTaskDefinitions({
      [SESSION_INDEX_CLEANUP_TASK_NAME]: {
        title: 'Cleanup expired or invalid user sessions',
        createTaskRunner: () => ({
          run: () => this.sessionIndex.cleanUp()
        })
      }
    });
  }

  start({
    elasticsearchClient,
    kibanaIndexName,
    online$,
    taskManager
  }) {
    this.sessionIndex = new _session_index.SessionIndex({
      config: this.config,
      elasticsearchClient,
      kibanaIndexName,
      logger: this.logger.get('index')
    });
    this.statusSubscription = online$.subscribe(async ({
      scheduleRetry
    }) => {
      try {
        await Promise.all([this.sessionIndex.initialize(), this.scheduleCleanupTask(taskManager)]);
      } catch (err) {
        scheduleRetry();
      }
    });
    return {
      session: new _session.Session({
        logger: this.logger,
        sessionCookie: this.sessionCookie,
        sessionIndex: this.sessionIndex,
        config: this.config
      })
    };
  }

  stop() {
    if (this.statusSubscription !== undefined) {
      this.statusSubscription.unsubscribe();
      this.statusSubscription = undefined;
    }
  }

  async scheduleCleanupTask(taskManager) {
    let currentTask;

    try {
      currentTask = await taskManager.get(SESSION_INDEX_CLEANUP_TASK_NAME);
    } catch (err) {
      if (!_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        this.logger.error(`Failed to retrieve session index cleanup task: ${err.message}`);
        throw err;
      }

      this.logger.debug('Session index cleanup task is not scheduled yet.');
    } // Check if currently scheduled task is scheduled with the correct interval.


    const cleanupInterval = `${this.config.session.cleanupInterval.asSeconds()}s`;

    if (currentTask) {
      var _currentTask$schedule;

      if (((_currentTask$schedule = currentTask.schedule) === null || _currentTask$schedule === void 0 ? void 0 : _currentTask$schedule.interval) === cleanupInterval) {
        this.logger.debug('Session index cleanup task is already scheduled.');
        return;
      }

      this.logger.debug('Session index cleanup interval has changed, the cleanup task will be rescheduled.');

      try {
        await taskManager.remove(SESSION_INDEX_CLEANUP_TASK_NAME);
      } catch (err) {
        // We may have multiple instances of Kibana that are removing old task definition at the
        // same time. If we get 404 here then task was removed by another instance, it's fine.
        if (!_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
          this.logger.error(`Failed to remove old session index cleanup task: ${err.message}`);
          throw err;
        }
      }
    } else if (this.isCleanupTaskScheduled) {
      // WORKAROUND: This is a workaround for the Task Manager issue: https://github.com/elastic/kibana/issues/75501
      // and should be removed as soon as this issue is resolved.
      this.logger.error('Session index cleanup task has been already scheduled, but is missing in the task list for some reason. Please restart Kibana to automatically reschedule this task.');
      return;
    }

    try {
      await taskManager.ensureScheduled({
        id: SESSION_INDEX_CLEANUP_TASK_NAME,
        taskType: SESSION_INDEX_CLEANUP_TASK_NAME,
        scope: ['security'],
        schedule: {
          interval: cleanupInterval
        },
        params: {},
        state: {}
      });
    } catch (err) {
      this.logger.error(`Failed to schedule session index cleanup task: ${err.message}`);
      throw err;
    }

    this.isCleanupTaskScheduled = true;
    this.logger.debug('Successfully scheduled session index cleanup task.');
  }

}

exports.SessionManagementService = SessionManagementService;