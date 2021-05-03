import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, select, take } from "typed-redux-saga";
import { isRight } from "fp-ts/lib/Either";
import { RootState, withPayload, Collection } from "config/types";
import { RequestState } from "http/ApiClient";
import { getOverview, OverviewData } from "http/OverviewAPI";
import { createMatchSelector, RouterRootState } from "connected-react-router";
import routes from "config/routes";

/******************************************************************************
 * Actions
 *****************************************************************************/

type SymbolPayload = { symbol: string };

export const OverviewActions = {
  addOverviewData: createAction(
    "Overview/addOverviewData",
    withPayload<OverviewData>()
  ),
  fetchOverviewData: createAction(
    "Overview/fetchOverviewData",
    withPayload<SymbolPayload>()
  ),
  setRequestState: createAction(
    "Overview/setRequestState",
    withPayload<RequestState>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export type OverviewState = {
  collection: Collection<OverviewData>;
  overviewSymbol: string;
  requestState: RequestState;
};

export const OverviewDefaultState: OverviewState = {
  collection: {},
  overviewSymbol: "",
  requestState: null,
};

export const OverviewReducer = createReducer(
  OverviewDefaultState,
  (builder) => {
    builder
      .addCase(OverviewActions.addOverviewData, (state, action) => {
        const overview = action.payload;
        state.collection[overview.Symbol] = overview;
      })
      .addCase(OverviewActions.setRequestState, (state, action) => {
        state.requestState = action.payload;
      });
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchOverviewData(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(OverviewActions.fetchOverviewData);
    yield* call(fetchOverviewData, action.payload);
  }
}

function* fetchOverviewData(action: SymbolPayload): SagaGenerator<void> {
  const { symbol } = action;
  const storeData = yield* select((state: RootState) =>
    OverviewSelectors.byId(state, { symbol: symbol })
  );
  if (storeData !== undefined) {
    yield* put(OverviewActions.setRequestState({ status: "success" }));
    return;
  }
  yield* put(OverviewActions.setRequestState({ status: "pending" }));
  const overviewData = yield* call(getOverview(symbol));
  if (isRight(overviewData)) {
    yield* put(OverviewActions.setRequestState({ status: "success" }));
    yield* put(OverviewActions.addOverviewData(overviewData.right));
  } else {
    yield* put(
      OverviewActions.setRequestState({
        status: "failure",
        error: overviewData.left,
      })
    );
    console.error(overviewData.left);
  }
}

export const OverviewSagas = {
  watchFetchOverviewData,
  fetchOverviewData,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

const collection = (state: RootState) => state.overviews.collection;
const requestState = (state: RootState) => state.overviews.requestState;
const byId = (state: RootState, props: { symbol?: string }) => {
  return props.symbol !== undefined
    ? state.overviews.collection[props.symbol.toUpperCase()]
    : undefined;
};
const matchSelector = createMatchSelector<RouterRootState, { symbol: string }>(
  routes.overview
);
const pathSymbol = (state: RootState) =>
  matchSelector(state)?.params.symbol;

export const OverviewSelectors = {
  collection,
  requestState,
  byId,
  pathSymbol,
};
