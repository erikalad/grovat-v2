import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.scss";
import Menu from "./Componentes/Menu"
import Login from "./Contenedores/Login";
import esES from 'antd/es/locale/es_ES'; // Importar el paquete de idioma español
import { ConfigProvider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, getClientes } from "./Redux/actions";

function App() {
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);
  const font = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Tipo de Letra')?.fieldValue);
  const cliente = useSelector(state => state.clientes)
  const dispatch = useDispatch()

  useEffect(() => {
    // Asumiendo que cliente es un array, verifica si está vacío
    if (cliente === null) {
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      // Asegúrate de que tanto username como password existen antes de llamar a fetchData
      if (username && password) {
        dispatch(fetchData(username, password))
      }
    }
    dispatch(getClientes())
  }, [cliente]);


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
    <ConfigProvider locale={esES} theme={{token:{colorPrimary: colorPrincipal}}}>

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
