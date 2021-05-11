"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = void 0;

var _actions = require("./actions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The Action Reducer for the Shareable Canvas Workpad interface.
 */


const reducer = (state, action) => {
  switch (action.type) {
    case _actions.CanvasShareableActions.SET_PAGE:
      {
        const {
          stage
        } = state;
        return { ...state,
          stage: { ...stage,
            page: action.payload.page
          }
        };
      }

    case _actions.CanvasShareableActions.SET_SCRUBBER_VISIBLE:
      {
        const {
          footer
        } = state;
        return { ...state,
          footer: { ...footer,
            isScrubberVisible: action.payload.visible
          }
        };
      }

    case _actions.CanvasShareableActions.SET_AUTOPLAY:
      {
        const {
          settings
        } = state;
        const {
          autoplay
        } = settings;
        const {
          isEnabled
        } = action.payload;
        return { ...state,
          settings: { ...settings,
            autoplay: { ...autoplay,
              isEnabled
            }
          }
        };
      }

    case _actions.CanvasShareableActions.SET_AUTOPLAY_INTERVAL:
      {
        const {
          settings
        } = state;
        const {
          autoplay
        } = settings;
        const {
          interval
        } = action.payload;
        return { ...state,
          settings: { ...settings,
            autoplay: { ...autoplay,
              interval
            }
          }
        };
      }

    case _actions.CanvasShareableActions.SET_TOOLBAR_AUTOHIDE:
      {
        const {
          settings
        } = state;
        const {
          toolbar
        } = settings;
        const {
          isAutohide
        } = action.payload;
        return { ...state,
          settings: { ...settings,
            toolbar: { ...toolbar,
              isAutohide
            }
          }
        };
      }

    default:
      {
        return state;
      }
  }
};

exports.reducer = reducer;