import React from 'react';
import { Tabs } from 'antd';
import TablaCustomizacion from './../Componentes/TablaCustomizacion';
import TablaUsuarios from '../Componentes/TablaUsuarios';
import TablaPerfil from '../Componentes/TablaPerfil';

const { TabPane } = Tabs;

const Ajustes = () => {
  const onChange = (key) => {
  };

  return (
    <Tabs onChange={onChange} type="card">
      <TabPane tab="Customización" key="customizacion">
        <TablaCustomizacion />
      </TabPane>
      <TabPane tab="Usuarios" key="usuarios">
        <TablaUsuarios/>
      </TabPane>
      <TabPane tab="Perfil" key="perfil">
        <TablaPerfil/>
      </TabPane>
    </Tabs>
  );
};

export default Ajustes;
