"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTrustedAppsSummary = exports.createTrustedApp = exports.getTrustedAppsList = exports.deleteTrustedApp = exports.MissingTrustedAppException = void 0;

var _common = require("../../../../../lists/common");

var _mapping = require("./mapping");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class MissingTrustedAppException {
  constructor(id) {
    this.id = id;
  }

}

exports.MissingTrustedAppException = MissingTrustedAppException;

const deleteTrustedApp = async (exceptionsListClient, {
  id
}) => {
  const exceptionListItem = await exceptionsListClient.deleteExceptionListItem({
    id,
    itemId: undefined,
    namespaceType: 'agnostic'
  });

  if (!exceptionListItem) {
    throw new MissingTrustedAppException(id);
  }
};

exports.deleteTrustedApp = deleteTrustedApp;

const getTrustedAppsList = async (exceptionsListClient, {
  page,
  per_page: perPage
}) => {
  var _results$data$map, _results$total, _results$page, _results$per_page; // Ensure list is created if it does not exist


  await exceptionsListClient.createTrustedAppsList();
  const results = await exceptionsListClient.findExceptionListItem({
    listId: _common.ENDPOINT_TRUSTED_APPS_LIST_ID,
    page,
    perPage,
    filter: undefined,
    namespaceType: 'agnostic',
    sortField: 'name',
    sortOrder: 'asc'
  });
  return {
    data: (_results$data$map = results === null || results === void 0 ? void 0 : results.data.map(_mapping.exceptionListItemToTrustedApp)) !== null && _results$data$map !== void 0 ? _results$data$map : [],
    total: (_results$total = results === null || results === void 0 ? void 0 : results.total) !== null && _results$total !== void 0 ? _results$total : 0,
    page: (_results$page = results === null || results === void 0 ? void 0 : results.page) !== null && _results$page !== void 0 ? _results$page : 1,
    per_page: (_results$per_page = results === null || results === void 0 ? void 0 : results.per_page) !== null && _results$per_page !== void 0 ? _results$per_page : perPage
  };
};

exports.getTrustedAppsList = getTrustedAppsList;

const createTrustedApp = async (exceptionsListClient, newTrustedApp) => {
  // Ensure list is created if it does not exist
  await exceptionsListClient.createTrustedAppsList();
  const createdTrustedAppExceptionItem = await exceptionsListClient.createExceptionListItem((0, _mapping.newTrustedAppToCreateExceptionListItemOptions)(newTrustedApp));
  return {
    data: (0, _mapping.exceptionListItemToTrustedApp)(createdTrustedAppExceptionItem)
  };
};

exports.createTrustedApp = createTrustedApp;

const getTrustedAppsSummary = async exceptionsListClient => {
  // Ensure list is created if it does not exist
  await exceptionsListClient.createTrustedAppsList();
  const summary = {
    linux: 0,
    windows: 0,
    macos: 0,
    total: 0
  };
  const perPage = 100;
  let paging = true;
  let page = 1;

  while (paging) {
    const {
      data,
      total
    } = await exceptionsListClient.findExceptionListItem({
      listId: _common.ENDPOINT_TRUSTED_APPS_LIST_ID,
      page,
      perPage,
      filter: undefined,
      namespaceType: 'agnostic',
      sortField: undefined,
      sortOrder: undefined
    });
    summary.total = total;

    for (const item of data) {
      summary[(0, _mapping.osFromExceptionItem)(item)]++;
    }

    paging = (page - 1) * perPage + data.length < total;
    page++;
  }

  return summary;
};

exports.getTrustedAppsSummary = getTrustedAppsSummary;