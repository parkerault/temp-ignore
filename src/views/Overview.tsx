import { useRootDispatch, useRootSelector } from "config/types";
import { OverviewActions, OverviewSelectors } from "entities/Overview";
import React, { useEffect } from "react";
import { createMatchSelector, RouterRootState } from "connected-react-router";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import {
  APIError,
  APIKeyError,
  ValidationError,
  JSONDecodeError,
  RequestState,
} from "http/ApiClient";
import UIStrings from "../config/data/UIStrings.json";
import { OverviewData, OverviewDataKeys } from "http/OverviewAPI";
import "./Overview.css";

export const Overview: React.FC = () => {
  const match = useSelector(
    createMatchSelector<RouterRootState, { symbol: string }>(
      "/overview/:symbol"
    )
  );
  const symbol = match?.params.symbol;
  const dispatch = useRootDispatch();
  const overviewData = useRootSelector((state) =>
    OverviewSelectors.byId(state, { symbol })
  );
  const requestState = useRootSelector(OverviewSelectors.requestState);
  const isLoading = requestState?.status === "pending";
  const isFailed = requestState?.status === "failure";

  useEffect(() => {
    if (symbol !== undefined) {
      dispatch(OverviewActions.fetchOverviewData({ symbol }));
    }
  }, [symbol]);

  return (
    <div className={"pageRoot overviewRoot page " + symbol}>
      {isLoading && <Spinner />}
      {isFailed ? (
        <FailureMessage requestState={requestState} />
      ) : (
        <>
          <h1 className="overview_title">{overviewData?.Symbol}</h1>
          <OverviewList overviewData={overviewData}></OverviewList>
        </>
      )}
    </div>
  );
};

type OverviewListProps = {
  overviewData?: OverviewData;
};

const OverviewList: React.FC<OverviewListProps> = (props) => {
  const keys = Object.keys(props.overviewData ?? {}) as OverviewDataKeys[];
  return (
    <dl className="overview_list">
      {keys.map((key) => (
        <OverviewListItem valueKey={key} value={props.overviewData![key]} />
      ))}
    </dl>
  );
};

type OverviewListItemProps = {
  valueKey: OverviewDataKeys;
  value: number | string;
};

const OverviewListItem: React.FC<OverviewListItemProps> = (props) => {
  const value =
    typeof props.value === "number"
      ? new Intl.NumberFormat("en-US").format(props.value)
      : props.value;
  return (
    <>
      <dt className="overview_listTerm">
        {props.valueKey}
      </dt>
      <dd className="overview_listDescription">{value}</dd>
    </>
  );
};

type FailureMessageProps = {
  requestState: RequestState;
};

const FailureMessage: React.FC<FailureMessageProps> = (props) => {
  const { requestState } = props;
  const failureError = requestState?.status === "failure" && requestState.error;
  const message = getFailureMessage(failureError);
  return (
    <div className="overview_failure">
      <h3>{UIStrings.Overview.failureHeadline}</h3>
      <br />
      <span>{message}</span>
    </div>
  );
};

function getFailureMessage(error?: APIError) {
  let message = UIStrings.Overview.failureMessage;
  if (error instanceof ValidationError || error instanceof JSONDecodeError) {
    message = UIStrings.Overview.failureResponseMessage;
  } else if (error instanceof APIKeyError) {
    message = error.message;
  }
  return message;
}
