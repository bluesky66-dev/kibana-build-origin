"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsManagement = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class SavedObjectsManagement {
  constructor(registry) {
    this.registry = registry;
  }

  isImportAndExportable(type) {
    return this.registry.isImportableAndExportable(type);
  }

  getDefaultSearchField(type) {
    var _this$registry$getTyp, _this$registry$getTyp2;

    return (_this$registry$getTyp = this.registry.getType(type)) === null || _this$registry$getTyp === void 0 ? void 0 : (_this$registry$getTyp2 = _this$registry$getTyp.management) === null || _this$registry$getTyp2 === void 0 ? void 0 : _this$registry$getTyp2.defaultSearchField;
  }

  getIcon(type) {
    var _this$registry$getTyp3, _this$registry$getTyp4;

    return (_this$registry$getTyp3 = this.registry.getType(type)) === null || _this$registry$getTyp3 === void 0 ? void 0 : (_this$registry$getTyp4 = _this$registry$getTyp3.management) === null || _this$registry$getTyp4 === void 0 ? void 0 : _this$registry$getTyp4.icon;
  }

  getTitle(savedObject) {
    var _this$registry$getTyp5, _this$registry$getTyp6;

    const getTitle = (_this$registry$getTyp5 = this.registry.getType(savedObject.type)) === null || _this$registry$getTyp5 === void 0 ? void 0 : (_this$registry$getTyp6 = _this$registry$getTyp5.management) === null || _this$registry$getTyp6 === void 0 ? void 0 : _this$registry$getTyp6.getTitle;
    return getTitle ? getTitle(savedObject) : undefined;
  }

  getEditUrl(savedObject) {
    var _this$registry$getTyp7, _this$registry$getTyp8;

    const getEditUrl = (_this$registry$getTyp7 = this.registry.getType(savedObject.type)) === null || _this$registry$getTyp7 === void 0 ? void 0 : (_this$registry$getTyp8 = _this$registry$getTyp7.management) === null || _this$registry$getTyp8 === void 0 ? void 0 : _this$registry$getTyp8.getEditUrl;
    return getEditUrl ? getEditUrl(savedObject) : undefined;
  }

  getInAppUrl(savedObject) {
    var _this$registry$getTyp9, _this$registry$getTyp10;

    const getInAppUrl = (_this$registry$getTyp9 = this.registry.getType(savedObject.type)) === null || _this$registry$getTyp9 === void 0 ? void 0 : (_this$registry$getTyp10 = _this$registry$getTyp9.management) === null || _this$registry$getTyp10 === void 0 ? void 0 : _this$registry$getTyp10.getInAppUrl;
    return getInAppUrl ? getInAppUrl(savedObject) : undefined;
  }

  getNamespaceType(savedObject) {
    var _this$registry$getTyp11;

    return (_this$registry$getTyp11 = this.registry.getType(savedObject.type)) === null || _this$registry$getTyp11 === void 0 ? void 0 : _this$registry$getTyp11.namespaceType;
  }

}

exports.SavedObjectsManagement = SavedObjectsManagement;