import React from 'react';
import { Progress, Space , Tooltip} from 'antd';
import { useSelector } from 'react-redux';


const ProgresoConexiones = ({ data, invitaciones }) => {
  const totalInvitaciones = invitaciones.length || 1; // Manejar el caso en que invitaciones.length sea 0
  const totalConexiones = data.length;
  const colorPrincipal = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Principal')?.fieldValue);
  const colorSecundario = useSelector(state => state.customizaciones.find(item => item.fieldName === 'Color Secundario')?.fieldValue);

  const porcentaje = isFinite(totalInvitaciones) ? Math.min((totalConexiones / totalInvitaciones) * 100, 100).toFixed(0) : 0;

  const twoColors = {
    '0%': colorPrincipal,
    '100%': colorSecundario,
  };

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

