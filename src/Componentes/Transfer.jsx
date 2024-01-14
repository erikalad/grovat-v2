import React, { useEffect, useState } from 'react';
import { Transfer } from 'antd';

export default function TransferCualificados({ data }) {
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const positions = [...new Set(data.map((item) => item.position))].filter(
    (position) => position
  );
  const [noCualificados, setNoCualificados] = useState(positions);
  const [cualificados, setCualificados] = useState([]);
  const [dataCualificada, setDataCualificada] = useState([]);


  // Obtener datos de localStorage
  const storedPuestos = JSON.parse(localStorage.getItem('puestos')) || { cualificados: [], noCualificados: positions };
  const cualificadosArray = storedPuestos.cualificados;

  
  useEffect(() => {
    setCualificados(storedPuestos.cualificados);
    setNoCualificados(storedPuestos.noCualificados);
  
    const tempMockData = positions.map((position, index) => ({
      key: index.toString(),
      title: position,
      chosen: false,
    }));
  
    setMockData(tempMockData);
    
    // Establecer las targetKeys basándose en los puestos cualificados
    const targetKeys = tempMockData
      .filter((item) => storedPuestos.cualificados.includes(item.title))
      .map((item) => item.key);
    setTargetKeys(targetKeys);
  }, [data]);
  
  useEffect(() => {
    // Iterar sobre los elementos de data
    const newData = data.map(item => {
      // Verificar si la posición está en el array de cualificados
      const estaCualificado = cualificados.includes(item.position);
  
      // Agregar la propiedad cualificados al objeto
      return {
        ...item,
        cualificados: estaCualificado,
      };
    });
    setDataCualificada(newData);
  }, [data, cualificados]);
  


  useEffect(() => {
    // Guardar los datos en localStorage cuando cambian
    localStorage.setItem('puestos', JSON.stringify({ cualificados, noCualificados }));
    localStorage.setItem('cualificadosData', JSON.stringify(dataCualificada));
  }, [cualificados, noCualificados, dataCualificada]);

  useEffect(() => {
    setCualificados(storedPuestos.cualificados);
    setNoCualificados(storedPuestos.noCualificados);

    const tempMockData = positions.map((position, index) => ({
      key: index.toString(),
      title: position,
      chosen: false,
    }));

    setMockData(tempMockData);
  }, [data]);

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);

    if (direction === 'left') {
      // Elementos movidos a la izquierda son "NO CUALIFICADOS"
      const noCualificadosKeys = moveKeys.map((key) => mockData.find((item) => item.key === key).title);
      setNoCualificados([...noCualificados, ...noCualificadosKeys]);

      // Quitar puestos cualificados que fueron movidos a la izquierda
      setCualificados(cualificados.filter((item) => !noCualificadosKeys.includes(item)));
    } else {
      // Elementos movidos a la derecha son "CUALIFICADOS"
      const cualificadosKeys = moveKeys.map((key) => mockData.find((item) => item.key === key).title);
      setCualificados([...cualificados, ...cualificadosKeys]);

      // Quitar puestos no cualificados que fueron movidos a la derecha
      setNoCualificados(noCualificados.filter((item) => !cualificadosKeys.includes(item)));
    }
  };


  return (
    <div>
    <Transfer
        dataSource={mockData}
        showSearch
        pagination
        listStyle={{
          width: 400,
          height: 500,
        }}
        operations={['Agregar', 'Quitar']}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={(item) => item.title}
        titles={['No cualificados', 'Cualificados']}
      />
    </div>
  );
}
