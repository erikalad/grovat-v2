import React, { useCallback, useEffect, useState } from 'react';
import { Select, Table, Tag, Button, Input, DatePicker } from 'antd';
import dayjs from 'dayjs';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { getFuncionalidades, patchFuncionalidades } from '../Redux/actions';
const { Option } = Select;
const { Search } = Input;

const TablaFuncionalidadesAdmin = () => {
  const funcionalidades = useSelector((state)=> state.funcionalidades)
  const [filtroClienteId, setFiltroClienteId] = useState(null);
  const [filtroPrioridad, setFiltroPrioridad] = useState(null);
  const [filtroFechaSolicitud, setFiltroFechaSolicitud] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState(null);
  const [cambiosStatus, setCambiosStatus] = useState([]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getFuncionalidades())
  },[loading])

  const handleStatusChange = (id, nuevoStatus, statusAnterior) => {
    const cambioExistenteIndex = cambiosStatus.findIndex(cambio => cambio.id_funcionalidad === id);
    if (cambioExistenteIndex >= 0) {
      const cambiosActualizados = [...cambiosStatus];
      cambiosActualizados[cambioExistenteIndex].status_nuevo = nuevoStatus;
      setCambiosStatus(cambiosActualizados);
    } else {
      setCambiosStatus(prev => [...prev, { id_funcionalidad: id, status_anterior: statusAnterior, status_nuevo: nuevoStatus }]);
    }
  };

  
  const getStatusTag = (funcionalidad) => {
    const handleChange = (nuevoStatus) => {
      handleStatusChange(funcionalidad.funcionalidadId, nuevoStatus, funcionalidad.status);
    };

    const defaultValue = !funcionalidad.fechaInicio && !funcionalidad.fechaFin ? "Pendiente" : (funcionalidad.fechaInicio && !funcionalidad.fechaFin ? "En proceso" : "Finalizado");
    return (
      <Select defaultValue={defaultValue} onChange={handleChange} style={{ width: "100%" }}>
        <Option value="Pendiente"><Tag color="grey">Pendiente</Tag></Option>
        <Option value="En proceso"><Tag color="yellow">En Proceso</Tag></Option>
        <Option value="Finalizado"><Tag color="green">Finalizado</Tag></Option>
      </Select>
    );
  };



  const columns = [
    {
      title: 'Cliente ID',
      dataIndex: 'clienteId',
      key: 'clienteId',
      filters: [...new Set(funcionalidades.map(funcionalidad => funcionalidad.clienteId))].map(clienteId => ({ text: clienteId, value: clienteId })),
      onFilter: (value, record) => record.clienteId === value,
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
      filters: [
        { text: 'Ninguno', value: null },
        { text: 'Alta', value: 'alta' },
        { text: 'Media', value: 'media' },
        { text: 'Baja', value: 'baja' },
      ],
      onFilter: (value, record) => record.prioridad === value || value === null,
    },
    {
      title: 'Fecha de Solicitud',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud',
    },
    {
      title: 'Gratis',
      dataIndex: 'gratis',
      key: 'gratis',
      render: (gratis) => (gratis ? <Tag color="green">Gratis</Tag> : <Tag color="red">No Gratis</Tag>),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        return getStatusTag(record);
      },      filters: [
        { text: 'Ninguno', value: null },
        { text: 'Pendiente', value: 'Pendiente' },
        { text: 'En Proceso', value: 'En proceso' },
        { text: 'Finalizado', value: 'Finalizado' },
      ],
      onFilter: (value, record) => record.status === value || value === null,
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ];

  const data = [];
  funcionalidades?.forEach((item) => {
    const clienteId = item.clienteId;
    item.funcionalidades.forEach((funcionalidad) => {
      data.push({
        key: funcionalidad.id_funcionalidades,
        clienteId: clienteId,
        fechaInicio: funcionalidad.fechaInicio,
        fechaFin: funcionalidad.fechafin,
        funcionalidadId: funcionalidad.id_funcionalidades,
        nombre: funcionalidad.nombre || '-',
        prioridad: funcionalidad.prioridad || '-',
        fechaSolicitud: funcionalidad.fechaSolicitud ? dayjs(funcionalidad.fechaSolicitud).format('DD-MM-YYYY') : '-',
        status: getStatusTag(funcionalidad).props.defaultValue,
        descripcion: funcionalidad.descripcion || '-',
        gratis: funcionalidad.gratis,
      });
    });
  });

  const clearFilters = () => {
    setFiltroClienteId(null);
    setFiltroPrioridad(null);
    setFiltroFechaSolicitud(null);
    setFiltroStatus(null);
  };
  

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Funcionalidades");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'funcionalidades.xlsx');
  };

  const enviarCambiosStatus = useCallback(async () => {
    for (const cambio of cambiosStatus) {
      let campos = {};
      const hoy = dayjs().format('YYYY-MM-DD');

      switch (cambio.status_anterior) {
        case "Pendiente":
          if (cambio.status_nuevo === "En proceso") {
            campos = { fechaInicio: hoy};
          } else if (cambio.status_nuevo === "Finalizado") {
            campos = { fechaInicio: hoy, fechaFin: hoy };
          }
          break;
        case "En proceso":
          if (cambio.status_nuevo === "Finalizado") {
            campos = { fechaFin: hoy };
          }
          break;
      }

      if (Object.keys(campos).length > 0) {
        setLoading(!loading)
        await dispatch(patchFuncionalidades(campos, cambio.id_funcionalidad));
      }
    }
  }, [cambiosStatus, dispatch]);

  
  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <Search placeholder="Buscar por Cliente ID" onSearch={value => setFiltroClienteId(value)} style={{ width: 200, marginRight: 8 }} />
        <Select defaultValue="Prioridad" style={{ width: 120, marginRight: 8 }} onChange={value => setFiltroPrioridad(value)}>
          <Option value={null}>Ninguno</Option>
          <Option value="alta">Alta</Option>
          <Option value="media">Media</Option>
          <Option value="baja">Baja</Option>
        </Select>
        <DatePicker placeholder="Seleccionar fecha" style={{ marginRight: 8 }} onChange={date => setFiltroFechaSolicitud(date ? date.format('DD-MM-YYYY') : null)} />        
        <Select defaultValue="Status" style={{ width: 120 }} onChange={value => setFiltroStatus(value)}>
          <Option value={null}>Ninguno</Option>
          <Option value="Pendiente">Pendiente</Option>
          <Option value="En proceso">En Proceso</Option>
          <Option value="Finalizado">Finalizado</Option>
        </Select>
        <Button onClick={clearFilters}>Borrar Filtros</Button>
        <Button onClick={exportToExcel} style={{ marginLeft: 8 }}>Exportar a Excel</Button>
      </div>
      <Table columns={columns} dataSource={data.filter(item => {
        return (!filtroClienteId || item.clienteId.toLowerCase().includes(filtroClienteId.toLowerCase())) &&
          (!filtroPrioridad || item.prioridad === filtroPrioridad) &&
          (!filtroFechaSolicitud || item.fechaSolicitud.toLowerCase().includes(filtroFechaSolicitud.toLowerCase())) &&
          (!filtroStatus || item.status === filtroStatus);
      })} pagination={false} bordered scroll={{ x: 'max-content' }} />
 <Button onClick={enviarCambiosStatus} type="primary" disabled={!cambiosStatus.length}>Enviar Cambios</Button>
    </>
  );
};

export default TablaFuncionalidadesAdmin;
