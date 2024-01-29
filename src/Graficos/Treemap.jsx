import React from 'react';
import { Treemap } from '@ant-design/plots';
import { Empty } from 'antd';
import { useSelector } from 'react-redux';
import * as d3 from 'd3';

export default function TreeMapComponent({ data }) {
  // Crear un objeto para contar la cantidad de cada posición
  const positionsCount = {};
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);

  // Contar la cantidad de cada posición en los datos
  data.forEach(person => {
    const position = person.Position;
    if (position) {
      if (positionsCount[position]) {
        positionsCount[position] += 1;
      } else {
        positionsCount[position] = 1;
      }
    }
  });

  // Ordenar las posiciones por cantidad de apariciones
  const sortedPositions = Object.keys(positionsCount).sort(
    (a, b) => positionsCount[b] - positionsCount[a]
  );

  // Tomar las 10 posiciones más comunes
  const top10Positions = sortedPositions.slice(0, 10);

  // Filtrar los datos para obtener solo las top 10 posiciones
  const formattedData = {
    name: 'root',
    children: top10Positions.map(position => ({
      name: position,
      value: positionsCount[position],
    })),
  };

// Función para generar una escala de colores con diferente luminosidad
const generateColorScale = (mainColor, steps) => {
  const colorScale = d3
    .scaleLinear()
    .domain([0, steps - 1]) // Rango de valores para la escala
    .range([0, 1]); // Rango de salida

  return Array.from({ length: steps }, (_, i) => {
    const brightness = colorScale(i); // Obtener el valor de la escala para cada paso
    return d3.interpolateRgb(mainColor, 'white')(brightness); // Convertir el valor a un color
  });
};
  // Configuración del Treemap
  const config = {
    data: formattedData,
    colorField: 'name',
    color: generateColorScale(colorPrincipal,20),  };





  return (
  <div className='carta'>
    <div className='subtitulo-carta'>Top 10 principales puestos conectados</div>
    {!data || data.length === 0 ?
         <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
         :

    <Treemap {...config} />
  }
  </div>
  )
}

