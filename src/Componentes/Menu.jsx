import React, { useEffect, useState } from "react";
import { BsGraphUp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { BsUpload } from "react-icons/bs";
import { Layout, Menu, theme } from "antd";
import Seguimientos from "./../Contenedores/Seguimientos";
import Datos from "./Datos";
import "./styles.scss";
import { FloatButton, Tooltip } from "antd";
import { BsWhatsapp } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import Ajustes from "../Contenedores/Ajustes";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineContactSupport } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { logoutUser } from "../Redux/actions";
import { useNavigate } from "react-router-dom";
import { PiUserListLight } from "react-icons/pi";
import Metricas from "../Contenedores/Metricas";



const { Header, Content, Footer, Sider } = Layout;

export default function MenuDesplegable() {
  const [collapsed, setCollapsed] = useState(true);
  const cliente = useSelector((state)=> state.clientes)
  const userLogeado = JSON.parse(localStorage.getItem("usuarioLogueado"))
  const [page, setPage] = useState("1");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Obtener el valor de 'username' del localStorage
    if(userLogeado){
      // Inicializar una variable para almacenar el 'id_usuario' encontrado
      let userId = userLogeado.id_usuario
      let email = userLogeado.email
      let user = userLogeado.usuario;

      dispatch(logoutUser(userId, email, user));
      navigate('/');
    }
  };

  const username = localStorage.getItem("username");
  const nameEmpresa = useSelector(
    (state) =>
      state.customizaciones.find(
        (item) => item.fieldName === "Nombre de la Empresa"
      )?.fieldValue
  );

  const usernameMappings = {
    lourdesaraoz: "Lourdes",
    lucasdeleon: "Lucas",
    mercately: "Mercately",
    tomasmarcilese: "Tomás",
    beehr: "Beehr",
    carlosterzano: "Carlos",
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
          <div className="user">
            Bienvenid@ {nameEmpresa} / {userLogeado.nombre}
          </div>
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

          <Menu.Item key="3" icon={<PiUserListLight />}>
            <span>Seguimientos</span>
          </Menu.Item>

          <Menu.Item key="4" icon={<IoSettingsSharp />}>
            <span>Ajustes</span>
          </Menu.Item>
       


          <Menu.Item key="5" icon={<CiLogin/>} onClick={handleLogout}>
            {/* <Link to="/"> */}
              <span>Salir</span>
            {/* </Link> */}
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
            {page === "1" ? (
              <Datos />
            ) : page === "2" ? (
              <Metricas/>
            ) : page === "4" ? (
              <Ajustes />
            ) : page === "3" ? (
                <Seguimientos />
            ): null
            }

            <FloatButton.Group
              trigger="hover"
              style={{
                right: 24,
              }}
              icon={<MdOutlineContactSupport/>}
            >
              {cliente?.plan === "empresarial" ? 
              <Tooltip title="Contactanos por WhatsApp" placement="left">
                <Link to="https://wa.me/qr/Q2YIOQL7UXOPH1" target="_blank">
                  <FloatButton
                    trigger="click"
                    type="primary"
                    style={{
                      right: 94,
                      marginBottom: '1rem',
                    }}
                    icon={<BsWhatsapp />}
                  />
                </Link>
              </Tooltip>

              :   
              
              <Tooltip title="Subi de plan para contactanos por WhatsApp" placement="left">
                <FloatButton
                  className="disabled"
                  trigger="click"
                  style={{
                    right: 94,
                    marginBottom: '1rem',
                  }}
                  icon={<BsWhatsapp />}
                />
            </Tooltip>
            }


              <Tooltip title="Contactanos por mail" placement="left">
                <Link to="mailto:meicanalitycs@gmail.com" target="_blank">
                  <FloatButton
                    className="icono2"
                    trigger="click"
                    type="primary"
                    style={{
                      right: 94,
                    }}
                    icon={<MdOutlineMailOutline />
                  }
                  ></FloatButton>
                </Link>
              </Tooltip>
            </FloatButton.Group>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          {nameEmpresa} ©2024
        </Footer>
      </Layout>
    </Layout>
  );
}
