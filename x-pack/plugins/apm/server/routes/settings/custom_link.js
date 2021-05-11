"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteCustomLinkRoute = exports.updateCustomLinkRoute = exports.createCustomLinkRoute = exports.listCustomLinksRoute = exports.customLinkTransactionRoute = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var t = _interopRequireWildcard(require("io-ts"));

var _lodash = require("lodash");

var _license_check = require("../../../common/license_check");

var _custom_link = require("../../../common/custom_link");

var _custom_link_filter_options = require("../../../common/custom_link/custom_link_filter_options");

var _feature = require("../../feature");

var _setup_request = require("../../lib/helpers/setup_request");

var _create_or_update_custom_link = require("../../lib/settings/custom_link/create_or_update_custom_link");

var _custom_link_types = require("../../lib/settings/custom_link/custom_link_types");

var _delete_custom_link = require("../../lib/settings/custom_link/delete_custom_link");

var _get_transaction = require("../../lib/settings/custom_link/get_transaction");

var _list_custom_links = require("../../lib/settings/custom_link/list_custom_links");

var _create_route = require("../create_route");

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


const customLinkTransactionRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/custom_links/transaction',
  options: {
    tags: ['access:apm']
  },
  params: t.partial({
    query: _custom_link_types.filterOptionsRt
  }),
  handler: async ({
    context,
    request
  }) => {
    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query
    } = context.params; // picks only the items listed in FILTER_OPTIONS

    const filters = (0, _lodash.pick)(query, _custom_link_filter_options.FILTER_OPTIONS);
    return await (0, _get_transaction.getTransaction)({
      setup,
      filters
    });
  }
});
exports.customLinkTransactionRoute = customLinkTransactionRoute;
const listCustomLinksRoute = (0, _create_route.createRoute)({
  endpoint: 'GET /api/apm/settings/custom_links',
  options: {
    tags: ['access:apm']
  },
  params: t.partial({
    query: _custom_link_types.filterOptionsRt
  }),
  handler: async ({
    context,
    request
  }) => {
    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      query
    } = context.params; // picks only the items listed in FILTER_OPTIONS

    const filters = (0, _lodash.pick)(query, _custom_link_filter_options.FILTER_OPTIONS);
    return await (0, _list_custom_links.listCustomLinks)({
      setup,
      filters
    });
  }
});
exports.listCustomLinksRoute = listCustomLinksRoute;
const createCustomLinkRoute = (0, _create_route.createRoute)({
  endpoint: 'POST /api/apm/settings/custom_links',
  params: t.type({
    body: _custom_link_types.payloadRt
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const customLink = context.params.body;
    const res = await (0, _create_or_update_custom_link.createOrUpdateCustomLink)({
      customLink,
      setup
    });
    (0, _feature.notifyFeatureUsage)({
      licensingPlugin: context.licensing,
      featureName: 'customLinks'
    });
    return res;
  }
});
exports.createCustomLinkRoute = createCustomLinkRoute;
const updateCustomLinkRoute = (0, _create_route.createRoute)({
  endpoint: 'PUT /api/apm/settings/custom_links/{id}',
  params: t.type({
    path: t.type({
      id: t.string
    }),
    body: _custom_link_types.payloadRt
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      id
    } = context.params.path;
    const customLink = context.params.body;
    const res = await (0, _create_or_update_custom_link.createOrUpdateCustomLink)({
      customLinkId: id,
      customLink,
      setup
    });
    return res;
  }
});
exports.updateCustomLinkRoute = updateCustomLinkRoute;
const deleteCustomLinkRoute = (0, _create_route.createRoute)({
  endpoint: 'DELETE /api/apm/settings/custom_links/{id}',
  params: t.type({
    path: t.type({
      id: t.string
    })
  }),
  options: {
    tags: ['access:apm', 'access:apm_write']
  },
  handler: async ({
    context,
    request
  }) => {
    if (!(0, _license_check.isActiveGoldLicense)(context.licensing.license)) {
      throw _boom.default.forbidden(_custom_link.INVALID_LICENSE);
    }

    const setup = await (0, _setup_request.setupRequest)(context, request);
    const {
      id
    } = context.params.path;
    const res = await (0, _delete_custom_link.deleteCustomLink)({
      customLinkId: id,
      setup
    });
    return res;
  }
});
exports.deleteCustomLinkRoute = deleteCustomLinkRoute;