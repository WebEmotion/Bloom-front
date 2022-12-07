import React, { useState, useEffect, useRef } from 'react'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Button } from 'primereact/button'
import { ProgressSpinner } from "primereact/progressspinner"
import { Toast } from "primereact/toast"
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import * as AuthAPI from '../../api/v0/auth'
import SEO from '../../components/seo'
import "../../assets/scss/global.scss"

const LoginInstructores = inject("RootStore")(observer(({ RootStore }) => {

    // States
    let toast = useRef(null)
    const store = RootStore.UserStore
    const [loading, setLoading] = useState({
        loading: false,
        animateIn: false
    })
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })

    // Effects
    useEffect(() => {
        if (store.token && store.isCollaborator) navigate("/coaches/dashboard")
    }, [])

    // Events
    const handleLogin = async () => {
        setLoading({
            loading: true,
            animateIn: true
        })
        const response = await AuthAPI.loginInstructor(loginData.email, loginData.password)
        if (response.success) {
            store.token = response.token
            store.email = response.instructor.email
            store.name = (response.instructor.name + ' ' + response.instructor.lastname).trim()
            store.id = response.instructor.id
            store.pictureUrl = response.instructor.profilePicture
            store.isInstructor = true
            navigate("/coaches/dashboard")
        } else {
            const message = response.message
            if (message === 'Invalid Credentials') {
                toast.current.show({ severity: 'warn', summary: 'Atención!', detail: 'Tus credenciales son inválidas' })
            } else {
                toast.current.show({ severity: 'error', summary: 'Atención!', detail: message });
            }
        }
        setLoading({
            loading: false,
            animateIn: false
        })
    }

    const changeEmail = (e) => {
        setLoginData({
            ...loginData,
            email: e.target.value
        })
        //console.log(e.targett.value)
    }
    const changePassword = (e) => {
        setLoginData({
            ...loginData,
            password: e.target.value
        })
        //console.log(e.targett.value)
    }

    // Templates

    // Layout
    return (
        <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ height: '100vh' }}>
            <Toast ref={toast} />
            <SEO title="Iniciar sesión | Instructores"/>
            <div className="logo" style={{ marginBottom: 50 }}>
                <img style={{ height: 100, width: '100%', objectFit: 'contain' }} src="https://digital-ignition.com.mx/logo.png" />
            </div>
            <div>
                <h3>Inicio de sesión instructores</h3>
            </div>
            <div style={{ width: '90%', maxWidth: 400 }}>
                <p style={{ margin: 0, marginBottom: 10, marginTop: 10 }}>Correo electrónico:</p>
                <InputText style={{ width: '100%' }} onChange={changeEmail.bind(this)} />
            </div>
            <div style={{ width: '90%', maxWidth: 400 }}>
                <p style={{ margin: 0, marginBottom: 10, marginTop: 10 }}>Contraseña:</p>
                <Password feedback={false} style={{ width: '100%' }} onChange={changePassword.bind(this)} />
            </div>
            <Button style={{ margin: 20 }} label="Acceder" className="p-button-rounded p-button-pink" onClick={handleLogin} />
            <a style={{cursor: 'pointer', fontSize: 12, opacity: 0.75}} onClick={() => navigate('/')}>Volver a la página principal</a>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3} />
            </div>}
        </div>
    )
}))

export default LoginInstructores