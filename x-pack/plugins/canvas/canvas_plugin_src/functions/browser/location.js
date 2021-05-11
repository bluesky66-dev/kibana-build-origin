"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.location = location;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const noop = () => {};

function location() {
  const {
    help
  } = (0, _i18n.getFunctionHelp)().location;
  return {
    name: 'location',
    type: 'datatable',
    inputTypes: ['null'],
    args: {},
    help,
    fn: () => {
      return new Promise(resolve => {
        function createLocation(geoposition) {
          const {
            latitude,
            longitude
          } = geoposition.coords;
          return resolve({
            type: 'datatable',
            columns: [{
              id: 'latitude',
              name: 'latitude',
              meta: {
                type: 'number'
              }
            }, {
              id: 'longitude',
              name: 'longitude',
              meta: {
                type: 'number'
              }
            }],
            rows: [{
              latitude,
              longitude
            }]
          });
        }

        return navigator.geolocation.getCurrentPosition(createLocation, noop, {
          maximumAge: 5000
        });
      });
    }
  };
}