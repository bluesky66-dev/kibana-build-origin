"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllRoute = registerGetAllRoute;
exports.registerGetOneRoute = registerGetOneRoute;

var _configSchema = require("@kbn/config-schema");

var _lib = require("../../../../common/lib");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const enhanceDataStreams = ({
  dataStreams,
  dataStreamsStats,
  dataStreamsPrivileges
}) => {
  return dataStreams.map(dataStream => {
    let enhancedDataStream = { ...dataStream
    };

    if (dataStreamsStats) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const {
        store_size,
        store_size_bytes,
        maximum_timestamp
      } = dataStreamsStats.find(({
        data_stream: statsName
      }) => statsName === dataStream.name) || {};
      enhancedDataStream = { ...enhancedDataStream,
        store_size,
        store_size_bytes,
        maximum_timestamp
      };
    }

    enhancedDataStream = { ...enhancedDataStream,
      privileges: {
        delete_index: dataStreamsPrivileges ? dataStreamsPrivileges.index[dataStream.name].delete_index : true
      }
    };
    return enhancedDataStream;
  });
};

const getDataStreams = (client, name = '*') => {
  // TODO update when elasticsearch client has update requestParams for 'indices.getDataStream'
  return client.transport.request({
    path: `/_data_stream/${encodeURIComponent(name)}`,
    method: 'GET',
    querystring: {
      expand_wildcards: 'all'
    }
  });
};

const getDataStreamsStats = (client, name = '*') => {
  return client.transport.request({
    path: `/_data_stream/${encodeURIComponent(name)}/_stats`,
    method: 'GET',
    querystring: {
      human: true,
      expand_wildcards: 'all'
    }
  });
};

const getDataStreamsPrivileges = (client, names) => {
  return client.security.hasPrivileges({
    body: {
      index: [{
        names,
        privileges: ['delete_index']
      }]
    }
  });
};

function registerGetAllRoute({
  router,
  license,
  lib: {
    handleEsError
  },
  config
}) {
  const querySchema = _configSchema.schema.object({
    includeStats: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.literal('true'), _configSchema.schema.literal('false')]))
  });

  router.get({
    path: (0, _index.addBasePath)('/data_streams'),
    validate: {
      query: querySchema
    }
  }, license.guardApiRoute(async (ctx, req, response) => {
    const {
      asCurrentUser
    } = ctx.core.elasticsearch.client;
    const includeStats = req.query.includeStats === 'true';

    try {
      let {
        body: {
          data_streams: dataStreams
        }
      } = await getDataStreams(asCurrentUser);
      let dataStreamsStats;
      let dataStreamsPrivileges;

      if (includeStats) {
        ({
          body: {
            data_streams: dataStreamsStats
          }
        } = await getDataStreamsStats(asCurrentUser));
      }

      if (config.isSecurityEnabled() && dataStreams.length > 0) {
        ({
          body: dataStreamsPrivileges
        } = await getDataStreamsPrivileges(asCurrentUser, dataStreams.map(dataStream => dataStream.name)));
      }

      dataStreams = enhanceDataStreams({
        dataStreams,
        dataStreamsStats,
        dataStreamsPrivileges
      });
      return response.ok({
        body: (0, _lib.deserializeDataStreamList)(dataStreams)
      });
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}

function registerGetOneRoute({
  router,
  license,
  lib: {
    handleEsError
  },
  config
}) {
  const paramsSchema = _configSchema.schema.object({
    name: _configSchema.schema.string()
  });

  router.get({
    path: (0, _index.addBasePath)('/data_streams/{name}'),
    validate: {
      params: paramsSchema
    }
  }, license.guardApiRoute(async (ctx, req, response) => {
    const {
      name
    } = req.params;
    const {
      asCurrentUser
    } = ctx.core.elasticsearch.client;

    try {
      const [{
        body: {
          data_streams: dataStreams
        }
      }, {
        body: {
          data_streams: dataStreamsStats
        }
      }] = await Promise.all([getDataStreams(asCurrentUser, name), getDataStreamsStats(asCurrentUser, name)]);

      if (dataStreams[0]) {
        let dataStreamsPrivileges;

        if (config.isSecurityEnabled()) {
          ({
            body: dataStreamsPrivileges
          } = await getDataStreamsPrivileges(asCurrentUser, [dataStreams[0].name]));
        }

        const enhancedDataStreams = enhanceDataStreams({
          dataStreams,
          dataStreamsStats,
          dataStreamsPrivileges
        });
        const body = (0, _lib.deserializeDataStream)(enhancedDataStreams[0]);
        return response.ok({
          body
        });
      }

      return response.notFound();
    } catch (error) {
      return handleEsError({
        error,
        response
      });
    }
  }));
}