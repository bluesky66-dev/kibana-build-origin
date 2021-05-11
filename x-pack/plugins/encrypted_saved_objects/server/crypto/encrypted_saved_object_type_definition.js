"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedSavedObjectAttributesDefinition = void 0;

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents the definition of the attributes of the specific saved object that are supposed to be
 * encrypted. The definition also dictates which attributes should be excluded from AAD and/or
 * stripped from response.
 */


class EncryptedSavedObjectAttributesDefinition {
  constructor(typeRegistration) {
    _defineProperty(this, "attributesToEncrypt", void 0);

    _defineProperty(this, "attributesToExcludeFromAAD", void 0);

    _defineProperty(this, "attributesToStrip", void 0);

    const attributesToEncrypt = new Set();
    const attributesToStrip = new Set();

    for (const attribute of typeRegistration.attributesToEncrypt) {
      if (typeof attribute === 'string') {
        attributesToEncrypt.add(attribute);
        attributesToStrip.add(attribute);
      } else {
        attributesToEncrypt.add(attribute.key);

        if (!attribute.dangerouslyExposeValue) {
          attributesToStrip.add(attribute.key);
        }
      }
    }

    this.attributesToEncrypt = attributesToEncrypt;
    this.attributesToStrip = attributesToStrip;
    this.attributesToExcludeFromAAD = typeRegistration.attributesToExcludeFromAAD;
  }
  /**
   * Determines whether particular attribute should be encrypted. Full list of attributes that
   * should be encrypted can be retrieved via `attributesToEncrypt` property.
   * @param attributeName Name of the attribute.
   */


  shouldBeEncrypted(attributeName) {
    return this.attributesToEncrypt.has(attributeName);
  }
  /**
   * Determines whether particular attribute should be excluded from AAD.
   * @param attributeName Name of the attribute.
   */


  shouldBeExcludedFromAAD(attributeName) {
    return this.shouldBeEncrypted(attributeName) || this.attributesToExcludeFromAAD != null && this.attributesToExcludeFromAAD.has(attributeName);
  }
  /**
   * Determines whether particular attribute should be stripped from the attribute list.
   * @param attributeName Name of the attribute.
   */


  shouldBeStripped(attributeName) {
    return this.attributesToStrip.has(attributeName);
  }

}

exports.EncryptedSavedObjectAttributesDefinition = EncryptedSavedObjectAttributesDefinition;