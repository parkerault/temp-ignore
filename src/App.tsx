import React from "react";
import { Route, Switch } from "react-router-dom";
import TitleBar from "views/TitleBar";
import { Overview } from "views/Overview";
import { SymbolSearch } from "views/SymbolSearch";
import SearchResults from "views/SearchResults";
import UIStrings from "./config/data/UIStrings.json";
import routes from "config/routes";
import "fonts.css";
import "App.css";
import Home from "Home";

const App = () => {
  return (
    <>
      <TitleBar title={UIStrings.SiteName} subtitle={UIStrings.SubTitle} />
      <SymbolSearch />
      <SearchResults />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path={routes.overview} component={Overview} />
      </Switch>
    </>
  );
};

export default App;
