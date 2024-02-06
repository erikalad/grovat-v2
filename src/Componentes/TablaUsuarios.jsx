import React, { useState } from 'react';
import { Table, Input, Button, message, Tooltip, Select, Spin, Tag } from 'antd';
import { CiEdit } from 'react-icons/ci';
import { TfiSave } from 'react-icons/tfi';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';

const { Option } = Select;

const TablaUsuarios = () => {
  const usuarios = useSelector((state) => state.usuarios);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(usuarios);
  const [count, setCount] = useState(usuarios.length);
  const dispatch = useDispatch();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: `Usuario guardado`,
    });
  };

  const handleFieldValueChange = (value, key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, fieldValue: value } : item
      )
    );
  };

  const handleEdit = (key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, editable: !item.editable } : item
      )
    );
  };

  const handleSave = async (key) => {
    const updatedData = data.map((item) =>
      item.key === key ? { ...item, editable: false } : item
    );

    setData(updatedData);
    showLoader();
    setTimeout(() => {
      success();
    }, 1500);

    setTimeout(() => {
    const editedItem = updatedData.find((item) => item.key === key);
    // if (editedItem) {
    //   dispatch(setCustomizaciones(editedItem.fieldName, editedItem.fieldValue));
    // }
    }, 2000);

  };

  const handleColorChange = (color, key) => {
    const hexColor = color?.toHexString();
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, fieldValue: hexColor } : item
      )
    );
  };

  const handleFontChange = (fontName, key) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, fieldValue: fontName } : item
      )
    );
  };


    const columns = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          key: 'nombre',
          render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.key)} /> : text,
        },
        {
          title: 'Apellido',
          dataIndex: 'apellido',
          key: 'apellido',
          render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.key)} /> : text,
        },
        {
          title: 'Email',
          dataIndex: 'email',
          key: 'email',
          render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.key)} /> : text,
        },
        {
          title: 'Usuario',
          dataIndex: 'usuario',
          key: 'usuario',
          render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.key)} /> : text,
        },
        {
          title: 'Contraseña',
          dataIndex: 'contraseña',
          key: 'contraseña',
          render: (text, record) => record.editable ? <Input value={text} onChange={(e) => handleFieldValueChange(e.target.value, record.key)} /> : text,
        },
        {
          title: 'Tipo',
          dataIndex: 'type',
          key: 'type',
          width: '10%',
          render: (text, record) => record.editable ? (
            <Select value={text} onChange={(value) => handleFieldValueChange(value, record.key)} style={{width:'100%'}}>
              <Option value="tipo1">Usuario</Option>
              <Option value="tipo2">Cliente</Option>
              <Option value="tipo2">Admin</Option>

            </Select>
          ) : text,
        },
        {
            title: 'Activo',
            dataIndex: 'activo',
            key: 'activo',
            width: '10%',
            render: (text, record) => record.editable ? (
              <Select value={text} onChange={(value) => handleFieldValueChange(value, record.key)} style={{width:'100%'}}>
                <Option value="activo">Activo</Option>
                <Option value="inactivo">Inactivo</Option>
              </Select>
            ) : (
              <Tag color={text === 'Activo' ? 'green' : 'red'}>{text}</Tag>
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
              <Button className='btn-guardar' shape="circle" onClick={() => handleSave(record.key)} icon={<TfiSave />} />
            </Tooltip>
          ) : (
            <Tooltip title="Editar">
              <Button type="primary" shape="circle" onClick={() => handleEdit(record.key)} icon={<CiEdit />} />
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
        key:count+1,
        nombre: "-",
        apellido: "-",
        email: "-",
        logueado: false,
        usuario: "-",
        contraseña: "-",
        type: "-",
        activo: "-",
        clienteId: "f88a4b0d-b9bd-46a3-a9a7-4bbcd1172b14"
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
      <Table dataSource={data} columns={columns} bordered pagination={false} />
      <Spin spinning={loading} fullscreen />
    </>
  );
};

export default TablaUsuarios;
