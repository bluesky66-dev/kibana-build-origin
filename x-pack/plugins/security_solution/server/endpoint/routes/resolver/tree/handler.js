"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleTree = handleTree;

var _fetch = require("./utils/fetch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function handleTree(log) {
  return async (context, req, res) => {
    try {
      const client = context.core.elasticsearch.client;
      const fetcher = new _fetch.Fetcher(client);
      const body = await fetcher.tree(req.body);
      return res.ok({
        body
      });
    } catch (err) {
      log.warn(err);
      return res.internalError({
        body: 'Error retrieving tree.'
      });
    }
  };
}