"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  NetworkQueries: true
};
exports.NetworkQueries = void 0;

var _common = require("./common");

Object.keys(_common).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _common[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _common[key];
    }
  });
});

var _details = require("./details");

Object.keys(_details).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _details[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _details[key];
    }
  });
});

var _dns = require("./dns");

Object.keys(_dns).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _dns[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _dns[key];
    }
  });
});

var _http = require("./http");

Object.keys(_http).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _http[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _http[key];
    }
  });
});

var _kpi = require("./kpi");

Object.keys(_kpi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _kpi[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _kpi[key];
    }
  });
});

var _overview = require("./overview");

Object.keys(_overview).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _overview[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _overview[key];
    }
  });
});

var _tls = require("./tls");

Object.keys(_tls).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _tls[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _tls[key];
    }
  });
});

var _top_countries = require("./top_countries");

Object.keys(_top_countries).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _top_countries[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _top_countries[key];
    }
  });
});

var _top_n_flow = require("./top_n_flow");

Object.keys(_top_n_flow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _top_n_flow[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _top_n_flow[key];
    }
  });
});

var _users = require("./users");

Object.keys(_users).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _users[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _users[key];
    }
  });
});
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let NetworkQueries;
exports.NetworkQueries = NetworkQueries;

(function (NetworkQueries) {
  NetworkQueries["details"] = "networkDetails";
  NetworkQueries["dns"] = "dns";
  NetworkQueries["http"] = "http";
  NetworkQueries["overview"] = "overviewNetwork";
  NetworkQueries["tls"] = "tls";
  NetworkQueries["topCountries"] = "topCountries";
  NetworkQueries["topNFlow"] = "topNFlow";
  NetworkQueries["users"] = "users";
})(NetworkQueries || (exports.NetworkQueries = NetworkQueries = {}));