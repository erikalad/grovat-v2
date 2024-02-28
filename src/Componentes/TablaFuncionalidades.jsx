// Importa useState y Select
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Table, Tag, Alert } from 'antd';
import dayjs from 'dayjs';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { postFuncionalidades } from '../Redux/actions';

const { Option } = Select;
const TablaFuncionalidades = () => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm(); // Usar el hook useForm para acceder a las funciones del formulario
  const cliente = useSelector((state)=> state.clientes)
  const dispatch = useDispatch();
  const dateFormat = 'DD-MM-YYYY'; 
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const disabledDate = (current) => {
    // Deshabilita los días anteriores a hoy
    return current && current < dayjs().startOf('day');
  };

  const onFinish = (values) => {
  
    // Formatear la fecha de solicitud a formato YYYY-MM-DD
    const fechaSolicitud = values.dateTime.format('YYYY-MM-DD');
  
    // Crear el objeto con los datos formateados
    const data = {
      clienteId: cliente.id_cliente,
      nombre: values.name,
      fechaSolicitud: fechaSolicitud,
      descripcion: values.description,
      prioridad: values.priority,
    };
  
  
    // Llamar a la acción postFuncionalidad con los datos formateados
    dispatch(postFuncionalidades(data));
  
    form.resetFields(); // Limpiar los campos del formulario después de enviar
  };

  const getStatusTag = (funcionalidad) => {
    if (!funcionalidad.fechaInicio) {
      return <Tag color="grey">Pendiente</Tag>;
    } else if (!funcionalidad.fechaFin) {
      return <Tag color="yellow">En proceso</Tag>;
    } else {
      return <Tag color="green">Finalizado</Tag>;
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Prioridad',
      dataIndex: 'prioridad',
      key: 'prioridad',
    },
    {
      title: 'Fecha de Solicitud',
      dataIndex: 'fechaSolicitud',
      key: 'fechaSolicitud',
    },
      // Agregar la columna "Gratis" solo si el plan del cliente es "empresarial"
      cliente?.plan === 'empresarial' && {
        title: 'Gratis',
        dataIndex: 'gratis',
        key: 'gratis',
        render: (gratis) => (gratis ? <Tag color="green">Gratis</Tag> : <Tag color="red">No Gratis</Tag>),
      },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => getStatusTag(record),
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
  ];

  const data = cliente?.funcionalidades.map((funcionalidad) => ({
    key: funcionalidad.id_funcionalidades,
    nombre: funcionalidad.nombre || '-',
    prioridad: funcionalidad.prioridad || '-',
    fechaSolicitud: funcionalidad.fechaSolicitud ? dayjs(funcionalidad.fechaSolicitud).format('DD-MM-YYYY') : '-',
    status: funcionalidad,
    descripcion: funcionalidad.descripcion || '-',
    gratis: funcionalidad.gratis
  }));
  
  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}   style={{
          marginBottom: 16,
        }}>
        Solicitar Funcionalidad
      </Button>
      
      {cliente?.funcionalidades && cliente?.funcionalidades.length > 0 ? (
        <Table columns={columns} dataSource={data} pagination={false} bordered scroll={{ x: 'max-content' }} />
      ) : (
        <Alert message="No hay funcionalidades solicitadas" type="info" />
      )}

      <Drawer
        title="Nueva funcionalidad"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancelar</Button>
            {cliente?.plan !== "empresarial" ?
               <Button onClick={() => form.submit()} type="primary" disabled>
                Enviar
               </Button>
                :
                <Button onClick={() => form.submit()} type="primary" >
                Enviar
            </Button>
          }
          </Space>
        }
      >
        <Form form={form} layout="vertical" requiredMark onFinish={onFinish} disabled={cliente?.plan !== "empresarial"}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Nombre"
                rules={[
                  {
                    required: true,
                    message: 'Por favor indicá un nombre a tu funcionalidad',
                  },
                ]}
              >
                <Input placeholder="Nombre Funcionalidad" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="Fecha Solicitud"
                rules={[
                  {
                    required: true,
                    message: 'Por favor indicá una fecha',
                  },
                ]}
              >
                <DatePicker
                className='date-picker'
                  format={dateFormat}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="priority"
                label="Prioridad"
                rules={[
                  {
                    required: true,
                    message: 'Por favor selecciona la prioridad',
                  },
                ]}
              >
                <Select placeholder="Selecciona la prioridad">
                  <Option value="alta">Alta</Option>
                  <Option value="media">Media</Option>
                  <Option value="baja">Baja</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          {/* Fin del selector de prioridad */}
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Descripción"
                rules={[
                  {
                    required: true,
                    message: 'Por favor indicá una descripción',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="Por favor indicá una descripción lo más completa posible" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

      {cliente?.plan === "emprendedor" &&
      <Alert
      message="Información importante"
      description="Solo pueden obtener una nueva funcionalidad los Planes Startup o Empresariales, recordá que el Plan Empresarial tiene una funcionalidad gratis incluida! Comunicate con nosotros para obtener un descuento en el Plan Empresarial!"
      type="info"
      showIcon
    />
   }

   

      </Drawer>
    </>
  );
};
export default TablaFuncionalidades;
