import React from "react";
import { Card, Statistic } from "antd";
import "./styles.css";

const Estadisticas = ({ data, cantArchivos,mesesFiltrados }) => {
  const cantidadElementos = data.length;
  const valorBase = 800;
  const mesesSeparados = mesesFiltrados?.split(',').map(mes => mes.trim());
  const totalObjetivo = valorBase * cantArchivos * mesesSeparados?.length;

  return (
    <div className="contenedor-estadisticas">
      <Card bordered={false}>
        <Statistic
          title="Invitaciones"
          value={`${cantidadElementos}/${totalObjetivo}`}
          precision={0}
        />
      </Card>
    </div>
  );
};
export default Estadisticas;

