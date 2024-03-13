import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';

export default function LineaMensajes({ data }) {
  const [lineChartData, setLineChartData] = useState([]);
  const actualizacionCualificados = useSelector((state) => state.transfer);
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);


  const updateChartData = () => {
    if (!data || data.length === 0) {
      setLineChartData([]);
      return;
    }

    // Cuenta el total de mensajes y el total de mensajes cualificados por fecha
    const totalMessagesByDate = {};
    const qualifiedMessagesByDate = {};

    data.forEach((item) => {
      const fecha = item.DATE.DATE;

      totalMessagesByDate[fecha] = (totalMessagesByDate[fecha] || 0) + 1;

      if (item.cualificados) {
        qualifiedMessagesByDate[fecha] = (qualifiedMessagesByDate[fecha] || 0) + 1;
      }
    });

    // Formatea los datos para el gráfico
    const totalMessagesChartData = Object.keys(totalMessagesByDate).map((fecha) => ({
      fecha,
      type: 'Mensajes',
      cantidad: totalMessagesByDate[fecha],
    }));

    const qualifiedMessagesChartData = Object.keys(qualifiedMessagesByDate).map((fecha) => ({
      fecha,
      type: 'Cualificados',
      cantidad: qualifiedMessagesByDate[fecha],
    }));

// Ordena los mensajes de más antiguo a más reciente
const sortedTotalMessagesChartData = totalMessagesChartData.sort((a, b) => {
  const dateA = new Date(
    parseInt(a.fecha.substring(6, 10)),
    parseInt(a.fecha.substring(3, 5)) - 1,
    parseInt(a.fecha.substring(0, 2))
  );
  const dateB = new Date(
    parseInt(b.fecha.substring(6, 10)),
    parseInt(b.fecha.substring(3, 5)) - 1,
    parseInt(b.fecha.substring(0, 2))
  );
  return dateA - dateB;
});

const sortedQualifiedMessagesChartData = qualifiedMessagesChartData.sort((a, b) => {
  const dateA = new Date(
    parseInt(a.fecha.substring(6, 10)),
    parseInt(a.fecha.substring(3, 5)) - 1,
    parseInt(a.fecha.substring(0, 2))
  );
  const dateB = new Date(
    parseInt(b.fecha.substring(6, 10)),
    parseInt(b.fecha.substring(3, 5)) - 1,
    parseInt(b.fecha.substring(0, 2))
  );
  return dateA - dateB;
});

    setLineChartData([sortedTotalMessagesChartData, sortedQualifiedMessagesChartData]);
  };

  useEffect(() => {
    updateChartData();
  }, [data, actualizacionCualificados]);

  const config = {
    data: lineChartData.flat(),
    color:[colorPrincipal, colorSecundario],
    xField: 'fecha',
    yField: 'cantidad',
    seriesField: 'type',
    legend: {
      position: 'top',
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
  };

  if (!data || data.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <Line {...config} />;
}
