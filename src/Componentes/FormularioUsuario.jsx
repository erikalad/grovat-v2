import React, { useState } from 'react';
import { Drawer, Form, Input, Select, Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { addUser, fetchData } from '../Redux/actions';
import './styles.scss';

function FormularioUsuario({ clienteId, cerrarDrawer, drawerAbierto }) {
    const dispatch = useDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const { Option } = Select;
    const [newUserData, setNewUserData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        usuario: '',
        contraseña: '',
        type: '',
        activo: true, 
        clienteId: clienteId,
        logueado: false
      });

      const success = () => {
        messageApi.open({
          type: 'success',
          content: `Usuario creado`,
        });
      };

      const handleNewUserChange = (value, option) => {
        // Para los inputs normales, `option` no estará definido y `value` será el evento.
        // Para los Selects de Ant Design, `value` será el valor seleccionado.
        if (option) {
          const { name } = option;
          console.log(name) // Asegúrate de que tus Selects pasen un 'name' en el objeto option.
          setNewUserData({ ...newUserData, [name]: value });
        } else {
          const { name, value: inputValue } = value.target;
          setNewUserData({ ...newUserData, [name]: inputValue });
        }
      };


  const handleSaveNewUser = async () => {
    console.log(newUserData)
    // Aquí deberías agregar la lógica para guardar el nuevo usuario, por ejemplo:
    // Una llamada a una API o agregar el usuario al estado y luego cerrar el drawer
    try {
      // Simula guardar el usuario
      await dispatch(addUser(newUserData));
      success(); // Muestra un mensaje de éxito
      cerrarDrawer(); // Cierra el drawer
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
<Drawer
  title="Agregar nuevo usuario"
  width={720}
  onClose={cerrarDrawer}
  open={drawerAbierto}
  bodyStyle={{ paddingBottom: 80 }}
  footer={
    <div style={{ textAlign: 'right', }}>
      <Button onClick={cerrarDrawer} style={{ marginRight: 8 }}>
        Cancelar
      </Button>
      <Button onClick={handleSaveNewUser} type="primary">
        Guardar
      </Button>
    </div>
  }
>
{contextHolder}
<Form layout="vertical" >
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
<Form.Item name="type" label="Tipo" valuePropName="checked" >
  <Select name="type" onChange={handleNewUserChange} >
    <Option value="usuario" name="type">Usuario</Option>
    <Option value="cliente" name="type">Cliente</Option>
    <Option value="admin" name="type">Admin</Option>
  </Select>
</Form.Item>
<Form.Item name="activo" label="Activo" valuePropName="checked">
  <Select defaultValue={true} name="activo">
    <Option value="true" name="activo">Activo</Option>
    <Option value="false" name="activo">Inactivo</Option>
  </Select>
</Form.Item>
</Form>

</Drawer>
  );
}

export default FormularioUsuario;
