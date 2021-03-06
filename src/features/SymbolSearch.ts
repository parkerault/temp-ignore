import { createAction, createReducer } from "@reduxjs/toolkit";
import { put, SagaGenerator } from "typed-redux-saga";
import { debounce } from "redux-saga/effects";
import { ActionMapTypes, RootState, withPayload } from "config/types";
import { SymbolActions } from "entities/Symbol";

/******************************************************************************
 * Actions
 *****************************************************************************/

export const SymbolSearchActions = {
  setValue: createAction("SymbolSearch/setValue", withPayload<string>()),
  setValid: createAction("SymbolSearch/setValid", withPayload<boolean>()),
  setVisibility: createAction(
    "SymbolSearch/setVisibility",
    withPayload<boolean>()
  ),
};

export type SymbolSearchActions = ActionMapTypes<typeof SymbolSearchActions>;

/******************************************************************************
 * State & Reducer
 *****************************************************************************/

export type SymbolSearchState = {
  searchValue: string;
  valid: boolean;
  visibility: boolean;
};

export const SymbolSearchDefaultState: SymbolSearchState = {
  searchValue: "",
  valid: true,
  visibility: false,
};

export const SymbolSearchReducer = createReducer(
  SymbolSearchDefaultState,
  (builder) => {
    builder
      .addCase(SymbolSearchActions.setValue, (state, action) => {
        state.searchValue = action.payload;
      })
      .addCase(SymbolSearchActions.setValid, (state, action) => {
        state.valid = action.payload;
      })
      .addCase(SymbolSearchActions.setVisibility, (state, action) => {
        state.visibility = action.payload;
      });
  }
);

/******************************************************************************
 * Sagas
 *****************************************************************************/

export function* watchSetValue(): SagaGenerator<void> {
  yield debounce(500, SymbolSearchActions.setValue as any, setValue);
}

function* setValue({
  payload,
}: SymbolSearchActions["setValue"]): SagaGenerator<void> {
  yield* put(SymbolActions.fetchSymbolData({ symbol: payload }));
}

export const SymbolSearchSagas = {
  watchSetValue,
  setValue,
};

/******************************************************************************
 * Selectors
 *****************************************************************************/

const searchValue = (state: RootState) => state.views.symbolSearch.searchValue;
const valid = (state: RootState) => state.views.symbolSearch.valid;
const visibility = (state: RootState) => state.views.symbolSearch.visibility;

export const SymbolSearchSelectors = {
  searchValue,
  valid,
  visibility,
};
