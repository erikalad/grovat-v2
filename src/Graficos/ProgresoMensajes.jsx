import React from 'react';
import { Progress, Space, Tooltip } from 'antd';
import { useSelector } from 'react-redux';
import 'dayjs/locale/es'; 
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);


const ProgresoMensajes = ({ data, conexiones }) => {
  const totalConexiones = conexiones.length || 1; // Manejar el caso en que invitaciones.length sea 0
  const fechasfiltros = useSelector(state => state.fechasfiltros);
  
  // Parsear fechas de filtro
  const fechaInicio = dayjs(fechasfiltros[0], 'DD/MM/YY');
  const fechaFin = dayjs(fechasfiltros[1], 'DD/MM/YY');

 // Filtrar mensajes dentro del rango de fechas y que tengan fechaConexion
 const mensajesEnRango = data.filter(item => {
  // Primero, verificar si el item tiene la propiedad 'fechaConexion'
  if (!item.fechaConexion) {
    return false; // Si no tiene 'fechaConexion', no incluir en el resultado
  }
  
  const fechaConexion = dayjs(item.fechaConexion, 'DD/MM/YYYY');
  return fechaConexion.isBetween(fechaInicio, fechaFin, null, '[]');
});

  const cantidadMensajesEnRango = mensajesEnRango.length;


  const totalMensajes = cantidadMensajesEnRango;
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);

  const porcentaje = isFinite(totalConexiones) ? Math.min((totalMensajes / totalConexiones) * 100, 100).toFixed(0) : 0;
  const twoColors = {
    '0%': colorPrincipal,
    '100%': colorSecundario,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 16,
      }}
    >
      <Space wrap style={{cursor:'pointer'}}>
      <Tooltip title={`El ${parseInt(porcentaje)}% de las conexiones fueron contactadas`}>
        <Progress type="dashboard" percent={parseInt(porcentaje)} strokeColor={twoColors} />
        </Tooltip>
      </Space>
    </div>
  );
};

export default ProgresoMensajes;

