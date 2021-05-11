"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKey = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * `type`+`id` tuple of a saved object
 */

/**
 * Represent an assignable saved object, as returned by the `_find_assignable_objects` API
 */

/**
 * Return a string that can be used as an unique identifier for given saved object
 */

const getKey = ({
  id,
  type
}) => `${type}|${id}`;

exports.getKey = getKey;