import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';

export default function Barra({ data, actualizacionCualificados }) {
  const storedCualificadosData = useSelector((state) => state.cualificadosData);
  const [graficoData, setGraficoData] = useState([]);
  const [cualificadosData, setCualificadosData] = useState([]);

  useEffect(() => {
    setCualificadosData(storedCualificadosData);

    if (!data || data.length === 0 || !storedCualificadosData) {
      setGraficoData([]);
      return;
    }

    const datosConCualificados = data.map((elemento) => {
      const encontrado = storedCualificadosData.find(
        (cualificado) => cualificado.name === elemento.To
      );

      if (encontrado) {
        return {
          ...elemento,
          position: encontrado.position,
          cualificados: encontrado.cualificados,
        };
      } else {
        return elemento;
      }
    });

    const conteoPorFecha = datosConCualificados.reduce((contador, elemento) => {
      const fecha = elemento.Fecha;

      if (!contador[fecha]) {
        contador[fecha] = { fecha, type: 'Invitaciones', value: 1 };
      } else {
        contador[fecha].value += 1;
      }

      if (elemento.cualificados) {
        if (!contador[fecha + '-cualificados']) {
          contador[fecha + '-cualificados'] = {
            fecha,
            type: 'Cualificados',
            value: 1,
          };
        } else {
          contador[fecha + '-cualificados'].value += 1;
        }
      }

      return contador;
    }, {});

    const datosGrafico = Object.values(conteoPorFecha);

    setGraficoData(datosGrafico);

  }, [data, actualizacionCualificados]);

  if (!data || data.length === 0 || !cualificadosData) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const config = {
    data: graficoData,
    xField: 'fecha',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
  };

  return <Column {...config} />;
}
