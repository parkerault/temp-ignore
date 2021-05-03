import React, { ChangeEvent } from "react";
import { useSelector } from "react-redux";

import { useRootDispatch } from "config/types";
import {
  SymbolSearchActions,
  SymbolSearchSelectors,
} from "features/SymbolSearch";
import "./SymbolSearch.css";

export const SymbolSearch: React.FC = () => {
  return (
    <div className="searchRoot">
      <div className="page">
        <SearchInput />
      </div>
    </div>
  );
};

const SearchInput: React.FC = () => {
  const inputValue = useSelector(SymbolSearchSelectors.searchValue);
  const dispatch = useRootDispatch();
  const inputId = "SymbolSearch";
  return (
    <label htmlFor={inputId}>
      <input
        id={inputId}
        className="searchInput"
        type="search"
        value={inputValue}
        onFocus={(e) => dispatch(SymbolSearchActions.setVisibility(true))}
        onBlur={(e) =>
          setTimeout(
            () => dispatch(SymbolSearchActions.setVisibility(false)),
            200
          )
        }
        onChange={(e) => dispatch(SymbolSearchActions.setValue(e.target.value))}
        placeholder="Search for a Stonk"
      />
    </label>
  );
};
