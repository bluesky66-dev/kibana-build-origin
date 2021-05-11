"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilter = void 0;

var _utility_types = require("../../../../common/utility_types");

var _get_query_filter = require("../../../../common/detection_engine/get_query_filter");

var _bad_request_error = require("../errors/bad_request_error");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFilter = async ({
  filters,
  index,
  language,
  savedId,
  services,
  type,
  query,
  lists
}) => {
  const queryFilter = () => {
    if (query != null && language != null && index != null) {
      return (0, _get_query_filter.getQueryFilter)(query, language, filters || [], index, lists);
    } else {
      throw new _bad_request_error.BadRequestError('query, filters, and index parameter should be defined');
    }
  };

  const savedQueryFilter = async () => {
    if (savedId != null && index != null) {
      try {
        // try to get the saved object first
        const savedObject = await services.savedObjectsClient.get('query', savedId);
        return (0, _get_query_filter.getQueryFilter)(savedObject.attributes.query.query, savedObject.attributes.query.language, savedObject.attributes.filters, index, lists);
      } catch (err) {
        // saved object does not exist, so try and fall back if the user pushed
        // any additional language, query, filters, etc...
        if (query != null && language != null && index != null) {
          return (0, _get_query_filter.getQueryFilter)(query, language, filters || [], index, lists);
        } else {
          // user did not give any additional fall back mechanism for generating a rule
          // rethrow error for activity monitoring
          throw err;
        }
      }
    } else {
      throw new _bad_request_error.BadRequestError('savedId parameter should be defined');
    }
  };

  switch (type) {
    case 'threat_match':
    case 'threshold':
      {
        return savedId != null ? savedQueryFilter() : queryFilter();
      }

    case 'query':
      {
        return queryFilter();
      }

    case 'saved_query':
      {
        return savedQueryFilter();
      }

    case 'machine_learning':
      {
        throw new _bad_request_error.BadRequestError('Unsupported Rule of type "machine_learning" supplied to getFilter');
      }

    case 'eql':
      {
        throw new _bad_request_error.BadRequestError('Unsupported Rule of type "eql" supplied to getFilter');
      }

    default:
      {
        return (0, _utility_types.assertUnreachable)(type);
      }
  }
};

exports.getFilter = getFilter;