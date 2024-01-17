import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';

export default function LineaMensajes({ data }) {
  const [lineChartData, setLineChartData] = useState([]);
  const actualizacionCualificados = useSelector((state) => state.transfer);


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
    const sortedTotalMessagesChartData = totalMessagesChartData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    const sortedQualifiedMessagesChartData = qualifiedMessagesChartData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    setLineChartData([sortedTotalMessagesChartData, sortedQualifiedMessagesChartData]);
  };

  useEffect(() => {
    updateChartData();
  }, [data, actualizacionCualificados]);

  const config = {
    data: lineChartData.flat(),
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
