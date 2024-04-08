import React from 'react';
import { useSelector } from "react-redux";
import { Tag} from 'antd';
import './styles.scss'; 


export default function Conversaciones({ conversacion }) {
    const nombreCuenta = useSelector((state)=> state.nombreCuenta)

    // Función para determinar si el mensaje es enviado por el usuario actual o no
    const isSentByCurrentUser = (msgFrom) => {
        // Comparar el remitente del mensaje con el usuario actual (puedes usar algún sistema de autenticación para obtener el usuario actual)
        return msgFrom === nombreCuenta[0]; // Ejemplo: si el usuario actual es 'Erika Ladner'
    };

        // Función para formatear la fecha del mensaje
        const formatDate = (dateString) => {
            const [month, day, year] = dateString.split('/'); // Dividir la fecha en partes
            // Formatear la fecha en formato dd/mm/yyyy
            const formattedDate = `${month}/${day}/${year}`;
            return formattedDate;
        };

    // Variable para almacenar el día del último mensaje mostrado
    let lastDate = '';

    return (
        <div className="conversaciones-container">
            {/* Mapea cada mensaje y muestra el contenido */}
            {conversacion.map((msg, index) => {
                // Verificar si el mensaje tiene una fecha diferente al último mensaje mostrado
                const currentDate = formatDate(msg.DATE.DATE);
                const isNewDate = currentDate !== lastDate;
                lastDate = currentDate;

                return (
                    <div key={index} className='contenedor-mensajes'>
                        {/* Mostrar la fecha si es diferente al último mensaje mostrado */}
                        {isNewDate && <div className="fecha"><Tag color='grey'>{currentDate}</Tag></div>}
                        
                        {/* Mostrar el nombre del remitente */}
                        <div className={isSentByCurrentUser(msg.FROM) ? 'nombre-saliente' : 'nombre-entrante'}>{msg.FROM}</div>
                        
                        {/* Mostrar el contenido del mensaje */}
                        <div className={isSentByCurrentUser(msg.FROM) ? 'mensaje-saliente' : 'mensaje-entrante'}>
                            <p>{msg.CONTENT}</p>
                            {/* Mostrar la hora del mensaje */}
                            <div className="hora">{msg.DATE.HORA}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
