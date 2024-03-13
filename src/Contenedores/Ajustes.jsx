import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import TablaCustomizacion from './../Componentes/TablaCustomizacion';
import TablaUsuarios from '../Componentes/TablaUsuarios';
import TablaPerfil from '../Componentes/TablaPerfil';
import TablaFuncionalidades from '../Componentes/TablaFuncionalidades';
import TablaFuncionalidadesAdmin from '../Componentes/TablaFuncionalidadesAdmin';
import { useDispatch } from 'react-redux';
import { getFuncionalidades } from '../Redux/actions';
import TablaClientes from '../Componentes/TablaClientes';

const { TabPane } = Tabs;

const Ajustes = () => {
  const [usuarioLogueado, setUsuarioLogueado] = useState(JSON.parse(localStorage.getItem("usuarioLogueado")));
  const dispatch = useDispatch()

  useEffect(() => {
      const usuarioActual = JSON.parse(localStorage.getItem("usuarioLogueado"));
      if (usuarioActual?.type !== usuarioLogueado?.type) {
        setUsuarioLogueado(usuarioActual);
      }
      if(usuarioActual?.type === "admin"){
        dispatch(getFuncionalidades())
      }
  }, [usuarioLogueado]);

  return (
    <Tabs type="card">
      {usuarioLogueado?.type === "cliente" || usuarioLogueado?.type === "admin" ?
      <>
        <TabPane tab="Customización" key="customizacion">
          <TablaCustomizacion />
        </TabPane>
        {usuarioLogueado?.type === "admin" ?
        <>
        <TabPane tab="Funcionalidades" key="funcionalidades">
          <TablaFuncionalidadesAdmin/>
        </TabPane>
           <TabPane tab="Clientes" key="clientes">
           <TablaClientes/>
         </TabPane>
         </>
        :
        <TabPane tab="Funcionalidades" key="funcionalidades">
        <TablaFuncionalidades/>
      </TabPane>
        }
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
