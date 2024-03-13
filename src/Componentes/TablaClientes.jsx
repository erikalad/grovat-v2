import React, { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Select,
  Table,
  Tag,
  Alert,
  message,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import { getClientes, patchCliente, postCliente } from "../Redux/actions";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma que desees usar (en este caso, español)
import FormularioUsuario from "./FormularioUsuario";



const { Option } = Select;

const TablaClientes = () => {
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form] = Form.useForm();
  const clientes = useSelector((state) => state.allClientes);
  const dispatch = useDispatch();
  const dateFormat = "DD-MM-YYYY";
  const [messageApi, contextHolder] = message.useMessage();
  const [editedClientId, setEditedClientId] = useState(null);
  const [searchText, setSearchText] = useState(""); // Definir el estado para el texto de búsqueda
  const [searchedColumn, setSearchedColumn] = useState(""); // Definir el estado para la columna de búsqueda
  const [drawerAbierto, setDrawerAbierto] = useState(false);


  const success = (msj) => {
    messageApi.open({
      type: "success",
      content: msj,
    });
  };

  const onCloseChange = () => {
    setOpenEdit(false);
  };

 // Definir la función de búsqueda para la columna de Email
const handleEmailSearch = (selectedKeys, confirm, dataIndex) => {
  confirm(); // Confirma la selección del filtro
  setSearchText(selectedKeys[0]); // Establece el texto de búsqueda
  setSearchedColumn(dataIndex); // Establece la columna por la que se está buscando
};

// Renderizar el ícono de búsqueda y la caja de texto para la columna de Email
const emailColumnSearchIcon = (filtered, dataIndex) => (
  <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleToggleEstadoCliente = async (cliente) => {
    try {
      const nuevoEstado = !cliente.activo;

      const data = {
        campos: {
          email: cliente.email,
          activo: nuevoEstado,
        },
        id: cliente.key,
      };

      await dispatch(patchCliente(data.campos, data.id));
      await dispatch(getClientes());
      success(
        `Cliente ${nuevoEstado ? "habilitado" : "deshabilitado"} correctamente`
      );
    } catch (error) {
      message.error("Error al actualizar el estado del cliente");
    }
  };


  const handleEdit = (cliente) => {    
    const { key, fechaAlta, fechaVencimiento, ...rest } = cliente;
    setEditedClientId(key);
    const fechaAltaFormatted = fechaAlta ? moment(fechaAlta, 'YYYY-MM-DD') : null;
    const fechaVencimientoFormatted = fechaVencimiento ? moment(fechaVencimiento, 'YYYY-MM-DD') : null;
    form.setFieldsValue({ ...rest, fechaAlta: fechaAltaFormatted, fechaVencimiento: fechaVencimientoFormatted });
    setOpenEdit(true);
  };

  const handleEditCliente = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        plan: values.plan,
      };

      const id = editedClientId;

      await dispatch(patchCliente(data, id));
      await dispatch(getClientes());
      success("Cliente editado correctamente");
      setOpenEdit(false);
    } catch (error) {
      message.error("Error al editar el cliente");
    }
  };

  const handleClearEmailSearch = (clearFilters) => {
    clearFilters(); // Borra los filtros aplicados
    setSearchText(""); // Establece el texto de búsqueda en vacío
  };

  const onFinish = async (values) => {
    const fechaAlta = values.fechaAlta.format("YYYY-MM-DD");
    const fechaVencimiento = values.fechaVencimiento.format("YYYY-MM-DD");
    const data = {
      nombre: values.nombre,
      apellido: values.apellido,
      email: values.email,
      fechaAlta: fechaAlta,
      fechaVencimiento: fechaVencimiento,
      plan: values.plan,
    };

    try {
      await dispatch(postCliente(data));
      await dispatch(getClientes());
      success("Cliente agregado correctamente");
      form.resetFields();
      setOpen(false);
    } catch (error) {
      message.error("Error al agregar el cliente");
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: "Apellido",
      dataIndex: "apellido",
      key: "apellido",
      sorter: (a, b) => a.apellido.localeCompare(b.apellido),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Buscar email"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleEmailSearch(selectedKeys, confirm, "email")
            }
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleEmailSearch(selectedKeys, confirm, "email")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Buscar
          </Button>
          <Button  onClick={() => handleClearEmailSearch(clearFilters)} size="small" style={{ width: 90 }}>
            Borrar Filtro
          </Button>
        </div>
      ),      
      filterIcon: emailColumnSearchIcon,
    },
    {
      title: "Alta",
      dataIndex: "fechaAlta",
      key: "fechaAlta",
      sorter: (a, b) => dayjs(a.fechaAlta).unix() - dayjs(b.fechaAlta).unix(),
    },
    {
      title: "Vencimiento",
      dataIndex: "fechaVencimiento",
      key: "fechaVencimiento",
      sorter: (a, b) =>
        dayjs(a.fechaVencimiento).unix() - dayjs(b.fechaVencimiento).unix(),
    },
    {
      title: "Plan",
      dataIndex: "plan",
      key: "plan",
      filters: [
        { text: "Emprendedor", value: "emprendedor" },
        { text: "Startup", value: "startup" },
        { text: "Empresarial", value: "empresarial" },
      ],
      onFilter: (value, record) => record.plan === value,
    },
    {
      title: "Estado",
      dataIndex: "activo",
      key: "activo",
      render: (activo) => (
        <Tag color={activo ? "green" : "red"}>
          {activo ? "Activo" : "Inactivo"}
        </Tag>
      ),
      filters: [
        { text: "Activo", value: true },
        { text: "Inactivo", value: false },
      ],
      onFilter: (value, record) => record.activo === value,
      sorter: (a, b) => (a.activo === b.activo ? 0 : a.activo ? -1 : 1),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => {
        return (
          <div className="acciones-btn">
            {record.activo ? (
              <Tooltip title="Deshabilitar">
                <Button
                  onClick={() => handleToggleEstadoCliente(record)}
                  className="btn-action"
                  type="primary"
                  shape="circle"
                  icon={<IoCloseSharp />}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Habilitar">
                <Button
                  onClick={() => handleToggleEstadoCliente(record)}
                  className="btn-action"
                  type="primary"
                  shape="circle"
                  icon={<FaCheck />}
                />
              </Tooltip>
            )}
    
            <Tooltip title="Editar">
              <Button
                className="btn-action"
                type="primary"
                shape="circle"
                onClick={() => handleEdit(record)}
                icon={<CiEdit />}
              />
            </Tooltip>
          </div>
        );
      },
    }    
  ];

  const expandedRowRender = (record) => {
    const userColumns = [
      {
        title: "Nombre",
        dataIndex: "nombre",
        key: "nombre",
      },
      {
        title: "Apellido",
        dataIndex: "apellido",
        key: "apellido",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Tipo",
        dataIndex: "type",
        key: "type",
      },
    ];
    const userData = record.usuarios.map((usuario) => ({
      key: usuario.id_usuario,
      nombre: usuario.nombre || "-",
      apellido: usuario.apellido || "-",
      email: usuario.email || "-",
      type: usuario.type || "-",
    }));

    return (
      <div>
      <Table columns={userColumns} dataSource={userData} pagination={false} />
      <div>
      <Button
        type="primary"
        onClick={() => setDrawerAbierto(true)}
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Crear Usuario
      </Button>
      {console.log(drawerAbierto)}
      {drawerAbierto && (
        <div className="drawer">
          <FormularioUsuario  cerrarDrawer={() => setDrawerAbierto(false)} drawerAbierto={drawerAbierto} clienteId={record.key}/>
        </div>
      )}
    </div>
    </div>
    );
  };

  
  const data = clientes
  .filter((item) =>
    searchedColumn ? item[searchedColumn].toString().toLowerCase().includes(searchText.toLowerCase()) : true
  )
  .map((cliente) => ({
    key: cliente.id_cliente,
    nombre: cliente.nombre || "-",
    apellido: cliente.apellido || "-",
    email: cliente.email || "-",
    fechaAlta: cliente.fechaAlta
      ? dayjs(cliente.fechaAlta).format("DD-MM-YYYY")
      : "-",
    fechaVencimiento: cliente.fechaVencimiento
      ? dayjs(cliente.fechaVencimiento).format("DD-MM-YYYY")
      : "-",
    plan: cliente.plan || "-",
    usuarios: cliente.usuarios,
    activo: cliente.activo,
  }));


  return (
    <>
      <Button
        type="primary"
        onClick={showDrawer}
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Agregar Cliente
      </Button>

      {clientes.length > 0 ? (
        <Table
          columns={columns}
          expandable={{ expandedRowRender }}
          dataSource={data}
          pagination={false}
          bordered
          scroll={{ x: "max-content" }}
        />
      ) : (
        <Alert message="No hay clientes registrados" type="info" />
      )}

      <Drawer
        title="Agregar Cliente"
        width={720}
        onClose={onClose}
        open={open}
        extra={
          <Button onClick={() => form.submit()} type="primary">
            Enviar
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[
                  { required: true, message: "Por favor ingresa el nombre" },
                ]}
              >
                <Input placeholder="Nombre" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apellido"
                label="Apellido"
                rules={[
                  { required: true, message: "Por favor ingresa el apellido" },
                ]}
              >
                <Input placeholder="Apellido" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Por favor ingresa un email válido",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="fechaAlta"
                label="Fecha de Alta"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la fecha de alta",
                  },
                ]}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="fechaVencimiento"
                label="Fecha de Vencimiento"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingresa la fecha de vencimiento",
                  },
                ]}
              >
                <DatePicker format={dateFormat} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="plan"
                label="Plan"
                rules={[
                  { required: true, message: "Por favor selecciona el plan" },
                ]}
              >
                <Select placeholder="Selecciona el plan">
                  <Option value="emprendedor">Emprendedor</Option>
                  <Option value="startup">Startup</Option>
                  <Option value="empresarial">Empresarial</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      {contextHolder}

      <Drawer
  title="Editar Cliente"
  width={720}
  onClose={onCloseChange}
  open={openEdit}
  extra={
    <Button onClick={() => form.submit()} type="primary">
      Guardar Cambios
    </Button>
  }
>
  <Form form={form} layout="vertical" onFinish={handleEditCliente}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
          <Input placeholder="Nombre" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="apellido" label="Apellido" rules={[{ required: true, message: 'Por favor ingresa el apellido' }]}>
          <Input placeholder="Apellido" />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Por favor ingresa un email válido' }]}>
          <Input placeholder="Email" />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="fechaVencimiento" label="Fecha de Vencimiento" rules={[{ required: true, message: 'Por favor ingresa la fecha de vencimiento' }]}>
          <DatePicker format={dateFormat} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="plan" label="Plan" rules={[{ required: true, message: 'Por favor selecciona el plan' }]}>
          <Select placeholder="Selecciona el plan">
            <Option value="emprendedor">Emprendedor</Option>
            <Option value="startup">Startup</Option>
            <Option value="empresarial">Empresarial</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  </Form>
</Drawer>


    </>
  );
};

export default TablaClientes;
