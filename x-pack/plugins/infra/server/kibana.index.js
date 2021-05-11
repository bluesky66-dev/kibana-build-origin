"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfigSchema = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// NP_TODO: this is only used in the root index file AFAICT, can remove after migrating to NP

const getConfigSchema = Joi => {
  const InfraDefaultSourceConfigSchema = Joi.object({
    metricAlias: Joi.string(),
    logAlias: Joi.string(),
    fields: Joi.object({
      container: Joi.string(),
      host: Joi.string(),
      message: Joi.array().items(Joi.string()).single(),
      pod: Joi.string(),
      tiebreaker: Joi.string(),
      timestamp: Joi.string()
    })
  }); // NP_TODO: make sure this is all represented in the NP config schema

  const InfraRootConfigSchema = Joi.object({
    enabled: Joi.boolean().default(true),
    query: Joi.object({
      partitionSize: Joi.number(),
      partitionFactor: Joi.number()
    }).default(),
    sources: Joi.object().keys({
      default: InfraDefaultSourceConfigSchema
    }).default()
  }).default();
  return InfraRootConfigSchema;
};

exports.getConfigSchema = getConfigSchema;