import React from 'react'
import fondo from './../imagenes/grovat-fondo.jpeg'
import './styles.css'
import LoginForm from '../Componentes/Loginform'

export default function Login() {
  return (
    <div className='contenedor-login'>
    <div className='login'>
        <div className='form-login'>
        <LoginForm/>
        </div>
    </div>
    <div className='img-login'><img src={fondo} className='img-fondo'/></div>
    </div>
  )
}
