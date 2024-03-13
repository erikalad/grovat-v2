import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/plots';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';

export default function Linea({ data }) {
  const [lineChartData, setLineChartData] = useState([]);

  const cualificadosData = useSelector((state) => state.cualificadosData);
  const actualizacionCualificados = useSelector((state) => state.transfer);
  const cualificados = cualificadosData ? cualificadosData : [];
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);


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
      const cualificado = cualificados.find((cualificado) => cualificado.name === name);
      const estaCualificado = cualificado ? cualificado.cualificados : false;
      const fechaIndex = acc.findIndex((data) => data.fecha === fecha);

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
    }, []);

     // Ordena los datos de más antiguo a más reciente
     const sortedChartData = chartData.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateA - dateB;
    });

    // Convierte los datos en un formato compatible con el gráfico de línea
    const formattedChartData = sortedChartData.flatMap((item) => [
      { fecha: item.fecha, type: 'Conexiones', value: item.totalConexiones },
      { fecha: item.fecha, type: 'Cualificados', value: item.cualificados },
    ]);

    setLineChartData(formattedChartData);
  };

  useEffect(() => {
    updateChartData();
  }, [data, actualizacionCualificados]);

  const config = {
    data: lineChartData,
    color:[colorPrincipal, colorSecundario],
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
