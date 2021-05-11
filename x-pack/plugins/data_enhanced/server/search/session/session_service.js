"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchSessionService = void 0;

var _boom = require("@hapi/boom");

var _lodash = require("lodash");

var _server = require("../../../../../../src/core/server");

var _common = require("../../../../../../src/plugins/data/common");

var _server2 = require("../../../../../../src/plugins/data/server");

var _common2 = require("../../../common");

var _utils = require("./utils");

var _monitoring_task = require("./monitoring_task");

var _types = require("./types");

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

const DEBOUNCE_UPDATE_OR_CREATE_WAIT = 1000;
const DEBOUNCE_UPDATE_OR_CREATE_MAX_WAIT = 5000;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

class SearchSessionService {
  constructor(logger, config, security) {
    this.logger = logger;
    this.config = config;
    this.security = security;

    _defineProperty(this, "sessionConfig", void 0);

    _defineProperty(this, "updateOrCreateBatchQueue", []);

    _defineProperty(this, "setupMonitoring", async (core, deps) => {
      if (this.sessionConfig.enabled) {
        (0, _monitoring_task.scheduleSearchSessionsTasks)(deps.taskManager, this.logger, this.sessionConfig.trackingInterval);
      } else {
        (0, _monitoring_task.unscheduleSearchSessionsTask)(deps.taskManager, this.logger);
      }
    });

    _defineProperty(this, "processUpdateOrCreateBatchQueue", (0, _lodash.debounce)(() => {
      const queue = [...this.updateOrCreateBatchQueue];
      if (queue.length === 0) return;
      this.updateOrCreateBatchQueue.length = 0;
      const batchedSessionAttributes = queue.reduce((res, next) => {
        if (!res[next.sessionId]) {
          res[next.sessionId] = next.attributes;
        } else {
          res[next.sessionId] = { ...res[next.sessionId],
            ...next.attributes,
            idMapping: { ...res[next.sessionId].idMapping,
              ...next.attributes.idMapping
            }
          };
        }

        return res;
      }, {});
      Object.keys(batchedSessionAttributes).forEach(sessionId => {
        const thisSession = queue.filter(s => s.sessionId === sessionId);
        this.updateOrCreate(thisSession[0].deps, thisSession[0].user, sessionId, batchedSessionAttributes[sessionId]).then(() => {
          thisSession.forEach(s => s.resolve());
        }).catch(e => {
          thisSession.forEach(s => s.reject(e));
        });
      });
    }, DEBOUNCE_UPDATE_OR_CREATE_WAIT, {
      maxWait: DEBOUNCE_UPDATE_OR_CREATE_MAX_WAIT
    }));

    _defineProperty(this, "scheduleUpdateOrCreate", (deps, user, sessionId, attributes) => {
      return new Promise((resolve, reject) => {
        this.updateOrCreateBatchQueue.push({
          deps,
          user,
          sessionId,
          attributes,
          resolve,
          reject
        }); // TODO: this would be better if we'd debounce per sessionId

        this.processUpdateOrCreateBatchQueue();
      });
    });

    _defineProperty(this, "updateOrCreate", async (deps, user, sessionId, attributes, retry = 1) => {
      const retryOnConflict = async e => {
        this.logger.debug(`Conflict error | ${sessionId}`); // Randomize sleep to spread updates out in case of conflicts

        await sleep(100 + Math.random() * 50);
        return await this.updateOrCreate(deps, user, sessionId, attributes, retry + 1);
      };

      this.logger.debug(`updateOrCreate | ${sessionId} | ${retry}`);

      try {
        return await this.update(deps, user, sessionId, attributes);
      } catch (e) {
        if (_server.SavedObjectsErrorHelpers.isNotFoundError(e)) {
          try {
            this.logger.debug(`Object not found | ${sessionId}`);
            return await this.create(deps, user, sessionId, attributes);
          } catch (createError) {
            if (_server.SavedObjectsErrorHelpers.isConflictError(createError) && retry < this.sessionConfig.maxUpdateRetries) {
              return await retryOnConflict(createError);
            } else {
              this.logger.error(createError);
            }
          }
        } else if (_server.SavedObjectsErrorHelpers.isConflictError(e) && retry < this.sessionConfig.maxUpdateRetries) {
          return await retryOnConflict(e);
        } else {
          this.logger.error(e);
        }
      }

      return undefined;
    });

    _defineProperty(this, "save", async (deps, user, sessionId, {
      name,
      appId,
      urlGeneratorId,
      initialState = {},
      restoreState = {}
    }) => {
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      if (!name) throw new Error('Name is required');
      if (!appId) throw new Error('AppId is required');
      if (!urlGeneratorId) throw new Error('UrlGeneratorId is required');
      return this.updateOrCreate(deps, user, sessionId, {
        name,
        appId,
        urlGeneratorId,
        initialState,
        restoreState,
        persisted: true
      });
    });

    _defineProperty(this, "create", ({
      savedObjectsClient
    }, user, sessionId, attributes) => {
      this.logger.debug(`create | ${sessionId}`);
      const realmType = user === null || user === void 0 ? void 0 : user.authentication_realm.type;
      const realmName = user === null || user === void 0 ? void 0 : user.authentication_realm.name;
      const username = user === null || user === void 0 ? void 0 : user.username;
      return savedObjectsClient.create(_common2.SEARCH_SESSION_TYPE, {
        sessionId,
        status: _common2.SearchSessionStatus.IN_PROGRESS,
        expires: new Date(Date.now() + this.sessionConfig.defaultExpiration.asMilliseconds()).toISOString(),
        created: new Date().toISOString(),
        touched: new Date().toISOString(),
        idMapping: {},
        persisted: false,
        realmType,
        realmName,
        username,
        ...attributes
      }, {
        id: sessionId
      });
    });

    _defineProperty(this, "get", async ({
      savedObjectsClient
    }, user, sessionId) => {
      this.logger.debug(`get | ${sessionId}`);
      const session = await savedObjectsClient.get(_common2.SEARCH_SESSION_TYPE, sessionId);
      this.throwOnUserConflict(user, session);
      return session;
    });

    _defineProperty(this, "find", ({
      savedObjectsClient
    }, user, options) => {
      const userFilters = user === null ? [] : [_common.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.realmType`, `${user.authentication_realm.type}`), _common.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.realmName`, `${user.authentication_realm.name}`), _common.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.username`, `${user.username}`)];
      const filterKueryNode = typeof options.filter === 'string' ? _server2.esKuery.fromKueryExpression(options.filter) : options.filter;

      const filter = _common.nodeBuilder.and(userFilters.concat(filterKueryNode !== null && filterKueryNode !== void 0 ? filterKueryNode : []));

      return savedObjectsClient.find({ ...options,
        filter,
        type: _common2.SEARCH_SESSION_TYPE
      });
    });

    _defineProperty(this, "update", async (deps, user, sessionId, attributes) => {
      this.logger.debug(`update | ${sessionId}`);
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      await this.get(deps, user, sessionId); // Verify correct user

      return deps.savedObjectsClient.update(_common2.SEARCH_SESSION_TYPE, sessionId, { ...attributes,
        touched: new Date().toISOString()
      });
    });

    _defineProperty(this, "cancel", async (deps, user, sessionId) => {
      this.logger.debug(`delete | ${sessionId}`);
      return this.update(deps, user, sessionId, {
        status: _common2.SearchSessionStatus.CANCELLED
      });
    });

    _defineProperty(this, "delete", async (deps, user, sessionId) => {
      if (!this.sessionConfig.enabled) throw new Error('Search sessions are disabled');
      this.logger.debug(`delete | ${sessionId}`);
      await this.get(deps, user, sessionId); // Verify correct user

      return deps.savedObjectsClient.delete(_common2.SEARCH_SESSION_TYPE, sessionId);
    });

    _defineProperty(this, "trackId", async (deps, user, searchRequest, searchId, {
      sessionId,
      strategy = _common2.ENHANCED_ES_SEARCH_STRATEGY
    }) => {
      if (!this.sessionConfig.enabled || !sessionId || !searchId) return;
      this.logger.debug(`trackId | ${sessionId} | ${searchId}`);
      let idMapping = {};

      if (searchRequest.params) {
        const requestHash = (0, _utils.createRequestHash)(searchRequest.params);
        const searchInfo = {
          id: searchId,
          strategy,
          status: _types.SearchStatus.IN_PROGRESS
        };
        idMapping = {
          [requestHash]: searchInfo
        };
      }

      await this.scheduleUpdateOrCreate(deps, user, sessionId, {
        idMapping
      });
    });

    _defineProperty(this, "getId", async (deps, user, searchRequest, {
      sessionId,
      isStored,
      isRestore
    }) => {
      if (!this.sessionConfig.enabled) {
        throw new Error('Search sessions are disabled');
      } else if (!sessionId) {
        throw new Error('Session ID is required');
      } else if (!isStored) {
        throw new Error('Cannot get search ID from a session that is not stored');
      } else if (!isRestore) {
        throw new Error('Get search ID is only supported when restoring a session');
      }

      const session = await this.get(deps, user, sessionId);
      const requestHash = (0, _utils.createRequestHash)(searchRequest.params);

      if (!session.attributes.idMapping.hasOwnProperty(requestHash)) {
        this.logger.error(`getId | ${sessionId} | ${requestHash} not found`);
        throw new Error('No search ID in this session matching the given search request');
      }

      this.logger.debug(`getId | ${sessionId} | ${requestHash}`);
      return session.attributes.idMapping[requestHash].id;
    });

    _defineProperty(this, "asScopedProvider", ({
      savedObjects
    }) => {
      return request => {
        var _this$security$authc$, _this$security;

        const user = (_this$security$authc$ = (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authc.getCurrentUser(request)) !== null && _this$security$authc$ !== void 0 ? _this$security$authc$ : null;
        const savedObjectsClient = savedObjects.getScopedClient(request, {
          includedHiddenTypes: [_common2.SEARCH_SESSION_TYPE]
        });
        const deps = {
          savedObjectsClient
        };
        return {
          getId: this.getId.bind(this, deps, user),
          trackId: this.trackId.bind(this, deps, user),
          getSearchIdMapping: this.getSearchIdMapping.bind(this, deps, user),
          save: this.save.bind(this, deps, user),
          get: this.get.bind(this, deps, user),
          find: this.find.bind(this, deps, user),
          update: this.update.bind(this, deps, user),
          extend: this.extend.bind(this, deps, user),
          cancel: this.cancel.bind(this, deps, user),
          delete: this.delete.bind(this, deps, user)
        };
      };
    });

    _defineProperty(this, "throwOnUserConflict", (user, session) => {
      if (user === null || !session) return;

      if (user.authentication_realm.type !== session.attributes.realmType || user.authentication_realm.name !== session.attributes.realmName || user.username !== session.attributes.username) {
        this.logger.debug(`User ${user.username} has no access to search session ${session.attributes.sessionId}`);
        throw (0, _boom.notFound)();
      }
    });

    this.sessionConfig = this.config.search.sessions;
  }

  setup(core, deps) {
    (0, _monitoring_task.registerSearchSessionsTask)(core, {
      config: this.config,
      taskManager: deps.taskManager,
      logger: this.logger
    });
  }

  async start(core, deps) {
    return this.setupMonitoring(core, deps);
  }

  stop() {}

  async extend(deps, user, sessionId, expires) {
    this.logger.debug(`extend | ${sessionId}`);
    return this.update(deps, user, sessionId, {
      expires: expires.toISOString()
    });
  }

  async getSearchIdMapping(deps, user, sessionId) {
    const searchSession = await this.get(deps, user, sessionId);
    const searchIdMapping = new Map();
    Object.values(searchSession.attributes.idMapping).forEach(requestInfo => {
      searchIdMapping.set(requestInfo.id, requestInfo.strategy);
    });
    return searchIdMapping;
  }
  /**
   * Look up an existing search ID that matches the given request in the given session so that the
   * request can continue rather than restart.
   * @internal
   */


}

exports.SearchSessionService = SearchSessionService;