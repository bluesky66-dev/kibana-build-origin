"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeBufferToItems = exports.importListItemsToStream = void 0;

var _create_list_if_it_does_not_exist = require("../lists/create_list_if_it_does_not_exist");

var _buffer_lines = require("./buffer_lines");

var _create_list_items_bulk = require("./create_list_items_bulk");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const importListItemsToStream = ({
  config,
  deserializer,
  serializer,
  listId,
  stream,
  callCluster,
  listItemIndex,
  listIndex,
  type,
  user,
  meta,
  version
}) => {
  return new Promise(resolve => {
    const readBuffer = new _buffer_lines.BufferLines({
      bufferSize: config.importBufferSize,
      input: stream
    });
    let fileName;
    let list = null;
    readBuffer.on('fileName', async fileNameEmitted => {
      readBuffer.pause();
      fileName = fileNameEmitted;

      if (listId == null) {
        list = await (0, _create_list_if_it_does_not_exist.createListIfItDoesNotExist)({
          callCluster,
          description: `File uploaded from file system of ${fileNameEmitted}`,
          deserializer,
          id: fileNameEmitted,
          immutable: false,
          listIndex,
          meta,
          name: fileNameEmitted,
          serializer,
          type,
          user,
          version
        });
      }

      readBuffer.resume();
    });
    readBuffer.on('lines', async lines => {
      if (listId != null) {
        await writeBufferToItems({
          buffer: lines,
          callCluster,
          deserializer,
          listId,
          listItemIndex,
          meta,
          serializer,
          type,
          user
        });
      } else if (fileName != null) {
        await writeBufferToItems({
          buffer: lines,
          callCluster,
          deserializer,
          listId: fileName,
          listItemIndex,
          meta,
          serializer,
          type,
          user
        });
      }
    });
    readBuffer.on('close', () => {
      resolve(list);
    });
  });
};

exports.importListItemsToStream = importListItemsToStream;

const writeBufferToItems = async ({
  listId,
  callCluster,
  deserializer,
  serializer,
  listItemIndex,
  buffer,
  type,
  user,
  meta
}) => {
  await (0, _create_list_items_bulk.createListItemsBulk)({
    callCluster,
    deserializer,
    listId,
    listItemIndex,
    meta,
    serializer,
    type,
    user,
    value: buffer
  });
  return {
    linesProcessed: buffer.length
  };
};

exports.writeBufferToItems = writeBufferToItems;