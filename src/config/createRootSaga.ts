import { OverviewSagas } from "entities/Overview";
import { SymbolSagas } from "entities/Symbol";
import { SymbolSearchSagas } from "features/SymbolSearch";
import { fork, SagaGenerator } from "typed-redux-saga";

export default function createRootSaga() {
  return function* rootSaga(): SagaGenerator<void> {
    yield* fork(SymbolSearchSagas.watchSetValue);
    yield* fork(SymbolSagas.watchFetchSymbolData);
    yield* fork(OverviewSagas.watchFetchOverviewData);
  };
}
