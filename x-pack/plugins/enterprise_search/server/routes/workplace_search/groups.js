"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGroupsRoute = registerGroupsRoute;
exports.registerSearchGroupsRoute = registerSearchGroupsRoute;
exports.registerGroupRoute = registerGroupRoute;
exports.registerGroupUsersRoute = registerGroupUsersRoute;
exports.registerShareGroupRoute = registerShareGroupRoute;
exports.registerAssignGroupRoute = registerAssignGroupRoute;
exports.registerBoostsGroupRoute = registerBoostsGroupRoute;
exports.registerGroupsRoutes = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerGroupsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/groups',
    validate: false
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups'
  }));
  router.post({
    path: '/api/workplace_search/groups',
    validate: {
      body: _configSchema.schema.object({
        group_name: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups'
  }));
}

function registerSearchGroupsRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/api/workplace_search/groups/search',
    validate: {
      body: _configSchema.schema.object({
        page: _configSchema.schema.object({
          current: _configSchema.schema.number(),
          size: _configSchema.schema.number()
        }),
        search: _configSchema.schema.object({
          query: _configSchema.schema.string(),
          content_source_ids: _configSchema.schema.arrayOf(_configSchema.schema.string()),
          user_ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/search'
  }));
}

function registerGroupRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/groups/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id'
  }));
  router.put({
    path: '/api/workplace_search/groups/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        group: _configSchema.schema.object({
          name: _configSchema.schema.string()
        })
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id'
  }));
  router.delete({
    path: '/api/workplace_search/groups/{id}',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id'
  }));
}

function registerGroupUsersRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.get({
    path: '/api/workplace_search/groups/{id}/group_users',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id/group_users'
  }));
}

function registerShareGroupRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/api/workplace_search/groups/{id}/share',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        content_source_ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id/share'
  }));
}

function registerAssignGroupRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.post({
    path: '/api/workplace_search/groups/{id}/assign',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        user_ids: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id/assign'
  }));
}

function registerBoostsGroupRoute({
  router,
  enterpriseSearchRequestHandler
}) {
  router.put({
    path: '/api/workplace_search/groups/{id}/boosts',
    validate: {
      params: _configSchema.schema.object({
        id: _configSchema.schema.string()
      }),
      body: _configSchema.schema.object({
        content_source_boosts: _configSchema.schema.arrayOf(_configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.number()])))
      })
    }
  }, enterpriseSearchRequestHandler.createRequest({
    path: '/ws/org/groups/:id/update_source_boosts'
  }));
}

const registerGroupsRoutes = dependencies => {
  registerGroupsRoute(dependencies);
  registerSearchGroupsRoute(dependencies);
  registerGroupRoute(dependencies);
  registerGroupUsersRoute(dependencies);
  registerShareGroupRoute(dependencies);
  registerAssignGroupRoute(dependencies);
  registerBoostsGroupRoute(dependencies);
};

exports.registerGroupsRoutes = registerGroupsRoutes;