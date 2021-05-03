import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerMiddleware as createRouterMiddleware } from "connected-react-router";
import { createLogger } from "redux-logger";

import {
  LocalStorageKeys,
  LocalStorageState,
  RootState,
  RootStore,
} from "config/types";
import createRootReducer from "config/createRootReducer";
import createDefaultState from "config/createDefaultState";
import { History } from "history";
import createRootSaga from "./createRootSaga";
import { debounce } from "throttle-debounce";

export default function configureStore(history: History): RootStore {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [
    createRouterMiddleware(history),
    sagaMiddleware,
    createLogger({ collapsed: true }),
  ];

  const store = createStore(
    createRootReducer(history),
    { ...createDefaultState(), ...deserializeState() },
    applyMiddleware(...middlewares)
  );

  configureStorage(store);

  sagaMiddleware.run(createRootSaga());

  return store;
}

const toPersist: LocalStorageKeys[] = [
  "overviews"
];

function configureStorage(store: RootStore) {
  let lastState: RootState;
  store.subscribe(
    debounce(100, () => {
      const state = store.getState();
      try {
        for (let key of toPersist) {
          if (state[key] !== lastState?.[key]) {
            window.localStorage.setItem(key, JSON.stringify(state[key]));
          }
        }
      } catch (e) {
        // Probably out of storage space
        console.error(e);
      }
      lastState = state;
    })
  );
}

function deserializeState() {
  let deserializedState: LocalStorageState = {};
  try {
    deserializedState = toPersist
      .map((key) => {
        let serialized = window.localStorage.getItem(key);
        return [key, serialized] as const;
      })
      .reduce((acc, [key, serialized]) => {
        if (serialized !== null) {
          const state = JSON.parse(serialized);
          acc[key] = state;
        }
        return acc;
      }, {} as LocalStorageState);
  } catch (e) {
    // Probably out of storage space
    console.error(e);
  }
  return deserializedState;
}
