import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "antd";

const TablaEstadosCantidades = ({ data }) => {
  const [conversacionesHoy, setConversacionesHoy] = useState(0);
  const [conversacionesManana, setConversacionesManana] = useState(0);
  const [conversacionesEnDosDias, setConversacionesEnDosDias] = useState(0);
  const [conversacionesAtrasadas, setConversacionesAtrasadas] = useState(0);
  const [finalizadas, setFinalizadas] = useState(0);
  const [propuestasEnviadas, setPropuestasEnviadas] = useState(0);
  const [calendlysEnviados, setCalendlysEnviados] = useState(0);
  const [noInteresados, setNoInteresados] = useState(0);
  const [sinPropuesta, setSinPropuesta] = useState(0);
  const [noInteresadosPropuesta, setNoInteresadosPropuesta] = useState(0);
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
    const noInteresadosPropuestaCount = data?.filter(
      (item) =>
        (item.mensajeApertura?.propuesta ||
          item.followUp1?.propuesta ||
          item.followUp2?.propuesta ||
          item.followUp3?.propuesta ||
          item.followUp4?.propuesta) &&
        (item.mensajeApertura?.noInteresado ||
          item.followUp1?.noInteresado ||
          item.followUp2?.noInteresado ||
          item.followUp3?.noInteresado ||
          item.followUp4?.noInteresado)
    ).length;

    setConversacionesHoy(hoy);
    setConversacionesManana(manana);
    setConversacionesEnDosDias(enDosDias);
    setConversacionesAtrasadas(atrasadas);
    setFinalizadas(finalizadasCount);
    setPropuestasEnviadas(propuestas);
    setCalendlysEnviados(calendlys);
    setNoInteresados(noInteresadoCount);
    setSinPropuesta(sinPropuestaCount);
    setNoInteresadosPropuesta(noInteresadosPropuestaCount);
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

  const dataSourceEstado = [
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
      estado: "Conversaciones al Día",
      cantidad:
        conversacionesHoy + conversacionesManana + conversacionesEnDosDias,
      porcentaje:
        ((conversacionesHoy + conversacionesManana + conversacionesEnDosDias) /
          totalConversaciones) *
        100,
    },
    {
      key: "5",
      estado: "Atrasadas",
      cantidad: conversacionesAtrasadas,
      porcentaje: (conversacionesAtrasadas / totalConversaciones) * 100,
    },
    {
      key: "6",
      estado: "Finalizadas",
      cantidad: finalizadas,
      porcentaje: (finalizadas / totalConversaciones) * 100,
    },
    {
      key: "7",
      estado: "No Interesados",
      cantidad: noInteresados,
      porcentaje: (noInteresados / totalConversaciones) * 100,
    },
  ];

  const dataSourcePropuestas = [
    {
      key: "1",
      estado: "Propuestas Enviadas",
      cantidad: propuestasEnviadas,
      porcentaje: (propuestasEnviadas / totalConversaciones) * 100,
    },
    {
      key: "2",
      estado: "Sin Propuesta",
      cantidad: sinPropuesta,
      porcentaje: (sinPropuesta / totalConversaciones) * 100,
    },
    {
      key: "3",
      estado: "Propuesta enviada - No interesado",
      cantidad: noInteresadosPropuesta,
      porcentaje: (noInteresadosPropuesta / totalConversaciones) * 100,
    },
  ];

  return (
    <div style={{ width: "100%" }}>
      <Row gutter={16}>
        <Col span={12}>
          <h3>Estado de Conversaciones</h3>
          <Table
            columns={columns}
            dataSource={dataSourceEstado}
            pagination={false}
            bordered
          />
        </Col>
        <Col span={12}>
          <h3>Detalles de Propuestas</h3>
          <Table
            columns={columns}
            dataSource={dataSourcePropuestas}
            pagination={false}
            bordered
          />
        </Col>
      </Row>
    </div>
  );
};

export default TablaEstadosCantidades;
