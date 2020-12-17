import React from "react";
import PropTypes from "prop-types";
import { useCubeQuery } from "@cubejs-client/react";
import { Spin, Row, Col, Statistic, Table } from "antd";
import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  ComposedChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import "./recharts-theme.less";
import moment from "moment";
import numeral from "numeral";

const numberFormatter = item => numeral(item).format("0,0");
const dateFormatter = item => moment(item).format("MMM DD, YY");
const colors = ["#7DB3FF", "#49457B", "#FF7C78", "#FFA233"];
const stackIds = ["a","b","c","d"];
const xAxisFormatter = (item) => {
  if (moment(item).isValid()) {
    return dateFormatter(item)
  } else {
    return item;
  }
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CartesianChart = ({ resultSet, children, ChartComponent }) => (
  <ResponsiveContainer width="100%" height={350}>
    <ChartComponent margin={{ left: 40 }} data={resultSet.chartPivot()}>
      <XAxis axisLine={false} tickLine={false} tickFormatter={xAxisFormatter} dataKey="x" minTickGap={20} />
      <YAxis axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
      <CartesianGrid vertical={false} />
      { children }
      <Legend />
      <Tooltip labelFormatter={dateFormatter} formatter={numberFormatter} />
    </ChartComponent>
  </ResponsiveContainer>
)

const stackedChartData = resultSet => {
  const data = resultSet
    .pivot()
    .map(({ xValues, yValuesArray }) =>
      yValuesArray.map(([yValues, m]) => ({
        x: resultSet.axisValuesString(xValues, ", "),
        color: resultSet.axisValuesString(yValues, ", "),
        measure: m && Number.parseFloat(m)
      }))
    )
    .reduce((a, b) => a.concat(b), []);
  return data;
};

const TypeToChartComponent = {
  line: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={LineChart}>
      {resultSet.seriesNames().map((series, i) => (
        <Line
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  bar: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={BarChart}>
      {resultSet.seriesNames().map((series, i) => (
        <Bar
          key={series.key}
          //stackId="a"
          stackId = {stackIds[i]}
          dataKey={series.key}
          name={series.title}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  composed: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={ComposedChart}>
      {resultSet.seriesNames().map((series, i) => {
       if (i===0) {
       return (
       <Bar
          key={series.key}
          stackId="a"
          //stackId = {stackIds[i]}
          barSize={20} 
          dataKey={series.key}
          name={series.title}
          fill={colors[i]}
        />
       )
       } else if (i ===1){
        return (
        <Line key={series.key} type="monotone" dataKey={series.key} name={series.title} stroke="#ff7300" />
        )
      } else if (i===2) {
        return (
        <Area key={series.key} type="monotone" dataKey={series.key} name={series.title} fill="#8884d8" stroke="#8884d8" />
        )
      }
      
      })}
    </CartesianChart>
  ),
  area: ({ resultSet }) => (
    <CartesianChart resultSet={resultSet} ChartComponent={AreaChart}>
      {resultSet.seriesNames().map((series, i) => (
        <Area
          key={series.key}
          stackId="a"
          dataKey={series.key}
          name={series.title}
          stroke={colors[i]}
          fill={colors[i]}
        />
      ))}
    </CartesianChart>
  ),
  pie: ({ resultSet }) => (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={resultSet.chartPivot()}
          nameKey="x"
          dataKey={resultSet.seriesNames()[0].key}
          //cx={200}
          //cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
        >
          {resultSet.chartPivot().map((e, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  ),
  number: ({ resultSet }) => (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{
        height: "100%"
      }}
    >
      <Col>
        {resultSet.seriesNames().map(s => (
          <Statistic value={resultSet.totalRow()[s.key]} />
        ))}
      </Col>
    </Row>
  ),
  table: ({ resultSet, pivotConfig }) => (
    <Table
      pagination={false}
      columns={resultSet.tableColumns(pivotConfig)}
      dataSource={resultSet.tablePivot(pivotConfig)}
    />
  )
};
const TypeToMemoChartComponent = Object.keys(TypeToChartComponent)
  .map(key => ({
    [key]: React.memo(TypeToChartComponent[key])
  }))
  .reduce((a, b) => ({ ...a, ...b }));

const renderChart = Component => ({ resultSet, error, pivotConfig }) =>
  (resultSet && (
    <Component resultSet={resultSet} pivotConfig={pivotConfig} />
  )) ||
  (error && error.toString()) || <Spin />;

const ChartRenderer = ({ vizState }) => {
  const { query, chartType, pivotConfig } = vizState;
  const component = TypeToMemoChartComponent[chartType];
  const renderProps = useCubeQuery(query);
  return component && renderChart(component)({ ...renderProps, pivotConfig });
};

ChartRenderer.propTypes = {
  vizState: PropTypes.object,
  cubejsApi: PropTypes.object
};
ChartRenderer.defaultProps = {
  vizState: {},
  cubejsApi: null
};
export default ChartRenderer;
