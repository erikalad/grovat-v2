import React from 'react';
import { Progress, Space, Tooltip } from 'antd';
import { useSelector } from 'react-redux';

const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const Progreso = ({ data, mesesFiltrados, cantArchivos }) => {
  const semanas = useSelector(state=>state.semanas)
  const valorBase = semanas * 200;
  const totalObjetivo = valorBase * cantArchivos; // Ajuste del cálculo
  const porcentaje = isFinite(totalObjetivo) ? Math.min((data.length / totalObjetivo) * 100, 100).toFixed(0) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 16,
      }}
    >
      <Space wrap style={{ cursor: 'pointer' }}>
        <Tooltip title={`El ${parseInt(porcentaje)}% del KPI fue invitado`}>
          <Progress type="dashboard" percent={parseInt(porcentaje)} strokeColor={twoColors} />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Progreso;
