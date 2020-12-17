import React from 'react';
import {
  Dropdown, Menu
} from 'antd';

import {PictureOutlined, HeatMapOutlined, TableOutlined, BarChartOutlined, PieChartOutlined, AreaChartOutlined, LineChartOutlined, NumberOutlined, CaretDownOutlined} from '@ant-design/icons';

import styled from 'styled-components';

const StyledDropdownTrigger = styled.span`
  color: #43436B;
  cursor: pointer;
  margin-left: 6px;

  & > span {
    margin: 0 2px;
  }
`

const ChartTypes = [
  { name: 'line', title: 'Line', icon: LineChartOutlined },
  { name: 'area', title: 'Area', icon: AreaChartOutlined },
  { name: 'bar', title: 'Bar', icon: BarChartOutlined },
  { name: 'pie', title: 'Pie', icon: PieChartOutlined },
  { name: 'composed', title: 'Composed', icon: PictureOutlined },
  //{ name: 'heatmap', title: 'HeatMap', icon: HeatMapOutlined },
  { name: 'table', title: 'Table', icon: TableOutlined },
  { name: 'number', title: 'Number', icon: NumberOutlined }
];

const SelectChartType = ({ chartType, updateChartType }) => {
  const menu = (
    <Menu>
      {ChartTypes.map(m => (
        <Menu.Item key={m.title} onClick={() => updateChartType(m.name)}>
          <m.icon />
          &nbsp;{m.title}
        </Menu.Item>
      ))}
    </Menu>
  );

  const foundChartType = ChartTypes.find(t => t.name === chartType);
  return (
    <Dropdown overlay={menu} lacement="bottomLeft" trigger={['click']}>
    <StyledDropdownTrigger>
      <foundChartType.icon  />
      <span>{foundChartType.title}</span>
      <CaretDownOutlined />
    </StyledDropdownTrigger>
    </Dropdown>
  );
};

export default SelectChartType;