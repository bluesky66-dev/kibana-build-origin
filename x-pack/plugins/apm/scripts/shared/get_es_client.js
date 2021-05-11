"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEsClient = getEsClient;

var _elasticsearch = require("@elastic/elasticsearch");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getEsClient({
  node,
  auth
}) {
  const client = new _elasticsearch.Client({
    node,
    ssl: {
      rejectUnauthorized: false
    },
    requestTimeout: 120000,
    auth
  });

  async function search(request) {
    const response = await client.search(request);
    return { ...response,
      body: response.body
    };
  } // @ts-expect-error


  client.search = search;
  return client;
}