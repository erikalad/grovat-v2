import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';
import { Empty } from 'antd';

export default function LineaMensajes({ data }) {
  const [lineChartData, setLineChartData] = useState([]);

  const updateChartData = () => {
    if (!data || data.length === 0) {
      setLineChartData([]);
      return;
    }

    // Cuenta los mensajes por fecha
    const messageCountsByDate = data.reduce((acc, item) => {
      const fecha = item.DATE.DATE;
      acc[fecha] = (acc[fecha] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(messageCountsByDate).map((fecha) => ({
      fecha,
      type: 'Mensajes',
      cantidad: messageCountsByDate[fecha],
    }));

    // Ordena los mensajes de más antiguo a más reciente
    const sortedChartData = chartData.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    setLineChartData(sortedChartData);
  };

  useEffect(() => {
    updateChartData();
  }, [data]);

  const config = {
    data: lineChartData,
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

