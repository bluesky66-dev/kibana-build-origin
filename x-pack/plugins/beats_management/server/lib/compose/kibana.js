"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compose = compose;

var _lodash = require("lodash");

var _constants = require("../../../common/constants");

var _elasticsearch_beats_adapter = require("../adapters/beats/elasticsearch_beats_adapter");

var _elasticsearch_configuration_block_adapter = require("../adapters/configuration_blocks/elasticsearch_configuration_block_adapter");

var _kibana_database_adapter = require("../adapters/database/kibana_database_adapter");

var _kibana_framework_adapter = require("../adapters/framework/kibana_framework_adapter");

var _elasticsearch_tags_adapter = require("../adapters/tags/elasticsearch_tags_adapter");

var _elasticsearch_tokens_adapter = require("../adapters/tokens/elasticsearch_tokens_adapter");

var _beat_events = require("../beat_events");

var _beats = require("../beats");

var _configuration_blocks = require("../configuration_blocks");

var _tags = require("../tags");

var _tokens = require("../tokens");

var _framework = require("./../framework");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function compose({
  elasticsearch,
  config,
  kibanaVersion,
  logger,
  licensing,
  security
}) {
  const backendAdapter = new _kibana_framework_adapter.KibanaBackendFrameworkAdapter((0, _lodash.camelCase)(_constants.PLUGIN.ID), kibanaVersion, config, logger, licensing, security);
  const framework = new _framework.BackendFrameworkLib(backendAdapter, config);
  const database = new _kibana_database_adapter.KibanaDatabaseAdapter(elasticsearch);
  const beatsAdapter = new _elasticsearch_beats_adapter.ElasticsearchBeatsAdapter(database);
  const configAdapter = new _elasticsearch_configuration_block_adapter.ElasticsearchConfigurationBlockAdapter(database);
  const tags = new _tags.CMTagsDomain(new _elasticsearch_tags_adapter.ElasticsearchTagsAdapter(database), configAdapter, beatsAdapter);
  const configurationBlocks = new _configuration_blocks.ConfigurationBlocksLib(configAdapter, tags);
  const tokens = new _tokens.CMTokensDomain(new _elasticsearch_tokens_adapter.ElasticsearchTokensAdapter(database), {
    framework
  });
  const beats = new _beats.CMBeatsDomain(beatsAdapter, {
    tags,
    tokens,
    framework
  });
  const beatEvents = new _beat_events.BeatEventsLib(beats);
  const libs = {
    beatEvents,
    framework,
    database,
    beats,
    tags,
    tokens,
    configurationBlocks
  };
  return libs;
}