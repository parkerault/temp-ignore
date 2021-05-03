import { flow, identity } from "fp-ts/lib/function";
import { tryCatch, chainEitherKW, mapLeft } from "fp-ts/TaskEither";
import { APIError, request, ValidationError } from "./ApiClient";
import { type, Type, TypeOf, number, string, failure, success } from "io-ts";

const parsedNumber = new Type<number, string, unknown>(
  "NumberFromString",
  number.is,
  (value, context) => {
    const parsed = Number(value);
    return isNaN(parsed) ? failure(value, context) : success(parsed);
  },
  String
);

export const OverviewDecoder = type({
  Symbol: string,
  AssetType: string,
  Name: string,
  Description: string,
  CIK: string,
  Exchange: string,
  Currency: string,
  Country: string,
  Sector: string,
  Industry: string,
  Address: string,
  FullTimeEmployees: parsedNumber,
  FiscalYearEnd: string,
  LatestQuarter: string,
  MarketCapitalization: parsedNumber,
  EBITDA: parsedNumber,
  PERatio: parsedNumber,
  PEGRatio: parsedNumber,
  BookValue: parsedNumber,
  EPS: parsedNumber,
  RevenuePerShareTTM: parsedNumber,
  ProfitMargin: parsedNumber,
  OperatingMarginTTM: parsedNumber,
  ReturnOnAssetsTTM: parsedNumber,
  ReturnOnEquityTTM: parsedNumber,
  RevenueTTM: parsedNumber,
  GrossProfitTTM: parsedNumber,
  DilutedEPSTTM: parsedNumber,
  QuarterlyEarningsGrowthYOY: parsedNumber,
  QuarterlyRevenueGrowthYOY: parsedNumber,
  AnalystTargetPrice: parsedNumber,
  TrailingPE: parsedNumber,
  ForwardPE: parsedNumber,
  PriceToSalesRatioTTM: parsedNumber,
  PriceToBookRatio: parsedNumber,
  EVToRevenue: parsedNumber,
  EVToEBITDA: parsedNumber,
  Beta: parsedNumber,
  "52WeekHigh": parsedNumber,
  "52WeekLow": parsedNumber,
  "50DayMovingAverage": parsedNumber,
  "200DayMovingAverage": parsedNumber,
  SharesOutstanding: parsedNumber,
  SharesFloat: parsedNumber,
  SharesShort: parsedNumber,
  SharesShortPriorMonth: parsedNumber,
  ShortRatio: parsedNumber,
  ShortPercentOutstanding: parsedNumber,
  ShortPercentFloat: parsedNumber,
  PercentInsiders: parsedNumber,
  PercentInstitutions: parsedNumber,
  ForwardAnnualDividendRate: parsedNumber,
  ForwardAnnualDividendYield: parsedNumber,
  PayoutRatio: parsedNumber,
  DividendDate: string,
  ExDividendDate: string,
  LastSplitFactor: string,
  LastSplitDate: string,
});

export type OverviewData = TypeOf<typeof OverviewDecoder>;
export type OverviewDataKeys = keyof OverviewData;

export type OverviewResponse = OverviewData; // Aliasing for consistency

const req = (symbol: string) =>
  tryCatch(
    () =>
      request<OverviewResponse>({
        query: {
          function: "OVERVIEW",
          symbol,
        },
      }),
    identity as (e: unknown) => APIError
  );

export const getOverview = flow(
  req,
  chainEitherKW(OverviewDecoder.decode),
  mapLeft(e => e instanceof Error ? e : new ValidationError(e))
);
