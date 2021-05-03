import { createAction, createReducer } from "@reduxjs/toolkit";
import { call, put, SagaGenerator, take } from "typed-redux-saga";
import { RootState, withPayload, Collection } from "config/types";
import { getSymbols, SymbolData, SymbolResponse } from "../http/SymbolAPI";
import { RequestState } from "http/ApiClient";
import { isRight } from "fp-ts/lib/Either";

/******************************************************************************
 * Actions
 *****************************************************************************/

export type FetchSymbolDataAction = {
  symbol: string;
};

export const SymbolActions = {
  setSymbolData: createAction(
    "Symbol/setSymbolData",
    withPayload<SymbolResponse>()
  ),
  fetchSymbolData: createAction(
    "Symbol/fetchSymbolData",
    withPayload<FetchSymbolDataAction>()
  ),
  setRequestState: createAction(
    "Symbol/setRequestState",
    withPayload<RequestState>()
  ),
};

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export type SymbolState = {
  collection: Collection<SymbolData>;
  requestState: RequestState;
};

export const SymbolDefaultState: SymbolState = {
  collection: {},
  requestState: null,
};

export const SymbolReducer = createReducer(SymbolDefaultState, (builder) => {
  builder
    .addCase(SymbolActions.setSymbolData, (state, action) => {
      const {
        payload: { bestMatches },
      } = action;
      state.collection = {};
      for (let match of bestMatches) {
        state.collection[match["1. symbol"]] = match;
      }
    })
    .addCase(SymbolActions.setRequestState, (state, action) => {
      state.requestState = action.payload;
    });
});

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchFetchSymbolData(): SagaGenerator<void> {
  while (true) {
    const action = yield* take(SymbolActions.fetchSymbolData);
    yield* call(fetchSymbolData, action.payload);
  }
}

function* fetchSymbolData(payload: FetchSymbolDataAction): SagaGenerator<void> {
  const { symbol } = payload;
  yield* put(SymbolActions.setRequestState({ status: "pending" }));
  const symbolData = yield* call(getSymbols(symbol));
  if (isRight(symbolData)) {
    yield* put(SymbolActions.setRequestState({ status: "success" }));
    yield* put(SymbolActions.setSymbolData(symbolData.right));
  } else {
    yield* put(
      SymbolActions.setRequestState({
        status: "failure",
        error: symbolData.left.message,
      })
    );
    console.error(symbolData.left);
  }
}

export const SymbolSagas = {
  watchFetchSymbolData,
  fetchSymbolData,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

const collection = (state: RootState) => state.symbols.collection;
const requestState = (state: RootState) => state.symbols.requestState;

export const SymbolSelectors = {
  collection,
  requestState,
};
