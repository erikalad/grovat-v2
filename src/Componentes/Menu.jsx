import React, { useState } from "react";
import { BsGraphUp } from "react-icons/bs";
import { BsUpload } from "react-icons/bs";
import { Layout, Menu, theme } from "antd";
import Metricas from "./../Contenedores/Metricas";
import Datos from "./Datos";
import logo from "./../imagenes/grovat.jpeg";
import "./styles.css";

const { Header, Content, Footer, Sider } = Layout;

export default function MenuDesplegable() {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("1");
  const username = localStorage.getItem('username');

  const usernameMappings = {
    lourdesaraoz: 'Lourdes',
    lucasdeleon: 'Lucas',
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
    </Layout>
  );
}
