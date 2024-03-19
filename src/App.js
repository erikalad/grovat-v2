import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";
import Menu from "./Componentes/Menu";
import Login from "./Contenedores/Login";
import Reporteria from "./Contenedores/Reporteria"; // Importa el componente Reporteria
import esES from 'antd/es/locale/es_ES';
import { ConfigProvider, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, getClientes } from "./Redux/actions";

function App() {
  const [loadingStyles, setLoadingStyles] = useState(true);
  const loadingClientes = useSelector(state => state.loadingClientes);
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);
  const font = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Tipo de Letra')?.fieldValue);
  const logo = useSelector(state => state.customizaciones.find(item => item.fieldName === 'URL del Logo')?.fieldValue);
  const nombreEmpresa = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Nombre de la Empresa')?.fieldValue);
  const cliente = useSelector(state => state.clientes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cliente === null) {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      if (username && password) {
        dispatch(fetchData(username, password));
      }
    }
    dispatch(getClientes());
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-principal', colorPrincipal);
    document.documentElement.style.setProperty('--color-secundario', colorSecundario);
    document.documentElement.style.setProperty('--font', font);
    localStorage.setItem('logoUrl', logo);
    localStorage.setItem('pageTitle', nombreEmpresa);
    setLoadingStyles(false); 
  }, [colorPrincipal, colorSecundario, font, logo, nombreEmpresa]);

  const ProtectedRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem("username") && localStorage.getItem("password");
    return isLoggedIn ? element : <Navigate to="/" />;
  };

  return (
    <ConfigProvider locale={esES} theme={{token:{colorPrimary: colorPrincipal}}}>
      {loadingStyles || loadingClientes ? (
        <Spin spinning={true} fullscreen />
      ) : (
        <div className="App" data-color-principal={colorPrincipal}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  element={<Menu/>}
                />
              }
            />
            <Route
              path="/reporteria" // Nueva ruta para el componente Reporteria
              element={
                <ProtectedRoute
                  element={<Reporteria />}
                />
              }
            />
          </Routes>
        </div>
      )}
    </ConfigProvider>
  );
}

export default App;
