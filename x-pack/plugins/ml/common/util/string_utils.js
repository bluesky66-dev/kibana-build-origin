"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderTemplate = renderTemplate;
exports.getMedianStringLength = getMedianStringLength;
exports.stringHash = stringHash;
exports.getGroupQueryText = getGroupQueryText;
exports.getJobQueryText = getJobQueryText;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// A simple template renderer, it replaces mustache/angular style {{...}} tags with
// the values provided via the data object

function renderTemplate(str, data) {
  const matches = str.match(/{{(.*?)}}/g);

  if (Array.isArray(matches) && data !== undefined) {
    matches.forEach(v => {
      str = str.replace(v, data[v.replace(/{{|}}/g, '')]);
    });
  }

  return str;
}

function getMedianStringLength(strings) {
  const sortedStringLengths = strings.map(s => s.length).sort((a, b) => a - b);
  return sortedStringLengths[Math.floor(sortedStringLengths.length / 2)] || 0;
}
/**
 * Creates a deterministic number based hash out of a string.
 */


function stringHash(str) {
  let hash = 0;
  let chr = 0;

  if (str.length === 0) {
    return hash;
  }

  for (let i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr; // eslint-disable-line no-bitwise

    hash |= 0; // eslint-disable-line no-bitwise
  }

  return hash < 0 ? hash * -2 : hash;
}

function getGroupQueryText(groupIds) {
  return `groups:(${groupIds.join(' or ')})`;
}

function getJobQueryText(jobIds) {
  return Array.isArray(jobIds) ? `id:(${jobIds.join(' OR ')})` : `id:${jobIds}`;
}