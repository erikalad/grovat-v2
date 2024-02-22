import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import TablaCustomizacion from './../Componentes/TablaCustomizacion';
import TablaUsuarios from '../Componentes/TablaUsuarios';
import TablaPerfil from '../Componentes/TablaPerfil';
import TablaFuncionalidades from '../Componentes/TablaFuncionalidades';

const { TabPane } = Tabs;

const Ajustes = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(JSON.parse(localStorage.getItem("usuarioLogueado")));

  useEffect(() => {
    const interval = setInterval(() => {
      const usuarioActual = JSON.parse(localStorage.getItem("usuarioLogueado"));
      if (usuarioActual?.type !== usuarioLogueado?.type) {
        setUsuarioLogueado(usuarioActual);
      }
    }, 1000); // Verifica cada segundo

    return () => clearInterval(interval); // Limpieza al desmontar
  }, [usuarioLogueado]);

  return (
    <Tabs type="card">
      {usuarioLogueado?.type === "cliente" ?
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
