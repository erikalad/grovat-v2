import React from "react";
import { Button, Progress, Space, Tooltip } from "antd";
import { useSelector } from "react-redux";
import "dayjs/locale/es";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import * as XLSX from "xlsx";
import { DownloadOutlined } from "@ant-design/icons";

dayjs.extend(isBetween);

const ProgresoMensajes = ({ data, conexiones }) => {
  const totalConexiones = conexiones.length || 1; // Manejar el caso en que invitaciones.length sea 0
  const fechasfiltros = useSelector((state) => state.fechasfiltros);
  // Parsear fechas de filtro
  const fechaInicio = dayjs(fechasfiltros[0], "DD/MM/YY");
  const fechaFin = dayjs(fechasfiltros[1], "DD/MM/YY");
  // Filtrar mensajes dentro del rango de fechas y que tengan fechaConexion
  const mensajesEnRango = data.filter((item) => {
    // Primero, verificar si el item tiene la propiedad 'fechaConexion'
    if (!item.fechaConexion) {
      return false; // Si no tiene 'fechaConexion', no incluir en el resultado
    }

    const fechaConexion = dayjs(item.fechaConexion, "DD/MM/YYYY");
    return fechaConexion.isBetween(fechaInicio, fechaFin, null, "[]");
  });

  const cantidadMensajesEnRango = mensajesEnRango.length;

  const totalMensajes = cantidadMensajesEnRango;
  const colorPrincipal = useSelector(
    (state) =>
      state.customizaciones.find((item) => item.fieldName === "Color Principal")
        ?.fieldValue
  );
  const colorSecundario = useSelector(
    (state) =>
      state.customizaciones.find(
        (item) => item.fieldName === "Color Secundario"
      )?.fieldValue
  );

  const porcentaje = isFinite(totalConexiones)
    ? Math.min((totalMensajes / totalConexiones) * 100, 100).toFixed(0)
    : 0;
  const twoColors = {
    "0%": colorPrincipal,
    "100%": colorSecundario,
  };

  const mensajes = useSelector((state) => state.mensajesAll);
  const nombreCuenta = useSelector((state) => state.nombreCuenta);

  function agruparPorConversationID(mensajes) {
    const agrupados = {};

    mensajes.forEach((mensaje) => {
      const id = mensaje["CONVERSATION ID"];
      if (!agrupados[id]) {
        agrupados[id] = [];
      }
      agrupados[id].push(mensaje);
    });

    return Object.values(agrupados);
  }

  function filtrarConversacionesIniciadasPor(mensajesAgrupados, nombreCuenta) {
    return mensajesAgrupados.filter((conversacion) => {
      // Verificamos si al menos un mensaje en la conversación fue enviado por nombreCuenta
      return conversacion.some((mensaje) => mensaje.FROM === nombreCuenta[0]);
    });
  }

  // Primero agrupamos los mensajes por CONVERSATION ID
  const mensajesAgrupados = agruparPorConversationID(mensajes);

  // Luego filtramos las conversaciones iniciadas por nombreCuenta
  const conversacionesIniciadasPorNombreCuenta =
    filtrarConversacionesIniciadasPor(mensajesAgrupados, nombreCuenta);

  function filtrarConversacionesConPrimerMensajeDistinto(
    mensajesAgrupados,
    nombreCuenta
  ) {
    return mensajesAgrupados.filter((conversacion) => {
      // Buscamos el índice del primer mensaje enviado por nombreCuenta (yendo del último al primero)
      const indicePrimerMensaje = conversacion
        .reverse()
        .findIndex((mensaje) => mensaje.FROM === nombreCuenta);

      // Si encontramos al menos un mensaje enviado por nombreCuenta
      if (indicePrimerMensaje !== -1) {
        // Verificamos si después de ese primer mensaje hay al menos un mensaje de otro remitente
        const mensajesDespuesPrimerMensaje = conversacion.slice(
          indicePrimerMensaje + 1
        );
        const siguienteMensaje = mensajesDespuesPrimerMensaje.find(
          (mensaje) => mensaje.FROM !== nombreCuenta
        );

        // Si hay un siguiente mensaje de otro remitente después del primer mensaje de nombreCuenta
        if (siguienteMensaje) {
          return true;
        }
      }

      return false; // Si no cumplimos los criterios, descartamos la conversación
    });
  }

  // Luego filtramos las conversaciones iniciadas por nombreCuenta
  const conversacionesIniciadasPorNombreCuentaConPrimerMensajeDistinto =
    filtrarConversacionesConPrimerMensajeDistinto(
      conversacionesIniciadasPorNombreCuenta,
      nombreCuenta[0]
    );

  function filtrarPrimerMensajePorFechas(conversaciones, fechasFiltros) {
    const fechaInicioFiltro = dayjs(fechasFiltros[0], "DD/MM/YY").startOf(
      "day"
    );
    const fechaFinFiltro = dayjs(fechasFiltros[1], "DD/MM/YY").endOf("day");

    return conversaciones.filter((conversacion) => {
      // Obtenemos el primer mensaje de la conversación
      const primerMensaje = conversacion[0];

      // Verificamos si la fecha del primer mensaje está dentro del rango de fechas
      const fechaMensaje = dayjs(primerMensaje.DATE.DATE, "DD/MM/YYYY"); // Ajusta el formato de acuerdo a tu dato
      return fechaMensaje.isBetween(
        fechaInicioFiltro,
        fechaFinFiltro,
        null,
        "[]"
      );
    });
  }

  // Luego filtramos el primer mensaje de cada conversación por las fechas especificadas
  const primerMensajeFiltrado = filtrarPrimerMensajePorFechas(
    conversacionesIniciadasPorNombreCuentaConPrimerMensajeDistinto,
    fechasfiltros
  );

  const totalMensajesFiltrados = filtrarPrimerMensajePorFechas(
    conversacionesIniciadasPorNombreCuenta,
    fechasfiltros
  );

  const porcentajeRespuesta = isFinite(totalConexiones)
    ? Math.min((primerMensajeFiltrado.length * 100) / data.length).toFixed(0)
    : 0;

    const exportToExcel = () => {
      // Obtener la fecha de hoy en el formato deseado para el nombre del archivo
      const today = new Date().toLocaleDateString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    
      // Aplanar el array de arrays
      const flatMessages = totalMensajesFiltrados.flat();
    
      // Mapear y transformar cada objeto
      const dataForExcel = flatMessages.map((mensaje) => ({
        Mensaje: mensaje.CONTENT || "",
        ID: mensaje["CONVERSATION ID"] || "",
        Fecha: mensaje.DATE ? mensaje.DATE.DATE : "",
        Cuenta: mensaje.FROM || "",
        Enviado: mensaje.TO || "",
        Link: mensaje["SENDER PROFILE URL"] || "",
      }));
    
      // Crear el archivo Excel
      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PrimerMensajeFiltrado");
      
      // Agregar la fecha de hoy al nombre del archivo
      const fileName = `MensajesRespuesta_${today}.xlsx`;
    
      // Descargar el archivo Excel
      XLSX.writeFile(workbook, fileName);
    };
    

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        rowGap: 16,
      }}
    >
      <Space wrap style={{ cursor: "pointer" }}>
        <Tooltip
          title={`El ${parseInt(
            porcentaje
          )}% de las conexiones fueron contactadas`}
        >
          <Progress
            type="dashboard"
            percent={parseInt(porcentaje)}
            strokeColor={twoColors}
            size={80}
          />
        </Tooltip>
        <div>
        <div className="subtitulo">Porcentaje de respuesta del primer mensaje</div>
          <Tooltip
            title={`De ${data.length} conversaciones, ${primerMensajeFiltrado.length} tuvieron respuesta en el primer mensaje `}
          >
            <Progress
              type="dashboard"
              percent={parseInt(porcentajeRespuesta)}
              strokeColor={twoColors}
              size={80}
            />
          </Tooltip>
          <Tooltip title="Descargar Excel con las conversaciones y sus respuestas">
            <Button
              onClick={exportToExcel}
              shape="circle"
              icon={<DownloadOutlined />}
              style={{ marginLeft: "1rem" }}
              className="btn-metricas-detalle"
            />
          </Tooltip>
        </div>
      </Space>
    </div>
  );
};

export default ProgresoMensajes;
