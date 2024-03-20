import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, Navigate, BrowserRouter, useParams, useNavigate } from 'react-router-dom';

import { Card, Layout, Tabs, TabsProps, Typography } from 'antd';

import 'antd/dist/reset.css';
import 'leaflet/dist/leaflet.css';
import '../../src/styles.css';

import { ChartConfigProvider } from '../../src';

import TestBarChart from './TestBarChart';
import TestHistogram from './TestHistogram';
import TestChoroplethMap from './TestChoroplethMap';
import TestPieChart from './TestPieChart';
import TestPointMap from './TestPointMap';

const items: TabsProps['items'] = [
  {
    key: 'bar',
    label: 'Chart: Bar',
    children: <TestBarChart />,
  },
  {
    key: 'histogram',
    label: 'Chart: Histogram',
    children: <TestHistogram />,
  },
  {
    key: 'pie',
    label: 'Chart: Pie',
    children: <TestPieChart />,
  },
  {
    key: 'choropleth',
    label: 'Map: Choropleth',
    children: <TestChoroplethMap />,
  },
  {
    key: 'points',
    label: 'Map: Points',
    children: <TestPointMap />,
  },
];

const RoutedApp = () => {
  const navigate = useNavigate();
  const { tab } = useParams();

  return (
    <Layout>
      <Layout.Content style={{ padding: 24, height: '100vh' }}>
        <Card>
          <Typography.Title level={1}>Bento Charts Test App</Typography.Title>
          <Tabs items={items} activeKey={tab} onChange={(key) => navigate(`/${key}`)} />
        </Card>
      </Layout.Content>
    </Layout>
  );
};

const BentoChartsTestApp = () => {
  return (
    <ChartConfigProvider Lng="en">
      <BrowserRouter>
        <Routes>
          <Route path="/:tab" element={<RoutedApp />} />
          <Route path="*" element={<Navigate to={`/${items[0].key}`} />} />
        </Routes>
      </BrowserRouter>
    </ChartConfigProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<BentoChartsTestApp />);
