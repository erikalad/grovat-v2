import React from "react";
import { Card, Statistic } from "antd";
import "./styles.scss";
import { useSelector } from "react-redux";

const Estadisticas = ({ data, cantArchivos }) => {
  const cantidadElementos = data.length;
  const semanas = useSelector(state=>state.semanas)
  const valorBase = semanas * 200;
  const totalObjetivo = valorBase * cantArchivos

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

