"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationFieldName = getAnnotationFieldName;
exports.getAnnotationFieldValue = getAnnotationFieldValue;
exports.isAnnotation = isAnnotation;
exports.isAnnotations = isAnnotations;

var _annotations = require("../constants/annotations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// The Annotation interface is based on annotation documents stored in the
// `.ml-annotations-6` index, accessed via the `.ml-annotations-[read|write]` aliases.
// Annotation document mapping:
// PUT .ml-annotations-6
// {
//   "mappings": {
//     "annotation": {
//       "properties": {
//         "annotation": {
//           "type": "text"
//         },
//         "create_time": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "create_username": {
//           "type": "keyword"
//         },
//         "timestamp": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "end_timestamp": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "job_id": {
//           "type": "keyword"
//         },
//         "modified_time": {
//           "type": "date",
//           "format": "epoch_millis"
//         },
//         "modified_username": {
//           "type": "keyword"
//         },
//         "type": {
//           "type": "keyword"
//         }
//       }
//     }
//   }
// }
// Alias
// POST /_aliases
// {
//     "actions" : [
//         { "add" : { "index" : ".ml-annotations-6", "alias" : ".ml-annotations-read" } },
//         { "add" : { "index" : ".ml-annotations-6", "alias" : ".ml-annotations-write" } }
//     ]
// }


function getAnnotationFieldName(fieldType) {
  return `${fieldType}_name`;
}

function getAnnotationFieldValue(fieldType) {
  return `${fieldType}_value`;
}

function isAnnotation(arg) {
  return arg.timestamp !== undefined && typeof arg.annotation === 'string' && typeof arg.job_id === 'string' && (arg.type === _annotations.ANNOTATION_TYPE.ANNOTATION || arg.type === _annotations.ANNOTATION_TYPE.COMMENT);
}

function isAnnotations(arg) {
  if (Array.isArray(arg) === false) {
    return false;
  }

  return arg.every(d => isAnnotation(d));
}