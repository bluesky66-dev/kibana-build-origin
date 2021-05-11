"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchStatus = getSearchStatus;

var _i18n = require("@kbn/i18n");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getSearchStatus(client, asyncId) {
  // TODO: Handle strategies other than the default one
  try {
    const apiResponse = await client.asyncSearch.status({
      id: asyncId
    });
    const response = apiResponse.body;

    if (response.is_partial && !response.is_running || response.completion_status >= 400) {
      return {
        status: _types.SearchStatus.ERROR,
        error: _i18n.i18n.translate('xpack.data.search.statusError', {
          defaultMessage: `Search completed with a {errorCode} status`,
          values: {
            errorCode: response.completion_status
          }
        })
      };
    } else if (!response.is_partial && !response.is_running) {
      return {
        status: _types.SearchStatus.COMPLETE,
        error: undefined
      };
    } else {
      return {
        status: _types.SearchStatus.IN_PROGRESS,
        error: undefined
      };
    }
  } catch (e) {
    return {
      status: _types.SearchStatus.ERROR,
      error: _i18n.i18n.translate('xpack.data.search.statusThrow', {
        defaultMessage: `Search status threw an error {message} ({errorCode}) status`,
        values: {
          message: e.message,
          errorCode: e.statusCode || 500
        }
      })
    };
  }
}