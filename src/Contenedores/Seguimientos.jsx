import React, { useEffect, useState } from 'react';
import { Table, Tag, Input, Select, Button } from 'antd';
import './styles.scss';
import { useSelector } from 'react-redux';

const { Search } = Input;

const ContactTable = () => {
  const dataMes = useSelector(state=> state.seguimiento)
  console.log(dataMes)
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueContactarValues, setUniqueContactarValues] = useState([]);

  useEffect(() => {
    if (dataMes && dataMes.length > 0) {
      const seguimientoData = dataMes.map(item => item.seguimiento);
      setFilteredData(seguimientoData);
      extractUniqueContactarValues(seguimientoData);
    }
  }, [dataMes]);

  const extractUniqueContactarValues = (data) => {
    const uniqueValues = new Set(['hoy', 'atrasado', '1 días', '2 días', "-"]);
    data.forEach(item => {
      for (let i = 1; i <= 4; i++) {
        const contactarKey = `contactarF${i}`;
        if (item[contactarKey]) {
          uniqueValues.add(item[contactarKey]);
        }
      }
    });
    setUniqueContactarValues(Array.from(uniqueValues));
  };

  // Datos de ejemplo
  // const data = [
  //   {
  //     key: '1',
  //     contacto:'Juan Pérez',
  //     link: 'https://www.linkedin.com/in/juanperez/',
  //     mensajeApertura: { enviado: true, contesto: false },
  //     followUp1: { enviado: true, contesto: true },
  //     contactarF1: 2,
  //     followUp2: { enviado: true, contesto: true },
  //     contactarF2: 1,
  //     followUp3: { enviado: false, contesto: false },
  //     contactarF3: 1,
  //     followUp4: { enviado: false, contesto: false },
  //     contactarF4: '-',
  //   },
  //   {
  //     key: '2',
  //     contacto: 'Emilia Gomez',
  //     link: 'https://www.linkedin.com/in/juanperez/',
  //     mensajeApertura: { enviado: true, contesto: true },
  //     followUp1: { enviado: true, contesto: false },
  //     contactarF1: 2,
  //     followUp2: { enviado: false, contesto: false },
  //     contactarF2: 2,
  //     followUp3: { enviado: false, contesto: false },
  //     contactarF3: 2,
  //     followUp4: { enviado: false, contesto: false },
  //     contactarF4: "-",
  //   },
  //   {
  //     key: '3',
  //     contacto: 'Emilia Gomez',
  //     link: 'https://www.linkedin.com/in/juanperez/',
  //     mensajeApertura: { enviado: true, contesto: true },
  //     followUp1: { enviado: true, contesto: false },
  //     contactarF1: 2,
  //     followUp2: { enviado: true, contesto: false },
  //     contactarF2: 2,
  //     followUp3: { enviado: true, contesto: true },
  //     contactarF3: 'Hoy',
  //     followUp4: { enviado: false, contesto: false },
  //     contactarF4: 'Hoy',
  //   },
  //   {
  //     key: '4',
  //     contacto: 'Emilia Gomez',
  //     link: 'https://www.linkedin.com/in/juanperez/',
  //     mensajeApertura: { enviado: true, contesto: true },
  //     followUp1: { enviado: false, contesto: false },
  //     contactarF1: "Atrasado",
  //     followUp2: { enviado: false, contesto: false },
  //     contactarF2: 2,
  //     followUp3: { enviado: false, contesto: false },
  //     contactarF3: 2,
  //     followUp4: { enviado: false, contesto: false },
  //     contactarF4: 2,
  //   },
  //   {
  //     key: '3',
  //     contacto: 'Emilia Gomez',
  //     link: 'https://www.linkedin.com/in/juanperez/',
  //     mensajeApertura: { enviado: true, contesto: true },
  //     followUp1: { enviado: true, contesto: false },
  //     contactarF1: 2,
  //     followUp2: { enviado: true, contesto: false },
  //     contactarF2: 2,
  //     followUp3: { enviado: true, contesto: true },
  //     contactarF3: 'Hoy',
  //     followUp4: { enviado: false, contesto: false },
  //     contactarF4: 'Hoy',
  //   },
  //   // Más entradas...
  // ];
  const [searchText, setSearchText] = useState('');
  const [openStatusFilter, setOpenStatusFilter] = useState('Todos');
  const [followUpFilters, setFollowUpFilters] = useState(['Todos', 'Todos', 'Todos', 'Todos']);

  const getColorForDays = (days) => {
    if (days === 'hoy') return 'green'; // Si es "Hoy", color verde
    if (days === 'atrasado') return 'red'; // Si es "Atrasado", color rojo
    if (days === 1) return 'yellow'; // Si es 1 día, color amarillo
    if (days === 2) return 'grey'; // Si son 2 días, color gris
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

  const getNextFollowUp = (record) => {
    let nextFollowUp = null;
    let daysLeft = null;
  
    // Buscar el próximo seguimiento pendiente
    for (let i = 1; i <= 4; i++) {
      const followUpKey = `followUp${i}`;
      const contactarKey = `contactarF${i}`;
  
      if (!record[followUpKey]?.enviado) {
        nextFollowUp = record[followUpKey];
        daysLeft = record[contactarKey];
        break;
      }
    }
  
    return { nextFollowUp, daysLeft };
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
      filters: [
        { text: 'Enviado', value: 'Enviado' },
        { text: 'Pendiente', value: 'Pendiente' },
        { text: 'Contestó', value: 'Contestó' },
        { text: 'No contestó', value: 'No contestó' },
      ],
      onFilter: (value, record) => {
        if (value === 'Enviado') {
          return record.mensajeApertura.enviado;
        } else if (value === 'Pendiente') {
          return !record.mensajeApertura.enviado;
        } else if (value === 'Contestó') {
          return record.mensajeApertura.contesto;
        } else if (value === 'No contestó') {
          return !record.mensajeApertura.contesto;
        }
        return true;
      },
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
        filters: [
          { text: 'Enviado', value: 'Enviado' },
          { text: 'Pendiente', value: 'Pendiente' },
        ],
        onFilter: (value, record) => {
          if (value === 'Enviado') {
            return record.mensajeApertura.enviado;
          } else if (value === 'Pendiente') {
            return !record.mensajeApertura.enviado;
          }
          return true;
        },
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
      key: 'contactar',
      filters: uniqueContactarValues.map(value => ({ text: value, value })),
      onFilter: (value, record) => {
        const lastContactar = Object.values(record).filter(val => {
          if (val === 'hoy' || val === 'atrasado' || val === '-') {
            return true;
          } else if (!isNaN(val)) {
            return `${val} días`; // Convertir números a la forma '1 días', '2 días', etc.
          }
          return false;
        }).pop();        return lastContactar === value;
      },
      render: (text, record) => {
        const { nextFollowUp, daysLeft } = getNextFollowUp(record);
        if (nextFollowUp && daysLeft !== '-') {
          const color = getColorForDays(daysLeft);
          console.log(daysLeft)
          const daysText = daysLeft === 'hoy' || daysLeft === 'atrasado' ? daysLeft : daysLeft === 1 ? `${daysLeft} día` : `${daysLeft} días`;
          return <Tag color={color}>{daysText}</Tag>;
        }
        return null;
      },
    }
  ];

  return (
    <>
      <div className="filters">
        <Search placeholder="Buscar por nombre de contacto" onSearch={handleSearch} value={searchText} onChange={e => setSearchText(e.target.value)} />
        <Button type="primary" onClick={clearFilters}>Borrar filtros</Button>
      </div>
      <Table columns={columns} dataSource={filteredData} />
    </>
  );
};

export default ContactTable;
