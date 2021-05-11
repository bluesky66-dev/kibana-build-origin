"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExceptionListClient = void 0;

var _constants = require("../../../common/constants");

var _get_exception_list = require("./get_exception_list");

var _create_exception_list = require("./create_exception_list");

var _get_exception_list_item = require("./get_exception_list_item");

var _create_exception_list_item = require("./create_exception_list_item");

var _update_exception_list = require("./update_exception_list");

var _update_exception_list_item = require("./update_exception_list_item");

var _delete_exception_list = require("./delete_exception_list");

var _delete_exception_list_item = require("./delete_exception_list_item");

var _find_exception_list_item = require("./find_exception_list_item");

var _find_exception_list = require("./find_exception_list");

var _find_exception_list_items = require("./find_exception_list_items");

var _create_endpoint_list = require("./create_endpoint_list");

var _create_endpoint_trusted_apps_list = require("./create_endpoint_trusted_apps_list");

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

class ExceptionListClient {
  constructor({
    user: _user,
    savedObjectsClient: _savedObjectsClient
  }) {
    _defineProperty(this, "user", void 0);

    _defineProperty(this, "savedObjectsClient", void 0);

    _defineProperty(this, "getExceptionList", async ({
      listId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list.getExceptionList)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });

    _defineProperty(this, "getExceptionListItem", async ({
      itemId,
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list_item.getExceptionListItem)({
        id,
        itemId,
        namespaceType,
        savedObjectsClient
      });
    });

    _defineProperty(this, "createEndpointList", async () => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_endpoint_list.createEndpointList)({
        savedObjectsClient,
        user,
        version: 1
      });
    });

    _defineProperty(this, "createTrustedAppsList", async () => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_endpoint_trusted_apps_list.createEndpointTrustedAppsList)({
        savedObjectsClient,
        user,
        version: 1
      });
    });

    _defineProperty(this, "createEndpointListItem", async ({
      comments,
      description,
      entries,
      itemId,
      meta,
      name,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      await this.createEndpointList();
      return (0, _create_exception_list_item.createExceptionListItem)({
        comments,
        description,
        entries,
        itemId,
        listId: _constants.ENDPOINT_LIST_ID,
        meta,
        name,
        namespaceType: 'agnostic',
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });

    _defineProperty(this, "updateEndpointListItem", async ({
      _version,
      comments,
      description,
      entries,
      id,
      itemId,
      meta,
      name,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      await this.createEndpointList();
      return (0, _update_exception_list_item.updateExceptionListItem)({
        _version,
        comments,
        description,
        entries,
        id,
        itemId,
        meta,
        name,
        namespaceType: 'agnostic',
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });

    _defineProperty(this, "getEndpointListItem", async ({
      itemId,
      id
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _get_exception_list_item.getExceptionListItem)({
        id,
        itemId,
        namespaceType: 'agnostic',
        savedObjectsClient
      });
    });

    _defineProperty(this, "createExceptionList", async ({
      description,
      immutable,
      listId,
      meta,
      name,
      namespaceType,
      tags,
      type,
      version
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_exception_list.createExceptionList)({
        description,
        immutable,
        listId,
        meta,
        name,
        namespaceType,
        savedObjectsClient,
        tags,
        type,
        user,
        version
      });
    });

    _defineProperty(this, "updateExceptionList", async ({
      _version,
      id,
      description,
      listId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type,
      version
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _update_exception_list.updateExceptionList)({
        _version,
        description,
        id,
        listId,
        meta,
        name,
        namespaceType,
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user,
        version
      });
    });

    _defineProperty(this, "deleteExceptionList", async ({
      id,
      listId,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list.deleteExceptionList)({
        id,
        listId,
        namespaceType,
        savedObjectsClient
      });
    });

    _defineProperty(this, "createExceptionListItem", async ({
      comments,
      description,
      entries,
      itemId,
      listId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _create_exception_list_item.createExceptionListItem)({
        comments,
        description,
        entries,
        itemId,
        listId,
        meta,
        name,
        namespaceType,
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });

    _defineProperty(this, "updateExceptionListItem", async ({
      _version,
      comments,
      description,
      entries,
      id,
      itemId,
      meta,
      name,
      namespaceType,
      osTypes,
      tags,
      type
    }) => {
      const {
        savedObjectsClient,
        user
      } = this;
      return (0, _update_exception_list_item.updateExceptionListItem)({
        _version,
        comments,
        description,
        entries,
        id,
        itemId,
        meta,
        name,
        namespaceType,
        osTypes,
        savedObjectsClient,
        tags,
        type,
        user
      });
    });

    _defineProperty(this, "deleteExceptionListItem", async ({
      id,
      itemId,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItem)({
        id,
        itemId,
        namespaceType,
        savedObjectsClient
      });
    });

    _defineProperty(this, "deleteExceptionListItemById", async ({
      id,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItemById)({
        id,
        namespaceType,
        savedObjectsClient
      });
    });

    _defineProperty(this, "deleteEndpointListItem", async ({
      id,
      itemId
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _delete_exception_list_item.deleteExceptionListItem)({
        id,
        itemId,
        namespaceType: 'agnostic',
        savedObjectsClient
      });
    });

    _defineProperty(this, "findExceptionListItem", async ({
      listId,
      filter,
      perPage,
      page,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_item.findExceptionListItem)({
        filter,
        listId,
        namespaceType,
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });

    _defineProperty(this, "findExceptionListsItem", async ({
      listId,
      filter,
      perPage,
      page,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_items.findExceptionListsItem)({
        filter,
        listId,
        namespaceType,
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });

    _defineProperty(this, "findValueListExceptionListItems", async ({
      perPage,
      page,
      sortField,
      sortOrder,
      valueListId
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list_items.findValueListExceptionListItems)({
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder,
        valueListId
      });
    });

    _defineProperty(this, "findExceptionList", async ({
      filter,
      perPage,
      page,
      sortField,
      sortOrder,
      namespaceType
    }) => {
      const {
        savedObjectsClient
      } = this;
      return (0, _find_exception_list.findExceptionList)({
        filter,
        namespaceType,
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });

    _defineProperty(this, "findEndpointListItem", async ({
      filter,
      perPage,
      page,
      sortField,
      sortOrder
    }) => {
      const {
        savedObjectsClient
      } = this;
      await this.createEndpointList();
      return (0, _find_exception_list_item.findExceptionListItem)({
        filter,
        listId: _constants.ENDPOINT_LIST_ID,
        namespaceType: 'agnostic',
        page,
        perPage,
        savedObjectsClient,
        sortField,
        sortOrder
      });
    });

    this.user = _user;
    this.savedObjectsClient = _savedObjectsClient;
  }

}

exports.ExceptionListClient = ExceptionListClient;