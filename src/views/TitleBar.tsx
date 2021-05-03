import React from "react";
import { Link, NavLink } from "react-router-dom";

import "./TitleBar.css";

type TitleBarProps = {
  title: string;
  subtitle: string;
};

const TitleBar: React.FC<TitleBarProps> = ({ title, subtitle }) => {
  return (
    <div className="titleBar">
      <div className="titleBar_page page">
        <Link className="titleBar_titleLink" to="/">
          <h1 className="titleBar_title">{title}</h1>
          <h3 className="titleBar_subtitle">{subtitle}</h3>
        </Link>
      </div>
    </div>
  );
};

export default TitleBar;
