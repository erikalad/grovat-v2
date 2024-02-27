import React, { useState } from "react";
import { BsGraphUp } from "react-icons/bs";
import { BsUpload } from "react-icons/bs";
import { Input, Layout, Menu, Modal, theme } from "antd";
import Metricas from "./../Contenedores/Metricas";
import Datos from "./Datos";
import logo from "./../imagenes/grovat.jpeg";
import "./styles.css";
import { useDispatch, useSelector } from "react-redux";
import { setNameCuenta } from "../Redux/actions";

const { Header, Content, Footer, Sider } = Layout;

export default function MenuDesplegable() {
  const invitacionesData = useSelector(state=> state.invitacionesData)
  const nombreCuenta = useSelector(state=>state.nombreCuenta)
  const mensajesData = useSelector(state=>state.mensajesData)
  const conexionesData = useSelector(state=>state.conexionesData)
  const [modalVisible, setModalVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(true);
  const [nombreCuentaInput, setNombreCuentaInput] = useState("");
  const [page, setPage] = useState("1");
  const username = localStorage.getItem('username');
  const dispatch = useDispatch()

  const usernameMappings = {
    lourdesaraoz: 'Lourdes',
    lucasdeleon: 'Lucas',
    mercately: 'Mercately',
    tomasmarcilese: 'Tomás',
    beehr: 'Beehr',
    carlosterzano: 'Carlos',
    solgruat: 'Sol',
    juanflorit: 'Juan'
  };

  const formattedUsername = usernameMappings[username] || username;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (item) => {
    if (item.key === "2" && invitacionesData.length === 0 && nombreCuenta.length === 0  && (mensajesData.length > 0 || conexionesData.length > 0) ) {
      setModalVisible(true);
    } else {
      setPage(item.key);
    }
  };

  const handleModalOk = () => {
    dispatch(setNameCuenta(nombreCuentaInput))
    setModalVisible(false);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="nav">
          <img src={logo} className="logo" /> <div className="user">Bienvenid@ {formattedUsername}</div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<BsUpload />}>
            <span>Cargar Datos</span>
          </Menu.Item>

          <Menu.Item key="2" icon={<BsGraphUp />}>
            <span>Métricas</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
          }}
        />
        <Content
          style={{
            margin: "16px 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {page === "1" ? <Datos /> : <Metricas />}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Grovat ©2024
        </Footer>
      </Layout>

      <Modal
        title="Ingrese el nombre de la cuenta"
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Input
          placeholder="Nombre de la cuenta"
          value={nombreCuentaInput}
          onChange={(e) => setNombreCuentaInput(e.target.value)}
        />
      </Modal>

    </Layout>
  );
}
