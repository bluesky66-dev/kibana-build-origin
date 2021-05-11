"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchIndices = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function fetchIndicesCall(callAsCurrentUser, indexNames) {
  const indexNamesString = indexNames && indexNames.length ? indexNames.join(',') : '*'; // This call retrieves alias and settings (incl. hidden status) information about indices

  const indices = await callAsCurrentUser('transport.request', {
    method: 'GET',
    // transport.request doesn't do any URI encoding, unlike other JS client APIs. This enables
    // working with Logstash indices with names like %{[@metadata][beat]}-%{[@metadata][version]}.
    path: `/${encodeURIComponent(indexNamesString)}`,
    query: {
      expand_wildcards: 'hidden,all'
    }
  });

  if (!Object.keys(indices).length) {
    return [];
  }

  const catQuery = {
    format: 'json',
    h: 'health,status,index,uuid,pri,rep,docs.count,sth,store.size',
    expand_wildcards: 'hidden,all',
    index: indexNamesString
  }; // This call retrieves health and other high-level information about indices.

  const catHits = await callAsCurrentUser('transport.request', {
    method: 'GET',
    path: '/_cat/indices',
    query: catQuery
  }); // The two responses should be equal in the number of indices returned

  return catHits.map(hit => {
    const index = indices[hit.index];
    const aliases = Object.keys(index.aliases);
    return {
      health: hit.health,
      status: hit.status,
      name: hit.index,
      uuid: hit.uuid,
      primary: hit.pri,
      replica: hit.rep,
      documents: hit['docs.count'],
      size: hit['store.size'],
      isFrozen: hit.sth === 'true',
      // sth value coming back as a string from ES
      aliases: aliases.length ? aliases : 'none',
      hidden: index.settings.index.hidden === 'true',
      data_stream: index.data_stream
    };
  });
}

const fetchIndices = async (callAsCurrentUser, indexDataEnricher, indexNames) => {
  const indices = await fetchIndicesCall(callAsCurrentUser, indexNames);
  return await indexDataEnricher.enrichIndices(indices, callAsCurrentUser);
};

exports.fetchIndices = fetchIndices;