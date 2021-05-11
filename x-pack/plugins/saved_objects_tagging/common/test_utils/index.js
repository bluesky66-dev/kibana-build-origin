"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAssignableObject = exports.createTagCapabilities = exports.createTagAttributes = exports.createTag = exports.createSavedObject = exports.createTagReference = exports.createReference = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createReference = (type, id) => ({
  type,
  id,
  name: `${type}-ref-${id}`
});

exports.createReference = createReference;

const createTagReference = id => createReference('tag', id);

exports.createTagReference = createTagReference;

const createSavedObject = parts => ({
  type: 'tag',
  id: 'id',
  references: [],
  attributes: {},
  ...parts
});

exports.createSavedObject = createSavedObject;

const createTag = (parts = {}) => ({
  id: 'tag-id',
  name: 'some-tag',
  description: 'Some tag',
  color: '#FF00CC',
  ...parts
});

exports.createTag = createTag;

const createTagAttributes = (parts = {}) => ({
  name: 'some-tag',
  description: 'Some tag',
  color: '#FF00CC',
  ...parts
});

exports.createTagAttributes = createTagAttributes;

const createTagCapabilities = (parts = {}) => ({
  view: true,
  create: true,
  edit: true,
  delete: true,
  assign: true,
  viewConnections: true,
  ...parts
});

exports.createTagCapabilities = createTagCapabilities;

const createAssignableObject = (parts = {}) => ({
  type: 'type',
  id: 'id',
  title: 'title',
  tags: [],
  ...parts
});

exports.createAssignableObject = createAssignableObject;