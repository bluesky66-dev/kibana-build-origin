"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAgentEvents = getAgentEvents;

var _constants = require("../../constants");

var _saved_object = require("../saved_object");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getAgentEvents(soClient, agentId, options) {
  const {
    page,
    perPage,
    kuery
  } = options; // eslint-disable-next-line @typescript-eslint/naming-convention

  const {
    total,
    saved_objects
  } = await soClient.find({
    type: _constants.AGENT_EVENT_SAVED_OBJECT_TYPE,
    filter: kuery && kuery !== '' ? (0, _saved_object.normalizeKuery)(_constants.AGENT_EVENT_SAVED_OBJECT_TYPE, kuery) : undefined,
    perPage,
    page,
    sortField: 'timestamp',
    sortOrder: 'desc',
    defaultSearchOperator: 'AND',
    search: agentId,
    searchFields: ['agent_id']
  });
  const items = saved_objects.map(so => {
    return {
      id: so.id,
      ...so.attributes,
      payload: so.attributes.payload ? JSON.parse(so.attributes.payload) : undefined
    };
  });
  return {
    items,
    total
  };
}