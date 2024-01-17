import React from 'react';
import { Progress, Space, Tooltip } from 'antd';

const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const Progreso = ({ data, mesesFiltrados, cantArchivos }) => {
  const mesesSeparados = mesesFiltrados?.split(',').map(mes => mes.trim());
  const totalObjetivo = 800 * (mesesSeparados?.length || 0) * cantArchivos; // Manejar el caso en que mesesSeparados sea undefined
  const porcentaje = isFinite(totalObjetivo) ? Math.min((data.length / totalObjetivo) * 100, 100).toFixed(0) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 16,
      }}
    >
       <Space wrap style={{cursor:'pointer'}}>
      <Tooltip title={`El ${parseInt(porcentaje)}% del KPI fue invitado`}>
        <Progress type="dashboard" percent={parseInt(porcentaje)} strokeColor={twoColors} />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Progreso;
