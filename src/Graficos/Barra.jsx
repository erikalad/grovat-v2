import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/plots';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';

export default function Barra({ data }) {
  const storedCualificadosData = useSelector((state) => state.cualificadosData);
  const actualizacionCualificados = useSelector((state) => state.transfer);
  const [graficoData, setGraficoData] = useState([]);
  const [cualificadosData, setCualificadosData] = useState(storedCualificadosData);
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);


  useEffect(() => {

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

    // Ordena los datos de más antiguo a más reciente
      const sortedDatosGrafico = datosGrafico.sort((a, b) => {
        const dateA = new Date(a.fecha);
        const dateB = new Date(b.fecha);
        return dateA - dateB;
      });

    setGraficoData(sortedDatosGrafico);

  }, [data, actualizacionCualificados]);

  if (!data || data.length === 0 || !cualificadosData) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  const config = {
    data: graficoData,
    color: [colorPrincipal, colorSecundario],
    xField: 'fecha',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
  };

  return <Column {...config} />;
}
