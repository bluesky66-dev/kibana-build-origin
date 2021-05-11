"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.I18nService = void 0;

var _operators = require("rxjs/operators");

var _i18n_config = require("./i18n_config");

var _get_kibana_translation_files = require("./get_kibana_translation_files");

var _init_translations = require("./init_translations");

var _routes = require("./routes");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class I18nService {
  constructor(coreContext) {
    _defineProperty(this, "log", void 0);

    _defineProperty(this, "configService", void 0);

    this.log = coreContext.logger.get('i18n');
    this.configService = coreContext.configService;
  }

  async setup({
    pluginPaths,
    http
  }) {
    const i18nConfig = await this.configService.atPath(_i18n_config.config.path).pipe((0, _operators.take)(1)).toPromise();
    const locale = i18nConfig.locale;
    this.log.debug(`Using locale: ${locale}`);
    const translationFiles = await (0, _get_kibana_translation_files.getKibanaTranslationFiles)(locale, pluginPaths);
    this.log.debug(`Using translation files: [${translationFiles.join(', ')}]`);
    await (0, _init_translations.initTranslations)(locale, translationFiles);
    const router = http.createRouter('');
    (0, _routes.registerRoutes)({
      router,
      locale
    });
    return {
      getLocale: () => locale,
      getTranslationFiles: () => translationFiles
    };
  }

}

exports.I18nService = I18nService;