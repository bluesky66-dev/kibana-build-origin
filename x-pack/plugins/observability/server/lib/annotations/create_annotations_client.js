"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAnnotationsClient = createAnnotationsClient;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _create_or_update_index = require("../../utils/create_or_update_index");

var _mappings = require("./mappings");

var _unwrap_es_response = require("../../utils/unwrap_es_response");

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


function createAnnotationsClient(params) {
  const {
    index,
    esClient,
    logger,
    license
  } = params;

  const initIndex = () => (0, _create_or_update_index.createOrUpdateIndex)({
    index,
    mappings: _mappings.mappings,
    client: esClient,
    logger
  });

  function ensureGoldLicense(fn) {
    return (...args) => {
      if (!(license !== null && license !== void 0 && license.hasAtLeast('gold'))) {
        throw _boom.default.forbidden('Annotations require at least a gold license or a trial license.');
      }

      return fn(...args);
    };
  }

  return {
    get index() {
      return index;
    },

    create: ensureGoldLicense(async createParams => {
      const indexExists = await (0, _unwrap_es_response.unwrapEsResponse)(esClient.indices.exists({
        index
      }));

      if (!indexExists) {
        await initIndex();
      }

      const annotation = { ...createParams,
        event: {
          created: new Date().toISOString()
        }
      };
      const body = await (0, _unwrap_es_response.unwrapEsResponse)(esClient.index({
        index,
        body: annotation,
        refresh: 'wait_for'
      }));
      return (await esClient.get({
        index,
        id: body._id
      })).body;
    }),
    getById: ensureGoldLicense(async getByIdParams => {
      const {
        id
      } = getByIdParams;
      return (0, _unwrap_es_response.unwrapEsResponse)(esClient.get({
        id,
        index
      }));
    }),
    delete: ensureGoldLicense(async deleteParams => {
      const {
        id
      } = deleteParams;
      return (0, _unwrap_es_response.unwrapEsResponse)(esClient.delete({
        index,
        id,
        refresh: 'wait_for'
      }));
    })
  };
}