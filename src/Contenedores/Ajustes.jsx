import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import TablaCustomizacion from './../Componentes/TablaCustomizacion';
import TablaUsuarios from '../Componentes/TablaUsuarios';
import TablaPerfil from '../Componentes/TablaPerfil';
import TablaFuncionalidades from '../Componentes/TablaFuncionalidades';

const { TabPane } = Tabs;

const Ajustes = () => {
  const usuarioLogueado = localStorage.getItem("usuarioLogueado");
  
  return (
    <Tabs type="card">
      {usuarioLogueado.type !== "cliente" ?
      <>
      <TabPane tab="Customización" key="customizacion">
        <TablaCustomizacion />
      </TabPane>
      <TabPane tab="Funcionalidades" key="funcionalidades">
        <TablaFuncionalidades/>
      </TabPane>
      <TabPane tab="Usuarios" key="usuarios">
        <TablaUsuarios/>
      </TabPane>
      </>
      : null
      }
      <TabPane tab="Perfil" key="perfil">
        <TablaPerfil/>
      </TabPane>
    </Tabs>
  );
};

export default Ajustes;
