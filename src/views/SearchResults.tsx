import React from "react";
import { Link } from "react-router-dom";
import { KnownCollection, useRootSelector } from "config/types";
import { SymbolSelectors } from "entities/Symbol";
import { SymbolData } from "http/SymbolAPI";

import "./SearchResults.css";
import Chevron from "../assets/chevron-right.svg";
import Spinner from "./Spinner";
import { SymbolSearchSelectors } from "features/SymbolSearch";

export const SearchResults: React.FC = () => {
  const collection = useRootSelector(SymbolSelectors.collection);
  const requestState = useRootSelector(SymbolSelectors.requestState);
  const isLoading = requestState?.status === "pending";
  const isVisible = useRootSelector(SymbolSearchSelectors.visibility)
  const loadingClassName = isLoading ? "loading" : "";
  return !isVisible ? null : (
    <div className={`listRoot ${loadingClassName}`}>
      {isLoading && <Spinner />}
      {Object.values(collection as KnownCollection<SymbolData>).map(
        (symbolData, i) => (
          <SearchResultListItem
            key={i}
            symbolData={symbolData as SymbolData}
            index={i}
          />
        )
      )}
    </div>
  );
};

type SearchResultListItemProps = {
  symbolData: SymbolData;
  index: number;
};

export const SearchResultListItem: React.FC<SearchResultListItemProps> = ({
  symbolData,
  index,
}) => {
  const rootClassName =
    index % 2 ? "list_row list_row-even" : "list_row list_row-odd";
  return (
    <div className={rootClassName}>
      <div className="page">
        <Link
          className="unstyledLink"
          to={`/overview/${symbolData["1. symbol"]}`}
        >
          <div className="list_rowContent">
            <div className="list_field">
              <div className="list_fieldLabel">Symbol</div>
              <div className="list_fieldData">{symbolData["1. symbol"]}</div>
            </div>
            <div className="list_field">
              <div className="list_fieldLabel">Name</div>
              <div className="list_fieldData">{symbolData["2. name"]}</div>
            </div>
            <div className="list_field">
              <div className="list_fieldLabel">Type</div>
              <div className="list_fieldData">{symbolData["3. type"]}</div>
            </div>
            <div className="list_field">
              <div className="list_fieldLabel">Region</div>
              <div className="list_fieldData">{symbolData["4. region"]}</div>
            </div>
            <div className="list_linkArrow">
              <Chevron className="linkArrow" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SearchResults;
