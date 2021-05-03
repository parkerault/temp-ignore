import React, { ChangeEvent } from "react";

import { useRootDispatch, useRootSelector } from "config/types";
import {
  SymbolSearchActions,
  SymbolSearchSelectors,
} from "features/SymbolSearch";
import UIStrings from "../config/data/UIStrings.json";
import "./SymbolSearch.css";
import { SymbolActions, SymbolSelectors } from "entities/Symbol";
import { push } from "connected-react-router";
import routes from "config/routes";

export const SymbolSearch: React.FC = () => {
  const dispatch = useRootDispatch();
  const inputValue = useRootSelector(SymbolSearchSelectors.searchValue);
  const symbolValue = useRootSelector((state) =>
    SymbolSelectors.byId(state, { symbol: inputValue })
  );
  const valid = useRootSelector(SymbolSearchSelectors.valid);
  const inputId = "SymbolSearch";
  const submitId = "SymbolSubmit";
  return (
    <div className="searchRoot symbolSearch page">
      <SearchInput
        value={inputValue}
        inputId={inputId}
        submitId={submitId}
        name={inputValue}
        onFocus={(e) => dispatch(SymbolSearchActions.setVisibility(true))}
        onBlur={(e) =>
          setTimeout(
            () => dispatch(SymbolSearchActions.setVisibility(false)),
            200
          )
        }
        onChange={(e) => {
          dispatch(SymbolSearchActions.setValid(true));
          dispatch(SymbolSearchActions.setValue(e.target.value));
        }}
        onSubmit={(e) => {
          e.preventDefault();
          console.log("onSubmit", inputValue, symbolValue)
          if (symbolValue === undefined) {
            dispatch(SymbolSearchActions.setValid(false));
          } else {
            dispatch(push(routes.getOverview(inputValue)));
          }
        }}
      />
      {!valid && (
        <div className="symbolSearch_invalid">
          {UIStrings.SymbolSearch.invalid}
        </div>
      )}
    </div>
  );
};

type SearchInputProps = {
  value: string;
  inputId: string;
  submitId: string;
  name: string;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onChange: React.FocusEventHandler<HTMLInputElement>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
};

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const dispatch = useRootDispatch();
  return (
    <form className="searchForm" onSubmit={props.onSubmit}>
      <label className="searchForm_labelInput" htmlFor={props.inputId}>
        <input
          id={props.inputId}
          name={props.inputId}
          className="searchForm_input styledInput"
          type="search"
          value={props.value}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          placeholder={UIStrings.SymbolSearch.searchPlaceholder}
        />
      </label>
      <label className="searchForm_labelSubmit" htmlFor={props.submitId}>
        <input
          id={props.submitId}
          name={props.submitId}
          className="searchForm_submit styledInput"
          value="Search"
          type="submit"
          disabled={props.value === ""}
        />
      </label>
    </form>
  );
};
