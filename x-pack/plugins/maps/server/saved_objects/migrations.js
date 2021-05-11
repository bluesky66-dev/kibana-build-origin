"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrations = void 0;

var _references = require("../../common/migrations/references");

var _ems_raster_tile_to_ems_vector_tile = require("../../common/migrations/ems_raster_tile_to_ems_vector_tile");

var _top_hits_time_to_sort = require("../../common/migrations/top_hits_time_to_sort");

var _move_apply_global_query = require("../../common/migrations/move_apply_global_query");

var _add_field_meta_options = require("../../common/migrations/add_field_meta_options");

var _migrate_symbol_style_descriptor = require("../../common/migrations/migrate_symbol_style_descriptor");

var _scaling_type = require("../../common/migrations/scaling_type");

var _join_agg_key = require("../../common/migrations/join_agg_key");

var _remove_bounds = require("../../common/migrations/remove_bounds");

var _set_default_auto_fit_to_bounds = require("../../common/migrations/set_default_auto_fit_to_bounds");

var _add_type_to_termjoin = require("../../common/migrations/add_type_to_termjoin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const migrations = {
  map: {
    '7.2.0': doc => {
      const {
        attributes,
        references
      } = (0, _references.extractReferences)(doc);
      return { ...doc,
        attributes,
        references
      };
    },
    '7.4.0': doc => {
      const attributes = (0, _ems_raster_tile_to_ems_vector_tile.emsRasterTileToEmsVectorTile)(doc);
      return { ...doc,
        attributes
      };
    },
    '7.5.0': doc => {
      const attributes = (0, _top_hits_time_to_sort.topHitsTimeToSort)(doc);
      return { ...doc,
        attributes
      };
    },
    '7.6.0': doc => {
      const attributesPhase1 = (0, _move_apply_global_query.moveApplyGlobalQueryToSources)(doc);
      const attributesPhase2 = (0, _add_field_meta_options.addFieldMetaOptions)({
        attributes: attributesPhase1
      });
      return { ...doc,
        attributes: attributesPhase2
      };
    },
    '7.7.0': doc => {
      const attributesPhase1 = (0, _migrate_symbol_style_descriptor.migrateSymbolStyleDescriptor)(doc);
      const attributesPhase2 = (0, _scaling_type.migrateUseTopHitsToScalingType)({
        attributes: attributesPhase1
      });
      return { ...doc,
        attributes: attributesPhase2
      };
    },
    '7.8.0': doc => {
      const attributes = (0, _join_agg_key.migrateJoinAggKey)(doc);
      return { ...doc,
        attributes
      };
    },
    '7.9.0': doc => {
      const attributes = (0, _remove_bounds.removeBoundsFromSavedObject)(doc);
      return { ...doc,
        attributes
      };
    },
    '7.10.0': doc => {
      const attributes = (0, _set_default_auto_fit_to_bounds.setDefaultAutoFitToBounds)(doc);
      return { ...doc,
        attributes
      };
    },
    '7.12.0': doc => {
      const attributes = (0, _add_type_to_termjoin.addTypeToTermJoin)(doc);
      return { ...doc,
        attributes
      };
    }
  }
};
exports.migrations = migrations;