import React from 'react';
import { Progress, Space , Tooltip} from 'antd';

const twoColors = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const ProgresoConexiones = ({ data, invitaciones }) => {
  const totalInvitaciones = invitaciones.length || 1; // Manejar el caso en que invitaciones.length sea 0
  const totalConexiones = data.length;

  const porcentaje = isFinite(totalInvitaciones) ? Math.min((totalConexiones / totalInvitaciones) * 100, 100).toFixed(0) : 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: 16,
      }}
    >
      <Space wrap style={{cursor:'pointer'}}>
      <Tooltip title={`El ${parseInt(porcentaje)}% de invitaciones enviadas, fueron aceptadas`}>
        <Progress type="dashboard" percent={parseInt(porcentaje)} strokeColor={twoColors} />
        </Tooltip>
      </Space>
    </div>
  );
};

export default ProgresoConexiones;

