import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { useCubeQuery } from "@cubejs-client/react";
import moment from "moment";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
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
import { DataGrid } from '@material-ui/data-grid';
import { RowingSharp, RowingTwoTone } from "@material-ui/icons";

const dateFormatter = item => moment(item).format("MMM DD");

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
    width: 800
  },
}));

//const colors = ["#FF6492", "#141446", "#7A77FF"];
const colors = ["#7DB3FF", "#49457B", "#FF7C78", "#FFA233"];
const stackIds = ["a","b","c","d"];

const query = {
  measures: ["IfeUsage.UH"],
  dimensions: ["Media.ifeUsageType"],
  timeDimensions: [{
    dimension: "IfeUsage.createdAt",
    granularity: "day",
    dateRange: "last 7 days"
    //dateRange: "Yesterday"
  }]
};

//flight information query by flight_id
const flight_Query = (flight_id) => ({
  measures: [],
  dimensions: [
    "Flight.id",
    "Flight.flightNo",
    "Flight.tail",
    "Flight.origin",
    "Flight.destination",
    "Flight.depart_date",
    "Flight.depart_time",
    "Flight.arrival_date",
    "Flight.arrival_time",
  ],
  filters: [
    {
      "member": "Flight.id",
      "operator": "equals",
      "values": [
        flight_id
      ]
    }
  ]
})

const UsageDemographics = () => {
  const classes = useStyles();
  const [drillDownQuery, setDrillDownQuery] = useState();
  const [flightQuery, setFlightQuery] = useState();
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const { resultSet } = useCubeQuery(query);
  const drillDownResponse = useCubeQuery(
    {
      ...drillDownQuery,
      limit: 100
    },
    {
      skip: !drillDownQuery
    },
    
  );

  const flightQueryResponse = useCubeQuery(
    {
      ...flightQuery,
      //limit: 100
    },
    {
      skip: !flightQuery
    },
    
  );

  const drillDownData = () => (
    (drillDownResponse.resultSet && drillDownResponse.resultSet.tablePivot()) || []
  )

  const columns = [
    { field: 'id', hide: true},
    { field: 'IfeUsage.id', headerName: 'IFE Usage ID',  type: 'number'},
    { field: 'Flight.id', headerName: 'Flight ID',  type: 'number'},
    { field: 'Media.mediaName', headerName: 'Media Name',width: 250},
    { field: 'Media.genres', headerName: 'Media Genres',width: 200}, 
    { field: 'IfeUsage.uh', headerName: 'Usage Hours',width: 60},
    { field: 'PassengerManifest.passengerName', headerName: 'Passenger Name',width: 150},
    { field: 'PassengerManifest.gender', headerName: 'Gender',width: 80},
    { field: 'PassengerManifest.age', headerName: 'Age', type: 'number',width: 50},
    { field: 'PassengerManifest.class', headerName: 'Class',width: 150},
    { field: 'PassengerManifest.seatAssignment', headerName: 'Seat Assignment', width: 60},
    { field: 'PassengerManifest.nationality', headerName: 'Nationality',width: 100},
    { field: 'PassengerManifest.tripPurpose', headerName: 'Trip Purpose',width: 100},
  ]

  var rows = new Array();;


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

  function Tooltip({ active, payload, label }) {
    if (active && activeId !== null) {
      return (
        <div className="tooltip" style={{ color: colors[activeId] }}>
          Drill down into {dateFormatter(label)}, {payload[activeId].name}
        </div>
      );
    }

    return null;
  }

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={resultSet.chartPivot()} cursor="pointer">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" tickFormatter={dateFormatter} />
          <YAxis />
          <RechartsTooltip content={<Tooltip />} />
          <Legend />

          {resultSet.seriesNames().map(({ key, yValues }, index) => {
            return (
              <Bar
                key={key}
                dataKey={key}
                //stackId="a"
                stackId = {stackIds[index]}
                fill={colors[index]}
                onClick={event => handleBarClick(event, yValues)}
                onMouseOver={() => setActiveId(index)}
                onMouseOut={() => setActiveId(null)}
              />
            );
          })}
        </BarChart>
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
              <div style={{ height: 400, width: '100%' }} >
                { 
                  drillDownData().map((row, index) => {
                  if (row["IfeUsage.uh"] > 0.00 ) {
                  let rowObject = new Object({id: (index + 1), "IfeUsage.id": row["IfeUsage.id"], "Flight.id": row["Flight.id"],"Media.mediaName": row["Media.mediaName"], "Media.genres": row["Media.genres"],"IfeUsage.uh": row["IfeUsage.uh"],"PassengerManifest.passengerName": row["PassengerManifest.passengerName"],"PassengerManifest.gender": row["PassengerManifest.gender"],"PassengerManifest.age": row["PassengerManifest.age"],"PassengerManifest.class": row["PassengerManifest.class"],"PassengerManifest.seatAssignment": row["PassengerManifest.seatAssignment"],"PassengerManifest.nationality": row["PassengerManifest.nationality"],"PassengerManifest.tripPurpose": row["PassengerManifest.tripPurpose"]});
                  rows.push(rowObject)  }     
              })}
              <DataGrid rows={rows} columns={columns} pageSize={5} checkboxSelection 
              />
              </div>
              }
          </div>
        </Fade>
       </Modal>
    </>
  );
}

export default UsageDemographics;
