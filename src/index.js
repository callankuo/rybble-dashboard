import React from "react";
import ReactDOM from "react-dom";
//import "./index.css";
import "./index.less";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { HashRouter as Router, Route } from "react-router-dom";
import ExplorePage from "./pages/ExplorePage";
import DashboardPage from "./pages/DashboardPage";
import UsageDemographicsPage from "./pages/UsageDemographicsPage";
import UsageMarketTrendPage from "./pages/UsageMarketTrendPage";
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App>  
      <Route key="index" exact path="/" component={DashboardPage} />
      <Route key="explore" path="/explore" component={ExplorePage} /> 
      </App>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
); 
// put rout back after poc 
//<Route key="usageDemographics" path="/usageDemographics" component={UsageDemographicsPage} /> 
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();
