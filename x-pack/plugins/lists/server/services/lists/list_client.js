"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListClient = void 0;

var _lists = require("../../services/lists");

var _items = require("../../services/items");

var _siem_server_deps = require("../../siem_server_deps");

var _list_item_policy = _interopRequireDefault(require("../items/list_item_policy.json"));

var _list_policy = _interopRequireDefault(require("./list_policy.json"));

var _create_list_if_it_does_not_exist = require("./create_list_if_it_does_not_exist");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
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

class ListClient {
  constructor({
    spaceId: _spaceId,
    user: _user,
    config: _config,
    callCluster: _callCluster
  }) {
    _defineProperty(this, "spaceId", void 0);

    _defineProperty(this, "user", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "callCluster", void 0);

    _defineProperty(this, "getListIndex", () => {
      const {
        spaceId,
        config: {
          listIndex: listsIndexName
        }
      } = this;
      return (0, _lists.getListIndex)({
        listsIndexName,
        spaceId
      });
    });

    _defineProperty(this, "getListItemIndex", () => {
      const {
        spaceId,
        config: {
          listItemIndex: listsItemsIndexName
        }
      } = this;
      return (0, _items.getListItemIndex)({
        listsItemsIndexName,
        spaceId
      });
    });

    _defineProperty(this, "getList", async ({
      id
    }) => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _lists.getList)({
        callCluster,
        id,
        listIndex
      });
    });

    _defineProperty(this, "createList", async ({
      id,
      deserializer,
      immutable,
      serializer,
      name,
      description,
      type,
      meta,
      version
    }) => {
      const {
        callCluster,
        user
      } = this;
      const listIndex = this.getListIndex();
      return (0, _lists.createList)({
        callCluster,
        description,
        deserializer,
        id,
        immutable,
        listIndex,
        meta,
        name,
        serializer,
        type,
        user,
        version
      });
    });

    _defineProperty(this, "createListIfItDoesNotExist", async ({
      id,
      deserializer,
      serializer,
      name,
      description,
      immutable,
      type,
      meta,
      version
    }) => {
      const {
        callCluster,
        user
      } = this;
      const listIndex = this.getListIndex();
      return (0, _create_list_if_it_does_not_exist.createListIfItDoesNotExist)({
        callCluster,
        description,
        deserializer,
        id,
        immutable,
        listIndex,
        meta,
        name,
        serializer,
        type,
        user,
        version
      });
    });

    _defineProperty(this, "getListIndexExists", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.getIndexExists)(callCluster, listIndex);
    });

    _defineProperty(this, "getListItemIndexExists", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.getIndexExists)(callCluster, listItemIndex);
    });

    _defineProperty(this, "createListBootStrapIndex", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.createBootstrapIndex)(callCluster, listIndex);
    });

    _defineProperty(this, "createListItemBootStrapIndex", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.createBootstrapIndex)(callCluster, listItemIndex);
    });

    _defineProperty(this, "getListPolicyExists", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.getPolicyExists)(callCluster, listIndex);
    });

    _defineProperty(this, "getListItemPolicyExists", async () => {
      const {
        callCluster
      } = this;
      const listsItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.getPolicyExists)(callCluster, listsItemIndex);
    });

    _defineProperty(this, "getListTemplateExists", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.getTemplateExists)(callCluster, listIndex);
    });

    _defineProperty(this, "getListItemTemplateExists", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.getTemplateExists)(callCluster, listItemIndex);
    });

    _defineProperty(this, "getListTemplate", () => {
      const listIndex = this.getListIndex();
      return (0, _lists.getListTemplate)(listIndex);
    });

    _defineProperty(this, "getListItemTemplate", () => {
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItemTemplate)(listItemIndex);
    });

    _defineProperty(this, "setListTemplate", async () => {
      const {
        callCluster
      } = this;
      const template = this.getListTemplate();
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.setTemplate)(callCluster, listIndex, template);
    });

    _defineProperty(this, "setListItemTemplate", async () => {
      const {
        callCluster
      } = this;
      const template = this.getListItemTemplate();
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.setTemplate)(callCluster, listItemIndex, template);
    });

    _defineProperty(this, "setListPolicy", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.setPolicy)(callCluster, listIndex, _list_policy.default);
    });

    _defineProperty(this, "setListItemPolicy", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.setPolicy)(callCluster, listItemIndex, _list_item_policy.default);
    });

    _defineProperty(this, "deleteListIndex", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.deleteAllIndex)(callCluster, `${listIndex}-*`);
    });

    _defineProperty(this, "deleteListItemIndex", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.deleteAllIndex)(callCluster, `${listItemIndex}-*`);
    });

    _defineProperty(this, "deleteListPolicy", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.deletePolicy)(callCluster, listIndex);
    });

    _defineProperty(this, "deleteListItemPolicy", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.deletePolicy)(callCluster, listItemIndex);
    });

    _defineProperty(this, "deleteListTemplate", async () => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _siem_server_deps.deleteTemplate)(callCluster, listIndex);
    });

    _defineProperty(this, "deleteListItemTemplate", async () => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _siem_server_deps.deleteTemplate)(callCluster, listItemIndex);
    });

    _defineProperty(this, "deleteListItem", async ({
      id
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.deleteListItem)({
        callCluster,
        id,
        listItemIndex
      });
    });

    _defineProperty(this, "deleteListItemByValue", async ({
      listId,
      value,
      type
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.deleteListItemByValue)({
        callCluster,
        listId,
        listItemIndex,
        type,
        value
      });
    });

    _defineProperty(this, "deleteList", async ({
      id
    }) => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      const listItemIndex = this.getListItemIndex();
      return (0, _lists.deleteList)({
        callCluster,
        id,
        listIndex,
        listItemIndex
      });
    });

    _defineProperty(this, "exportListItemsToStream", ({
      stringToAppend,
      listId,
      stream
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      (0, _items.exportListItemsToStream)({
        callCluster,
        listId,
        listItemIndex,
        stream,
        stringToAppend
      });
    });

    _defineProperty(this, "importListItemsToStream", async ({
      deserializer,
      serializer,
      type,
      listId,
      stream,
      meta,
      version
    }) => {
      const {
        callCluster,
        user,
        config
      } = this;
      const listItemIndex = this.getListItemIndex();
      const listIndex = this.getListIndex();
      return (0, _items.importListItemsToStream)({
        callCluster,
        config,
        deserializer,
        listId,
        listIndex,
        listItemIndex,
        meta,
        serializer,
        stream,
        type,
        user,
        version
      });
    });

    _defineProperty(this, "getListItemByValue", async ({
      listId,
      value,
      type
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItemByValue)({
        callCluster,
        listId,
        listItemIndex,
        type,
        value
      });
    });

    _defineProperty(this, "createListItem", async ({
      id,
      deserializer,
      serializer,
      listId,
      value,
      type,
      meta
    }) => {
      const {
        callCluster,
        user
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.createListItem)({
        callCluster,
        deserializer,
        id,
        listId,
        listItemIndex,
        meta,
        serializer,
        type,
        user,
        value
      });
    });

    _defineProperty(this, "updateListItem", async ({
      _version,
      id,
      value,
      meta
    }) => {
      const {
        callCluster,
        user
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.updateListItem)({
        _version,
        callCluster,
        id,
        listItemIndex,
        meta,
        user,
        value
      });
    });

    _defineProperty(this, "updateList", async ({
      _version,
      id,
      name,
      description,
      meta,
      version
    }) => {
      const {
        callCluster,
        user
      } = this;
      const listIndex = this.getListIndex();
      return (0, _lists.updateList)({
        _version,
        callCluster,
        description,
        id,
        listIndex,
        meta,
        name,
        user,
        version
      });
    });

    _defineProperty(this, "getListItem", async ({
      id
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItem)({
        callCluster,
        id,
        listItemIndex
      });
    });

    _defineProperty(this, "getListItemByValues", async ({
      type,
      listId,
      value
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.getListItemByValues)({
        callCluster,
        listId,
        listItemIndex,
        type,
        value
      });
    });

    _defineProperty(this, "searchListItemByValues", async ({
      type,
      listId,
      value
    }) => {
      const {
        callCluster
      } = this;
      const listItemIndex = this.getListItemIndex();
      return (0, _items.searchListItemByValues)({
        callCluster,
        listId,
        listItemIndex,
        type,
        value
      });
    });

    _defineProperty(this, "findList", async ({
      filter,
      currentIndexPosition,
      perPage,
      page,
      sortField,
      sortOrder,
      searchAfter
    }) => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      return (0, _lists.findList)({
        callCluster,
        currentIndexPosition,
        filter,
        listIndex,
        page,
        perPage,
        searchAfter,
        sortField,
        sortOrder
      });
    });

    _defineProperty(this, "findListItem", async ({
      listId,
      filter,
      currentIndexPosition,
      perPage,
      page,
      sortField,
      sortOrder,
      searchAfter
    }) => {
      const {
        callCluster
      } = this;
      const listIndex = this.getListIndex();
      const listItemIndex = this.getListItemIndex();
      return (0, _items.findListItem)({
        callCluster,
        currentIndexPosition,
        filter,
        listId,
        listIndex,
        listItemIndex,
        page,
        perPage,
        searchAfter,
        sortField,
        sortOrder
      });
    });

    this.spaceId = _spaceId;
    this.user = _user;
    this.config = _config;
    this.callCluster = _callCluster;
  }

}

exports.ListClient = ListClient;