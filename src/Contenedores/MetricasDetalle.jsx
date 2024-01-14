import React from "react";
import { Table, Modal, Tooltip, Button } from "antd";
import Barra from "../Graficos/Barra";
import { BsTable } from "react-icons/bs";
import { BsInfo } from "react-icons/bs";
import Linea from "../Graficos/Linea";

const MetricasDetalle = ({ data, filteredColumns, type, actualizacionCualificados }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const info = () => {
    Modal.info({
      title: "Mensaje importante",
      content: (
        <div>
          Esta visualización presenta exclusivamente las invitaciones enviadas
          desde la cuenta de origen. No se consideran las invitaciones recibidas
          en este conjunto de datos.
        </div>
      ),
      onOk() {},
    });
  };

  const infoCon = () => {
    Modal.info({
      title: "Mensaje importante",
      content: (
        <div>
          Esta visualización presenta el recuento total de conexiones en la
          cuenta, así como las conexiones asociadas a puestos cualificados. Es
          importante tener en cuenta que la información sobre los puestos en
          LinkedIn es proporcionada por los usuarios y puede no estar siempre
          disponible. En caso de observar discrepancias entre los números de
          conexiones totales y las conexiones cualificadas, especialmente al
          seleccionar todos los puestos, es probable que se deba a la falta de
          información específica en algunos perfiles.
        </div>
      ),
      onOk() {},
    });
  };

  const infoMen = () => {
    Modal.info({
      title: "Mensaje importante",
      content: <div></div>,
      onOk() {},
    });
  };

  return (
    <>
      <div className="barra-button carta">
        {type === "invitaciones" ? (
          <Barra data={data} type={type} actualizacionCualificados={actualizacionCualificados}/>
        ) : (
          <Linea data={data} type={type} actualizacionCualificados={actualizacionCualificados}/>
        )}
        <Tooltip title="Ver detalle de los datos">
          <Button
            onClick={showModal}
            shape="circle"
            icon={<BsTable />}
            style={{ marginRight: "1rem", marginTop: "1rem" }}
          ></Button>
        </Tooltip>
        <Tooltip title="Importante">
          {type === "invitaciones" ? (
            <Button onClick={info} shape="circle" icon={<BsInfo />} />
          ) : type === "conexiones" ? (
            <Button onClick={infoCon} shape="circle" icon={<BsInfo />} />
          ) : (
            <Button onClick={infoMen} shape="circle" icon={<BsInfo />} />
          )}
        </Tooltip>
      </div>
      <Modal
        title={type === "invitaciones" ? "Invitaciones" : type === "conexiones" ? "Conexiones" : "Mensajes"}  
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <div className="tabla">
          <Table
            columns={filteredColumns}
            dataSource={data}
            scroll={{ x: "max-content", y: 600 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default MetricasDetalle;
