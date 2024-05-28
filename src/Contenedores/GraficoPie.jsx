import React from "react";
import { Pie } from "@ant-design/plots";

const GraficoPie = ({ data }) => {
  const config = {
    appendPadding: 10,
    data: [
      {
        type: "Atrasadas",
        value: (data.conversacionesAtrasadas / data.totalMensajes) * 100,
      },
      {
        type: "Al Día",
        value:
          ((data.conversacionesHoy +
            data.conversacionesEnUnDia +
            data.conversacionesEnDosDias) /
            data.totalMensajes) *
          100,
      },
      {
        type: "Finalizadas",
        value: (data.conversacionesFinalizadas / data.totalMensajes) * 100,
      },
      {
        type: "No Interesados",
        value: (data.noInteresados / data.totalMensajes) * 100,
      },
    ],
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    label: {
      type: "outer",
      content: (data) => `${data.value.toFixed(2)}%`, // Asegurar que las etiquetas muestran los valores correctos
    },
    interactions: [{ type: "pie-legend-active" }, { type: "element-active" }],
    tooltip: {
      formatter: (datum) => ({
        name: datum.type,
        value: `${datum.value.toFixed(2)}%`, // Formatear el valor con solo dos decimales
      }),
    },
    legend: {
      layout: "horizontal", // Establecer el diseño horizontal
      position: "bottom", // Colocar la leyenda debajo del gráfico
    },
  };

  return <Pie {...config} height={200} />;
};

export default GraficoPie;
