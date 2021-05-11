"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedSavedObjectsClientWrapper = void 0;

var _server = require("../../../../../src/core/server");

var _get_descriptor_namespace = require("./get_descriptor_namespace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class EncryptedSavedObjectsClientWrapper {
  constructor(options, errors = options.baseClient.errors) {
    this.options = options;
    this.errors = errors;
  }

  async checkConflicts(objects = [], options) {
    return await this.options.baseClient.checkConflicts(objects, options);
  }

  async create(type, attributes = {}, options = {}) {
    if (!this.options.service.isRegistered(type)) {
      return await this.options.baseClient.create(type, attributes, options);
    }

    const id = this.getValidId(options.id, options.version, options.overwrite);
    const namespace = (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, type, options.namespace);
    return await this.handleEncryptedAttributesInResponse(await this.options.baseClient.create(type, await this.options.service.encryptAttributes({
      type,
      id,
      namespace
    }, attributes, {
      user: this.options.getCurrentUser()
    }), { ...options,
      id
    }), attributes, namespace);
  }

  async bulkCreate(objects, options) {
    // We encrypt attributes for every object in parallel and that can potentially exhaust libuv or
    // NodeJS thread pool. If it turns out to be a problem, we can consider switching to the
    // sequential processing.
    const encryptedObjects = await Promise.all(objects.map(async object => {
      if (!this.options.service.isRegistered(object.type)) {
        return object;
      }

      const id = this.getValidId(object.id, object.version, options === null || options === void 0 ? void 0 : options.overwrite);
      const namespace = (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, object.type, options === null || options === void 0 ? void 0 : options.namespace);
      return { ...object,
        id,
        attributes: await this.options.service.encryptAttributes({
          type: object.type,
          id,
          namespace
        }, object.attributes, {
          user: this.options.getCurrentUser()
        })
      };
    }));
    return await this.handleEncryptedAttributesInBulkResponse(await this.options.baseClient.bulkCreate(encryptedObjects, options), objects);
  }

  async bulkUpdate(objects, options) {
    // We encrypt attributes for every object in parallel and that can potentially exhaust libuv or
    // NodeJS thread pool. If it turns out to be a problem, we can consider switching to the
    // sequential processing.
    const encryptedObjects = await Promise.all(objects.map(async object => {
      const {
        type,
        id,
        attributes,
        namespace: objectNamespace
      } = object;

      if (!this.options.service.isRegistered(type)) {
        return object;
      }

      const namespace = (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, type, objectNamespace !== null && objectNamespace !== void 0 ? objectNamespace : options === null || options === void 0 ? void 0 : options.namespace);
      return { ...object,
        attributes: await this.options.service.encryptAttributes({
          type,
          id,
          namespace
        }, attributes, {
          user: this.options.getCurrentUser()
        })
      };
    }));
    return await this.handleEncryptedAttributesInBulkResponse(await this.options.baseClient.bulkUpdate(encryptedObjects, options), objects);
  }

  async delete(type, id, options) {
    return await this.options.baseClient.delete(type, id, options);
  }

  async find(options) {
    return await this.handleEncryptedAttributesInBulkResponse(await this.options.baseClient.find(options), undefined);
  }

  async bulkGet(objects = [], options) {
    return await this.handleEncryptedAttributesInBulkResponse(await this.options.baseClient.bulkGet(objects, options), undefined);
  }

  async get(type, id, options) {
    return await this.handleEncryptedAttributesInResponse(await this.options.baseClient.get(type, id, options), undefined, (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, type, options === null || options === void 0 ? void 0 : options.namespace));
  }

  async resolve(type, id, options) {
    const resolveResult = await this.options.baseClient.resolve(type, id, options);
    const object = await this.handleEncryptedAttributesInResponse(resolveResult.saved_object, undefined, (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, type, options === null || options === void 0 ? void 0 : options.namespace));
    return { ...resolveResult,
      saved_object: object
    };
  }

  async update(type, id, attributes, options) {
    if (!this.options.service.isRegistered(type)) {
      return await this.options.baseClient.update(type, id, attributes, options);
    }

    const namespace = (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, type, options === null || options === void 0 ? void 0 : options.namespace);
    return this.handleEncryptedAttributesInResponse(await this.options.baseClient.update(type, id, await this.options.service.encryptAttributes({
      type,
      id,
      namespace
    }, attributes, {
      user: this.options.getCurrentUser()
    }), options), attributes, namespace);
  }

  async addToNamespaces(type, id, namespaces, options) {
    return await this.options.baseClient.addToNamespaces(type, id, namespaces, options);
  }

  async deleteFromNamespaces(type, id, namespaces, options) {
    return await this.options.baseClient.deleteFromNamespaces(type, id, namespaces, options);
  }

  async removeReferencesTo(type, id, options = {}) {
    return await this.options.baseClient.removeReferencesTo(type, id, options);
  }

  async openPointInTimeForType(type, options = {}) {
    return await this.options.baseClient.openPointInTimeForType(type, options);
  }

  async closePointInTime(id, options) {
    return await this.options.baseClient.closePointInTime(id, options);
  }
  /**
   * Strips encrypted attributes from any non-bulk Saved Objects API response. If type isn't
   * registered, response is returned as is.
   * @param response Raw response returned by the underlying base client.
   * @param [originalAttributes] Optional list of original attributes of the saved object.
   * @param [namespace] Optional namespace that was used for the saved objects operation.
   */


  async handleEncryptedAttributesInResponse(response, originalAttributes, namespace) {
    if (response.attributes && this.options.service.isRegistered(response.type)) {
      // Error is returned when decryption fails, and in this case encrypted attributes will be
      // stripped from the returned attributes collection. That will let consumer decide whether to
      // fail or handle recovery gracefully.
      const {
        attributes,
        error
      } = await this.options.service.stripOrDecryptAttributes({
        id: response.id,
        type: response.type,
        namespace
      }, response.attributes, originalAttributes, {
        user: this.options.getCurrentUser()
      });
      response.attributes = attributes;

      if (error) {
        response.error = error;
      }
    }

    return response;
  }
  /**
   * Strips encrypted attributes from any bulk Saved Objects API response. If type for any bulk
   * response portion isn't registered, it is returned as is.
   * @param response Raw response returned by the underlying base client.
   * @param [objects] Optional list of saved objects with original attributes.
   */


  async handleEncryptedAttributesInBulkResponse(response, objects) {
    for (const [index, savedObject] of response.saved_objects.entries()) {
      var _objects$index$attrib;

      await this.handleEncryptedAttributesInResponse(savedObject, (_objects$index$attrib = objects === null || objects === void 0 ? void 0 : objects[index].attributes) !== null && _objects$index$attrib !== void 0 ? _objects$index$attrib : undefined, (0, _get_descriptor_namespace.getDescriptorNamespace)(this.options.baseTypeRegistry, savedObject.type, savedObject.namespaces ? savedObject.namespaces[0] : undefined));
    }

    return response;
  } // Saved objects with encrypted attributes should have IDs that are hard to guess especially
  // since IDs are part of the AAD used during encryption, that's why we control them within this
  // wrapper and don't allow consumers to specify their own IDs directly unless overwriting the original document.


  getValidId(id, version, overwrite) {
    if (id) {
      // only allow a specified ID if we're overwriting an existing ESO with a Version
      // this helps us ensure that the document really was previously created using ESO
      // and not being used to get around the specified ID limitation
      const canSpecifyID = overwrite && version || _server.SavedObjectsUtils.isRandomId(id);

      if (!canSpecifyID) {
        throw this.errors.createBadRequestError('Predefined IDs are not allowed for saved objects with encrypted attributes unless the ID is a UUID.');
      }

      return id;
    }

    return _server.SavedObjectsUtils.generateId();
  }

}

exports.EncryptedSavedObjectsClientWrapper = EncryptedSavedObjectsClientWrapper;