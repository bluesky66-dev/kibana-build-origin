"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceAnnotations = getServiceAnnotations;

var _get_derived_service_annotations = require("./get_derived_service_annotations");

var _get_stored_annotations = require("./get_stored_annotations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServiceAnnotations({
  setup,
  searchAggregatedTransactions,
  serviceName,
  environment,
  annotationsClient,
  client,
  logger
}) {
  // start fetching derived annotations (based on transactions), but don't wait on it
  // it will likely be significantly slower than the stored annotations
  const derivedAnnotationsPromise = (0, _get_derived_service_annotations.getDerivedServiceAnnotations)({
    setup,
    serviceName,
    environment,
    searchAggregatedTransactions
  });
  const storedAnnotations = annotationsClient ? await (0, _get_stored_annotations.getStoredAnnotations)({
    setup,
    serviceName,
    environment,
    annotationsClient,
    client,
    logger
  }) : [];

  if (storedAnnotations.length) {
    derivedAnnotationsPromise.catch(() => {// handle error silently to prevent Kibana from crashing
    });
    return {
      annotations: storedAnnotations
    };
  }

  return {
    annotations: await derivedAnnotationsPromise
  };
}