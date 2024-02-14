import React, { useState } from 'react';
import { Table, Input, Button, message, Tooltip, Select, Spin, Tag } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { addUser } from '../Redux/actions';

const { Option } = Select;

const TablaUsuarios = () => {
  const cliente = useSelector((state)=> state.clientes)
  const usuarios = useSelector((state) => state.usuarios);
  const usuariosTipoUsuario = usuarios.filter(user => user.type === 'usuario');
  const [data, setData] = useState(usuariosTipoUsuario);  
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(usuarios.length);
  const dispatch = useDispatch();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: `Usuario guardado`,
    });
  };

  const handleFieldValueChange = (value, key, fieldName) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id_usuario === key ? { ...item, [fieldName]: value } : item
      )
    );
  };

  const handleEdit = (key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id_usuario === key ? { ...item, editable: !item.editable } : item
      )
    );
  };


  const handleSave = async (key) => {
    const usuarioGuardado = data.find(item => item.id_usuario === key);
    
    // Convertir el valor de 'activo' a booleano
    const activoBooleano = usuarioGuardado.activo === 'Activo' ? true : false;
    const usuarioParaGuardar = { ...usuarioGuardado, activo: activoBooleano };
  
    const updatedData = data.map((item) =>
      item.id_usuario === key ? { ...item, editable: false } : item
    );
  
    setData(updatedData);
    showLoader();
    
    try {
      await dispatch(addUser(usuarioParaGuardar));
      success();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };
  
  

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.id_usuario, 'nombre')} /> : text,
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
      render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.id_usuario, 'apellido')} /> : text,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.id_usuario, 'email')} /> : text,
    },
    {
      title: 'Usuario',
      dataIndex: 'usuario',
      key: 'usuario',
      render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.id_usuario, 'usuario')} /> : text,
    },
    {
      title: 'Contraseña',
      dataIndex: 'contraseña',
      key: 'contraseña',
      render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.id_usuario, 'contraseña')} /> : text,
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
      width: '10%',
      render: (text, record) => record.editable ? (
        <Select value={text} onChange={(value) => handleFieldValueChange(value, record.id_usuario, 'type')} style={{width:'100%'}}>
          <Option value="usuario">Usuario</Option>
          <Option value="cliente">Cliente</Option>
          <Option value="admin">Admin</Option>
        </Select>
      ) : text,
    },
    {
      title: 'Activo',
      dataIndex: 'activo',
      key: 'activo',
      width: '10%',
      render: (text, record) => record.editable ? (
        <Select value={text} onChange={(value) => handleFieldValueChange(value, record.id_usuario, 'activo')} style={{width:'100%'}}>
          <Option value="true">Activo</Option>
          <Option value="false">Inactivo</Option>
        </Select>
      ) : (
        <Tag color={text ? 'green' : 'red'}>{text ? 'Activo' : 'Inactivo'}</Tag>
      ),
    },
    {
      title: 'Acción',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        <span>
          {record.editable ? (
            <Tooltip title="Guardar">
              <Button className='btn-guardar' shape="circle" onClick={() => handleSave(record.id_usuario)} icon={<SaveOutlined />} />
            </Tooltip>
          ) : (
            <Tooltip title="Editar">
              <Button type="primary" shape="circle" onClick={() => handleEdit(record.id_usuario)} icon={<EditOutlined />} />
            </Tooltip>
          )}
        </span>
      ),
    },
  ];

  const showLoader = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleAdd = () => {
    const newData = {
      nombre: "-",
      apellido: "-",
      email: "-",
      logueado: false,
      usuario: "-",
      contraseña: "-",
      type: "-",
      activo: "-",
      clienteId: cliente.id_cliente
    }
    setData([...data, newData]);
    setCount(count + 1);
  };

  return (
    <>
      {contextHolder}
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Agregar Usuario
      </Button>
      <Table dataSource={data} columns={columns} bordered pagination={false} scroll={{ x: 'max-content' }}/>
      <Spin spinning={loading} fullscreen />
    </>
  );
};

export default TablaUsuarios;
