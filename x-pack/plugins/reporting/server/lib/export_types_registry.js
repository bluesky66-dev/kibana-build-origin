"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportTypesRegistry = getExportTypesRegistry;
exports.ExportTypesRegistry = void 0;

var _lodash = require("lodash");

var _csv = require("../export_types/csv");

var _csv_from_savedobject = require("../export_types/csv_from_savedobject");

var _png = require("../export_types/png");

var _printable_pdf = require("../export_types/printable_pdf");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

class ExportTypesRegistry {
  constructor() {
    _defineProperty(this, "_map", new Map());
  }

  register(item) {
    if (!(0, _lodash.isString)(item.id)) {
      throw new Error(`'item' must have a String 'id' property `);
    }

    if (this._map.has(item.id)) {
      throw new Error(`'item' with id ${item.id} has already been registered`);
    }

    this._map.set(item.id, item);
  }

  getAll() {
    return Array.from(this._map.values());
  }

  getSize() {
    return this._map.size;
  }

  getById(id) {
    if (!this._map.has(id)) {
      throw new Error(`Unknown id ${id}`);
    }

    return this._map.get(id);
  }

  get(findType) {
    let result;

    for (const value of this._map.values()) {
      if (!findType(value)) {
        continue; // try next value
      }

      const foundResult = value;

      if (result) {
        throw new Error('Found multiple items matching predicate.');
      }

      result = foundResult;
    }

    if (!result) {
      throw new Error('Found no items matching predicate');
    }

    return result;
  }

} // TODO: Define a 2nd ExportTypeRegistry instance for "immediate execute" report job types only.
// It should not require a `CreateJobFn` for its ExportTypeDefinitions, which only makes sense for async.
// Once that is done, the `any` types below can be removed.

/*
 * @return ExportTypeRegistry: the ExportTypeRegistry instance that should be
 * used to register async export type definitions
 */


exports.ExportTypesRegistry = ExportTypesRegistry;

function getExportTypesRegistry() {
  const registry = new ExportTypesRegistry(); // can not specify because ImmediateExecuteFn is not assignable to RunTaskFn

  const getTypeFns = [_csv.getExportType, _csv_from_savedobject.getExportType, _png.getExportType, _printable_pdf.getExportType];
  getTypeFns.forEach(getType => {
    registry.register(getType());
  });
  return registry;
}