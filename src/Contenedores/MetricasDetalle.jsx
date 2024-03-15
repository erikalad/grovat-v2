import React from "react";
import { Table, Modal, Tooltip, Button } from "antd";
import { BsTable } from "react-icons/bs";
import { BsInfo } from "react-icons/bs";
import Linea from "../Graficos/Linea";
import LineaMensajes from "../Graficos/LineaMensajes";
import Barra from "../Graficos/Barra";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";
import Estadisticas from "../Graficos/Estadisticas";
import Progreso from "../Graficos/Progreso";
import EstadisticasConexiones from "../Graficos/EstadisticasConexiones";
import ProgresoConexiones from "../Graficos/ProgresoConexiones";
import EstadisticasMensajes from "../Graficos/EstadisticasMensajes";
import ProgresoMensajes from "../Graficos/ProgresoMensajes";

const MetricasDetalle = ({
  data,
  filteredColumns,
  type,
  estadisticas,
  progreso,
  mesesFiltrados,
  cantArchivos,
  invitaciones,
  conexiones,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  console.log(data)
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function exportExcelMessage() {
    const modifiedData = data.map(message => {
        const rowData = {
            Cuenta: message.FROM,
            Enviado: message.TO,
            Día: message.DATE.DATE,
            Mensaje: message.CONTENT,
            FechaConexion: message.fechaConexion
        };
        // Verifica si hay datos de cualificados antes de agregar la columna
        if (message.cualificados !== undefined && message.cualificados !== null) {
            rowData.Cualificado = message.cualificados ? 'Cualificado' : 'No Cualificado';
        }
        return rowData;
    });

    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Mensajes");
    const today = new Date();
    const filename = `export_${type}_${today.getFullYear()}-${(today.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.xlsx`;
    XLSX.writeFile(wb, filename);
}



  const exportToExcel = () => {
    const cualificadosData = JSON.parse(localStorage.getItem('cualificadosData')) || [];

    // Ordenar los datos de más antiguos a más nuevos
    const sortedData = data.sort((a, b) => {
        const dateA = a['Connected On'].split('/').reverse().join();
        const dateB = b['Connected On'].split('/').reverse().join();
        return new Date(dateA) - new Date(dateB);
    });

    // Modificar los datos: concatenar nombres, ajustar 'contactado', y verificar si es cualificado (si cualificadosData no está vacío)
    const modifiedData = sortedData.map(({ 'First Name': firstName, 'Last Name': lastName, ...item }) => {
        const fullName = `${firstName} ${lastName}`;
        let modifiedItem = {
            Name: fullName,
            ...item,
            contactado: item.contactado ? 'Contactado' : 'No contactado',
        };
        
        // Añadir la propiedad "Cualificado" solo si cualificadosData no está vacío
        if (cualificadosData.length > 0) {
            const isCualificado = !!cualificadosData.find(cualificado => cualificado.name === fullName)?.cualificados;
            modifiedItem.Cualificado = isCualificado ? 'Cualificado' : 'No Cualificado';
        }

        return modifiedItem;
    });

    const ws = XLSX.utils.json_to_sheet(modifiedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conexiones");
    const today = new Date();
    const filename = `export_${type}_${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.xlsx`;
    XLSX.writeFile(wb, filename);
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
      content: (
        <div>
          Esta visualización corresponde a los mensajes enviados solo desde la
          cuenta asignada, para identificar las primeras interacciones con
          nuevas conexiones. Esta información permitirá evaluar cuántas cuentas
          nuevas se han contactado por día.
        </div>
      ),
      onOk() {},
    });
  };

  return (
    <>
      <div className="container-detalles">
        {type === "invitaciones" ? (
          <div className="contenedor-estadisticas-barra">
            <div className="statidistics-progress">
              <Estadisticas
                className="statidistics"
                data={estadisticas}
                cantArchivos={cantArchivos}
                type="invitaciones"
                mesesFiltrados={mesesFiltrados}
              />
              <Progreso
                data={progreso}
                mesesFiltrados={mesesFiltrados}
                cantArchivos={cantArchivos}
              />
            </div>
            <div className="barra-button carta">
              <Barra data={data} />
            </div>
          </div>
        ) : type === "conexiones" ? (
          <div className="contenedor-estadisticas-barra">
            <div className="statidistics-progress">
              <EstadisticasConexiones className="statidistics" data={data} />
              <ProgresoConexiones data={data} invitaciones={invitaciones} />
            </div>
            <div className="barra-button carta">
              <Linea data={data} />
            </div>
          </div>
        ) : (
          <div className="contenedor-estadisticas-barra">
            <div className="statidistics-progress">
              <EstadisticasMensajes
              
                className="statidistics"
                data={data}
                cantArchivos={cantArchivos}
                type="mensajes"
                mesesFiltrados={mesesFiltrados}
              />
              <ProgresoMensajes
              
                data={data}
                mesesFiltrados={mesesFiltrados}
                cantArchivos={cantArchivos}
                conexiones={conexiones}
              />
            </div>
            <div className="barra-button carta">
              <LineaMensajes data={data} />
            </div>
          </div>
        )}
        <div>
          <Tooltip title="Ver detalle de los datos">
            <Button
              onClick={showModal}
              shape="circle"
              icon={<BsTable />}
              style={{ marginRight: "1rem" }}
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
          <Tooltip title="Exportar a Excel">
                {type === "conexiones" && (
                    <Button
                        onClick={exportToExcel}
                        shape="circle"
                        icon={<DownloadOutlined />}
                        style={{ marginLeft: "1rem" }}
                    />
                )}
                {type === "mensajes" && (
                    <Button
                        onClick={exportExcelMessage}
                        shape="circle"
                        icon={<DownloadOutlined />}
                        style={{ marginLeft: "1rem" }}
                    />
                )}
            </Tooltip>
        </div>
      </div>
      <Modal
        title={
          type === "invitaciones"
            ? "Invitaciones"
            : type === "conexiones"
            ? "Conexiones"
            : "Mensajes"
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <div className="tabla">
          <Table
          
            columns={filteredColumns}
            dataSource={data}
            scroll={{ y: 400 }}
          />
        </div>
      </Modal>
    </>
  );
};

export default MetricasDetalle;
