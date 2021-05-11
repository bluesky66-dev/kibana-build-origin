"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.putOuputHandler = exports.getOneOuputHandler = exports.getOutputsHandler = void 0;

var _output = require("../../services/output");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getOutputsHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const outputs = await _output.outputService.list(soClient);
    const body = {
      items: outputs.items,
      page: outputs.page,
      perPage: outputs.perPage,
      total: outputs.total
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getOutputsHandler = getOutputsHandler;

const getOneOuputHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    const output = await _output.outputService.get(soClient, request.params.outputId);
    const body = {
      item: output
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Output ${request.params.outputId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getOneOuputHandler = getOneOuputHandler;

const putOuputHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    await _output.outputService.update(soClient, request.params.outputId, request.body);
    const output = await _output.outputService.get(soClient, request.params.outputId);
    const body = {
      item: output
    };
    return response.ok({
      body
    });
  } catch (error) {
    if (error.isBoom && error.output.statusCode === 404) {
      return response.notFound({
        body: {
          message: `Output ${request.params.outputId} not found`
        }
      });
    }

    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.putOuputHandler = putOuputHandler;