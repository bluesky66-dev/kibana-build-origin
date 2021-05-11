"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initRoutes = initRoutes;

var _constants = require("../common/constants");

var _emsClient = require("@elastic/ems-client");

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var _i18n = require("@kbn/i18n");

var _get_index_pattern_settings = require("./lib/get_index_pattern_settings");

var _configSchema = require("@kbn/config-schema");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _mvt_routes = require("./mvt/mvt_routes");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EMPTY_EMS_CLIENT = {
  async getFileLayers() {
    return [];
  },

  async getTMSServices() {
    return [];
  },

  async getMainManifest() {
    return null;
  },

  async getDefaultFileManifest() {
    return null;
  },

  async getDefaultTMSManifest() {
    return null;
  },

  addQueryParams() {}

};

function initRoutes(router, getLicenseId, emsSettings, kbnVersion, logger) {
  let emsClient;
  let lastLicenseId;

  function getEMSClient() {
    const currentLicenseId = getLicenseId();

    if (emsClient && emsSettings.isEMSEnabled() && lastLicenseId === currentLicenseId) {
      return emsClient;
    }

    lastLicenseId = currentLicenseId;

    if (emsSettings.isIncludeElasticMapsService()) {
      emsClient = new _emsClient.EMSClient({
        language: _i18n.i18n.getLocale(),
        appVersion: kbnVersion,
        appName: _constants.EMS_APP_NAME,
        fileApiUrl: emsSettings.getEMSFileApiUrl(),
        tileApiUrl: emsSettings.getEMSTileApiUrl(),
        landingPageUrl: emsSettings.getEMSLandingPageUrl(),
        fetchFunction: _nodeFetch.default
      });
      emsClient.addQueryParams({
        license: currentLicenseId
      });
      return emsClient;
    } else {
      return EMPTY_EMS_CLIENT;
    }
  }

  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_FILES_API_PATH}/${_constants.EMS_FILES_DEFAULT_JSON_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        id: _configSchema.schema.maybe(_configSchema.schema.string()),
        elastic_tile_service_tos: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_name: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_version: _configSchema.schema.maybe(_configSchema.schema.string()),
        license: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    if (!request.query.id) {
      logger.warn('Must supply id parameters to retrieve EMS file');
      return null;
    }

    const fileLayers = await getEMSClient().getFileLayers();
    const layer = fileLayers.find(layer => layer.getId() === request.query.id);

    if (!layer) {
      return null;
    }

    try {
      const file = await (0, _nodeFetch.default)(layer.getDefaultFormatUrl());
      const fileJson = await file.json();
      return ok({
        body: fileJson
      });
    } catch (e) {
      logger.warn(`Cannot connect to EMS for file, error: ${e.message}`);
      return badRequest(`Cannot connect to EMS`);
    }
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_TILES_RASTER_TILE_PATH}`,
    validate: false
  }, async (context, request, response) => {
    if (!checkEMSProxyEnabled()) {
      return response.badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    if (!request.query.id || typeof parseInt(request.query.x, 10) !== 'number' || typeof parseInt(request.query.y, 10) !== 'number' || typeof parseInt(request.query.z, 10) !== 'number') {
      logger.warn('Must supply id/x/y/z parameters to retrieve EMS raster tile');
      return null;
    }

    const tmsServices = await getEMSClient().getTMSServices();
    const tmsService = tmsServices.find(layer => layer.getId() === request.query.id);

    if (!tmsService) {
      return null;
    }

    const urlTemplate = await tmsService.getUrlTemplate();
    const url = urlTemplate.replace('{x}', request.query.x).replace('{y}', request.query.y).replace('{z}', request.query.z);
    return await proxyResource({
      url,
      contentType: 'image/png'
    }, response);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_CATALOGUE_PATH}`,
    validate: false
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const main = await getEMSClient().getMainManifest();
    const proxiedManifest = {
      services: []
    }; //rewrite the urls to the submanifest

    const tileService = main.services.find(service => service.type === 'tms');
    const fileService = main.services.find(service => service.type === 'file');

    if (tileService) {
      proxiedManifest.services.push({ ...tileService,
        manifest: `${_constants.GIS_API_PATH}/${_constants.EMS_TILES_CATALOGUE_PATH}`
      });
    }

    if (fileService) {
      proxiedManifest.services.push({ ...fileService,
        manifest: `${_constants.GIS_API_PATH}/${_constants.EMS_FILES_CATALOGUE_PATH}`
      });
    }

    return ok({
      body: proxiedManifest
    });
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_FILES_CATALOGUE_PATH}/{emsVersion}/manifest`,
    validate: false
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const file = await getEMSClient().getDefaultFileManifest(); //need raw manifest

    const fileLayers = await getEMSClient().getFileLayers();
    const layers = file.layers.map(layerJson => {
      const newLayerJson = { ...layerJson
      };
      const id = encodeURIComponent(layerJson.layer_id);
      const fileLayer = fileLayers.find(fileLayer => fileLayer.getId() === layerJson.layer_id);
      const defaultFormat = layerJson.formats.find(format => format.type === fileLayer.getDefaultFormatType());
      const newUrl = `${_constants.EMS_FILES_DEFAULT_JSON_PATH}?id=${id}`; //Only proxy default-format. Others are unused in Maps-app

      newLayerJson.formats = [{ ...defaultFormat,
        url: newUrl
      }];
      return newLayerJson;
    }); //rewrite

    return ok({
      body: {
        layers
      }
    });
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_CATALOGUE_PATH}/{emsVersion}/manifest`,
    validate: false
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const tilesManifest = await getEMSClient().getDefaultTMSManifest();
    const newServices = tilesManifest.services.map(service => {
      const newService = { ...service
      };
      newService.formats = [];
      const rasterFormats = service.formats.filter(format => format.format === 'raster');

      if (rasterFormats.length) {
        const newUrl = `${_constants.EMS_TILES_RASTER_STYLE_PATH}?id=${service.id}`;
        newService.formats.push({ ...rasterFormats[0],
          url: newUrl
        });
      }

      const vectorFormats = service.formats.filter(format => format.format === 'vector');

      if (vectorFormats.length) {
        const newUrl = `${_constants.EMS_TILES_VECTOR_STYLE_PATH}?id=${service.id}`;
        newService.formats.push({ ...vectorFormats[0],
          url: newUrl
        });
      }

      return newService;
    });
    return ok({
      body: {
        services: newServices
      }
    });
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_TILES_RASTER_STYLE_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        id: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    if (!request.query.id) {
      logger.warn('Must supply id parameter to retrieve EMS raster style');
      return null;
    }

    const tmsServices = await getEMSClient().getTMSServices();
    const tmsService = tmsServices.find(layer => layer.getId() === request.query.id);

    if (!tmsService) {
      return null;
    }

    const style = await tmsService.getDefaultRasterStyle();
    const newUrl = `${_constants.EMS_TILES_RASTER_TILE_PATH}?id=${request.query.id}&x={x}&y={y}&z={z}`;
    return ok({
      body: { ...style,
        tiles: [newUrl]
      }
    });
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_TILES_VECTOR_STYLE_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        id: _configSchema.schema.string(),
        elastic_tile_service_tos: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_name: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_version: _configSchema.schema.maybe(_configSchema.schema.string()),
        license: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const tmsServices = await getEMSClient().getTMSServices();
    const tmsService = tmsServices.find(layer => layer.getId() === request.query.id);

    if (!tmsService) {
      return null;
    }

    const vectorStyle = await tmsService.getVectorStyleSheetRaw();
    const newSources = {};

    for (const sourceId in vectorStyle.sources) {
      if (vectorStyle.sources.hasOwnProperty(sourceId)) {
        newSources[sourceId] = {
          type: 'vector',
          url: `${_constants.EMS_TILES_VECTOR_SOURCE_PATH}?id=${request.query.id}&sourceId=${sourceId}`
        };
      }
    }

    const spritePath = `${_constants.EMS_SPRITES_PATH}/${request.query.id}/sprite`;
    return ok({
      body: { ...vectorStyle,
        glyphs: `${_constants.EMS_GLYPHS_PATH}/{fontstack}/{range}`,
        sprite: spritePath,
        sources: newSources
      }
    });
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_TILES_VECTOR_SOURCE_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        id: _configSchema.schema.string(),
        sourceId: _configSchema.schema.maybe(_configSchema.schema.string()),
        elastic_tile_service_tos: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_name: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_version: _configSchema.schema.maybe(_configSchema.schema.string()),
        license: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, {
    ok,
    badRequest
  }) => {
    if (!checkEMSProxyEnabled()) {
      return badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const tmsServices = await getEMSClient().getTMSServices();
    const tmsService = tmsServices.find(layer => layer.getId() === request.query.id);

    if (!tmsService) {
      return null;
    }

    const vectorStyle = await tmsService.getVectorStyleSheet();
    const sourceManifest = vectorStyle.sources[request.query.sourceId];
    const newUrl = `${_constants.EMS_TILES_VECTOR_TILE_PATH}?id=${request.query.id}&sourceId=${request.query.sourceId}&x={x}&y={y}&z={z}`;
    return ok({
      body: { ...sourceManifest,
        tiles: [newUrl]
      }
    });
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_TILES_VECTOR_TILE_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        id: _configSchema.schema.string(),
        sourceId: _configSchema.schema.string(),
        x: _configSchema.schema.number(),
        y: _configSchema.schema.number(),
        z: _configSchema.schema.number(),
        elastic_tile_service_tos: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_name: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_version: _configSchema.schema.maybe(_configSchema.schema.string()),
        license: _configSchema.schema.maybe(_configSchema.schema.string())
      })
    }
  }, async (context, request, response) => {
    if (!checkEMSProxyEnabled()) {
      return response.badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const tmsServices = await getEMSClient().getTMSServices();
    const tmsService = tmsServices.find(layer => layer.getId() === request.query.id);

    if (!tmsService) {
      return null;
    }

    const urlTemplate = await tmsService.getUrlTemplateForVector(request.query.sourceId);
    const url = urlTemplate.replace('{x}', request.query.x).replace('{y}', request.query.y).replace('{z}', request.query.z);
    return await proxyResource({
      url
    }, response);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_GLYPHS_PATH}/{fontstack}/{range}`,
    validate: {
      params: _configSchema.schema.object({
        fontstack: _configSchema.schema.string(),
        range: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    if (!checkEMSProxyEnabled()) {
      return response.badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const url = emsSettings.getEMSFontLibraryUrl().replace('{fontstack}', request.params.fontstack).replace('{range}', request.params.range);
    return await proxyResource({
      url
    }, response);
  });
  router.get({
    path: `${_constants.API_ROOT_PATH}/${_constants.EMS_TILES_API_PATH}/${_constants.EMS_SPRITES_PATH}/{id}/sprite{scaling?}.{extension}`,
    validate: {
      query: _configSchema.schema.object({
        elastic_tile_service_tos: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_name: _configSchema.schema.maybe(_configSchema.schema.string()),
        my_app_version: _configSchema.schema.maybe(_configSchema.schema.string()),
        license: _configSchema.schema.maybe(_configSchema.schema.string())
      }),
      params: _configSchema.schema.object({
        id: _configSchema.schema.string(),
        scaling: _configSchema.schema.maybe(_configSchema.schema.string()),
        extension: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    if (!checkEMSProxyEnabled()) {
      return response.badRequest('map.proxyElasticMapsServiceInMaps disabled');
    }

    const tmsServices = await getEMSClient().getTMSServices();
    const tmsService = tmsServices.find(layer => layer.getId() === request.params.id);

    if (!tmsService) {
      return null;
    }

    let proxyPathUrl;
    const isRetina = request.params.scaling === '@2x';

    if (request.params.extension === 'json') {
      proxyPathUrl = await tmsService.getSpriteSheetJsonPath(isRetina);
    } else if (request.params.extension === 'png') {
      proxyPathUrl = await tmsService.getSpriteSheetPngPath(isRetina);
    } else {
      logger.warn(`Must have png or json extension for spritesheet`);
      return null;
    }

    return await proxyResource({
      url: proxyPathUrl,
      contentType: request.params.extension === 'png' ? 'image/png' : ''
    }, response);
  });
  router.get({
    path: `/${_constants.FONTS_API_PATH}/{fontstack}/{range}`,
    validate: {
      params: _configSchema.schema.object({
        fontstack: _configSchema.schema.string(),
        range: _configSchema.schema.string()
      })
    }
  }, (context, request, response) => {
    return new Promise((resolve, reject) => {
      const santizedRange = _path.default.normalize(request.params.range);

      const fontPath = _path.default.join(__dirname, 'fonts', 'open_sans', `${santizedRange}.pbf`);

      _fs.default.readFile(fontPath, (error, data) => {
        if (error) {
          reject(response.custom({
            statusCode: 404
          }));
        } else {
          resolve(response.ok({
            body: data
          }));
        }
      });
    });
  });
  router.get({
    path: `/${_constants.INDEX_SETTINGS_API_PATH}`,
    validate: {
      query: _configSchema.schema.object({
        indexPatternTitle: _configSchema.schema.string()
      })
    }
  }, async (context, request, response) => {
    const {
      query
    } = request;

    if (!query.indexPatternTitle) {
      logger.warn(`Required query parameter 'indexPatternTitle' not provided.`);
      return response.custom({
        body: `Required query parameter 'indexPatternTitle' not provided.`,
        statusCode: 400
      });
    }

    try {
      const resp = await context.core.elasticsearch.legacy.client.callAsCurrentUser('indices.getSettings', {
        index: query.indexPatternTitle
      });
      const indexPatternSettings = (0, _get_index_pattern_settings.getIndexPatternSettings)(resp);
      return response.ok({
        body: indexPatternSettings
      });
    } catch (error) {
      logger.warn(`Cannot load index settings for index pattern '${query.indexPatternTitle}', error: ${error.message}.`);
      response.custom({
        body: 'Error loading index settings',
        statusCode: 400
      });
    }
  });

  function checkEMSProxyEnabled() {
    const proxyEMSInMaps = emsSettings.isProxyElasticMapsServiceInMaps();

    if (!proxyEMSInMaps) {
      logger.warn(`Cannot load content from EMS when map.proxyElasticMapsServiceInMaps is turned off`);
    }

    return proxyEMSInMaps;
  }

  async function proxyResource({
    url,
    contentType
  }, response) {
    try {
      const resource = await (0, _nodeFetch.default)(url);
      const arrayBuffer = await resource.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return response.ok({
        body: buffer,
        headers: {
          'content-disposition': 'inline',
          'content-length': buffer.length,
          ...(contentType ? {
            'Content-type': contentType
          } : {})
        }
      });
    } catch (e) {
      logger.warn(`Cannot connect to EMS for resource, error: ${e.message}`);
      return response.badRequest(`Cannot connect to EMS`);
    }
  }

  (0, _mvt_routes.initMVTRoutes)({
    router,
    logger
  });
}