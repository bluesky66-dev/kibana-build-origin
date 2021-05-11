"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EsLegacyConfigService = void 0;

var _operators = require("rxjs/operators");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class EsLegacyConfigService {
  constructor() {
    _defineProperty(this, "config", void 0);

    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "configSub", void 0);
  }

  setup(config$) {
    this.config$ = config$;
    this.configSub = this.config$.subscribe(config => {
      this.config = config;
    });
  }

  stop() {
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  async readConfig() {
    if (!this.config$) {
      throw new Error('Could not read elasticsearch config, this service has not been setup!');
    }

    if (!this.config) {
      return this.config$.pipe((0, _operators.first)()).toPromise();
    }

    return this.config;
  }

}

exports.EsLegacyConfigService = EsLegacyConfigService;