"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TagsCapabilities", {
  enumerable: true,
  get: function () {
    return _capabilities.TagsCapabilities;
  }
});
Object.defineProperty(exports, "getTagsCapabilities", {
  enumerable: true,
  get: function () {
    return _capabilities.getTagsCapabilities;
  }
});
Object.defineProperty(exports, "tagFeatureId", {
  enumerable: true,
  get: function () {
    return _constants.tagFeatureId;
  }
});
Object.defineProperty(exports, "tagSavedObjectTypeName", {
  enumerable: true,
  get: function () {
    return _constants.tagSavedObjectTypeName;
  }
});
Object.defineProperty(exports, "tagManagementSectionId", {
  enumerable: true,
  get: function () {
    return _constants.tagManagementSectionId;
  }
});
Object.defineProperty(exports, "TagWithRelations", {
  enumerable: true,
  get: function () {
    return _types.TagWithRelations;
  }
});
Object.defineProperty(exports, "TagAttributes", {
  enumerable: true,
  get: function () {
    return _types.TagAttributes;
  }
});
Object.defineProperty(exports, "Tag", {
  enumerable: true,
  get: function () {
    return _types.Tag;
  }
});
Object.defineProperty(exports, "ITagsClient", {
  enumerable: true,
  get: function () {
    return _types.ITagsClient;
  }
});
Object.defineProperty(exports, "TagSavedObject", {
  enumerable: true,
  get: function () {
    return _types.TagSavedObject;
  }
});
Object.defineProperty(exports, "TagValidation", {
  enumerable: true,
  get: function () {
    return _validation.TagValidation;
  }
});
Object.defineProperty(exports, "validateTagColor", {
  enumerable: true,
  get: function () {
    return _validation.validateTagColor;
  }
});
Object.defineProperty(exports, "validateTagName", {
  enumerable: true,
  get: function () {
    return _validation.validateTagName;
  }
});
Object.defineProperty(exports, "validateTagDescription", {
  enumerable: true,
  get: function () {
    return _validation.validateTagDescription;
  }
});
Object.defineProperty(exports, "tagNameMinLength", {
  enumerable: true,
  get: function () {
    return _validation.tagNameMinLength;
  }
});
Object.defineProperty(exports, "tagNameMaxLength", {
  enumerable: true,
  get: function () {
    return _validation.tagNameMaxLength;
  }
});
Object.defineProperty(exports, "tagDescriptionMaxLength", {
  enumerable: true,
  get: function () {
    return _validation.tagDescriptionMaxLength;
  }
});

var _capabilities = require("./capabilities");

var _constants = require("./constants");

var _types = require("./types");

var _validation = require("./validation");