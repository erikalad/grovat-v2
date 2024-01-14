import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';
import { Empty } from 'antd';

export default function Linea({ data,actualizacionCualificados }) {
  const [lineChartData, setLineChartData] = useState([]);

  const cualificadosData = localStorage.getItem('cualificadosData');
  const cualificados = cualificadosData ? JSON.parse(cualificadosData) : [];

  // Esta función se encarga de actualizar los datos del gráfico
  const updateChartData = () => {
    if (!data || data.length === 0) {
            setLineChartData([]);
            return;
          }
      
          const chartData = data.reduce((acc, item) => {
            const fecha = item['Connected On'];
            const firstName = item['First Name'];
            const lastName = item['Last Name'];
            const name = `${firstName} ${lastName}`;
            const cualificado = cualificados.find(cualificado => cualificado.name === name);
            const estaCualificado = cualificado ? cualificado.cualificados : false;
            const fechaIndex = acc.findIndex(data => data.fecha === fecha);
      
            if (fechaIndex !== -1) {
              acc[fechaIndex].totalConexiones += 1;
              if (estaCualificado) {
                acc[fechaIndex].cualificados += 1;
              }
            } else {
              acc.push({
                fecha,
                totalConexiones: 1,
                cualificados: estaCualificado ? 1 : 0,
              });
            }
      
            return acc;
          }, []).flatMap(item => [
            { fecha: item.fecha, type: 'Conexiones', value: item.totalConexiones },
            { fecha: item.fecha, type: 'Cualificados', value: item.cualificados },
          ]);
      
          setLineChartData(chartData);
          };

  useEffect(() => {
    updateChartData();
  }, [data, actualizacionCualificados]);
  


  const config = {
    data: lineChartData,
    xField: 'fecha',
    yField: 'value',
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
