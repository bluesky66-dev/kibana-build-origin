"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReindexWorker = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _types = require("../../../common/types");

var _reindex_actions = require("./reindex_actions");

var _reindex_service = require("./reindex_service");

var _op_utils = require("./op_utils");

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

const POLL_INTERVAL = 30000; // If no nodes have been able to update this index in 2 minutes (due to missing credentials), set to paused.

const PAUSE_WINDOW = POLL_INTERVAL * 4;
/**
 * To avoid running the worker loop very tightly and causing a CPU bottleneck we use this
 * padding to simulate an asynchronous sleep. See the description of the tight loop below.
 */

const WORKER_PADDING_MS = 1000;
/**
 * A singleton worker that will coordinate two polling loops:
 *   (1) A longer loop that polls for reindex operations that are in progress. If any are found, loop (2) is started.
 *   (2) A tighter loop that pushes each in progress reindex operation through ReindexService.processNextStep. If all
 *       updated reindex operations are complete, this loop will terminate.
 *
 * The worker can also be forced to start loop (2) by calling forceRefresh(). This is done when we know a new reindex
 * operation has been started.
 *
 * This worker can be ran on multiple nodes without conflicts or dropped jobs. Reindex operations are locked by the
 * ReindexService and if any operation is locked longer than the ReindexService's timeout, it is assumed to have been
 * locked by a node that is no longer running (crashed or shutdown). In this case, another node may safely acquire
 * the lock for this reindex operation.
 */

class ReindexWorker {
  constructor(client, credentialStore, clusterClient, log, licensing, apmIndexPatterns) {
    this.client = client;
    this.credentialStore = credentialStore;
    this.clusterClient = clusterClient;
    this.licensing = licensing;
    this.apmIndexPatterns = apmIndexPatterns;

    _defineProperty(this, "continuePolling", false);

    _defineProperty(this, "updateOperationLoopRunning", false);

    _defineProperty(this, "timeout", void 0);

    _defineProperty(this, "inProgressOps", []);

    _defineProperty(this, "reindexService", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "start", () => {
      this.log.debug('Starting worker...');
      this.continuePolling = true;
      this.pollForOperations();
    });

    _defineProperty(this, "stop", () => {
      this.log.debug('Stopping worker...');

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.updateOperationLoopRunning = false;
      this.continuePolling = false;
    });

    _defineProperty(this, "forceRefresh", () => {
      this.refresh();
    });

    _defineProperty(this, "includes", reindexOp => {
      return this.inProgressOps.map(o => o.id).includes(reindexOp.id);
    });

    _defineProperty(this, "startUpdateOperationLoop", async () => {
      this.updateOperationLoopRunning = true;

      try {
        while (this.inProgressOps.length > 0) {
          this.log.debug(`Updating ${this.inProgressOps.length} reindex operations`); // Push each operation through the state machine and refresh.

          await Promise.all(this.inProgressOps.map(this.processNextStep));
          await this.refresh();

          if (this.inProgressOps.length && this.inProgressOps.every(op => !this.credentialStore.get(op))) {
            // TODO: This tight loop needs something to relax potentially high CPU demands so this padding is added.
            // This scheduler should be revisited in future.
            await new Promise(resolve => setTimeout(resolve, WORKER_PADDING_MS));
          }
        }
      } finally {
        this.updateOperationLoopRunning = false;
      }
    });

    _defineProperty(this, "pollForOperations", async () => {
      this.log.debug(`Polling for reindex operations`);
      await this.refresh();

      if (this.continuePolling) {
        this.timeout = setTimeout(this.pollForOperations, POLL_INTERVAL);
      }
    });

    _defineProperty(this, "getCredentialScopedReindexService", credential => {
      const fakeRequest = {
        headers: credential
      };
      const scopedClusterClient = this.clusterClient.asScoped(fakeRequest);
      const callAsCurrentUser = scopedClusterClient.asCurrentUser;
      const actions = (0, _reindex_actions.reindexActionsFactory)(this.client, callAsCurrentUser);
      return (0, _reindex_service.reindexServiceFactory)(callAsCurrentUser, actions, this.log, this.licensing, this.apmIndexPatterns);
    });

    _defineProperty(this, "updateInProgressOps", async () => {
      try {
        const inProgressOps = await this.reindexService.findAllByStatus(_types.ReindexStatus.inProgress);
        const {
          parallel,
          queue
        } = (0, _op_utils.sortAndOrderReindexOperations)(inProgressOps);
        let [firstOpInQueue] = queue;

        if (firstOpInQueue && !(0, _op_utils.queuedOpHasStarted)(firstOpInQueue)) {
          this.log.debug(`Queue detected; current length ${queue.length}, current item ReindexOperation(id: ${firstOpInQueue.id}, indexName: ${firstOpInQueue.attributes.indexName})`);
          const credential = this.credentialStore.get(firstOpInQueue);

          if (credential) {
            const service = this.getCredentialScopedReindexService(credential);
            firstOpInQueue = await service.startQueuedReindexOperation(firstOpInQueue.attributes.indexName); // Re-associate the credentials

            this.credentialStore.set(firstOpInQueue, credential);
          }
        }

        this.inProgressOps = parallel.concat(firstOpInQueue ? [firstOpInQueue] : []);
      } catch (e) {
        this.log.debug(`Could not fetch reindex operations from Elasticsearch, ${e.message}`);
        this.inProgressOps = [];
      }
    });

    _defineProperty(this, "refresh", async () => {
      await this.updateInProgressOps(); // If there are operations in progress and we're not already updating operations, kick off the update loop

      if (!this.updateOperationLoopRunning) {
        this.startUpdateOperationLoop();
      }
    });

    _defineProperty(this, "lastCheckedQueuedOpId", void 0);

    _defineProperty(this, "processNextStep", async reindexOp => {
      const credential = this.credentialStore.get(reindexOp);

      if (!credential) {
        // If this is a queued reindex op, and we know there can only ever be one in progress at a
        // given time, there is a small chance it may have just reached the front of the queue so
        // we give it a chance to be updated by another worker with credentials by making this a
        // noop once. If it has not been updated by the next loop we will mark it paused if it
        // falls outside of PAUSE_WINDOW.
        if ((0, _op_utils.isQueuedOp)(reindexOp)) {
          if (this.lastCheckedQueuedOpId !== reindexOp.id) {
            this.lastCheckedQueuedOpId = reindexOp.id;
            return;
          }
        } // This indicates that no Kibana nodes currently have credentials to update this job.


        const now = (0, _moment.default)();
        const updatedAt = (0, _moment.default)(reindexOp.updated_at);

        if (updatedAt < now.subtract(PAUSE_WINDOW)) {
          await this.reindexService.pauseReindexOperation(reindexOp.attributes.indexName);
          return;
        } else {
          // If it has been updated recently, we assume another node has the necessary credentials,
          // and this becomes a noop.
          return;
        }
      } // Setup a ReindexService specific to these credentials.


      const fakeRequest = {
        headers: credential
      };
      const scopedClusterClient = this.clusterClient.asScoped(fakeRequest);
      const callAsCurrentUser = scopedClusterClient.asCurrentUser;
      const actions = (0, _reindex_actions.reindexActionsFactory)(this.client, callAsCurrentUser);
      const service = (0, _reindex_service.reindexServiceFactory)(callAsCurrentUser, actions, this.log, this.licensing, this.apmIndexPatterns);
      reindexOp = await swallowExceptions(service.processNextStep, this.log)(reindexOp); // Update credential store with most recent state.

      this.credentialStore.set(reindexOp, credential);
    });

    this.log = log.get('reindex_worker');

    if (ReindexWorker.workerSingleton) {
      throw new Error(`More than one ReindexWorker cannot be created.`);
    }

    const callAsInternalUser = this.clusterClient.asInternalUser;
    this.reindexService = (0, _reindex_service.reindexServiceFactory)(callAsInternalUser, (0, _reindex_actions.reindexActionsFactory)(this.client, callAsInternalUser), log, this.licensing, apmIndexPatterns);
    ReindexWorker.workerSingleton = this;
  }
  /**
   * Begins loop (1) to begin checking for in progress reindex operations.
   */


}
/**
 * Swallows any exceptions that may occur during the reindex process. This prevents any errors from
 * stopping the worker from continuing to process more jobs.
 */


exports.ReindexWorker = ReindexWorker;

_defineProperty(ReindexWorker, "workerSingleton", void 0);

const swallowExceptions = (func, log) => async reindexOp => {
  try {
    return await func(reindexOp);
  } catch (e) {
    if (reindexOp.attributes.locked) {
      log.debug(`Skipping reindexOp with unexpired lock: ${reindexOp.id}`);
    } else {
      log.warn(`Error when trying to process reindexOp (${reindexOp.id}): ${e.toString()}`);
    }

    return reindexOp;
  }
};