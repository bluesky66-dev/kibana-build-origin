"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emsBoundariesSpecProvider = emsBoundariesSpecProvider;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../../../src/plugins/home/server");

var _constants = require("../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function emsBoundariesSpecProvider({
  emsLandingPageUrl,
  prependBasePath
}) {
  return () => ({
    id: 'emsBoundaries',
    name: _i18n.i18n.translate('xpack.maps.tutorials.ems.nameTitle', {
      defaultMessage: 'EMS Boundaries'
    }),
    category: _server.TutorialsCategory.OTHER,
    shortDescription: _i18n.i18n.translate('xpack.maps.tutorials.ems.shortDescription', {
      defaultMessage: 'Administrative boundaries from Elastic Maps Service.'
    }),
    longDescription: _i18n.i18n.translate('xpack.maps.tutorials.ems.longDescription', {
      defaultMessage: '[Elastic Maps Service (EMS)](https://www.elastic.co/elastic-maps-service) \
hosts tile layers and vector shapes of administrative boundaries. \
Indexing EMS administrative boundaries in Elasticsearch allows for search on boundary property fields.'
    }),
    euiIconType: 'emsApp',
    completionTimeMinutes: 1,
    previewImagePath: '/plugins/maps/assets/boundaries_screenshot.png',
    onPrem: {
      instructionSets: [{
        instructionVariants: [{
          id: 'EMS',
          instructions: [{
            title: _i18n.i18n.translate('xpack.maps.tutorials.ems.downloadStepTitle', {
              defaultMessage: 'Download Elastic Maps Service boundaries'
            }),
            textPre: _i18n.i18n.translate('xpack.maps.tutorials.ems.downloadStepText', {
              defaultMessage: '1. Navigate to Elastic Maps Service [landing page]({emsLandingPageUrl}).\n\
2. In the left sidebar, select an administrative boundary.\n\
3. Click `Download GeoJSON` button.',
              values: {
                emsLandingPageUrl
              }
            })
          }, {
            title: _i18n.i18n.translate('xpack.maps.tutorials.ems.uploadStepTitle', {
              defaultMessage: 'Index Elastic Maps Service boundaries'
            }),
            textPre: _i18n.i18n.translate('xpack.maps.tutorials.ems.uploadStepText', {
              defaultMessage: '1. Open [Maps]({newMapUrl}).\n\
2. Click `Add layer`, then select `Upload GeoJSON`.\n\
3. Upload the GeoJSON file and click `Import file`.',
              values: {
                newMapUrl: prependBasePath((0, _constants.getNewMapPath)())
              }
            })
          }]
        }]
      }]
    }
  });
}