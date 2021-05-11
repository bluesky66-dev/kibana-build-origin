"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSessionRoutes = registerSessionRoutes;

var _configSchema = require("@kbn/config-schema");

var _server = require("../../../../../src/plugins/kibana_utils/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const STORE_SEARCH_SESSIONS_ROLE_TAG = `access:store_search_session`;

function registerSessionRoutes(router, logger) {
  router.post({
    path: '/internal/session',
    validate: {
      body: _configSchema.schema.object({
        sessionId: _configSchema.schema.string(),
        name: _configSchema.schema.string(),
        appId: _configSchema.schema.string(),
        expires: _configSchema.schema.maybe(_configSchema.schema.string()),
        urlGeneratorId: _configSchema.schema.string(),
        initialState: _configSchema.schema.maybe(_configSchema.schema.object({}, {
          unknowns: 'allow'
        })),
        restoreState: _configSchema.schema.maybe(_configSchema.schema.object({}, {
          unknowns: 'allow'
        }))
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      sessionId,
      name,
      expires,
      initialState,
      restoreState,
      appId,
      urlGeneratorId
    } = request.body;

    try {
      const response = await context.search.saveSession(sessionId, {
        name,
        appId,
        expires,
        urlGeneratorId,
        initialState,
        restoreState
      });
      return res.ok({
        body: response
      });
    } catch (err) {
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.get({
    path: '/internal/session/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      id
    } = request.params;

    try {
      const response = await context.search.getSession(id);
      return res.ok({
        body: response
      });
    } catch (e) {
      var _e$output;

      const err = ((_e$output = e.output) === null || _e$output === void 0 ? void 0 : _e$output.payload) || e;
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.post({
    path: '/internal/session/_find',
    validate: {
      body: _configSchema.schema.object({
        page: _configSchema.schema.maybe(_configSchema.schema.number()),
        perPage: _configSchema.schema.maybe(_configSchema.schema.number()),
        sortField: _configSchema.schema.maybe(_configSchema.schema.string()),
        sortOrder: _configSchema.schema.maybe(_configSchema.schema.string()),
        filter: _configSchema.schema.maybe(_configSchema.schema.string()),
        searchFields: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.string())),
        search: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      page,
      perPage,
      sortField,
      sortOrder,
      filter,
      searchFields,
      search
    } = request.body;

    try {
      const response = await context.search.findSessions({
        page,
        perPage,
        sortField,
        sortOrder,
        filter,
        searchFields,
        search
      });
      return res.ok({
        body: response
      });
    } catch (err) {
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.delete({
    path: '/internal/session/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      id
    } = request.params;

    try {
      await context.search.deleteSession(id);
      return res.ok();
    } catch (e) {
      var _e$output2;

      const err = ((_e$output2 = e.output) === null || _e$output2 === void 0 ? void 0 : _e$output2.payload) || e;
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.post({
    path: '/internal/session/{id}/cancel',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      id
    } = request.params;

    try {
      await context.search.cancelSession(id);
      return res.ok();
    } catch (e) {
      var _e$output3;

      const err = ((_e$output3 = e.output) === null || _e$output3 === void 0 ? void 0 : _e$output3.payload) || e;
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.put({
    path: '/internal/session/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        name: _configSchema.schema.maybe(_configSchema.schema.string()),
        expires: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      id
    } = request.params;
    const {
      name,
      expires
    } = request.body;

    try {
      const response = await context.search.updateSession(id, {
        name,
        expires
      });
      return res.ok({
        body: response
      });
    } catch (err) {
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
  router.post({
    path: '/internal/session/{id}/_extend',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        expires: _configSchema.schema.string()
      })
    },
    options: {
      tags: [STORE_SEARCH_SESSIONS_ROLE_TAG]
    }
  }, async (context, request, res) => {
    const {
      id
    } = request.params;
    const {
      expires
    } = request.body;

    try {
      const response = await context.search.extendSession(id, new Date(expires));
      return res.ok({
        body: response
      });
    } catch (e) {
      var _e$output4;

      const err = ((_e$output4 = e.output) === null || _e$output4 === void 0 ? void 0 : _e$output4.payload) || e;
      logger.error(err);
      return (0, _server.reportServerError)(res, err);
    }
  });
}