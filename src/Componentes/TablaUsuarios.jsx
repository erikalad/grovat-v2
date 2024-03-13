import React, { useState } from 'react';
import { Drawer, Form, Input, Select, Button, message, Tooltip, Table, Spin, Alert, Tag } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import './styles.scss';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, editUser, editUsuarioCliente, fetchData } from '../Redux/actions';
import { PlusOutlined } from '@ant-design/icons';
// import CargarExcel from './CargarExcel';

const { Option } = Select;

const TablaUsuarios = () => {
  const cliente = useSelector((state)=> state.clientes)
  const usuarios = useSelector((state) => state.usuarios);
  const [data, setData] = useState(usuarios);  
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(usuarios.length);
  const dispatch = useDispatch();

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [newUserData, setNewUserData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    usuario: '',
    contraseña: '',
    type: 'usuario', // Asumiendo un valor predeterminado, ajusta según sea necesario
    activo: true, // Asumiendo predeterminadamente activo
    clienteId: cliente?.id_cliente,
    logueado: false
  });

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };
  
  const onClose = () => {
    setDrawerVisible(false);
  };

 


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
    const activoBooleano = usuarioGuardado.activo === 'true' ? true : false;
    const usuarioParaGuardar = { ...usuarioGuardado, activo: activoBooleano };
  
    const updatedData = data.map((item) =>
      item.id_usuario === key ? { ...item, editable: false } : item
    );
  
    setData(updatedData);
    showLoader();
    try {
      await dispatch(editUsuarioCliente(usuarioParaGuardar));
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
    showDrawer();
         let maxUsersAllowed = 0;
      
      switch (cliente?.plan) {
        case 'emprendedor':
          maxUsersAllowed = 5;
          break;
        case 'startup':
          maxUsersAllowed = 10;
          break;
        case 'empresarial':
          maxUsersAllowed = 30;
          break;
        default:
          maxUsersAllowed = 0;
      }
    
      // Verificar si se supera el límite de usuarios permitidos
      if (data.length >= maxUsersAllowed) {
        message.error(`Se ha alcanzado el límite de usuarios para el plan "${cliente.plan}"`);
        return;
      }

      setCount(count + 1);
  };


    const handleUpgrade = () => {
      // Abrir URL externa en una nueva pestaña del navegador
      window.open('https://www.meicanalitycs.com/planesyprecios', '_blank');
    };

    const handleSaveNewUser = async () => {
      // Aquí deberías agregar la lógica para guardar el nuevo usuario, por ejemplo:
      // Una llamada a una API o agregar el usuario al estado y luego cerrar el drawer
      try {
        // Simula guardar el usuario
        await dispatch(addUser(newUserData));
        success(); // Muestra un mensaje de éxito
        onClose(); // Cierra el drawer
      const username = localStorage.getItem("username");
      const password = localStorage.getItem("password");
      // Asegúrate de que tanto username como password existen antes de llamar a fetchData
      if (username && password) {
        dispatch(fetchData(username, password))
      }
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
      }
    };


  return (
    <>
      {contextHolder}
      
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
          marginRight: 16
        }}
        icon={<PlusOutlined />} 
      >
        Agregar Usuario
      </Button>

      {/* {cliente.plan === 'emprendedor' && (
        <CargarExcel/>
      )} */}


      <Table dataSource={data} columns={columns} bordered pagination={false} scroll={{ x: 'max-content' }}/>
      <Spin spinning={loading} fullscreen />

      {cliente?.plan === 'emprendedor' && data.length >= 5 && (
        <Alert
          message="¡Upgrade!"
          description={`Has alcanzado el límite de usuarios para el plan "Emprendedor".`}
          type="info"
          action={
            <Button size="small" type="primary" onClick={handleUpgrade}>
              Upgrade
            </Button>
          }
          closable
          style={{
            marginTop: 16,
          }}
        />
      )}
      {cliente?.plan === 'startup' && data.length >= 10 && (
        <Alert
          message="¡Upgrade!"
          description={`Has alcanzado el límite de usuarios para el plan "Startup".`}
          type="info"
          action={
            <Button size="small" type="primary" onClick={handleUpgrade}>
              Upgrade
            </Button>
          }
          closable
          style={{
            marginTop: 16,
          }}
        />
      )}
      {cliente?.plan === 'empresarial' && data.length >= 30 && (
        <Alert
          message="¡Upgrade!"
          description={`Has alcanzado el límite de usuarios para el plan "Empresarial".`}
          type="info"
          action={
            <Button size="small" type="primary" onClick={handleUpgrade}>
              Upgrade
            </Button>
          }
          closable
          style={{
            marginTop: 16,
          }}
        />
      )}

<Drawer
  title="Agregar nuevo usuario"
  width={720}
  onClose={onClose}
  open={drawerVisible}
  bodyStyle={{ paddingBottom: 80 }}
  footer={
    <div style={{ textAlign: 'right', }}>
      <Button onClick={onClose} style={{ marginRight: 8 }}>
        Cancelar
      </Button>
      <Button onClick={handleSaveNewUser} type="primary">
        Guardar
      </Button>
    </div>
  }
>
<Form layout="vertical" hideRequiredMark>
    <Form.Item name="nombre" label="Nombre">
      <Input placeholder="Ingrese el nombre" name="nombre" onChange={handleNewUserChange} />
    </Form.Item>
    <Form.Item name="apellido" label="Apellido">
      <Input placeholder="Ingrese el apellido" name="apellido" onChange={handleNewUserChange} />
      </Form.Item>
      <Form.Item name="email" label="Email">
      <Input placeholder="Ingrese el email" name="email" onChange={handleNewUserChange} />
    </Form.Item>
<Form.Item name="usuario" label="Usuario">
  <Input placeholder="Ingrese el usuario" name="usuario" onChange={handleNewUserChange} />
</Form.Item>
<Form.Item name="contraseña" label="Contraseña">
  <Input.Password placeholder="Ingrese la contraseña" name="contraseña" onChange={handleNewUserChange} />
</Form.Item>
<Form.Item name="activo" label="Activo" valuePropName="checked">
  <Select defaultValue={true} onChange={value => setNewUserData({ ...newUserData, activo: value === "true" })}>
    <Option value="true">Activo</Option>
    <Option value="false">Inactivo</Option>
  </Select>
</Form.Item>
</Form>

</Drawer>


    </>

    
  );
};

export default TablaUsuarios;
