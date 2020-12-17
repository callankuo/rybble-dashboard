import React from "react";
import UsageMarketTrend from "../components/UsageMarketTrend";
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2, 4, 3),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(4, 4, 3),
    margin: theme.spacing(2, 0, 0),
    borderRadius: 8
  },
  alertInfo: {
    color: "#7A77FF",
    border: "1px solid #CAC9FF",
    borderRadius: 8,
    background: "white"
  }
}));
const UsageMarketTrendPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Alert className={classes.alertInfo} severity="info">IFE Usage UH/PD/Count Market Trend for year 2020.</Alert>
      <div className={classes.paper}>
        <UsageMarketTrend />
      </div>
    </div>
  )
}

export default UsageMarketTrendPage;
