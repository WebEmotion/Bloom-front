import React, { useRef } from "react"
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

import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props"

import { FaFacebook, FaGoogle } from "react-icons/fa"
import { FiCheckCircle } from "react-icons/fi"

import store from "./store"

const Loading = ({ message }) => {
  return (
    <div style={{ width: '100%', height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', flex: 1 }} className="loader-login">
      <ProgressSpinner/>
      <p className="login-info">{message}</p>
    </div>
  )
}

const SuccessModal = ({ onClose }) => {
  return (
    <Dialog
      header="Tu cuenta ha sido creada"
      visible={true}
      maximizable
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
      } else {
        let token = await store.login(userStore)
        userStore.token = token.token
        setTimeout(() => {
          if (onLogin && token) {
            store.loading = false
            onLogin()
            navigate("/")
          }
        }, 3000)
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
        toggle()
        navigate("/terminos&condiciones")
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
      setTimeout(() => {
        store.loading = false
        store.loading_message = ""
        if (onLogin && token) {
          onLogin()
        }
      }, 3000)
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
      setTimeout(() => {
        store.loading = false
        store.loading_message = ""
        if (onLogin && token) {
          onLogin()
        }
      }, 3000)
    }

    const myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    return (
      <Dialog
        visible={open}
        modal
        onHide={() => navigate("/")}
        className="login-dialog"
      >
        <Toast ref={myToast} />
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

        {!store.loading && (
          <div>
            <h3 className="login-text login-title p-mb-4">Iniciar sesión</h3>
            <div className="p-grid p-align-center p-justify-center">
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
            </div>
            <div className="p-grid p-align-center p-justify-center">
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
            </div>
            <div className="p-grid p-align-center p-justify-center p-mb-4 p-mt-2">
              <Button
                onClick={handleLogin}
                className="login-btn"
                label="Entrar"
              />
            </div>
          </div>
        )}
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
