// Importa useState y Select
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, Table, Tag, Alert, message, Spin } from 'antd';
import dayjs from 'dayjs';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getClientes, postFuncionalidades } from '../Redux/actions';

const { Option } = Select;
const TablaFuncionalidades = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm(); // Usar el hook useForm para acceder a las funciones del formulario
  const cliente = useSelector((state)=> state.clientes)
  const dispatch = useDispatch();
  const dateFormat = 'DD-MM-YYYY'; 
  const [messageApi, contextHolder] = message.useMessage();

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const success = (msj) => {
    messageApi.open({
      type: "success",
      content: msj,
    });
  };

  const disabledDate = (current) => {
    // Deshabilita los días anteriores a hoy
    return current && current < dayjs().startOf('day');
  };

  const onFinish = async (values) => {
    setIsLoading(true); // Activar el spinner de pantalla completa al enviar la funcionalidad

    const fechaSolicitud = values.dateTime.format('YYYY-MM-DD');
    const data = {
      clienteId: cliente.id_cliente,
      nombre: values.name,
      fechaSolicitud: fechaSolicitud,
      descripcion: values.description,
      prioridad: values.priority,
    };

    try {
      setOpen(false);
      await dispatch(postFuncionalidades(data));
      await dispatch(getClientes());
      success(`Funcionalidad enviada con éxito`);
      form.resetFields();
    } catch (error) {
      message.error("Error al enviar la funcionalidad");
    } finally {
      setIsLoading(false); // Desactivar el spinner de pantalla completa después de enviar la funcionalidad
    }
  };

  const getStatusTag = (funcionalidad) => {
    const { fechaInicio, fechaFin } = funcionalidad.status;
  
    if (!fechaInicio && !fechaFin) {
      return <Tag color="grey">Pendiente</Tag>;
    } else if (fechaInicio && !fechaFin) {
      return <Tag color="yellow">En proceso</Tag>;
    } else if (fechaInicio && fechaFin) {
      return <Tag color="green">Finalizado</Tag>;
    } else {
      return <Tag color="default">Estado desconocido</Tag>;
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
    ...(cliente?.plan === 'empresarial'
      ? [
          {
            title: 'Gratis',
            dataIndex: 'gratis',
            key: 'gratis',
            render: (gratis) => (gratis ? <Tag color="green">Gratis</Tag> : <Tag color="red">No Gratis</Tag>),
          },
        ]
      : []),
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
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />} style={{ marginBottom: 16 }}>
        Solicitar Funcionalidad
      </Button>

      {isLoading && <Spin size="large" />} {/* Mostrar el spinner de pantalla completa mientras se envía la funcionalidad */}

      {cliente?.funcionalidades && cliente?.funcionalidades.length > 0 ? (
        <Table columns={columns} dataSource={data} pagination={false} bordered scroll={{ x: 'max-content' }} />
      ) : (
        <Alert message="No hay funcionalidades solicitadas" type="info" />
      )}

      {cliente?.plan !== "emprendedor" &&
          <Alert
            message="Te escuchamos"
            description={`¿Pensas que le falta algo a la aplicación que puede potenciar tu analítica? Llena la solicitud de nueva funcionalidad. Recuerda que el precio para la nueva funcionalidad en el Plan ${cliente?.plan} es a partir de ${cliente?.plan === "startup" ? '300 USD' : '100 USD'}.`}
            type="info"
            showIcon
            style={{marginTop:"1rem"}}
          />
        }

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

      {cliente?.plan !== "emprendedor" &&
          <Alert
            message="Importante"
            description="Te vamos a estar contactando por correo electrónico una vez que mandes el formulario, para pedirte mas información de la funcionalidad si es necesario y evaluar la solicitud. Por favor verificá que en tu Perfil tengas el correo electrónico actualizado, sino indicar en la descripción a que correo electrónico comunicarnos. Muchas gracias."
            type="info"
            showIcon
            style={{marginTop:"1rem"}}
          />
        }
   
{contextHolder}
      </Drawer>
    </>
  );
};
export default TablaFuncionalidades;
