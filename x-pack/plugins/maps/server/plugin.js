"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapsPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _server = require("../../../../src/core/server");

var _ecommerce_saved_objects = require("./sample_data/ecommerce_saved_objects");

var _flights_saved_objects = require("./sample_data/flights_saved_objects.js");

var _web_logs_saved_objects = require("./sample_data/web_logs_saved_objects.js");

var _register = require("./maps_telemetry/collectors/register");

var _constants = require("../common/constants");

var _saved_objects = require("./saved_objects");

var _kibana_server_services = require("./kibana_server_services");

var _ems = require("./tutorials/ems");

var _routes = require("./routes");

var _ems_settings = require("../common/ems_settings");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class MapsPlugin {
  constructor(initializerContext) {
    _defineProperty(this, "_initializerContext", void 0);

    _defineProperty(this, "_logger", void 0);

    _defineProperty(this, "kibanaVersion", void 0);

    this._logger = initializerContext.logger.get();
    this._initializerContext = initializerContext;
    this.kibanaVersion = initializerContext.env.packageInfo.version;
  }

  _initHomeData(home, prependBasePath, emsSettings) {
    const sampleDataLinkLabel = _i18n.i18n.translate('xpack.maps.sampleDataLinkLabel', {
      defaultMessage: 'Map'
    });

    if (home) {
      home.sampleData.addSavedObjectsToSampleDataset('ecommerce', (0, _ecommerce_saved_objects.getEcommerceSavedObjects)());
      home.sampleData.addAppLinksToSampleDataset('ecommerce', [{
        path: (0, _constants.getExistingMapPath)('2c9c1f60-1909-11e9-919b-ffe5949a18d2'),
        label: sampleDataLinkLabel,
        icon: _constants.APP_ICON
      }]);
      home.sampleData.replacePanelInSampleDatasetDashboard({
        sampleDataId: 'ecommerce',
        dashboardId: '722b74f0-b882-11e8-a6d9-e546fe2bba5f',
        oldEmbeddableId: '9c6f83f0-bb4d-11e8-9c84-77068524bcab',
        embeddableId: '2c9c1f60-1909-11e9-919b-ffe5949a18d2',
        // @ts-ignore
        embeddableType: 'map',
        embeddableConfig: {
          isLayerTOCOpen: false
        }
      });
      home.sampleData.addSavedObjectsToSampleDataset('flights', (0, _flights_saved_objects.getFlightsSavedObjects)());
      home.sampleData.addAppLinksToSampleDataset('flights', [{
        path: (0, _constants.getExistingMapPath)('5dd88580-1906-11e9-919b-ffe5949a18d2'),
        label: sampleDataLinkLabel,
        icon: _constants.APP_ICON
      }]);
      home.sampleData.replacePanelInSampleDatasetDashboard({
        sampleDataId: 'flights',
        dashboardId: '7adfa750-4c81-11e8-b3d7-01146121b73d',
        oldEmbeddableId: '334084f0-52fd-11e8-a160-89cc2ad9e8e2',
        embeddableId: '5dd88580-1906-11e9-919b-ffe5949a18d2',
        // @ts-ignore
        embeddableType: _constants.MAP_SAVED_OBJECT_TYPE,
        embeddableConfig: {
          isLayerTOCOpen: true
        }
      });
      home.sampleData.addSavedObjectsToSampleDataset('logs', (0, _web_logs_saved_objects.getWebLogsSavedObjects)());
      home.sampleData.addAppLinksToSampleDataset('logs', [{
        path: (0, _constants.getExistingMapPath)('de71f4f0-1902-11e9-919b-ffe5949a18d2'),
        label: sampleDataLinkLabel,
        icon: _constants.APP_ICON
      }]);
      home.sampleData.replacePanelInSampleDatasetDashboard({
        sampleDataId: 'logs',
        dashboardId: 'edf84fe0-e1a0-11e7-b6d5-4dc382ef7f5b',
        oldEmbeddableId: '06cf9c40-9ee8-11e7-8711-e7a007dcef99',
        embeddableId: 'de71f4f0-1902-11e9-919b-ffe5949a18d2',
        // @ts-ignore
        embeddableType: _constants.MAP_SAVED_OBJECT_TYPE,
        embeddableConfig: {
          isLayerTOCOpen: false
        }
      });
      home.tutorials.registerTutorial((0, _ems.emsBoundariesSpecProvider)({
        prependBasePath,
        emsLandingPageUrl: emsSettings.getEMSLandingPageUrl()
      }));
    }
  } // @ts-ignore


  setup(core, plugins) {
    const {
      usageCollection,
      home,
      licensing,
      features,
      mapsLegacy
    } = plugins;
    const mapsLegacyConfig = mapsLegacy.config;

    const config$ = this._initializerContext.config.create();

    const currentConfig = this._initializerContext.config.get(); // @ts-ignore


    const mapsEnabled = currentConfig.enabled; // TODO: Consider dynamic way to disable maps app on config change

    if (!mapsEnabled) {
      this._logger.warn('Maps app disabled by configuration');

      return;
    }

    let isEnterprisePlus = false;
    let lastLicenseId;
    const emsSettings = new _ems_settings.EMSSettings(mapsLegacyConfig, () => isEnterprisePlus);
    licensing.license$.subscribe(license => {
      const enterprise = license.check(_constants.APP_ID, 'enterprise');
      isEnterprisePlus = enterprise.state === 'valid';
      lastLicenseId = license.uid;
    });
    (0, _routes.initRoutes)(core.http.createRouter(), () => lastLicenseId, emsSettings, this.kibanaVersion, this._logger);

    this._initHomeData(home, core.http.basePath.prepend, emsSettings);

    features.registerKibanaFeature({
      id: _constants.APP_ID,
      name: _i18n.i18n.translate('xpack.maps.featureRegistry.mapsFeatureName', {
        defaultMessage: 'Maps'
      }),
      order: 400,
      category: _server.DEFAULT_APP_CATEGORIES.kibana,
      app: [_constants.APP_ID, 'kibana'],
      catalogue: [_constants.APP_ID],
      privileges: {
        all: {
          api: ['fileUpload:import'],
          app: [_constants.APP_ID, 'kibana'],
          catalogue: [_constants.APP_ID],
          savedObject: {
            all: [_constants.MAP_SAVED_OBJECT_TYPE, 'query'],
            read: ['index-pattern', 'tag']
          },
          ui: ['save', 'show', 'saveQuery']
        },
        read: {
          app: [_constants.APP_ID, 'kibana'],
          catalogue: [_constants.APP_ID],
          savedObject: {
            all: [],
            read: [_constants.MAP_SAVED_OBJECT_TYPE, 'index-pattern', 'query', 'tag']
          },
          ui: ['show']
        }
      }
    });
    core.savedObjects.registerType(_saved_objects.mapsTelemetrySavedObjects);
    core.savedObjects.registerType(_saved_objects.mapSavedObjects);
    (0, _register.registerMapsUsageCollector)(usageCollection, currentConfig);
    return {
      config: config$
    };
  } // @ts-ignore


  start(core, plugins) {
    (0, _kibana_server_services.setInternalRepository)(core.savedObjects.createInternalRepository);
    (0, _kibana_server_services.setIndexPatternsService)(plugins.data.indexPatterns.indexPatternsServiceFactory, core.elasticsearch.client.asInternalUser);
  }

}

exports.MapsPlugin = MapsPlugin;