import React from "react";
import SearchResults from "./views/SearchResults";
import UIStrings from "./config/data/UIStrings.json";

import "./Home.css";

type HomeProps = {};

const Home: React.FC<HomeProps> = (props) => {
  return (
    <div className="home pageRoot page">
      <h3 className="home_headline">{UIStrings.Home.headline}</h3>
      <small className="home_disclaimer">{UIStrings.Home.disclaimer}</small>
    </div>
  );
};

export default Home;
