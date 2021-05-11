"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createMockSavedObjectsRepository: true,
  createRouteContext: true,
  authenticationMock: true,
  createRoute: true,
  createActionsClient: true
};
Object.defineProperty(exports, "createMockSavedObjectsRepository", {
  enumerable: true,
  get: function () {
    return _create_mock_so_repository.createMockSavedObjectsRepository;
  }
});
Object.defineProperty(exports, "createRouteContext", {
  enumerable: true,
  get: function () {
    return _route_contexts.createRouteContext;
  }
});
Object.defineProperty(exports, "authenticationMock", {
  enumerable: true,
  get: function () {
    return _authc_mock.authenticationMock;
  }
});
Object.defineProperty(exports, "createRoute", {
  enumerable: true,
  get: function () {
    return _mock_router.createRoute;
  }
});
Object.defineProperty(exports, "createActionsClient", {
  enumerable: true,
  get: function () {
    return _mock_actions_client.createActionsClient;
  }
});

var _mock_saved_objects = require("./mock_saved_objects");

Object.keys(_mock_saved_objects).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _mock_saved_objects[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _mock_saved_objects[key];
    }
  });
});

var _create_mock_so_repository = require("./create_mock_so_repository");

var _route_contexts = require("./route_contexts");

var _authc_mock = require("./authc_mock");

var _mock_router = require("./mock_router");

var _mock_actions_client = require("./mock_actions_client");