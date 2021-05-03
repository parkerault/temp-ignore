import { type, TypeOf, string, array } from "io-ts";
import { flow, identity } from "fp-ts/lib/function";
import { tryCatch, chainEitherKW, mapLeft } from "fp-ts/TaskEither";
import { APIError, request, ValidationError } from "./ApiClient";

export const SymbolDecoder = type({
  "1. symbol": string,
  "2. name": string,
  "3. type": string,
  "4. region": string,
  "8. currency": string,
});

export type SymbolData = TypeOf<typeof SymbolDecoder>;

export const SymbolResponseDecoder = type({
  bestMatches: array(SymbolDecoder),
});

export type SymbolResponse = TypeOf<typeof SymbolResponseDecoder>;

const req = (symbol: string) =>
  tryCatch(
    () =>
      request<SymbolResponse>({
        query: {
          function: "SYMBOL_SEARCH",
          keywords: symbol,
        },
      }),
    identity as (e: unknown) => APIError
  );

export const getSymbols = flow(
  req,
  chainEitherKW(SymbolResponseDecoder.decode),
  mapLeft(e => e instanceof Error ? e : new ValidationError(e))
);
