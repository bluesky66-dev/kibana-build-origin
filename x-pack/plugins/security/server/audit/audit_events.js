"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpRequestEvent = httpRequestEvent;
exports.userLoginEvent = userLoginEvent;
exports.savedObjectEvent = savedObjectEvent;
exports.spaceAuditEvent = spaceAuditEvent;
exports.SpaceAuditAction = exports.SavedObjectAction = exports.EventOutcome = exports.EventType = exports.EventCategory = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Audit event schema using ECS format: https://www.elastic.co/guide/en/ecs/1.6/index.html
 *
 * If you add additional fields to the schema ensure you update the Kibana Filebeat module:
 * https://github.com/elastic/beats/tree/master/filebeat/module/kibana
 *
 * @public
 */

let EventCategory;
exports.EventCategory = EventCategory;

(function (EventCategory) {
  EventCategory["DATABASE"] = "database";
  EventCategory["WEB"] = "web";
  EventCategory["AUTHENTICATION"] = "authentication";
})(EventCategory || (exports.EventCategory = EventCategory = {}));

let EventType;
exports.EventType = EventType;

(function (EventType) {
  EventType["CREATION"] = "creation";
  EventType["ACCESS"] = "access";
  EventType["CHANGE"] = "change";
  EventType["DELETION"] = "deletion";
})(EventType || (exports.EventType = EventType = {}));

let EventOutcome;
exports.EventOutcome = EventOutcome;

(function (EventOutcome) {
  EventOutcome["SUCCESS"] = "success";
  EventOutcome["FAILURE"] = "failure";
  EventOutcome["UNKNOWN"] = "unknown";
})(EventOutcome || (exports.EventOutcome = EventOutcome = {}));

function httpRequestEvent({
  request
}) {
  var _request$rewrittenUrl;

  const url = (_request$rewrittenUrl = request.rewrittenUrl) !== null && _request$rewrittenUrl !== void 0 ? _request$rewrittenUrl : request.url;
  return {
    message: `User is requesting [${url.pathname}] endpoint`,
    event: {
      action: 'http_request',
      category: EventCategory.WEB,
      outcome: EventOutcome.UNKNOWN
    },
    http: {
      request: {
        method: request.route.method
      }
    },
    url: {
      domain: url.hostname,
      path: url.pathname,
      port: url.port ? parseInt(url.port, 10) : undefined,
      query: url.search ? url.search.slice(1) : undefined,
      scheme: url.protocol ? url.protocol.substr(0, url.protocol.length - 1) : undefined
    }
  };
}

function userLoginEvent({
  authenticationResult,
  authenticationProvider,
  authenticationType
}) {
  var _authenticationResult, _authenticationResult2;

  return {
    message: authenticationResult.user ? `User [${authenticationResult.user.username}] has logged in using ${authenticationType} provider [name=${authenticationProvider}]` : `Failed attempt to login using ${authenticationType} provider [name=${authenticationProvider}]`,
    event: {
      action: 'user_login',
      category: EventCategory.AUTHENTICATION,
      outcome: authenticationResult.user ? EventOutcome.SUCCESS : EventOutcome.FAILURE
    },
    user: authenticationResult.user && {
      name: authenticationResult.user.username,
      roles: authenticationResult.user.roles
    },
    kibana: {
      space_id: undefined,
      // Ensure this does not get populated by audit service
      authentication_provider: authenticationProvider,
      authentication_type: authenticationType,
      authentication_realm: (_authenticationResult = authenticationResult.user) === null || _authenticationResult === void 0 ? void 0 : _authenticationResult.authentication_realm.name,
      lookup_realm: (_authenticationResult2 = authenticationResult.user) === null || _authenticationResult2 === void 0 ? void 0 : _authenticationResult2.lookup_realm.name
    },
    error: authenticationResult.error && {
      code: authenticationResult.error.name,
      message: authenticationResult.error.message
    }
  };
}

let SavedObjectAction;
exports.SavedObjectAction = SavedObjectAction;

(function (SavedObjectAction) {
  SavedObjectAction["CREATE"] = "saved_object_create";
  SavedObjectAction["GET"] = "saved_object_get";
  SavedObjectAction["RESOLVE"] = "saved_object_resolve";
  SavedObjectAction["UPDATE"] = "saved_object_update";
  SavedObjectAction["DELETE"] = "saved_object_delete";
  SavedObjectAction["FIND"] = "saved_object_find";
  SavedObjectAction["ADD_TO_SPACES"] = "saved_object_add_to_spaces";
  SavedObjectAction["DELETE_FROM_SPACES"] = "saved_object_delete_from_spaces";
  SavedObjectAction["REMOVE_REFERENCES"] = "saved_object_remove_references";
  SavedObjectAction["OPEN_POINT_IN_TIME"] = "saved_object_open_point_in_time";
  SavedObjectAction["CLOSE_POINT_IN_TIME"] = "saved_object_close_point_in_time";
})(SavedObjectAction || (exports.SavedObjectAction = SavedObjectAction = {}));

const savedObjectAuditVerbs = {
  saved_object_create: ['create', 'creating', 'created'],
  saved_object_get: ['access', 'accessing', 'accessed'],
  saved_object_resolve: ['resolve', 'resolving', 'resolved'],
  saved_object_update: ['update', 'updating', 'updated'],
  saved_object_delete: ['delete', 'deleting', 'deleted'],
  saved_object_find: ['access', 'accessing', 'accessed'],
  saved_object_add_to_spaces: ['update', 'updating', 'updated'],
  saved_object_delete_from_spaces: ['update', 'updating', 'updated'],
  saved_object_open_point_in_time: ['open point-in-time', 'opening point-in-time', 'opened point-in-time'],
  saved_object_close_point_in_time: ['close point-in-time', 'closing point-in-time', 'closed point-in-time'],
  saved_object_remove_references: ['remove references to', 'removing references to', 'removed references to']
};
const savedObjectAuditTypes = {
  saved_object_create: EventType.CREATION,
  saved_object_get: EventType.ACCESS,
  saved_object_resolve: EventType.ACCESS,
  saved_object_update: EventType.CHANGE,
  saved_object_delete: EventType.DELETION,
  saved_object_find: EventType.ACCESS,
  saved_object_add_to_spaces: EventType.CHANGE,
  saved_object_delete_from_spaces: EventType.CHANGE,
  saved_object_open_point_in_time: EventType.CREATION,
  saved_object_close_point_in_time: EventType.DELETION,
  saved_object_remove_references: EventType.CHANGE
};

function savedObjectEvent({
  action,
  savedObject,
  addToSpaces,
  deleteFromSpaces,
  outcome,
  error
}) {
  const doc = savedObject ? `${savedObject.type} [id=${savedObject.id}]` : 'saved objects';
  const [present, progressive, past] = savedObjectAuditVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === EventOutcome.UNKNOWN ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = savedObjectAuditTypes[action];

  if (type === EventType.ACCESS && savedObject && (savedObject.type === 'config' || savedObject.type === 'telemetry')) {
    return;
  }

  return {
    message,
    event: {
      action,
      category: EventCategory.DATABASE,
      type,
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? EventOutcome.FAILURE : EventOutcome.SUCCESS
    },
    kibana: {
      saved_object: savedObject,
      add_to_spaces: addToSpaces,
      delete_from_spaces: deleteFromSpaces
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}

let SpaceAuditAction;
exports.SpaceAuditAction = SpaceAuditAction;

(function (SpaceAuditAction) {
  SpaceAuditAction["CREATE"] = "space_create";
  SpaceAuditAction["GET"] = "space_get";
  SpaceAuditAction["UPDATE"] = "space_update";
  SpaceAuditAction["DELETE"] = "space_delete";
  SpaceAuditAction["FIND"] = "space_find";
})(SpaceAuditAction || (exports.SpaceAuditAction = SpaceAuditAction = {}));

const spaceAuditVerbs = {
  space_create: ['create', 'creating', 'created'],
  space_get: ['access', 'accessing', 'accessed'],
  space_update: ['update', 'updating', 'updated'],
  space_delete: ['delete', 'deleting', 'deleted'],
  space_find: ['access', 'accessing', 'accessed']
};
const spaceAuditTypes = {
  space_create: EventType.CREATION,
  space_get: EventType.ACCESS,
  space_update: EventType.CHANGE,
  space_delete: EventType.DELETION,
  space_find: EventType.ACCESS
};

function spaceAuditEvent({
  action,
  savedObject,
  outcome,
  error
}) {
  const doc = savedObject ? `space [id=${savedObject.id}]` : 'spaces';
  const [present, progressive, past] = spaceAuditVerbs[action];
  const message = error ? `Failed attempt to ${present} ${doc}` : outcome === EventOutcome.UNKNOWN ? `User is ${progressive} ${doc}` : `User has ${past} ${doc}`;
  const type = spaceAuditTypes[action];
  return {
    message,
    event: {
      action,
      category: EventCategory.DATABASE,
      type,
      outcome: outcome !== null && outcome !== void 0 ? outcome : error ? EventOutcome.FAILURE : EventOutcome.SUCCESS
    },
    kibana: {
      saved_object: savedObject
    },
    error: error && {
      code: error.name,
      message: error.message
    }
  };
}