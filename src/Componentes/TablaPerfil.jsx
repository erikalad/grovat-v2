import React, { useState } from 'react';
import { Table, Input, Button, message, Tooltip, Spin } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import './styles.scss';
import { useDispatch } from 'react-redux';
import { editUser } from '../Redux/actions';

const { Column } = Table;

const TablaPerfil = () => {
  const userLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  const [userData, setUserData] = useState([
    { key: '1', attribute: 'Nombre', information: userLogueado.nombre, editable: false },
    { key: '2', attribute: 'Apellido', information: userLogueado.apellido, editable: false },
    { key: '3', attribute: 'Correo Electrónico', information: userLogueado.email, editable: false },
    { key: '4', attribute: 'Usuario', information: userLogueado.usuario, editable: false },
    { key: '5', attribute: 'Contraseña', information: userLogueado.contraseña, editable: false },
  ]);

  const dispatch = useDispatch(); 
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const success = (updatedData, key) => {
    messageApi.open({
      type: 'success',
      content: `${updatedData.find((item) => item.key === key).attribute} guardado`,
    });
  };

  const handleInformationChange = (value, key) => {
    setUserData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, information: value } : item
      )
    );
  };

  const handleEdit = (key) => {
    setUserData((prevData) =>
      prevData.map((item) =>
        item.key === key ? { ...item, editable: true } : item
      )
    );
  };
  
  const showLoader = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleSave = async (key) => {
    showLoader();
  
    try {
      // Obtener los datos actualizados del usuario
      const updatedUserData = userData.filter((item) => item.key === key)[0];
      const updatedAttributes = updatedUserData.attribute; // Atributos actualizados
      const updatedValues = updatedUserData.information; // Nuevos valores
  
      // Crear objeto con los datos actualizados
      const userActualizado = {
        nombre: updatedAttributes === 'Nombre' ? updatedValues : userData.find((item) => item.attribute === 'Nombre').information,
        apellido: updatedAttributes === 'Apellido' ? updatedValues : userData.find((item) => item.attribute === 'Apellido').information,
        email: updatedAttributes === 'Correo Electrónico' ? updatedValues : userData.find((item) => item.attribute === 'Correo Electrónico').information,
        usuario: updatedAttributes === 'Usuario' ? updatedValues : userData.find((item) => item.attribute === 'Usuario').information,
        contraseña: updatedAttributes === 'Contraseña' ? updatedValues : userData.find((item) => item.attribute === 'Contraseña').information,
      };
  
      // Envía la acción editUser con el objeto que contiene los datos actualizados del usuario
      await dispatch(editUser({ id: userLogueado.id_usuario, userActualizado }));
      success(userData, key);
    } catch (error) {
      console.error("Error al guardar:", error);
      messageApi.error("Error al guardar los cambios");
      // Manejar el error aquí
    } finally {
      setUserData((prevData) =>
        prevData.map((item) =>
          item.key === key ? { ...item, editable: false } : item
        )
      );
    }
  };
  

  return (
    <>
      {contextHolder}
      <Table dataSource={userData} pagination={false} bordered scroll={{ x: 'max-content' }}>
        <Column title="Atributo" dataIndex="attribute" key="attribute" />
        <Column
          title="Información"
          dataIndex="information"
          key="information"
          render={(text, record) => {
          if (record.attribute === 'Contraseña') {
              return (
                <Input.Password
                  value={text}
                  disabled={!record.editable}
                  onChange={(e) => handleInformationChange(e.target.value, record.key)}
                />
              );
            } else {
              return (
                <Input
                  value={text}
                  disabled={!record.editable}
                  onChange={(e) => handleInformationChange(e.target.value, record.key)}
                />
              );
            }
          }}
        />
        <Column
          title="Acción"
          key="action"
          render={(_, record) => (
            <span>
              {record.editable ? (
                <Tooltip title="Guardar">
                  <Button
                    className='btn-guardar'
                    shape="circle"
                    onClick={() => handleSave(record.key)}
                    icon={<SaveOutlined />}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Editar">
                  <Button
                    type="primary"
                    shape="circle"
                    onClick={() => handleEdit(record.key)}
                    icon={<EditOutlined />}
                  />
                </Tooltip>
              )}
            </span>
          )}
        />
      </Table>
      <Spin spinning={loading} fullscreen />
    </>
  );
};

export default TablaPerfil;
