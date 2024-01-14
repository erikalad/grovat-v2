import React from 'react';
import { Treemap } from '@ant-design/plots';
import { Empty } from 'antd';

export default function TreeMapComponent({ data }) {
  // Crear un objeto para contar la cantidad de cada posición
  const positionsCount = {};

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

  // Configuración del Treemap
  const config = {
    data: formattedData,
    colorField: 'name',
    color: ['#0000FF', '#0000CC', '#000099', '#000066', '#000033', '#0000AA', '#000077', '#000044', '#000022', '#000011']
  };





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

