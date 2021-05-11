"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initFindCaseCommentsApi = initFindCaseCommentsApi;

var rt = _interopRequireWildcard(require("io-ts"));

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _api = require("../../../../../common/api");

var _utils = require("../../utils");

var _constants = require("../../../../../common/constants");

var _ = require("../..");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FindQueryParamsRt = rt.partial({ ..._api.SavedObjectFindOptionsRt.props
});

function initFindCaseCommentsApi({
  caseService,
  router,
  logger
}) {
  router.get({
    path: `${_constants.CASE_COMMENTS_URL}/_find`,
    validate: {
      params: _configSchema.schema.object({
        case_id: _configSchema.schema.string()
      }),
      query: _utils.escapeHatch
    }
  }, async (context, request, response) => {
    try {
      const client = context.core.savedObjects.client;
      const query = (0, _pipeable.pipe)(FindQueryParamsRt.decode(request.query), (0, _Either.fold)((0, _api.throwErrors)(_boom.default.badRequest), _function.identity));
      const id = request.params.case_id;
      const associationType = _api.AssociationType.case;
      const args = query ? {
        caseService,
        client,
        id,
        options: {
          // We need this because the default behavior of getAllCaseComments is to return all the comments
          // unless the page and/or perPage is specified. Since we're spreading the query after the request can
          // still override this behavior.
          page: _.defaultPage,
          perPage: _.defaultPerPage,
          sortField: 'created_at',
          ...query
        },
        associationType
      } : {
        caseService,
        client,
        id,
        options: {
          page: _.defaultPage,
          perPage: _.defaultPerPage,
          sortField: 'created_at'
        },
        associationType
      };
      const theComments = await caseService.getCommentsByAssociation(args);
      return response.ok({
        body: _api.CommentsResponseRt.encode((0, _utils.transformComments)(theComments))
      });
    } catch (error) {
      logger.error(`Failed to find comments in route case id: ${request.params.case_id}: ${error}`);
      return response.customError((0, _utils.wrapError)(error));
    }
  });
}