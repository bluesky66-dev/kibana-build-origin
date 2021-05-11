"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TagsRequestHandlerContext = void 0;

var _services = require("./services");

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to set private field on non-instance");
  }

  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }

  return value;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

var _client = new WeakMap();

var _assignmentService = new WeakMap();

class TagsRequestHandlerContext {
  constructor(request, coreContext, security) {
    this.request = request;
    this.coreContext = coreContext;
    this.security = security;

    _client.set(this, {
      writable: true,
      value: void 0
    });

    _assignmentService.set(this, {
      writable: true,
      value: void 0
    });
  }

  get tagsClient() {
    if (_classPrivateFieldGet(this, _client) == null) {
      _classPrivateFieldSet(this, _client, new _services.TagsClient({
        client: this.coreContext.savedObjects.client
      }));
    }

    return _classPrivateFieldGet(this, _client);
  }

  get assignmentService() {
    if (_classPrivateFieldGet(this, _assignmentService) == null) {
      var _this$security;

      _classPrivateFieldSet(this, _assignmentService, new _services.AssignmentService({
        request: this.request,
        client: this.coreContext.savedObjects.client,
        typeRegistry: this.coreContext.savedObjects.typeRegistry,
        authorization: (_this$security = this.security) === null || _this$security === void 0 ? void 0 : _this$security.authz
      }));
    }

    return _classPrivateFieldGet(this, _assignmentService);
  }

}

exports.TagsRequestHandlerContext = TagsRequestHandlerContext;