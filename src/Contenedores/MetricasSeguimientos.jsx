import React, { useState, useEffect } from "react";
import { Progress, Card, Tag, Statistic } from "antd";
import { useSelector } from "react-redux";
import { Column } from "@ant-design/plots";
import GraficoPie from "./GraficoPie";
import calendly from "./../imagenes/calendly.webp";
import conversaciones from "./../imagenes/conversaciones.webp";
import respuestas from "./../imagenes/respuestas.webp";
import "./styles.scss";

export default function MetricasSeguimientos({ data }) {
  const [porcentajeApertura, setPorcentajeApertura] = useState(0);
  const [porcentajeFollowUp1, setPorcentajeFollowUp1] = useState(0);
  const [porcentajeFollowUp2, setPorcentajeFollowUp2] = useState(0);
  const [porcentajeFollowUp3, setPorcentajeFollowUp3] = useState(0);
  const [porcentajeFollowUp4, setPorcentajeFollowUp4] = useState(0);
  const [porcentajePropuesta, setPorcentajePropuesta] = useState(0);
  const [calendlyEnviadoCount, setCalendlyEnviadoCount] = useState(0);
  const [procesoConMasCalendly, setProcesoConMasCalendly] = useState("");
  const [conversacionesAtrasadas, setConversacionesAtrasadas] = useState(0);
  const [porcentajeAlDia, setPorcentajeAlDia] = useState(0);
  const [conversacionesHoy, setConversacionesHoy] = useState(0);
  const [conversacionesEnDosDias, setConversacionesEnDosDias] = useState(0);
  const [conversacionesEnUnDia, setConversacionesEnUnDia] = useState(0);
  const [respuestasApertura, setRespuestasApertura] = useState(0);
  const [respuestasFollowUp1, setRespuestasFollowUp1] = useState(0);
  const [respuestasFollowUp2, setRespuestasFollowUp2] = useState(0);
  const [respuestasFollowUp3, setRespuestasFollowUp3] = useState(0);
  const [respuestasFollowUp4, setRespuestasFollowUp4] = useState(0);
  const [respuestasPropuesta, setRespuestasPropuesta] = useState(0);
  const [totalPropuestas, setTotalPropuestas] = useState(0);
  const [porcentajePropuestas, setPorcentajePropuestas] = useState(0);
  const [noInteresados, setNoInteresados] = useState(0);
  const [conversacionesFinalizadas, setConversacionesFinalizadas] = useState(0);

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
  const twoColors = {
    "0%": colorPrincipal,
    "100%": colorSecundario,
  };

  useEffect(() => {
    let respuestasApertura = 0;
    let respuestasFollowUp1 = 0;
    let respuestasFollowUp2 = 0;
    let respuestasFollowUp3 = 0;
    let respuestasFollowUp4 = 0;
    let respuestasPropuesta = 0;
    let calendlyEnviadoCount = 0;
    let procesoConMasCalendlyCount = 0;
    let procesoConMasCalendly = "";
    let conversacionesAtrasadas = 0;
    let conversacionesHoy = 0;
    let conversacionesEnUnDia = 0;
    let conversacionesEnDosDias = 0;
    let totalPropuestas = 0;
    let totalRespuestasPropuestas = 0;
    let noInteresados = 0;
    let conversacionesFinalizadas = 0;

    data.forEach((item) => {
      if (item.mensajeApertura?.contesto) respuestasApertura++;
      if (item.followUp1?.contesto) respuestasFollowUp1++;
      if (item.followUp2?.contesto) respuestasFollowUp2++;
      if (item.followUp3?.contesto) respuestasFollowUp3++;
      if (item.followUp4?.contesto) respuestasFollowUp4++;
      if (item.propuesta?.contesto) respuestasPropuesta++;

      if (item.calendlyEnviado) calendlyEnviadoCount++;

      if (item.mensajeApertura.calendly) {
        procesoConMasCalendlyCount++;
        if (procesoConMasCalendlyCount === 1) {
          procesoConMasCalendly = "Mensaje de Apertura";
        }
      }
      if (item.followUp1.calendly) {
        procesoConMasCalendlyCount++;
        if (procesoConMasCalendlyCount === 1) {
          procesoConMasCalendly = "FollowUp 1";
        }
      }
      if (item.followUp2.calendly) {
        procesoConMasCalendlyCount++;
        if (procesoConMasCalendlyCount === 1) {
          procesoConMasCalendly = "FollowUp 2";
        }
      }
      if (item.followUp3.calendly) {
        procesoConMasCalendlyCount++;
        if (procesoConMasCalendlyCount === 1) {
          procesoConMasCalendly = "FollowUp 3";
        }
      }
      if (item.followUp4.calendly) {
        procesoConMasCalendlyCount++;
        if (procesoConMasCalendlyCount === 1) {
          procesoConMasCalendly = "FollowUp 4";
        }
      }

      if (item.contactar?.toLowerCase() === "atrasado") {
        conversacionesAtrasadas++;
      } else if (item.contactar?.toLowerCase() === "hoy") {
        conversacionesHoy++;
      } else if (item.contactar === "1") {
        conversacionesEnUnDia++;
      } else if (item.contactar === "2") {
        conversacionesEnDosDias++;
      }

      if (item.contactar?.toLowerCase() === "no interesado") {
        noInteresados++;
      }

      if (item.contactar?.toLowerCase() === "finalizado") {
        conversacionesFinalizadas++;
      }

      if (
        item.mensajeApertura?.propuesta ||
        item.followUp1?.propuesta ||
        item.followUp2?.propuesta ||
        item.followUp3?.propuesta ||
        item.followUp4?.propuesta
      ) {
        totalPropuestas++;
        if (
          item.mensajeApertura?.contesto ||
          item.followUp1?.contesto ||
          item.followUp2?.contesto ||
          item.followUp3?.contesto ||
          item.followUp4?.contesto
        ) {
          totalRespuestasPropuestas++;
        }
      }
    });

    const totalMensajes = data.length;
    const conversacionesAlDia =
      conversacionesHoy + conversacionesEnUnDia + conversacionesEnDosDias;

    setPorcentajeApertura((respuestasApertura / totalMensajes) * 100);
    setPorcentajeFollowUp1((respuestasFollowUp1 / totalMensajes) * 100);
    setPorcentajeFollowUp2((respuestasFollowUp2 / totalMensajes) * 100);
    setPorcentajeFollowUp3((respuestasFollowUp3 / totalMensajes) * 100);
    setPorcentajeFollowUp4((respuestasFollowUp4 / totalMensajes) * 100);
    setPorcentajePropuesta((respuestasPropuesta / totalMensajes) * 100);
    setCalendlyEnviadoCount(calendlyEnviadoCount);
    setProcesoConMasCalendly(procesoConMasCalendly);
    setConversacionesAtrasadas(conversacionesAtrasadas);
    setPorcentajeAlDia((conversacionesAlDia / totalMensajes) * 100);
    setConversacionesHoy(conversacionesHoy);
    setConversacionesEnUnDia(conversacionesEnUnDia);
    setConversacionesEnDosDias(conversacionesEnDosDias);
    setRespuestasApertura(respuestasApertura);
    setRespuestasFollowUp1(respuestasFollowUp1);
    setRespuestasFollowUp2(respuestasFollowUp2);
    setRespuestasFollowUp3(respuestasFollowUp3);
    setRespuestasFollowUp4(respuestasFollowUp4);
    setRespuestasPropuesta(respuestasPropuesta);
    setNoInteresados(noInteresados);
    setConversacionesFinalizadas(conversacionesFinalizadas);

    setTotalPropuestas(totalPropuestas);
    if (totalPropuestas > 0) {
      setPorcentajePropuestas(
        (totalRespuestasPropuestas / totalPropuestas) * 100
      );
    } else {
      setPorcentajePropuestas(0);
    }

    console.log({
      totalPropuestas,
      porcentajePropuestas:
        totalPropuestas > 0
          ? (totalRespuestasPropuestas / totalPropuestas) * 100
          : 0,
    });
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
  ];

  const dataSource = [
    {
      key: "1",
      estado: "Hoy",
      cantidad: conversacionesHoy,
    },
    {
      key: "2",
      estado: "En 1 día",
      cantidad: conversacionesEnUnDia,
    },
    {
      key: "3",
      estado: "En 2 días",
      cantidad: conversacionesEnDosDias,
    },
    {
      key: "4",
      estado: "Atrasadas",
      cantidad: conversacionesAtrasadas,
    },
  ];

  const pieData = {
    totalMensajes: data.length,
    conversacionesAtrasadas,
    conversacionesHoy,
    conversacionesEnUnDia,
    conversacionesEnDosDias,
    conversacionesFinalizadas,
    noInteresados,
  };

  const configPropuestas = {
    appendPadding: 10,
    data: [{ proceso: "Propuesta", porcentaje: porcentajePropuestas }],
    xField: "proceso",
    yField: "porcentaje",
    yAxis: {
      label: (datum) => {
        return {
          name: datum.proceso,
          value: `${datum.porcentaje.toFixed(
            2
          )}% - ${totalPropuestas} propuestas`,
        };
      },
    },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.proceso,
          value: `${datum.porcentaje.toFixed(
            2
          )}% - ${totalPropuestas} propuestas`,
        };
      },
    },

    meta: {
      proceso: { alias: "Proceso" },
      porcentaje: { alias: "Porcentaje" },
    },
  };

  const configRespuestas = {
    appendPadding: 10,
    data: [
      { proceso: "MA", porcentaje: porcentajeApertura },
      { proceso: "F1", porcentaje: porcentajeFollowUp1 },
      { proceso: "F2", porcentaje: porcentajeFollowUp2 },
      { proceso: "F3", porcentaje: porcentajeFollowUp3 },
      { proceso: "F4", porcentaje: porcentajeFollowUp4 },
    ],
    xField: "proceso",
    yField: "porcentaje",
    yAxis: {
      label: {
        formatter: (v) => `${v}%`, // Agrega el símbolo "%" al final de cada valor en el eje Y
      },
    },
    tooltip: {
      formatter: (datum) => {
        let cantidad = 0;
        // Asigna la cantidad correspondiente según el proceso
        switch (datum.proceso) {
          case "MA":
            cantidad = respuestasApertura;
            break;
          case "F1":
            cantidad = respuestasFollowUp1;
            break;
          case "F2":
            cantidad = respuestasFollowUp2;
            break;
          case "F3":
            cantidad = respuestasFollowUp3;
            break;
          case "F4":
            cantidad = respuestasFollowUp4;
            break;
          default:
            cantidad = 0;
            break;
        }
        return {
          name: datum.proceso,
          value: `${datum.porcentaje.toFixed(2)}% - ${cantidad} conversaciones`,
        };
      },
    },

    meta: {
      proceso: { alias: "Proceso" },
      porcentaje: { alias: "Porcentaje" },
    },
  };

  return (
    <div className="contenedor-metricas-seguimientos">
      <Card
        title={
          <span className="card-title-metricas">
            <img className="calendly-img" src={conversaciones} /> Conversaciones
          </span>
        }
        className="carta-metricas-seguimiento"
        bordered={false}
      >
        <GraficoPie data={pieData} />
      </Card>

      <Card
        title={
          <span className="card-title-metricas">
            <img className="calendly-img" src={respuestas} /> Propuestas
          </span>
        }
        className="carta-metricas-seguimiento"
        bordered={false}
      >
        <Column {...configPropuestas} height={200} />
      </Card>

      <Card
        title={
          <span className="card-title-metricas">
            <img className="calendly-img" src={respuestas} /> Respuestas
          </span>
        }
        className="carta-metricas-seguimiento"
        bordered={false}
      >
        <Column {...configRespuestas} height={200} />
      </Card>

      <Card
        title={
          <span className="card-title-metricas">
            <img className="calendly-img" src={calendly} /> Calendly
          </span>
        }
        className="carta-metricas-seguimiento"
        bordered={false}
      >
        <Statistic
          title="Calendly enviados"
          value={`${calendlyEnviadoCount} / ${data.length} conversaciones`}
        />
        <Progress
          percent={((calendlyEnviadoCount / data.length) * 100).toFixed(2)}
          strokeColor={twoColors}
        />

        <div className="calendlyenviado">Proceso con más calendly enviado</div>
        <Tag color={colorSecundario} className="tag-followup">
          {procesoConMasCalendly}
        </Tag>
      </Card>
    </div>
  );
}
