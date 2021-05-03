import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  Dispatch,
  Store,
} from "@reduxjs/toolkit";
import createDefaultState from "config/createDefaultState";
import { CallHistoryMethodAction, LocationChangeAction } from "connected-react-router";
import { EntityActions } from "entities";
import { FeatureActions } from "features";
import { LocationState } from "history";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type RootState = ReturnType<typeof createDefaultState>;
export type RootAction =
  | EntityActions
  | FeatureActions
  | LocationChangeAction<LocationState>
  | CallHistoryMethodAction
export type RootDispatch = Dispatch<RootAction>;
export type RootStore = Store<RootState, RootAction>;

/**
 * Get a union of action creator types
 */
export type ActionTypes<T extends ActionMap> = ReturnType<T[keyof T]>;
export type ActionMap = {
  [key: string]: ActionCreatorWithPayload<any> | ActionCreatorWithoutPayload;
};
export type LocalStorageKeys = keyof RootState;
export type LocalStorageState = Partial<RootState>;

/**
 * A type safe wrapper for redux's `useDispatch` hook. It only accepts members
 * of `RootAction`, which prevents the accidental use of incorrect action
 * payloads. The `useDispatch` hook provided by redux will let you put any old
 * garbage into it without complaining.
 * @example
 * const dispatch = useRootDispatch();
 * dispatch(theWrongFunction()) // this won't compile
 * dispatch(myAction()) // this will
 */
export function useRootDispatch() {
  return useDispatch<RootDispatch>();
}

/**
 * A type safe wrapper for redux's `useSelector` hook. It obviates the need to pass the `RootState` type to `useSelector` in every component.
 * @example
 * const myValue = useRootSelector((state) => state.myValue);
 * // the type of `state` is inferred as `RootState`.
 */
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * A type helper for `createAction` so you don't have to declare the action
 * type constant twice.
 * @example
 * createAction('test', withPayload<{ a: number }>())
 * // is the same as
 * createAction<{ a: number }, 'test'>('test')
 */

export function withPayload<P>() {
  return (payload: P) => ({ payload });
}

export function withMeta<P, M>() {
  return (payload: P, meta: M) => ({ payload, meta });
}

export type ActionMapTypes<
  T extends Record<string, (...args: any[]) => any>
> = { [K in keyof T]: ReturnType<T[K]> };

/**
 * By default, Collection items should be optional, since accessing a key on
 * the collection isn't guaranteed to return a value. If we don't tell the type
 * system the the values may be undefined, it won't complain when you write a
 * selector that doesn't check the user inputs. This does make accessing items
 * from collections kind of a pain in the ass, so I recommend using the nullish
 * coalescing operator, or if you're absolutely sure it can never be undefined,
 * use `(collection[id] as Item).property`.
 * @example
 * type MyCollection = { [id: string]: number }
 * const numbers: MyCollection = { a: 1 }
 * numbers.x.toString() // Typescript will consider this perfectly fine.
 */
export type Collection<T> = {
  [id: string]: T | undefined;
};


export type KnownCollection<T> = {
  [id: string]: T;
}
