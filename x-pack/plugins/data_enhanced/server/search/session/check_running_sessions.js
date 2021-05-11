"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkRunningSessions = checkRunningSessions;

var _moment = _interopRequireDefault(require("moment"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _common = require("../../../../../../src/plugins/data/common");

var _common2 = require("../../../common");

var _get_search_status = require("./get_search_status");

var _get_session_status = require("./get_session_status");

var _types = require("./types");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function isSessionStale(session, config, logger) {
  const curTime = (0, _moment.default)(); // Delete if a running session wasn't polled for in the last notTouchedInProgressTimeout OR
  // if a completed \ errored \ canceled session wasn't saved for within notTouchedTimeout

  return session.attributes.status === _common2.SearchSessionStatus.IN_PROGRESS && curTime.diff((0, _moment.default)(session.attributes.touched), 'ms') > config.notTouchedInProgressTimeout.asMilliseconds() || session.attributes.status !== _common2.SearchSessionStatus.IN_PROGRESS && curTime.diff((0, _moment.default)(session.attributes.touched), 'ms') > config.notTouchedTimeout.asMilliseconds();
}

async function updateSessionStatus(session, client, logger) {
  let sessionUpdated = false; // Check statuses of all running searches

  await Promise.all(Object.keys(session.attributes.idMapping).map(async searchKey => {
    const updateSearchRequest = currentStatus => {
      sessionUpdated = true;
      session.attributes.idMapping[searchKey] = { ...session.attributes.idMapping[searchKey],
        ...currentStatus
      };
    };

    const searchInfo = session.attributes.idMapping[searchKey];

    if (searchInfo.status === _types.SearchStatus.IN_PROGRESS) {
      try {
        const currentStatus = await (0, _get_search_status.getSearchStatus)(client, searchInfo.id);

        if (currentStatus.status !== searchInfo.status) {
          logger.debug(`search ${searchInfo.id} | status changed to ${currentStatus.status}`);
          updateSearchRequest(currentStatus);
        }
      } catch (e) {
        var _e$meta$error, _e$meta$error$caused_;

        logger.error(e);
        updateSearchRequest({
          status: _types.SearchStatus.ERROR,
          error: e.message || ((_e$meta$error = e.meta.error) === null || _e$meta$error === void 0 ? void 0 : (_e$meta$error$caused_ = _e$meta$error.caused_by) === null || _e$meta$error$caused_ === void 0 ? void 0 : _e$meta$error$caused_.reason)
        });
      }
    }
  })); // And only then derive the session's status

  const sessionStatus = (0, _get_session_status.getSessionStatus)(session.attributes);

  if (sessionStatus !== session.attributes.status) {
    session.attributes.status = sessionStatus;
    session.attributes.touched = new Date().toISOString();
    sessionUpdated = true;
  }

  return sessionUpdated;
}

function getSavedSearchSessionsPage$({
  savedObjectsClient,
  logger
}, config, page) {
  logger.debug(`Fetching saved search sessions page ${page}`);
  return (0, _rxjs.from)(savedObjectsClient.find({
    page,
    perPage: config.pageSize,
    type: _common2.SEARCH_SESSION_TYPE,
    namespaces: ['*'],
    // process older sessions first
    sortField: 'touched',
    sortOrder: 'asc',
    filter: _common.nodeBuilder.or([_common.nodeBuilder.and([_common.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.status`, _common2.SearchSessionStatus.IN_PROGRESS.toString()), _common.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.persisted`, 'true')]), _common.nodeBuilder.is(`${_common2.SEARCH_SESSION_TYPE}.attributes.persisted`, 'false')])
  }));
}

function checkRunningSessionsPage(deps, config, page) {
  const {
    logger,
    client,
    savedObjectsClient
  } = deps;
  return getSavedSearchSessionsPage$(deps, config, page).pipe((0, _operators.concatMap)(async runningSearchSessionsResponse => {
    if (!runningSearchSessionsResponse.total) return;
    logger.debug(`Found ${runningSearchSessionsResponse.total} running sessions, processing ${runningSearchSessionsResponse.saved_objects.length} sessions from page ${page}`);
    const updatedSessions = new Array();
    await Promise.all(runningSearchSessionsResponse.saved_objects.map(async session => {
      const updated = await updateSessionStatus(session, client, logger);
      let deleted = false;

      if (!session.attributes.persisted) {
        if (isSessionStale(session, config, logger)) {
          // delete saved object to free up memory
          // TODO: there's a potential rare edge case of deleting an object and then receiving a new trackId for that same session!
          // Maybe we want to change state to deleted and cleanup later?
          logger.debug(`Deleting stale session | ${session.id}`);

          try {
            var _session$namespaces;

            await savedObjectsClient.delete(_common2.SEARCH_SESSION_TYPE, session.id, {
              namespace: (_session$namespaces = session.namespaces) === null || _session$namespaces === void 0 ? void 0 : _session$namespaces[0]
            });
            deleted = true;
          } catch (e) {
            logger.error(`Error while deleting stale search session ${session.id}: ${e.message}`);
          } // Send a delete request for each async search to ES


          Object.keys(session.attributes.idMapping).map(async searchKey => {
            const searchInfo = session.attributes.idMapping[searchKey];

            if (searchInfo.strategy === _common2.ENHANCED_ES_SEARCH_STRATEGY) {
              try {
                await client.asyncSearch.delete({
                  id: searchInfo.id
                });
              } catch (e) {
                logger.error(`Error while deleting async_search ${searchInfo.id}: ${e.message}`);
              }
            }
          });
        }
      }

      if (updated && !deleted) {
        updatedSessions.push(session);
      }
    })); // Do a bulk update

    if (updatedSessions.length) {
      // If there's an error, we'll try again in the next iteration, so there's no need to check the output.
      const updatedResponse = await savedObjectsClient.bulkUpdate(updatedSessions.map(session => {
        var _session$namespaces2;

        return { ...session,
          namespace: (_session$namespaces2 = session.namespaces) === null || _session$namespaces2 === void 0 ? void 0 : _session$namespaces2[0]
        };
      }));
      const success = [];
      const fail = [];
      updatedResponse.saved_objects.forEach(savedObjectResponse => {
        if ('error' in savedObjectResponse) {
          var _savedObjectResponse$;

          fail.push(savedObjectResponse);
          logger.error(`Error while updating search session ${savedObjectResponse === null || savedObjectResponse === void 0 ? void 0 : savedObjectResponse.id}: ${(_savedObjectResponse$ = savedObjectResponse.error) === null || _savedObjectResponse$ === void 0 ? void 0 : _savedObjectResponse$.message}`);
        } else {
          success.push(savedObjectResponse);
        }
      });
      logger.debug(`Updating search sessions: success: ${success.length}, fail: ${fail.length}`);
    }

    return runningSearchSessionsResponse;
  }));
}

function checkRunningSessions(deps, config) {
  const {
    logger
  } = deps;

  const checkRunningSessionsByPage = (nextPage = 1) => checkRunningSessionsPage(deps, config, nextPage).pipe((0, _operators.concatMap)(result => {
    if (!result || !result.saved_objects || result.saved_objects.length < config.pageSize) {
      return _rxjs.EMPTY;
    } else {
      // TODO: while processing previous page session list might have been changed and we might skip a session,
      // because it would appear now on a different "page".
      // This isn't critical, as we would pick it up on a next task iteration, but maybe we could improve this somehow
      return checkRunningSessionsByPage(result.page + 1);
    }
  }));

  return checkRunningSessionsByPage().pipe((0, _operators.catchError)(e => {
    logger.error(`Error while processing search sessions: ${e === null || e === void 0 ? void 0 : e.message}`);
    return _rxjs.EMPTY;
  }));
}