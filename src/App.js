import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Menu from "./Componentes/Menu"
import Login from "./Contenedores/Login";
import esES from 'antd/es/locale/es_ES'; // Importar el paquete de idioma español
import { ConfigProvider } from "antd";

function App() {

  const ProtectedRoute = ({ element }) => {
    const isLoggedIn = localStorage.getItem("username") && localStorage.getItem("password");
    return isLoggedIn ? element : <Navigate to="/" />;
  };

  return (
    <ConfigProvider locale={esES}>

<div className="App">
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
