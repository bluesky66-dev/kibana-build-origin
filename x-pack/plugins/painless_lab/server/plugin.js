"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PainlessLabServerPlugin = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../common/constants");

var _services = require("./services");

var _api = require("./routes/api");

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

class PainlessLabServerPlugin {
  constructor({
    logger
  }) {
    _defineProperty(this, "license", void 0);

    _defineProperty(this, "logger", void 0);

    this.logger = logger.get();
    this.license = new _services.License();
  }

  setup({
    http
  }, {
    licensing
  }) {
    const router = http.createRouter();
    this.license.setup({
      pluginId: _constants.PLUGIN.id,
      minimumLicenseType: _constants.PLUGIN.minimumLicenseType,
      defaultErrorMessage: _i18n.i18n.translate('xpack.painlessLab.licenseCheckErrorMessage', {
        defaultMessage: 'License check failed'
      })
    }, {
      licensing,
      logger: this.logger
    });
    (0, _api.registerExecuteRoute)({
      router,
      license: this.license
    });
  }

  start() {}

  stop() {}

}

exports.PainlessLabServerPlugin = PainlessLabServerPlugin;