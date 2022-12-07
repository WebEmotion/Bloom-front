import React, { useRef, useState } from "react"
import { navigate } from "gatsby"
import { observer, inject } from "mobx-react"

import { Dialog } from "primereact/dialog"
import { ScrollPanel } from "primereact/scrollpanel"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { ProgressSpinner } from "primereact/progressspinner"
import { Toast } from "primereact/toast"

import * as Constants from "../../environment"
import Loader from "react-loader-spinner"
import PropTypes from "prop-types"

import { GoogleLogin } from "react-google-login"
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"

import { FaFacebook, FaGoogle } from "react-icons/fa"
import { FiCheckCircle } from "react-icons/fi"

import store from "./store"
import * as Auth from "../../api/v0/auth"

const Loading = ({ message }) => {
  return (
    <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', flex: 1 }} className="loader-login">
      <div>
        <ProgressSpinner />
        <p className="login-info">{message}</p>
      </div>
    </div>
  )
}

const SuccessModal = ({ onClose }) => {
  return (
    <Dialog
      header="Tu cuenta ha sido creada"
      visible={true}
      modal
      className="dialog"
      onHide={onClose}
    >
      <p style={{ color: Constants.COLORS.primary, fontSize: 64 }}>
        <FiCheckCircle />
      </p>
      <p
        style={{
          color: "white",
          fontFamily: Constants.FONTS.regular,
          textAlign: "justify",
        }}
      >
        Hemos mandado un enlace a tu correo para verificar tu cuenta.
      </p>
      <Button
        onClick={onClose}
        className="login-btn2"
        style={{ marginTop: 20 }}
        label="Cerrar"
      />
    </Dialog>
  )
}

const Login = inject("RootStore")(
  observer(({ RootStore, open, toggle, specialTitle, onLogin, onSignup }) => {
    const userStore = RootStore.UserStore
    const handleKeyDown = event => {
      if (event.keyCode === 13 && store.validateLogin()) {
        handleLogin()
      }
    }
    const handleLogin = async () => {
      let isValid = store.validateLogin()
      if (!isValid) {
        store.alert_message = "Por favor, completa todos los campos"
        store.show_alert = true
        showToast("error", "Upps!", "Completa todos los campos.")
        setTimeout(() => {
          store.show_alert = false
        }, 3000)
        store.show_alert = false
      } else {
        let response = await store.login(userStore)
        if (response.success) {
          userStore.token = response.token
        } else {
          showToast("error", "Upps!", response.message)
        }
        if (onLogin && response.token) {
          store.loading = false
          onLogin()
        } else {
          store.loading = false
        }
      }
    }
    const handleRecovery = async () => {
      store.loading = true
      store.loading_message = 'Enviando email de recuperación...'
      let response = await Auth.recoveryPassword(emailReset)
      if (response.success) {
        setResetPassword(false)
        setTimeout(() => {
          store.loading = false
          store.loading_message = ''
          showToast("success", "Operación exitosa!", 'Te hemos enviado un email con los datos de recuperación.')
        }, 3000)
      } else {
        showToast("error", "Upps!", response.message)
        store.loading = false
        store.loading_message = ''
      }

    }
    const handleSignUp = async () => {
      let isValid = store.validateSignup()
      if (!isValid.valid) {
        store.alert_message = isValid.message
        store.show_alert = true
        showToast("error", "Upps!", "Completa todos los campos.")
        setTimeout(() => {
          store.show_alert = false
        }, 3000)
      } else {
        const response = await Auth.validateEmail(store.email_signup)
        if (response.success && response.available) {
          toggle()
          userStore.signinup = true
          navigate("/terminos&condiciones")
        } else if (response.success) {
          showToast("warn", "Atención", "El correo que ingresaste ya se encuentra registrado")
        } else {
          showToast("error", "Atención", response.message)
        }
      }
    }
    const handleLoginFb = async response => {
      let token = await store.loginFacebook(
        response.userID,
        response.accessToken,
        response.email,
        response.first_name,
        response.last_name,
        "",
        "",
        "",
        `https://graph.facebook.com/${response.userID}/picture?type=large`,
        userStore
      )
      userStore.token = token
      store.loading = false
      store.loading_message = ""
      if (onLogin && token) {
        onLogin()
      }
    }
    const handleLoginGoogle = async response => {
      let token = await store.loginGoogle(
        response.googleId,
        response.tokenId,
        response.profileObj.email,
        response.profileObj.givenName,
        response.profileObj.familyName,
        "",
        "",
        "",
        response.profileObj.imageUrl,
        userStore
      )
      userStore.token = token
      store.loading = false
      store.loading_message = ""
      if (onLogin && token) {
        onLogin()
      }
    }

    const myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    const [resetPassword, setResetPassword] = useState(false)
    const [emailReset, setEmailReset] = useState("")

    return (
      <Dialog
        header={userStore.tempToken ? 'Invitación de registro': ''}
        visible={open}
        modal
        onHide={toggle}
        className="login-dialog"
      >
        <Toast ref={myToast} />
        <ScrollPanel
          style={{ width: "100%", height: "70vh" }}
          className="custombar-login"
        >
          {store.showSignupSuccess && (
            <SuccessModal
              onClose={() => {
                store.showSignupSuccess = false
                if (onLogin && userStore.token) {
                  onLogin()
                }
              }}
            />
          )}
          {store.loading && <Loading message={store.loading_message} />}

          {!store.loading && !resetPassword && (
            <div>
              {!userStore.tempToken && <h3 className="login-text login-title">Iniciar sesión</h3>}
              {!userStore.tempToken && <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Iniciar sesión con:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <FacebookLogin
                    appId={Constants.KEYS.facebook}
                    callback={handleLoginFb}
                    autoLoad={false}
                    fields="first_name,last_name,email,picture"
                    disableMobileRedirect
                    redirectUri='https://www.bloomcycling.com/'
                    render={renderProps => (
                      <button
                        onClick={renderProps.onClick}
                        className="iconSocialMedia"
                      >
                        {" "}
                        <FaFacebook
                          style={{ color: Constants.COLORS.primary }}
                        />{" "}
                      </button>
                    )}
                  />
                  {/* <GoogleLogin
                    cookiePolicy={"single_host_origin"}
                    clientId={Constants.KEYS.google}
                    render={renderProps => (
                      <button
                        onClick={renderProps.onClick}
                        className="iconSocialMedia"
                      >
                        {" "}
                        <FaGoogle
                          style={{ color: Constants.COLORS.primary }}
                        />{" "}
                      </button>
                    )}
                    buttonText="Login"
                    onSuccess={handleLoginGoogle}
                    onFailure={response => {
                      console.log(response)
                    }}
                  /> */}
                </div>
              </div>}
              {!userStore.tempToken && <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Email:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.email_login_invalid
                          ? "pi pi-exclamation-circle"
                          : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.email_login}
                      onKeyDown={handleKeyDown}
                      onChange={event => {
                        store.email_login = event.target.value
                      }}
                      type="email"
                    />
                  </span>
                </div>
              </div>}
              {!userStore.tempToken && <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Contraseña:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.password_login_invalid
                          ? "pi pi-exclamation-circle"
                          : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.password_login}
                      onKeyDown={handleKeyDown}
                      onChange={event => {
                        store.password_login = event.target.value
                      }}
                      type="password"
                    />
                  </span>
                </div>
              </div>}
              {!userStore.tempToken && <div className="p-grid p-align-center p-justify-center">
                <Button
                  onClick={handleLogin}
                  className="login-btn"
                  label="Entrar"
                />
              </div>}
              {!userStore.tempToken && <div className="p-grid p-align-center p-justify-center p-mt-1">
                <Button
                  onClick={() => {
                    setResetPassword(true)
                  }}
                  className="p-button-link btn-link-pass"
                  label="¿Olvidaste tu contraseña?"
                />
              </div>}

              {!userStore.tempToken && <div className="login-fullDivider" />}
              <h3 className="login-text login-title" style={{ marginTop: 30 }}>
                Registro
              </h3>

              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Nombre:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.name_invalid ? "pi pi-exclamation-circle" : ""
                      }
                      style={{ color: "red" }}
                    />
                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.name}
                      onChange={event => {
                        store.name = event.target.value
                      }}
                      type="text"
                    />
                  </span>
                </div>
              </div>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Apellido:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.lastname_invalid ? "pi pi-exclamation-circle" : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.lastname}
                      onChange={event => {
                        store.lastname = event.target.value
                      }}
                      type="text"
                    />
                  </span>
                </div>
              </div>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Email:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.email_signup_invalid
                          ? "pi pi-exclamation-circle"
                          : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.email_signup}
                      onChange={event => {
                        store.email_signup = event.target.value
                      }}
                      type="email"
                    />
                  </span>
                </div>
              </div>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Confirmar email:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.email_signup_conf_invalid
                          ? "pi pi-exclamation-circle"
                          : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.email_signup_conf}
                      onPaste={e => {
                        e.preventDefault()
                        return false
                      }}
                      onChange={event => {
                        store.email_signup_conf = event.target.value
                      }}
                      type="email"
                    />
                  </span>
                </div>
              </div>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Contraseña:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.password_signup_invalid
                          ? "pi pi-exclamation-circle"
                          : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.password_signup}
                      onChange={event => {
                        store.password_signup = event.target.value
                      }}
                      type="password"
                    />
                  </span>
                </div>
              </div>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-5">
                  <p className="login-label">Confirmar contraseña:</p>
                </div>
                <div className="p-col-6 p-md-7">
                  <span className="p-input-icon-right">
                    <i
                      className={
                        store.password_signup_conf_invalid
                          ? "pi pi-exclamation-circle"
                          : ""
                      }
                      style={{ color: "red" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={store.password_signup_conf}
                      onPaste={e => {
                        e.preventDefault()
                        return false
                      }}
                      onChange={event => {
                        store.password_signup_conf = event.target.value
                      }}
                      type="password"
                    />
                  </span>
                </div>
              </div>

              <div className="p-grid p-align-center p-justify-center p-mb-2">
                <Button
                  onClick={handleSignUp}
                  className="login-btn2"
                  label="Registrarme"
                />
              </div>
            </div>
          )}

          {!store.loading && resetPassword && (
            <div>
              <h3 className="login-text login-title">Recuperar Contraseña</h3>
              <h4 style={{ textAlign: "center" }}>
                Por favor introduce el email con el que ingresas a tu cuenta.
              </h4>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-8 p-md-7">
                  <span
                    className="p-input-icon-right"
                    style={{ width: "100%" }}
                  >
                    <i
                      className={
                        emailReset === "" ? "pi pi-exclamation-circle" : ""
                      }
                      style={{ color: "#d78676" }}
                    />

                    <InputText
                      className="p-inputtext-sm form-input"
                      value={emailReset}
                      onChange={event => {
                        setEmailReset(event.target.value)
                      }}
                      type="email"
                      style={{ width: "100%", maxWidth: "100%" }}
                    />
                  </span>
                </div>
              </div>
              <div className="p-grid p-align-center p-justify-center">
                <Button
                  onClick={() => {
                    handleRecovery()
                  }}
                  className="login-btn"
                  label="Recuperar contraseña"
                  style={{ width: "250px", marginTop: "2rem" }}
                  disabled={emailReset === ""}
                />
              </div>
              <div className="p-grid p-align-center p-justify-center p-mt-1">
                <Button
                  onClick={() => {
                    setResetPassword(false)
                  }}
                  className="p-button-link btn-link-pass"
                  label="Cancelar"
                />
              </div>
            </div>
          )}
        </ScrollPanel>
      </Dialog>
    )
  })
)

Login.propTypes = {
  toggle: PropTypes.func.isRequired,
  specialTitle: PropTypes.string,
  onLogin: PropTypes.func,
  onSignup: PropTypes.func,
}

export default Login
