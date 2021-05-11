"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RenderedWorkpadSchema = exports.RenderedWorkpadPageSchema = exports.RenderedWorkpadElementSchema = exports.RenderableSchema = exports.ContainerStyleSchema = exports.PositionSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PositionSchema = _configSchema.schema.object({
  angle: _configSchema.schema.number(),
  height: _configSchema.schema.number(),
  left: _configSchema.schema.number(),
  parent: _configSchema.schema.nullable(_configSchema.schema.string()),
  top: _configSchema.schema.number(),
  width: _configSchema.schema.number()
});

exports.PositionSchema = PositionSchema;

const ContainerStyleSchema = _configSchema.schema.object({
  type: _configSchema.schema.maybe(_configSchema.schema.string()),
  border: _configSchema.schema.maybe(_configSchema.schema.string()),
  borderRadius: _configSchema.schema.maybe(_configSchema.schema.string()),
  padding: _configSchema.schema.maybe(_configSchema.schema.string()),
  backgroundColor: _configSchema.schema.maybe(_configSchema.schema.string()),
  backgroundImage: _configSchema.schema.maybe(_configSchema.schema.string()),
  backgroundSize: _configSchema.schema.maybe(_configSchema.schema.string()),
  backgroundRepeat: _configSchema.schema.maybe(_configSchema.schema.string()),
  opacity: _configSchema.schema.maybe(_configSchema.schema.number()),
  overflow: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.ContainerStyleSchema = ContainerStyleSchema;

const RenderableSchema = _configSchema.schema.object({
  error: _configSchema.schema.nullable(_configSchema.schema.string()),
  state: _configSchema.schema.string(),
  value: _configSchema.schema.object({
    as: _configSchema.schema.string(),
    containerStyle: ContainerStyleSchema,
    css: _configSchema.schema.maybe(_configSchema.schema.string()),
    type: _configSchema.schema.string(),
    value: _configSchema.schema.any()
  })
});

exports.RenderableSchema = RenderableSchema;

const RenderedWorkpadElementSchema = _configSchema.schema.object({
  expressionRenderable: RenderableSchema,
  id: _configSchema.schema.string(),
  position: PositionSchema
});

exports.RenderedWorkpadElementSchema = RenderedWorkpadElementSchema;

const RenderedWorkpadPageSchema = _configSchema.schema.object({
  id: _configSchema.schema.string(),
  elements: _configSchema.schema.arrayOf(RenderedWorkpadElementSchema),
  groups: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.arrayOf(RenderedWorkpadElementSchema))),
  style: _configSchema.schema.recordOf(_configSchema.schema.string(), _configSchema.schema.string()),
  transition: _configSchema.schema.maybe(_configSchema.schema.oneOf([_configSchema.schema.object({}), _configSchema.schema.object({
    name: _configSchema.schema.string()
  })]))
});

exports.RenderedWorkpadPageSchema = RenderedWorkpadPageSchema;

const RenderedWorkpadSchema = _configSchema.schema.object({
  '@created': _configSchema.schema.maybe(_configSchema.schema.string()),
  '@timestamp': _configSchema.schema.maybe(_configSchema.schema.string()),
  assets: _configSchema.schema.maybe(_configSchema.schema.recordOf(_configSchema.schema.string(), RenderedWorkpadPageSchema)),
  colors: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  css: _configSchema.schema.string(),
  height: _configSchema.schema.number(),
  id: _configSchema.schema.string(),
  isWriteable: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  name: _configSchema.schema.string(),
  page: _configSchema.schema.number(),
  pages: _configSchema.schema.arrayOf(RenderedWorkpadPageSchema),
  width: _configSchema.schema.number()
});

exports.RenderedWorkpadSchema = RenderedWorkpadSchema;