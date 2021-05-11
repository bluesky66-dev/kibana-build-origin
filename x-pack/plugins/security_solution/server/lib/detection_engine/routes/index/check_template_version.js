"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.templateNeedsUpdate = exports.getTemplateVersion = void 0;

var _helpers = require("../../migrations/helpers");

var _get_signals_template = require("./get_signals_template");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTemplateVersion = async ({
  alias,
  esClient
}) => {
  try {
    var _response$body$alias$;

    const response = await esClient.indices.getTemplate({
      name: alias
    });
    return (_response$body$alias$ = response.body[alias].version) !== null && _response$body$alias$ !== void 0 ? _response$body$alias$ : 0;
  } catch (e) {
    return 0;
  }
};

exports.getTemplateVersion = getTemplateVersion;

const templateNeedsUpdate = async ({
  alias,
  esClient
}) => {
  const templateVersion = await getTemplateVersion({
    alias,
    esClient
  });
  return (0, _helpers.isOutdated)({
    current: templateVersion,
    target: _get_signals_template.SIGNALS_TEMPLATE_VERSION
  });
};

exports.templateNeedsUpdate = templateNeedsUpdate;