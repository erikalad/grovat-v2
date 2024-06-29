import React, { useEffect, useState } from "react";
import { Table, Row, Col } from "antd";
import { Pie } from "@ant-design/plots";

const TablaEstadosCantidades = ({ data, setStateDescarga }) => {
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

  // Variables adicionales para la nueva tabla
  const [respuestasApertura, setRespuestasApertura] = useState(0);
  const [respuestasFollowUp1, setRespuestasFollowUp1] = useState(0);
  const [respuestasFollowUp2, setRespuestasFollowUp2] = useState(0);
  const [respuestasFollowUp3, setRespuestasFollowUp3] = useState(0);
  const [respuestasFollowUp4, setRespuestasFollowUp4] = useState(0);
  const [respuestasPropuesta, setRespuestasPropuesta] = useState(0);
  const [porcentajePropuestas, setPorcentajePropuestas] = useState(0);

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

    // Calcular tasas de respuesta
    const respuestasAperturaCount = data?.filter(
      (item) => item.mensajeApertura?.contesto
    ).length;
    const respuestasFollowUp1Count = data?.filter(
      (item) => item.followUp1?.contesto
    ).length;
    const respuestasFollowUp2Count = data?.filter(
      (item) => item.followUp2?.contesto
    ).length;
    const respuestasFollowUp3Count = data?.filter(
      (item) => item.followUp3?.contesto
    ).length;
    const respuestasFollowUp4Count = data?.filter(
      (item) => item.followUp4?.contesto
    ).length;
    const respuestasPropuestaCount = data?.filter(
      (item) => item.propuesta?.contesto
    ).length;

    setRespuestasApertura(respuestasAperturaCount);
    setRespuestasFollowUp1(respuestasFollowUp1Count);
    setRespuestasFollowUp2(respuestasFollowUp2Count);
    setRespuestasFollowUp3(respuestasFollowUp3Count);
    setRespuestasFollowUp4(respuestasFollowUp4Count);
    setRespuestasPropuesta(respuestasPropuestaCount);
    setPorcentajePropuestas(
      propuestas > 0 ? (respuestasPropuestaCount / propuestas) * 100 : 0
    );

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
      porcentaje:
        propuestasEnviadas > 0
          ? (noInteresadosPropuesta / propuestasEnviadas) * 100
          : 0,
    },
  ];

  const totalPropuestas = propuestasEnviadas;
  const noInteresadosPorcentaje =
    propuestasEnviadas > 0
      ? (noInteresadosPropuesta / propuestasEnviadas) * 100
      : 0;
  const propuestasEnProcesoPorcentaje = 100 - noInteresadosPorcentaje;

  const config = {
    data: [
      {
        type: "Propuestas Enviadas en Proceso",
        value: propuestasEnProcesoPorcentaje,
      },
      {
        type: "No interesados en la Propuesta",
        value: noInteresadosPorcentaje,
      },
    ],
    angleField: "value",
    colorField: "type",
    innerRadius: 0.6,
    label: {
      type: "inner",
      offset: "-50%",
      content: ({ percent }) => `${(percent * 100).toFixed(2)}%`,
      style: {
        textAlign: "center",
        fontSize: 14,
        rotate: false, // Para mantener el texto horizontal
      },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    statistic: {
      title: false,
      content: {
        content: `${totalPropuestas}`,
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          fontSize: 20,
        },
      },
    },
  };

  const columnsMetrics = [
    {
      title: "Métrica",
      dataIndex: "metrica",
      key: "metrica",
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

  const dataSourceMetrics = [
    {
      key: "1",
      metrica: "Tasa de Respuesta - Apertura",
      cantidad: respuestasApertura,
      porcentaje: (respuestasApertura / totalConversaciones) * 100,
    },
    {
      key: "2",
      metrica: "Tasa de Respuesta - FollowUp 1",
      cantidad: respuestasFollowUp1,
      porcentaje: (respuestasFollowUp1 / totalConversaciones) * 100,
    },
    {
      key: "3",
      metrica: "Tasa de Respuesta - FollowUp 2",
      cantidad: respuestasFollowUp2,
      porcentaje: (respuestasFollowUp2 / totalConversaciones) * 100,
    },
    {
      key: "4",
      metrica: "Tasa de Respuesta - FollowUp 3",
      cantidad: respuestasFollowUp3,
      porcentaje: (respuestasFollowUp3 / totalConversaciones) * 100,
    },
    {
      key: "5",
      metrica: "Tasa de Respuesta - FollowUp 4",
      cantidad: respuestasFollowUp4,
      porcentaje: (respuestasFollowUp4 / totalConversaciones) * 100,
    },
    {
      key: "6",
      metrica: "Tasa de Respuesta - Propuesta",
      cantidad: respuestasPropuesta,
      porcentaje: (respuestasPropuesta / totalConversaciones) * 100,
    },
    {
      key: "7",
      metrica: "Calendlys Enviados",
      cantidad: calendlysEnviados,
      porcentaje: (calendlysEnviados / totalConversaciones) * 100,
    },
  ];

  useEffect(()=>{
    setStateDescarga([dataSourceMetrics,dataSourcePropuestas,dataSourceEstado], "Tablas")
  },[data,totalConversaciones])

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
          <h3>Métricas de Seguimiento</h3>
          <Table
            columns={columnsMetrics}
            dataSource={dataSourceMetrics}
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
          <h3>Comparación de Propuestas</h3>
          <Pie {...config} />
        </Col>
      </Row>
    </div>
  );
};

export default TablaEstadosCantidades;
