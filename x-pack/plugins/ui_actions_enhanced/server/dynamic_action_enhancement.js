"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dynamicActionEnhancement = void 0;

var _dynamic_actions_collector = require("./telemetry/dynamic_actions_collector");

var _dynamic_action_factories_collector = require("./telemetry/dynamic_action_factories_collector");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const dynamicActionEnhancement = getActionFactory => {
  return {
    id: 'dynamicActions',
    telemetry: (serializableState, stats) => {
      const state = serializableState;
      stats = (0, _dynamic_actions_collector.dynamicActionsCollector)(state, stats);
      stats = (0, _dynamic_action_factories_collector.dynamicActionFactoriesCollector)(getActionFactory, state, stats);
      return stats;
    },
    extract: state => {
      const references = [];
      const newState = {
        events: state.events.map(event => {
          const factory = getActionFactory(event.action.factoryId);
          const result = factory ? factory.extract(event) : {
            state: event,
            references: []
          };
          result.references.forEach(r => references.push(r));
          return result.state;
        })
      };
      return {
        state: newState,
        references
      };
    },
    inject: (state, references) => {
      return {
        events: state.events.map(event => {
          const factory = getActionFactory(event.action.factoryId);
          return factory ? factory.inject(event, references) : event;
        })
      };
    }
  };
};

exports.dynamicActionEnhancement = dynamicActionEnhancement;