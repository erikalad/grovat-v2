import React, { useEffect, useState } from 'react';
import { Transfer } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setCualificadosData, setPuestos } from '../Redux/actions';

export default function TransferCualificados({ data }) {
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const positions = [...new Set(data.map((item) => item.position))].filter((position) => position);

  const storedPuestos = JSON.parse(localStorage.getItem('puestos')) || { cualificados: [], noCualificados: positions };
  const [dataCualificada, setDataCualificada] = useState([]);

  const [noCualificados, setNoCualificados] = useState(storedPuestos.noCualificados);
  const [cualificados, setCualificados] = useState(storedPuestos.cualificados);
  const dispatch = useDispatch();
  const actualizacionCualificados = useSelector((state) => state.transfer);

  useEffect(() => {
    // Cargar datos iniciales
    const tempMockData = positions.map((position, index) => ({
      key: index.toString(),
      title: position,
      chosen: false,
    }));

    setMockData(tempMockData);

    const storedCualificados = storedPuestos.cualificados;
    const storedNoCualificados = storedPuestos.noCualificados;

    setNoCualificados(storedNoCualificados);
    setCualificados(storedCualificados);

    const initialTargetKeys = tempMockData
      .filter((item) => storedCualificados.includes(item.title))
      .map((item) => item.key);

    setTargetKeys(initialTargetKeys);
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
    // Actualizar datos cualificados en localStorage
    dispatch(setPuestos({ cualificados, noCualificados }));
    localStorage.setItem('puestos', JSON.stringify({ cualificados, noCualificados }));
    dispatch(setCualificadosData(dataCualificada))
    localStorage.setItem('cualificadosData', JSON.stringify(dataCualificada));
  }, [actualizacionCualificados]);

  const handleChange = (newTargetKeys, direction, moveKeys) => {
    setTargetKeys(newTargetKeys);

    const movedPositions = moveKeys.map((key) => mockData.find((item) => item.key === key).title);

    if (direction === 'left') {
      setNoCualificados([...noCualificados, ...movedPositions]);
      setCualificados(cualificados.filter((item) => !movedPositions.includes(item)));
    } else {
      setCualificados([...cualificados, ...movedPositions]);
      setNoCualificados(noCualificados.filter((item) => !movedPositions.includes(item)));
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
