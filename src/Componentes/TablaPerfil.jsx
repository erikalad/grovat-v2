import React, { useState } from 'react';
import { Table, Input, Button, message, Tooltip, Spin } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import './styles.scss';

const { Column } = Table;

const TablaPerfil = () => {
  const [userData, setUserData] = useState([
    { key: '1', attribute: 'Nombre', information: 'John', editable: false },
    { key: '2', attribute: 'Apellido', information: 'Doe', editable: false },
    { key: '3', attribute: 'Correo Electrónico', information: 'john.doe@example.com', editable: false },
    { key: '4', attribute: 'Usuario', information: 'johndoe123', editable: false },
    { key: '5', attribute: 'Contraseña', information: '********', editable: false },
  ]);

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

  const handleSave = async (key) => {
    // Implementación del guardado
  };

  const showLoader = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
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
          render={(text, record) => (
            <Input
              value={text}
              disabled={!record.editable}
              onChange={(e) => handleInformationChange(e.target.value, record.key)}
            />
          )}
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
