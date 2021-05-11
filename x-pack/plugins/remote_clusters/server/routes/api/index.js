"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "registerGetRoute", {
  enumerable: true,
  get: function () {
    return _get_route.register;
  }
});
Object.defineProperty(exports, "registerAddRoute", {
  enumerable: true,
  get: function () {
    return _add_route.register;
  }
});
Object.defineProperty(exports, "registerUpdateRoute", {
  enumerable: true,
  get: function () {
    return _update_route.register;
  }
});
Object.defineProperty(exports, "registerDeleteRoute", {
  enumerable: true,
  get: function () {
    return _delete_route.register;
  }
});

var _get_route = require("./get_route");

var _add_route = require("./add_route");

var _update_route = require("./update_route");

var _delete_route = require("./delete_route");