import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Select, Button } from 'antd';
import './styles.scss';
import { useSelector } from 'react-redux';
import Conversaciones from '../Componentes/Conversaciones';

const { Search } = Input;

const ContactTable = () => {
  const dataMes = useSelector(state=> state.seguimiento)
  const fechas = useSelector(state => state.fechasfiltros);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueContactarValues, setUniqueContactarValues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openStatusFilter, setOpenStatusFilter] = useState('Todos');
  const [followUpFilters, setFollowUpFilters] = useState(['Todos', 'Todos', 'Todos', 'Todos']);

  useEffect(() => {
    if (dataMes && dataMes.length > 0) {
      const seguimientoData = dataMes.map(item => item.seguimiento);
      setFilteredData(seguimientoData);
      extractUniqueContactarValues(seguimientoData);
    }
  }, [dataMes]);
  
  const extractUniqueContactarValues = (data) => {
    const uniqueValues = new Set([]);
    data.forEach(item => {
      const contactar = item.contactar;
      if (contactar) {
        uniqueValues.add(contactar);
      }
    });
    setUniqueContactarValues(Array.from(uniqueValues));
  };


    // Define la función para manejar el cambio de filas expandidas
    const handleExpandedChange = (expandedRowKeys) => {
      setExpandedRowKeys(expandedRowKeys);
    };

    // Define la función para renderizar el contenido de la fila expandida
    const renderExpandedRow = (record) => {
      const matchingItem = dataMes.find(item => item.seguimiento.key === record.key);
      const conversacion = matchingItem ? matchingItem.conversacion : [];
      return (
        <div>
          <Conversaciones conversacion={conversacion} /> 
        </div>
      );
    };

  const getColorForDays = (days) => {
    if (days === 'hoy') return 'green'; // Si es "Hoy", color verde
    if (days === 'atrasado') return 'red'; // Si es "Atrasado", color rojo
    if (days === '1') return 'yellow'; // Si es 1 día, color amarillo
    if (days === '2') return 'grey'; // Si son 2 días, color gris
    return 'default'; // De lo contrario, color por defecto
  };

  const handleSearch = searchText => {
    setSearchText(searchText);
    filterData(searchText, openStatusFilter, followUpFilters);
  };


  const filterData = (searchText, openStatusFilter, followUpFilters) => {
    let filtered = filteredData.filter(item =>
      item.contacto.toLowerCase().includes(searchText.toLowerCase())
    );

    filtered = filtered.filter(item => {
      if (openStatusFilter === 'Todos') return true;
      return openStatusFilter === 'Enviado' ? item.mensajeApertura.enviado : !item.mensajeApertura.enviado;
    });

    followUpFilters.forEach((filter, index) => {
      if (filter !== 'Todos') {
        filtered = filtered.filter(item => {
          return filter === 'Enviado' ? item[`followUp${index + 1}`]?.enviado : !item[`followUp${index + 1}`]?.enviado;
        });
      }
    });

    setFilteredData(filtered);
  };

  const clearFilters = () => {
    setSearchText('');
    setOpenStatusFilter('Todos');
    setFollowUpFilters(['Todos', 'Todos', 'Todos', 'Todos']);
    setFilteredData(filteredData);
  };

  const columns = [
    {
      title: 'Contacto',
      dataIndex: 'contacto',
      key: 'contacto',
      render: text => text,
    },
    {
      title: 'Perfil Linkedin',
      dataIndex: 'link',
      key: 'link',
      render: link => <a href={link} target="_blank" rel="noopener noreferrer">Ver perfil</a>,
    },
    {
      title: 'Mensaje de Apertura',
      dataIndex: 'mensajeApertura',
      key: 'mensajeApertura',
      width: '15%',
      render: ({ enviado, contesto }) => (
        <div className='tags-seguimientos'>
          {enviado ? <Tag color='green'>Enviado</Tag> : <Tag color='volcano'>Pendiente</Tag>}
          {contesto ? <Tag color='blue'>Contestó</Tag> : enviado ? <Tag color='default'>No contestó</Tag> : null}
        </div>
      ),
    },
    ...Array.from({ length: 4 }).flatMap((_, index) => ([
      {
        title: `Follow Up ${index + 1}`,
        dataIndex: `followUp${index + 1}`,
        key: `followUp${index + 1}`,
        render: ({ enviado, contesto }, record) => {
          const prevKey = index === 0 ? 'mensajeApertura' : `followUp${index}`;
          const prevEnviado = record[prevKey]?.enviado;
          if (!prevEnviado) return '-';
          return (
            <div className='tags-seguimientos'>
              {enviado ? <Tag color='green'>Enviado</Tag> : <Tag color='volcano'>Pendiente</Tag>}
              {contesto ? <Tag color='blue'>Contestó</Tag> : enviado ? <Tag color='default'>No contestó</Tag> : null}
            </div>
          );
        },
      },
    ])),
    {
      title: 'Contactar',
      dataIndex: 'contactar',
      key: 'contactar',
      filters: uniqueContactarValues.map(value => ({ text: value, value })),
      onFilter: (value, record) => record.contactar === value,
      render: (text, record) => {
        const daysLeft = record.contactar;
        let displayText;
        if (daysLeft === '1') {
          displayText = '1 día';
        } else if (daysLeft === '2') {
          displayText = '2 días';
        } else {
          displayText = daysLeft;
        }
        const color = getColorForDays(daysLeft);
        return <Tag color={color}>{displayText}</Tag>;
      },
    }
  ];

  return (
    <>
      <div className="filters">
        <Search placeholder="Buscar por nombre de contacto" onSearch={handleSearch} value={searchText} onChange={e => setSearchText(e.target.value)} />
        <Button type="primary" onClick={clearFilters}>Borrar filtros</Button>
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        expandable={{
          expandedRowKeys: expandedRowKeys,
          onExpandedRowsChange: handleExpandedChange,
          expandedRowRender: renderExpandedRow
        }}
        className='table-prosp'
      />
    </>
  );
};

export default ContactTable;
