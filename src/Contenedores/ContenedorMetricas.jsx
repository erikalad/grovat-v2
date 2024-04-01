import React from 'react';
import { Tabs } from 'antd';
import Metricas from './Metricas';
import Seguimientos from './Seguimientos';


const { TabPane } = Tabs;

const TabsMetricas = () => {

  return (
    <Tabs type="card">
      <>
        <TabPane tab="Métricas" key="metricas">
          <Metricas />
        </TabPane>
        {/* <TabPane tab="Seguimientos" key="seguimientos">
          <Seguimientos />
        </TabPane> */}
      </>
    </Tabs>
  );
};

export default TabsMetricas;
