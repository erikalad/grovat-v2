import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Select, Button, DatePicker } from 'antd';
import './styles.scss';
import { useSelector } from 'react-redux';
import Conversaciones from '../Componentes/Conversaciones';

const { Search } = Input;

const ContactTable = () => {
  const dataMes = useSelector(state=> state.seguimiento)
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueContactarValues, setUniqueContactarValues] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [startDate, setStartDate] = useState(null); // Estado para la fecha de inicio
  const [endDate, setEndDate] = useState(null); // Estado para la fecha de fin


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
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
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


  const handleSearch = (searchText) => {
    setSearchText(searchText);
    filterData(searchText, startDate, endDate);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterData(searchText, date, endDate);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    filterData(searchText, startDate, date);
  };


  const filterData = (searchText, startDate, endDate) => {
    let filtered = dataMes.filter(item => {
      const seguimiento = item.seguimiento; // Accede al seguimiento del elemento
      if (!seguimiento) return false; // Verifica si seguimiento es null
      const searchTextMatch = !searchText || (seguimiento.contacto && seguimiento.contacto.toLowerCase().includes(searchText.toLowerCase()));
      const startDateMatch = !startDate || item.conversacion.some(message => isDateInRange(parseDate(message.DATE.DATE), startDate, endDate));
      return searchTextMatch && startDateMatch;
    });
  
    const seguimientoData = filtered.map(item => item.seguimiento);
  
    setFilteredData(seguimientoData);
  };
  
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${month}/${day}/${year}`);
  };
  
  const isDateInRange = (messageDate, startDate, endDate) => {
    if (startDate && endDate) {
      return messageDate >= startDate && messageDate <= endDate;
    } else if (startDate) {
      return messageDate >= startDate;
    } else if (endDate) {
      return messageDate <= endDate;
    }
    return true;
  };
  
  

  const clearFilters = () => {
    setSearchText('');
    setStartDate(null);
    setEndDate(null);
    const seguimientoData = dataMes.map(item => item.seguimiento);
    setFilteredData(seguimientoData);
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
        <Search placeholder="Buscar por nombre de contacto" onSearch={handleSearch} value={searchText} onChange={e => setSearchText(e.target.value)} style={{width:"50%"}}/>
        <DatePicker.RangePicker value={[startDate, endDate]} onChange={([start, end]) => { handleStartDateChange(start); handleEndDateChange(end); }} />
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
