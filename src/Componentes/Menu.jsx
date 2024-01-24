import React, { useState } from "react";
import { BsGraphUp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BsUpload } from "react-icons/bs";
import { Layout, Menu, theme } from "antd";
import Metricas from "./../Contenedores/Metricas";
import Datos from "./Datos";
// import logo from "./../imagenes/grovat.jpeg";
import "./styles.scss";
import { RiTeamLine, RiMenuSearchLine, RiRobot2Fill } from "react-icons/ri";
import { HiOutlineComputerDesktop } from "react-icons/hi2";
import { SiHandshake } from "react-icons/si";
import { MdReviews } from "react-icons/md";
import { FloatButton, Tooltip } from "antd";
import { BsWhatsapp } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import TablaCustomizacion from "./TablaCustomizacion";
import Ajustes from "../Contenedores/Ajustes";
import { useSelector } from "react-redux";


const { Header, Content, Footer, Sider } = Layout;

export default function MenuDesplegable() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("1");
  const username = localStorage.getItem('username');
  const nameEmpresa = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Nombre de la Empresa')?.fieldValue);

  const usernameMappings = {
    lourdesaraoz: 'Lourdes',
    lucasdeleon: 'Lucas',
    mercately: 'Mercately',
    tomasmarcilese: 'Tomás',
    beehr: 'Beehr',
    carlosterzano: 'Carlos'
  };

  const formattedUsername = usernameMappings[username] || username;

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (item) => {
    setPage(item.key);
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
          <div className="user">Bienvenid@ {nameEmpresa} / {formattedUsername}</div>
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

          <Menu.Item key="3" icon={<IoSettingsSharp />}>
            <span>Ajustes</span>
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
            {page === "1" ? <Datos /> : page === "2" ?  <Metricas /> : <Ajustes/>}

            {/* <FloatButton.Group
        trigger="hover"
        style={{
          right: 24,
        }}
        className="icono2"
        icon={<RiMenuSearchLine style={{ color: "white" }} />}>
        <Tooltip title="#WeAreDCisGlobal" placement="left">
          <Link to="/">
            <FloatButton.BackTop
              visibilityHeight={0}
              className="floatButton"
              icon={<SiHandshake style={{ color: "white" }} />}
              style={{ marginBottom: "0.5rem" }}
            />
          </Link>
        </Tooltip>

        <Tooltip title="#DCisStandard" placement="left">
          <Link to="/DCisStandard">
            <FloatButton.BackTop
              visibilityHeight={0}
              className="floatButton"
              icon={<HiOutlineComputerDesktop style={{ color: "white" }} />}
              style={{ marginBottom: "0.5rem" }}
            />
          </Link>
        </Tooltip>

        <Tooltip title="#DCisTeams" placement="left">
          <Link to="/DCisTeams">
            <FloatButton.BackTop
              visibilityHeight={0}
              className="floatButton"
              icon={<RiTeamLine style={{ color: "white" }} />}
              style={{ marginBottom: "0.5rem" }}
            />
          </Link>
        </Tooltip>

        <Tooltip title="#DCisIA" placement="left">
          <Link to="/DCisIA">
            <FloatButton.BackTop
              visibilityHeight={0}
              className="floatButton pulsate-fwd"
              icon={<RiRobot2Fill style={{ color: "white" }} />}
              style={{ marginBottom: "0.5rem" }}
            />
          </Link>
        </Tooltip>

        <Tooltip title="#DCisReview" placement="left">
          <Link to="/DCisReview">
            <FloatButton.BackTop
              visibilityHeight={0}
              className="floatButton pulsate-fwd"
              icon={<MdReviews style={{ color: "white" }} />}
            />
          </Link>
        </Tooltip>
      </FloatButton.Group> */}
      {/* <>
      <Link to="https://wa.me/qr/Q2YIOQL7UXOPH1" target="_blank">
        <FloatButton
          className="icono1"
          trigger="click"
          type="primary"
          style={{
            right: 94,
          }}
          icon={<BsWhatsapp />}></FloatButton>
          </Link>
      </> */}
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
    </Layout>
  );
}
