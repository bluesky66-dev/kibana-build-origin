"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strictKeysRt = strictKeysRt;

var t = _interopRequireWildcard(require("io-ts"));

var _Either = require("fp-ts/lib/Either");

var _lodash = require("lodash");

var _merge = require("../merge");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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

function getKeysInObject(object, prefix = '') {
  const keys = [];
  (0, _lodash.forEach)(object, (value, key) => {
    const ownPrefix = prefix ? `${prefix}.${key}` : key;
    keys.push(ownPrefix);

    if ((0, _lodash.isPlainObject)(object[key])) {
      keys.push(...getKeysInObject(object[key], ownPrefix));
    }
  });
  return keys;
}

function addToContextWhenValidated(type, prefix) {
  const validate = (input, context) => {
    const result = type.validate(input, context);
    const keysType = context[0].type;

    if (!('trackedKeys' in keysType)) {
      throw new Error('Expected a top-level StrictKeysType');
    }

    if ((0, _Either.isRight)(result)) {
      keysType.trackedKeys.push(...Object.keys(type.props).map(propKey => `${prefix}${propKey}`));
    }

    return result;
  };

  if (type._tag === 'InterfaceType') {
    return new t.InterfaceType(type.name, type.is, validate, type.encode, type.props);
  }

  return new t.PartialType(type.name, type.is, validate, type.encode, type.props);
}

function trackKeysOfValidatedTypes(type, prefix = '') {
  if (!('_tag' in type)) {
    return type;
  }

  const taggedType = type;

  switch (taggedType._tag) {
    case 'IntersectionType':
      {
        const collectionType = type;
        return t.intersection(collectionType.types.map(rt => trackKeysOfValidatedTypes(rt, prefix)));
      }

    case 'UnionType':
      {
        const collectionType = type;
        return t.union(collectionType.types.map(rt => trackKeysOfValidatedTypes(rt, prefix)));
      }

    case 'MergeType':
      {
        const collectionType = type;
        return (0, _merge.merge)(collectionType.types.map(rt => trackKeysOfValidatedTypes(rt, prefix)));
      }

    case 'PartialType':
      {
        const propsType = type;
        return addToContextWhenValidated(t.partial((0, _lodash.mapValues)(propsType.props, (val, key) => trackKeysOfValidatedTypes(val, `${prefix}${key}.`))), prefix);
      }

    case 'InterfaceType':
      {
        const propsType = type;
        return addToContextWhenValidated(t.type((0, _lodash.mapValues)(propsType.props, (val, key) => trackKeysOfValidatedTypes(val, `${prefix}${key}.`))), prefix);
      }

    case 'ExactType':
      {
        const exactType = type;
        return t.exact(trackKeysOfValidatedTypes(exactType.type, prefix));
      }

    default:
      return type;
  }
}

class StrictKeysType extends t.Type {
  constructor(type) {
    const trackedType = trackKeysOfValidatedTypes(type);
    super('strict_keys', trackedType.is, (input, context) => {
      this.trackedKeys.length = 0;
      return _Either.either.chain(trackedType.validate(input, context), i => {
        const originalKeys = getKeysInObject(input);
        const excessKeys = (0, _lodash.difference)(originalKeys, this.trackedKeys);

        if (excessKeys.length) {
          return t.failure(i, context, `Excess keys are not allowed: \n${excessKeys.join('\n')}`);
        }

        return t.success(i);
      });
    }, trackedType.encode);

    _defineProperty(this, "trackedKeys", void 0);

    this.trackedKeys = [];
  }

}

function strictKeysRt(type) {
  return new StrictKeysType(type);
}