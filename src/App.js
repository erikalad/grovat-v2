import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";
import Menu from "./Componentes/Menu"
import Login from "./Contenedores/Login";
import esES from 'antd/es/locale/es_ES'; // Importar el paquete de idioma español
import { ConfigProvider } from "antd";
import { useSelector } from "react-redux";

function App() {
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);
  const font = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Tipo de Letra')?.fieldValue);

  useEffect(() => {

      document.documentElement.style.setProperty('--color-principal', colorPrincipal);
      document.documentElement.style.setProperty('--color-secundario', colorSecundario);
      document.documentElement.style.setProperty('--font', font);
  
  }, [colorPrincipal, colorSecundario,font]);

  const ProtectedRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem("username") && localStorage.getItem("password");
    return isLoggedIn ? element : <Navigate to="/" />;
  };


  return (
    <ConfigProvider locale={esES}>

<div className="App" data-color-principal={colorPrincipal}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={<Menu />}
            />
          }
        />
      </Routes>
    </div>
    </ConfigProvider>
  );
}

export default App;
