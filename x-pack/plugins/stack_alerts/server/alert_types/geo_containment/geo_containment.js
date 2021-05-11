"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformResults = transformResults;
exports.getActiveEntriesAndGenerateAlerts = getActiveEntriesAndGenerateAlerts;
exports.getGeoContainmentExecutor = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _es_query_builder = require("./es_query_builder");

var _alert_type = require("./alert_type");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Flatten agg results and get latest locations for each entity


function transformResults(results, dateField, geoField) {
  if (!results) {
    return new Map();
  }

  const buckets = _lodash.default.get(results, 'aggregations.shapes.buckets', {});

  const arrResults = _lodash.default.flatMap(buckets, (bucket, bucketKey) => {
    const subBuckets = _lodash.default.get(bucket, 'entitySplit.buckets', []);

    return _lodash.default.map(subBuckets, subBucket => {
      const locationFieldResult = _lodash.default.get(subBucket, `entityHits.hits.hits[0].fields["${geoField}"][0]`, '');

      const location = locationFieldResult ? _lodash.default.chain(locationFieldResult).split(', ').map(coordString => +coordString).reverse().value() : [];

      const dateInShape = _lodash.default.get(subBucket, `entityHits.hits.hits[0].fields["${dateField}"][0]`, null);

      const docId = _lodash.default.get(subBucket, `entityHits.hits.hits[0]._id`);

      return {
        location,
        shapeLocationId: bucketKey,
        entityName: subBucket.key,
        dateInShape,
        docId
      };
    });
  });

  const orderedResults = _lodash.default.orderBy(arrResults, ['entityName', 'dateInShape'], ['asc', 'desc']) // Get unique
  .reduce((accu, el) => {
    const {
      entityName,
      ...locationData
    } = el;

    if (entityName) {
      if (!accu.has(entityName)) {
        accu.set(entityName, []);
      }

      accu.get(entityName).push(locationData);
    }

    return accu;
  }, new Map());

  return orderedResults;
}

function getActiveEntriesAndGenerateAlerts(prevLocationMap, currLocationMap, alertInstanceFactory, shapesIdsNamesMap, currIntervalEndTime) {
  const allActiveEntriesMap = new Map([...prevLocationMap, ...currLocationMap]);
  allActiveEntriesMap.forEach((locationsArr, entityName) => {
    // Generate alerts
    locationsArr.forEach(({
      location,
      shapeLocationId,
      dateInShape,
      docId
    }) => {
      const context = {
        entityId: entityName,
        entityDateTime: dateInShape ? new Date(dateInShape).toISOString() : null,
        entityDocumentId: docId,
        detectionDateTime: new Date(currIntervalEndTime).toISOString(),
        entityLocation: `POINT (${location[0]} ${location[1]})`,
        containingBoundaryId: shapeLocationId,
        containingBoundaryName: shapesIdsNamesMap[shapeLocationId] || shapeLocationId
      };
      const alertInstanceId = `${entityName}-${context.containingBoundaryName}`;

      if (shapeLocationId !== _es_query_builder.OTHER_CATEGORY) {
        alertInstanceFactory(alertInstanceId).scheduleActions(_alert_type.ActionGroupId, context);
      }
    });

    if (locationsArr[0].shapeLocationId === _es_query_builder.OTHER_CATEGORY) {
      allActiveEntriesMap.delete(entityName);
      return;
    }

    const otherCatIndex = locationsArr.findIndex(({
      shapeLocationId
    }) => shapeLocationId === _es_query_builder.OTHER_CATEGORY);

    if (otherCatIndex >= 0) {
      const afterOtherLocationsArr = locationsArr.slice(0, otherCatIndex);
      allActiveEntriesMap.set(entityName, afterOtherLocationsArr);
    } else {
      allActiveEntriesMap.set(entityName, locationsArr);
    }
  });
  return allActiveEntriesMap;
}

const getGeoContainmentExecutor = log => async function ({
  previousStartedAt: currIntervalStartTime,
  startedAt: currIntervalEndTime,
  services,
  params,
  alertId,
  state
}) {
  const {
    shapesFilters,
    shapesIdsNamesMap
  } = state.shapesFilters ? state : await (0, _es_query_builder.getShapesFilters)(params.boundaryIndexTitle, params.boundaryGeoField, params.geoField, services.callCluster, log, alertId, params.boundaryNameField, params.boundaryIndexQuery);
  const executeEsQuery = await (0, _es_query_builder.executeEsQueryFactory)(params, services, log, shapesFilters); // Start collecting data only on the first cycle

  let currentIntervalResults;

  if (!currIntervalStartTime) {
    log.debug(`alert ${_alert_type.GEO_CONTAINMENT_ID}:${alertId} alert initialized. Collecting data`); // Consider making first time window configurable?

    const START_TIME_WINDOW = 1;
    const tempPreviousEndTime = new Date(currIntervalEndTime);
    tempPreviousEndTime.setMinutes(tempPreviousEndTime.getMinutes() - START_TIME_WINDOW);
    currentIntervalResults = await executeEsQuery(tempPreviousEndTime, currIntervalEndTime);
  } else {
    currentIntervalResults = await executeEsQuery(currIntervalStartTime, currIntervalEndTime);
  }

  const currLocationMap = transformResults(currentIntervalResults, params.dateField, params.geoField);
  const prevLocationMap = new Map([...Object.entries(state.prevLocationMap || {})]);
  const allActiveEntriesMap = getActiveEntriesAndGenerateAlerts(prevLocationMap, currLocationMap, services.alertInstanceFactory, shapesIdsNamesMap, currIntervalEndTime);
  return {
    shapesFilters,
    shapesIdsNamesMap,
    prevLocationMap: Object.fromEntries(allActiveEntriesMap)
  };
};

exports.getGeoContainmentExecutor = getGeoContainmentExecutor;