import React from "react";
import { Card, Statistic } from "antd";
import "./styles.scss";

const EstadisticasMensajes = ({ data }) => {
  const cantidadElementos = data.length;
  console.log(data)
  
  return (
    <div className="contenedor-estadisticas">
      <Card bordered={false}>
        <Statistic title="Mensajes" value={cantidadElementos} precision={0} />
      </Card>
    </div>
  );
};
export default EstadisticasMensajes;
