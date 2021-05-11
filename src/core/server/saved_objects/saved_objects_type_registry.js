"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectTypeRegistry = void 0;

var _std = require("@kbn/std");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Registry holding information about all the registered {@link SavedObjectsType | saved object types}.
 *
 * @public
 */
class SavedObjectTypeRegistry {
  constructor() {
    _defineProperty(this, "types", new Map());
  }

  /**
   * Register a {@link SavedObjectsType | type} inside the registry.
   * A type can only be registered once. subsequent calls with the same type name will throw an error.
   */
  registerType(type) {
    if (this.types.has(type.name)) {
      throw new Error(`Type '${type.name}' is already registered`);
    }

    validateType(type);
    this.types.set(type.name, (0, _std.deepFreeze)(type));
  }
  /**
   * Return the {@link SavedObjectsType | type} definition for given type name.
   */


  getType(type) {
    return this.types.get(type);
  }
  /**
   * Returns all visible {@link SavedObjectsType | types}.
   *
   * A visible type is a type that doesn't explicitly define `hidden=true` during registration.
   */


  getVisibleTypes() {
    return [...this.types.values()].filter(type => !this.isHidden(type.name));
  }
  /**
   * Return all {@link SavedObjectsType | types} currently registered, including the hidden ones.
   *
   * To only get the visible types (which is the most common use case), use `getVisibleTypes` instead.
   */


  getAllTypes() {
    return [...this.types.values()];
  }
  /**
   * Return all {@link SavedObjectsType | types} currently registered that are importable/exportable.
   */


  getImportableAndExportableTypes() {
    return this.getAllTypes().filter(type => this.isImportableAndExportable(type.name));
  }
  /**
   * Returns whether the type is namespace-agnostic (global);
   * resolves to `false` if the type is not registered
   */


  isNamespaceAgnostic(type) {
    var _this$types$get;

    return ((_this$types$get = this.types.get(type)) === null || _this$types$get === void 0 ? void 0 : _this$types$get.namespaceType) === 'agnostic';
  }
  /**
   * Returns whether the type is single-namespace (isolated);
   * resolves to `true` if the type is not registered
   */


  isSingleNamespace(type) {
    // in the case we somehow registered a type with an invalid `namespaceType`, treat it as single-namespace
    return !this.isNamespaceAgnostic(type) && !this.isMultiNamespace(type);
  }
  /**
   * Returns whether the type is multi-namespace (shareable *or* isolated);
   * resolves to `false` if the type is not registered
   */


  isMultiNamespace(type) {
    var _this$types$get2;

    const namespaceType = (_this$types$get2 = this.types.get(type)) === null || _this$types$get2 === void 0 ? void 0 : _this$types$get2.namespaceType;
    return namespaceType === 'multiple' || namespaceType === 'multiple-isolated';
  }
  /**
   * Returns whether the type is multi-namespace (shareable);
   * resolves to `false` if the type is not registered
   */


  isShareable(type) {
    var _this$types$get3;

    return ((_this$types$get3 = this.types.get(type)) === null || _this$types$get3 === void 0 ? void 0 : _this$types$get3.namespaceType) === 'multiple';
  }
  /**
   * Returns the `hidden` property for given type, or `false` if
   * the type is not registered.
   */


  isHidden(type) {
    var _this$types$get$hidde, _this$types$get4;

    return (_this$types$get$hidde = (_this$types$get4 = this.types.get(type)) === null || _this$types$get4 === void 0 ? void 0 : _this$types$get4.hidden) !== null && _this$types$get$hidde !== void 0 ? _this$types$get$hidde : false;
  }
  /**
   * Returns the `indexPattern` property for given type, or `undefined` if
   * the type is not registered.
   */


  getIndex(type) {
    var _this$types$get5;

    return (_this$types$get5 = this.types.get(type)) === null || _this$types$get5 === void 0 ? void 0 : _this$types$get5.indexPattern;
  }
  /**
   * Returns the `management.importableAndExportable` property for given type, or
   * `false` if the type is not registered or does not define a management section.
   */


  isImportableAndExportable(type) {
    var _this$types$get$manag, _this$types$get6, _this$types$get6$mana;

    return (_this$types$get$manag = (_this$types$get6 = this.types.get(type)) === null || _this$types$get6 === void 0 ? void 0 : (_this$types$get6$mana = _this$types$get6.management) === null || _this$types$get6$mana === void 0 ? void 0 : _this$types$get6$mana.importableAndExportable) !== null && _this$types$get$manag !== void 0 ? _this$types$get$manag : false;
  }

}

exports.SavedObjectTypeRegistry = SavedObjectTypeRegistry;

const validateType = ({
  name,
  management
}) => {
  if (management) {
    if (management.onExport && !management.importableAndExportable) {
      throw new Error(`Type ${name}: 'management.importableAndExportable' must be 'true' when specifying 'management.onExport'`);
    }
  }
};