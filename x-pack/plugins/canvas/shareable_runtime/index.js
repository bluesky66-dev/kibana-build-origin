"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _api = require("./api");

Object.keys(_api).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _api[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _api[key];
    }
  });
});

require("../../../../src/core/server/core_app/assets/legacy_light_theme.css");

require("../public/style/index.scss");

require("@elastic/eui/dist/eui_theme_light.css");

require("@kbn/ui-framework/dist/kui_light.css");