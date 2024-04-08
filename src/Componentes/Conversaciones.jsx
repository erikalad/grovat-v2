import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Tag, Empty, Avatar } from 'antd';
import './styles.scss'; 

export default function Conversaciones({ conversacion }) {
    const nombreCuenta = useSelector((state) => state.nombreCuenta);
    const [nombreOtroUsuario, setNombreOtroUsuario] = useState('');

    useEffect(() => {
        // Extraer el nombre del otro usuario de la conversación
        if (conversacion && conversacion.length > 0) {
            const otroUsuario = conversacion.find(msg => msg.TO !== nombreCuenta[0]);
            if (otroUsuario) {
                setNombreOtroUsuario(otroUsuario.TO);
            }
        } else {
            // Resetea el nombre del otro usuario si no hay conversaciones
            setNombreOtroUsuario('');
        }
    }, [conversacion, nombreCuenta]);

    // Función para determinar si el mensaje es enviado por el usuario actual o no
    const isSentByCurrentUser = (msgFrom) => msgFrom === nombreCuenta[0];

    // Función para formatear la fecha del mensaje
    const formatDate = (dateString) => {
        const [month, day, year] = dateString.split('/');
        return `${month}/${day}/${year}`;
    };

    // Genera un número aleatorio para usar como seed en el avatar
    const randomNumber = Math.floor(Math.random() * 10000) + 1;
    let lastDate = ""
    // Verifica si hay conversaciones y las muestra, o muestra el componente Empty
    return (
        <div className={!conversacion ? "empty-conv mensajes-view" : "conversaciones-container mensajes-view"}>
            {/* Comprueba si hay contenido para mostrar */}
            {conversacion && conversacion.length > 0 ? (
                <>
                    {/* Mostrar el nombre del otro usuario */}
                    {nombreOtroUsuario && (
                        <div className='nav-conv'>
                            <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${randomNumber}`} />
                            <div className="nombre-otro-usuario">{nombreOtroUsuario}</div>
                        </div>
                    )}
                    {/* Mapea cada mensaje y muestra el contenido */}
                    {conversacion.map((msg, index) => {
                        const currentDate = formatDate(msg.DATE.DATE);
                        const isNewDate = currentDate !== lastDate;
                        lastDate = currentDate;

                        return (
                            <div key={index} className='contenedor-mensajes'>
                                {isNewDate && <div className="fecha"><Tag color='grey'>{currentDate}</Tag></div>}
                                <div className={isSentByCurrentUser(msg.FROM) ? 'nombre-saliente' : 'nombre-entrante'}>{msg.FROM}</div>
                                <div className={isSentByCurrentUser(msg.FROM) ? 'mensaje-saliente' : 'mensaje-entrante'}>
                                    <p>{msg.CONTENT}</p>
                                    <div className="hora">{msg.DATE.HORA}</div>
                                </div>
                            </div>
                        );
                    })}
                </>
            ) : (
                // Muestra Empty si no hay conversaciones
                <Empty description="Hacé click en una conversación para visualizarla" />
            )}
        </div>
    );
}
