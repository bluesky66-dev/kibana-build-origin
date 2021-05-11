"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtract = exports.createInject = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const generateRefName = (state, id) => `drilldown:${id}:${state.eventId}:dashboardId`;

const injectDashboardId = (state, dashboardId) => {
  return { ...state,
    action: { ...state.action,
      config: { ...state.action.config,
        dashboardId
      }
    }
  };
};

const createInject = ({
  drilldownId
}) => {
  return (state, references) => {
    const action = state.action;
    const refName = generateRefName(state, drilldownId);
    const ref = references.find(r => r.name === refName);
    if (!ref) return state;
    if (ref.id && ref.id === action.config.dashboardId) return state;
    return injectDashboardId(state, ref.id);
  };
};

exports.createInject = createInject;

const createExtract = ({
  drilldownId
}) => {
  return state => {
    const action = state.action;
    const references = action.config.dashboardId ? [{
      name: generateRefName(state, drilldownId),
      type: 'dashboard',
      id: action.config.dashboardId
    }] : [];
    const {
      dashboardId,
      ...restOfConfig
    } = action.config;
    return {
      state: { ...state,
        action: { ...state.action,
          config: restOfConfig
        }
      },
      references
    };
  };
};

exports.createExtract = createExtract;