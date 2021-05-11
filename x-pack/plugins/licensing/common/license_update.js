"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLicenseUpdate = createLicenseUpdate;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _has_license_info_changed = require("./has_license_info_changed");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createLicenseUpdate(triggerRefresh$, stop$, fetcher, initialValues) {
  const manuallyRefresh$ = new _rxjs.Subject();
  const fetched$ = (0, _rxjs.merge)(triggerRefresh$, manuallyRefresh$).pipe((0, _operators.exhaustMap)(fetcher), (0, _operators.share)());
  const cached$ = fetched$.pipe((0, _operators.takeUntil)(stop$), (0, _operators.publishReplay)(1) // have to cast manually as pipe operator cannot return ConnectableObservable
  // https://github.com/ReactiveX/rxjs/issues/2972
  );
  const cachedSubscription = cached$.connect();
  stop$.subscribe({
    complete: () => cachedSubscription.unsubscribe()
  });
  const initialValues$ = initialValues ? (0, _rxjs.from)([undefined, initialValues]) : (0, _rxjs.from)([undefined]);
  const license$ = (0, _rxjs.merge)(initialValues$, cached$).pipe((0, _operators.pairwise)(), (0, _operators.filter)(([previous, next]) => (0, _has_license_info_changed.hasLicenseInfoChanged)(previous, next)), (0, _operators.map)(([, next]) => next));
  return {
    license$,

    refreshManually() {
      const licensePromise = fetched$.pipe((0, _operators.take)(1)).toPromise();
      manuallyRefresh$.next();
      return licensePromise;
    }

  };
}