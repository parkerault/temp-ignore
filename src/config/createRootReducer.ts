import { combineReducers, Reducer } from "redux";
import { connectRouter } from "connected-react-router";
import { History } from "history";
import { RootAction, RootState } from "./types";
import { SymbolSearchReducer } from "features/SymbolSearch";
import { SymbolReducer } from "entities/Symbol";
import { OverviewReducer } from "entities/Overview";

export default function createRootReducer(
  history: History<never>
): Reducer<RootState, RootAction> {
  return combineReducers({
    router: connectRouter<never>(history),
    symbols: SymbolReducer,
    overviews: OverviewReducer,
    views: combineReducers({
      symbolSearch: SymbolSearchReducer
    }),
  });
}
