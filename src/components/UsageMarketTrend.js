import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useCubeQuery } from "@cubejs-client/react";
import moment from "moment";
import numeral from "numeral";
import {
  BarChart,
  Bar,ComposedChart, Line, Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import Modal from '@material-ui/core/Modal';

import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
//import { DataGrid } from '@material-ui/data-grid';
import MUIDataTable from "mui-datatables";
import { RowingSharp, RowingTwoTone } from "@material-ui/icons";

const numberFormatter = item => numeral(item).format("0,0");
const dateFormatter = item => moment(item).format("MMM DD, YY");

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    width: 1000
  },
}));

//const colors = ["#FF6492", "#141446", "#7A77FF"];
const colors = ["#7DB3FF", "#49457B", "#FF7C78", "#FFA233"];
const stackIds = ["a","b","c","d"];

const query = {
  measures: ["IfeUsage.UH","IfeUsage.PD","IfeUsage.count"],
  dimensions: [],
  timeDimensions: [{
    dimension: "IfeUsage.createdAt",
    granularity: "month",
    dateRange: ["2020-01-01","2020-12-31"]
  }]
};


const UsageMarketTrend = () => {
  const classes = useStyles();
  const [drillDownQuery, setDrillDownQuery] = useState();
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const { resultSet } = useCubeQuery(query);
  const drillDownResponse = useCubeQuery(
    {
      ...drillDownQuery,
      limit: 50000
    },
    {
      skip: !drillDownQuery
    },
    
  );


  const drillDownData = () => (
    (drillDownResponse.resultSet && drillDownResponse.resultSet.tablePivot()) || []
  )

  const columns = [
    { name: 'IfeUsage.id', lbel: 'IFE Usage ID',  options: {
      filter: true,
      sort: true,
     }},
     { name: 'Airline.name', label: 'Airline',  options: {
      filter: true,
      sort: true,
     }},
    { name: 'Flight.tail', label: 'Aircraft Tail',options: {
      filter: true,
      sort: true,
     }},
    { name: 'Flight.id', label: 'Flight ID',  options: {
      filter: true,
      sort: true,
     }},
     { name: 'Flight.origin', label: 'Origin',options: {
      filter: true,
      sort: true,
     }},
    { name: 'Flight.destination', label: 'Destination',  options: {
      filter: true,
      sort: true,
     }},
     { name: 'Airport.city', label: 'Destination City',  options: {
      filter: true,
      sort: true,
     }},
     { name: 'Flight.flightTime', label: 'Flight Time',options: {
      filter: true,
      sort: true,
     }},
    { name: 'Media.mediaName', label: 'Media Name',options: {
      filter: true,
      sort: true,
     }},
    { name: 'Media.genres', label: 'Media Genres',options: {
      filter: true,
      sort: true,
     }}, 
    { name: 'IfeUsage.uh', label: 'Usage Hours',options: {
      filter: true,
      sort: true,
     }},
     { name: 'IfeUsage.device', label: 'Device',options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.passengerName', label: 'Passenger Name',options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.gender', label: 'Gender',options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.ageGroup', label: 'Age Group', options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.class', label: 'Class',options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.seatAssignment', label: 'Seat Assignment', options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.nationality', label: 'Nationality',options: {
      filter: true,
      sort: true,
     }},
    { name: 'PassengerManifest.tripPurpose', label: 'Trip Purpose',options: {
      filter: true,
      sort: true,
     }},
  ]

  const options = {
    filterType: 'dropdown',
    rowsPerPage: 5,
    page: 1,
    resizableColumns: false,
    responsive: 'scroll',

  };

  var rows = new Array();


  if (!resultSet) {
    return <p>Loading...</p>;
  }

  const handleBarClick = (event, yValues) => {
    if (event.xValues != null) {
      setDrillDownQuery(
        resultSet.drillDown(
          {
            xValues: event.xValues,
            yValues
          }
        )
      );
      setOpen(true);
    }
  };


  return (
    <>
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart width={500} height={500} data={resultSet.chartPivot()}
        {...console.log(resultSet.chartPivot())}
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" tickFormatter={dateFormatter} />
          <YAxis />
          <Tooltip labelFormatter={dateFormatter} formatter={numberFormatter} />
          <Legend />

          {resultSet.seriesNames().map(({ key, yValues }, index) => {
           console.log(resultSet.seriesNames());
           
            if (key === "IfeUsage.UH") {
              console.log("key= "+key);
              return(
              <Bar
                key={key}
                dataKey={key}
                barSize={20} 
                //stackId="a"
                //stackId = {stackIds[index]}
                //fill={colors[index]}
                stackId = {stackIds[0]}
                fill = "#413ea0"
                //fill={colors[0]}
                onClick={event => handleBarClick(event, yValues)}
                onMouseOver={() => setActiveId(index)}
                onMouseOut={() => setActiveId(null)}
              />
              )
            } else if (key === "IfeUsage.count") {
              console.log("key= "+key);
              return(
                <Area key={key} type="monotone" dataKey={key} fill="#8884d8" stroke="#8884d8" />
              )
              
            } else if (key === "IfeUsage.PD") {
              console.log("key= "+key);
              return(
                
                <Line key={key} type="monotone" dataKey={key} stroke="#ff7300" />
              )

              
            } 

          })}
      </ComposedChart>
      </ResponsiveContainer>
      <Modal
         open={open}
         onClose={handleClose}
         className={classes.modal}
         aria-labelledby="simple-modal-title"
         aria-describedby="simple-modal-description"
       >
         <Fade in={open}>
          <div className={classes.paper}>
            { drillDownResponse.isLoading ?
              "Loading..." : 
              <div style={{ height: 600, width: '100%' }} >
                { 
                  drillDownData().map((row, index) => {
                  if (row["IfeUsage.uh"] > 0.00 ) {
                  //let rowObject = new Object({"IfeUsage.id": row["IfeUsage.id"], "Flight.id": row["Flight.id"],"Media.mediaName": row["Media.mediaName"], "Media.genres": row["Media.genres"],"IfeUsage.uh": row["IfeUsage.uh"],"PassengerManifest.passengerName": row["PassengerManifest.passengerName"],"PassengerManifest.gender": row["PassengerManifest.gender"],"PassengerManifest.age": row["PassengerManifest.age"],"PassengerManifest.class": row["PassengerManifest.class"],"PassengerManifest.seatAssignment": row["PassengerManifest.seatAssignment"],"PassengerManifest.nationality": row["PassengerManifest.nationality"],"PassengerManifest.tripPurpose": row["PassengerManifest.tripPurpose"]});
                  rows.push(row)  }     
              })}
              <MUIDataTable title={'IFE Usage Demographics Analytics'} data={rows} columns={columns} options={options} 
              />
              </div>
              }
          </div>
        </Fade>
       </Modal>
    </>
  );
}

export default UsageMarketTrend;
