"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsUtils = exports.FIND_DEFAULT_PER_PAGE = exports.FIND_DEFAULT_PAGE = exports.ALL_NAMESPACES_STRING = exports.DEFAULT_NAMESPACE_STRING = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const DEFAULT_NAMESPACE_STRING = 'default';
exports.DEFAULT_NAMESPACE_STRING = DEFAULT_NAMESPACE_STRING;
const ALL_NAMESPACES_STRING = '*';
exports.ALL_NAMESPACES_STRING = ALL_NAMESPACES_STRING;
const FIND_DEFAULT_PAGE = 1;
exports.FIND_DEFAULT_PAGE = FIND_DEFAULT_PAGE;
const FIND_DEFAULT_PER_PAGE = 20;
exports.FIND_DEFAULT_PER_PAGE = FIND_DEFAULT_PER_PAGE;
const UUID_REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
/**
 * @public
 */

class SavedObjectsUtils {
  /**
   * Converts a given saved object namespace ID to its string representation. All namespace IDs have an identical string representation, with
   * the exception of the `undefined` namespace ID (which has a namespace string of `'default'`).
   *
   * @param namespace The namespace ID, which must be either a non-empty string or `undefined`.
   */

  /**
   * Converts a given saved object namespace string to its ID representation. All namespace strings have an identical ID representation, with
   * the exception of the `'default'` namespace string (which has a namespace ID of `undefined`).
   *
   * @param namespace The namespace string, which must be non-empty.
   */

  /**
   * Creates an empty response for a find operation. This is only intended to be used by saved objects client wrappers.
   */

  /**
   * Generates a random ID for a saved objects.
   */
  static generateId() {
    return _uuid.default.v1();
  }
  /**
   * Validates that a saved object ID has been randomly generated.
   *
   * @param {string} id The ID of a saved object.
   * @todo Use `uuid.validate` once upgraded to v5.3+
   */


  static isRandomId(id) {
    return typeof id === 'string' && UUID_REGEX.test(id);
  }

}

exports.SavedObjectsUtils = SavedObjectsUtils;

_defineProperty(SavedObjectsUtils, "namespaceIdToString", namespace => {
  if (namespace === '') {
    throw new TypeError('namespace cannot be an empty string');
  }

  return namespace !== null && namespace !== void 0 ? namespace : DEFAULT_NAMESPACE_STRING;
});

_defineProperty(SavedObjectsUtils, "namespaceStringToId", namespace => {
  if (!namespace) {
    throw new TypeError('namespace must be a non-empty string');
  }

  return namespace !== DEFAULT_NAMESPACE_STRING ? namespace : undefined;
});

_defineProperty(SavedObjectsUtils, "createEmptyFindResponse", ({
  page = FIND_DEFAULT_PAGE,
  perPage = FIND_DEFAULT_PER_PAGE
}) => ({
  page,
  per_page: perPage,
  total: 0,
  saved_objects: []
}));