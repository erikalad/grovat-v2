import React, { useEffect, useState } from "react";
import { Card, Statistic, Tooltip } from "antd";
import "./styles.scss";
import 'dayjs/locale/es'; 
import { useSelector } from "react-redux";
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { IoIosInformationCircleOutline } from "react-icons/io";
dayjs.extend(isBetween);


function EstadisticasMensajes({ data }) {
  const cantidadMensajes = data.length;
  const fechasfiltros = useSelector(state => state.fechasfiltros);
  const [mensajesEnRango, setMensajesEnRango] = useState([]);


useEffect(() => {
    // Asegúrate de especificar el formato exacto de tus fechas, incluido el año de dos dígitos
    const fechaInicio = dayjs(fechasfiltros[0], 'DD/MM/YY');
    const fechaFin = dayjs(fechasfiltros[1], 'DD/MM/YY');
    

    const filtrados = data.filter(item => {
      if (!item.fechaConexion) return false;
      // También aquí asegúrate de que el formato coincide con cómo esperas que vengan las fechas
      const fechaConexion = dayjs(item.fechaConexion, 'DD/MM/YYYY');
      return fechaConexion.isBetween(fechaInicio, fechaFin, null, '[]');
    });

    setMensajesEnRango(filtrados);
}, [fechasfiltros, data]);


  const cantidadMensajesEnRango = mensajesEnRango.length;


  return (
    <div className="contenedor-estadisticas">
      <Card bordered={false} >
        
        <div className="contenedor-estadisticas">
        <Statistic title="Conversaciones nuevas totales" value={cantidadMensajes} precision={0} />
        <Tooltip title="Mensajes nuevos de apertura totales enviados en este rango de fechas, sin importar cuando aceptó la invitación">
        <IoIosInformationCircleOutline/>
        </Tooltip>
        </div>
       
       
       
        <div className="contenedor-estadisticas">
        <Statistic title="Conversaciones nuevas conexiones" value={cantidadMensajesEnRango} precision={0}  />
        <Tooltip title="Mensajes nuevos de apertura enviados a las personas que aceptaron la invitación en este rango de fechas">
        <IoIosInformationCircleOutline/>
        </Tooltip>
        </div>
      </Card>

    </div>
  );
}

export default EstadisticasMensajes;
