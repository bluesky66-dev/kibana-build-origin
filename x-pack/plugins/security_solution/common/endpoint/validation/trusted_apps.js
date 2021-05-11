"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDuplicateFields = exports.isValidHash = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const HASH_LENGTHS = [32, // MD5
40, // SHA1
64 // SHA256
];
const INVALID_CHARACTERS_PATTERN = /[^0-9a-f]/i;

const isValidHash = value => HASH_LENGTHS.includes(value.length) && !INVALID_CHARACTERS_PATTERN.test(value);

exports.isValidHash = isValidHash;

const getDuplicateFields = entries => {
  const groupedFields = new Map();
  entries.forEach(entry => {
    groupedFields.set(entry.field, [...(groupedFields.get(entry.field) || []), entry]);
  });
  return [...groupedFields.entries()].filter(entry => entry[1].length > 1).map(entry => entry[0]);
};

exports.getDuplicateFields = getDuplicateFields;