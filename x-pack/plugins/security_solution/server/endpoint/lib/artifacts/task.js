"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ManifestTask = exports.ManifestTaskConstants = void 0;

var _common = require("./common");

var _manifest = require("./manifest");

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

const ManifestTaskConstants = {
  TIMEOUT: '1m',
  TYPE: 'endpoint:user-artifact-packager',
  VERSION: '1.0.0'
};
exports.ManifestTaskConstants = ManifestTaskConstants;

class ManifestTask {
  constructor(setupContract) {
    _defineProperty(this, "endpointAppContext", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "start", async startContract => {
      try {
        await startContract.taskManager.ensureScheduled({
          id: this.getTaskId(),
          taskType: ManifestTaskConstants.TYPE,
          scope: ['securitySolution'],
          schedule: {
            interval: (await this.endpointAppContext.config()).packagerTaskInterval
          },
          state: {},
          params: {
            version: ManifestTaskConstants.VERSION
          }
        });
      } catch (e) {
        this.logger.debug(`Error scheduling task, received ${e.message}`);
      }
    });

    _defineProperty(this, "getTaskId", () => {
      return `${ManifestTaskConstants.TYPE}:${ManifestTaskConstants.VERSION}`;
    });

    _defineProperty(this, "runTask", async taskId => {
      // Check that this task is current
      if (taskId !== this.getTaskId()) {
        // old task, return
        this.logger.debug(`Outdated task running: ${taskId}`);
        return;
      }

      const manifestManager = this.endpointAppContext.service.getManifestManager();

      if (manifestManager === undefined) {
        this.logger.debug('Manifest Manager not available.');
        return;
      }

      try {
        // Last manifest we computed, which was saved to ES
        const oldManifest = await manifestManager.getLastComputedManifest();

        if (oldManifest == null) {
          this.logger.debug('User manifest not available yet.');
          return;
        } // New computed manifest based on current manifest


        const newManifest = await manifestManager.buildNewManifest(oldManifest);
        const diff = newManifest.diff(oldManifest);
        const persistErrors = await manifestManager.pushArtifacts(diff.additions);

        if (persistErrors.length) {
          (0, _common.reportErrors)(this.logger, persistErrors);
          throw new Error('Unable to persist new artifacts.');
        }

        if (!(0, _manifest.isEmptyManifestDiff)(diff)) {
          // Commit latest manifest state
          newManifest.bumpSemanticVersion();
          await manifestManager.commit(newManifest);
        } // Try dispatching to ingest-manager package policies


        const dispatchErrors = await manifestManager.tryDispatch(newManifest);

        if (dispatchErrors.length) {
          (0, _common.reportErrors)(this.logger, dispatchErrors);
          throw new Error('Error dispatching manifest.');
        } // Try to clean up superceded artifacts


        const deleteErrors = await manifestManager.deleteArtifacts(diff.removals.map(artifact => (0, _common.getArtifactId)(artifact)));

        if (deleteErrors.length) {
          (0, _common.reportErrors)(this.logger, deleteErrors);
        }
      } catch (err) {
        this.logger.error(err);
      }
    });

    this.endpointAppContext = setupContract.endpointAppContext;
    this.logger = this.endpointAppContext.logFactory.get(this.getTaskId());
    setupContract.taskManager.registerTaskDefinitions({
      [ManifestTaskConstants.TYPE]: {
        title: 'Security Solution Endpoint Exceptions Handler',
        timeout: ManifestTaskConstants.TIMEOUT,
        createTaskRunner: ({
          taskInstance
        }) => {
          return {
            run: async () => {
              const taskInterval = (await this.endpointAppContext.config()).packagerTaskInterval;
              await this.runTask(taskInstance.id);
              const nextRun = new Date();

              if (taskInterval.endsWith('s')) {
                const seconds = parseInt(taskInterval.slice(0, -1), 10);
                nextRun.setSeconds(nextRun.getSeconds() + seconds);
              } else if (taskInterval.endsWith('m')) {
                const minutes = parseInt(taskInterval.slice(0, -1), 10);
                nextRun.setMinutes(nextRun.getMinutes() + minutes);
              } else {
                this.logger.error(`Invalid task interval: ${taskInterval}`);
                return;
              }

              return {
                state: {},
                runAt: nextRun
              };
            },
            cancel: async () => {}
          };
        }
      }
    });
  }

}

exports.ManifestTask = ManifestTask;