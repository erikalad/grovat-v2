import React from 'react'
import fondo from './../imagenes/LogoCircular.jpeg'
import './styles.scss'
import LoginForm from '../Componentes/Loginform'
import { useSelector } from 'react-redux';

export default function Login() {
  // const fondo = useSelector(state => state.customizaciones.find(item => item.fieldName === 'URL del Logo')?.fieldValue);

  return (
    <div className='contenedor-login'>
    <div className='login'>
        <div className='form-login'>
        <LoginForm/>
        </div>
    </div>
  <img src={fondo} className='img-fondo img-login'/>
    </div>
  )
}
