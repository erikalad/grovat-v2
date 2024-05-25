import React, { useEffect, useState } from "react";
import { Table } from "antd";

const TablaEstadosCantidades = ({ data }) => {
  const [conversacionesHoy, setConversacionesHoy] = useState(0);
  const [conversacionesManana, setConversacionesManana] = useState(0);
  const [conversacionesEnDosDias, setConversacionesEnDosDias] = useState(0);
  const [conversacionesAtrasadas, setConversacionesAtrasadas] = useState(0);
  const [finalizadas, setFinalizadas] = useState(0);
  const [propuestasEnviadas, setPropuestasEnviadas] = useState(0);
  const [calendlysEnviados, setCalendlysEnviados] = useState(0);
  const [noInteresados, setNoInteresados] = useState(0);
  const [sinPropuesta, setSinPropuesta] = useState(0); // Estado para "Sin propuesta"
  const [totalConversaciones, setTotalConversaciones] = useState(0);

  useEffect(() => {
    const total = data?.length || 0;
    const hoy = data?.filter(
      (item) => item.contactar?.toLowerCase() === "hoy"
    ).length;
    const manana = data?.filter((item) => item.contactar === "1").length;
    const enDosDias = data?.filter((item) => item.contactar === "2").length;
    const atrasadas = data?.filter(
      (item) => item.contactar?.toLowerCase() === "atrasado"
    ).length;
    const finalizadasCount = data?.filter(
      (item) => item.contactar?.toLowerCase() === "finalizado"
    ).length;
    const propuestas = data?.filter(
      (item) =>
        item.mensajeApertura?.propuesta ||
        item.followUp1?.propuesta ||
        item.followUp2?.propuesta ||
        item.followUp3?.propuesta ||
        item.followUp4?.propuesta
    ).length;
    const calendlys = data?.filter((item) => item.calendlyEnviado).length;
    const noInteresadoCount = data?.filter(
      (item) =>
        item.mensajeApertura?.noInteresado ||
        item.followUp1?.noInteresado ||
        item.followUp2?.noInteresado ||
        item.followUp3?.noInteresado ||
        item.followUp4?.noInteresado
    ).length;
    const sinPropuestaCount = data?.filter(
      (item) =>
        !item.mensajeApertura?.propuesta &&
        !item.followUp1?.propuesta &&
        !item.followUp2?.propuesta &&
        !item.followUp3?.propuesta &&
        !item.followUp4?.propuesta
    ).length;

    setConversacionesHoy(hoy);
    setConversacionesManana(manana);
    setConversacionesEnDosDias(enDosDias);
    setConversacionesAtrasadas(atrasadas);
    setFinalizadas(finalizadasCount);
    setPropuestasEnviadas(propuestas);
    setCalendlysEnviados(calendlys);
    setNoInteresados(noInteresadoCount);
    setSinPropuesta(sinPropuestaCount); // Actualizar estado "Sin propuesta"
    setTotalConversaciones(total);
  }, [data]);

  const columns = [
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "%",
      dataIndex: "porcentaje",
      key: "porcentaje",
      render: (text) => `${text.toFixed(2)}%`,
    },
  ];

  const dataSource = [
    {
      key: "1",
      estado: "Hoy",
      cantidad: conversacionesHoy,
      porcentaje: (conversacionesHoy / totalConversaciones) * 100,
    },
    {
      key: "2",
      estado: "Mañana",
      cantidad: conversacionesManana,
      porcentaje: (conversacionesManana / totalConversaciones) * 100,
    },
    {
      key: "3",
      estado: "En 2 días",
      cantidad: conversacionesEnDosDias,
      porcentaje: (conversacionesEnDosDias / totalConversaciones) * 100,
    },
    {
      key: "4",
      estado: "Atrasadas",
      cantidad: conversacionesAtrasadas,
      porcentaje: (conversacionesAtrasadas / totalConversaciones) * 100,
    },
    {
      key: "5",
      estado: "Finalizadas",
      cantidad: finalizadas,
      porcentaje: (finalizadas / totalConversaciones) * 100,
    },
    {
      key: "6",
      estado: "Propuestas Enviadas",
      cantidad: propuestasEnviadas,
      porcentaje: (propuestasEnviadas / totalConversaciones) * 100,
    },
    {
      key: "7",
      estado: "Calendlys Enviados",
      cantidad: calendlysEnviados,
      porcentaje: (calendlysEnviados / totalConversaciones) * 100,
    },
    {
      key: "8",
      estado: "No Interesados",
      cantidad: noInteresados,
      porcentaje: (noInteresados / totalConversaciones) * 100,
    },
    {
      key: "9",
      estado: "Sin Propuesta",
      cantidad: sinPropuesta,
      porcentaje: (sinPropuesta / totalConversaciones) * 100,
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        bordered
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default TablaEstadosCantidades;
