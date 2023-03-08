import React, { useState, useRef } from "react"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"

import Loader from "react-loader-spinner"

import * as queryString from "query-string"
// import * as Auth from "../api/v0/auth"
import store from "../components/Login/store"
import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = inject("RootStore")(
  observer(({ RootStore, location }) => {
    const storeUser = RootStore.UserStore
    //console.log(location) // inspect location for yourself

    // query-string parses the parameters that are contained in the location object
    const { token } = queryString.parse(location.search)

    console.log(token)

    if (!token) {
      navigate("/")
    }

    const myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    const handleChangePassword = async () => {
      if (password === passwordConf) {
        setLoading(true)
        //let response = await Auth.changePassword(token, password)
        let response = await store.changePassword(storeUser, token, password)
        if (response.success) {
          showToast(
            "success",
            "Operación exitosa!",
            "Tu contraseña ha sido actualizada."
          )
          setTimeout(() => {
            setLoading(false)
            navigate("/")
          }, 3000)
        } else {
          setLoading(false)
          showToast("error", "Upps!", response.message)
        }
      } else {
        showToast("error", "Upps!", "Las contraseñas no coinciden.")
      }
    }

    const [password, setPassword] = useState("")
    const [passwordConf, setPasswordConf] = useState("")
    const [loading, setLoading] = useState(false)

    return (
      <>
        <Toast ref={myToast} />
        {loading && (
          <div
            style={{
              position: "absolute",
              height: "100vh",
              width: "100vw",
              top: 0,
              left: 0,
              backgroundColor: "#00000080",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              textAlign: "center",
              color: "white",
              flexDirection: "column",
            }}
          >
            <Loader color="#ffffff" width="100" height="100" type="Grid" />
            <p style={{ margin: "1rem" }}>Cambiando contraseña...</p>
          </div>
        )}
        <Layout page="login">
          <SEO title="Recuperar contraseña" />
          <h1
            style={{
              textAlign: "center",
              color: "#3eb978",
              fontFamily: "Poppins-Regular",
            }}
          >
            Recuperar contraseña.
          </h1>
          <p style={{ textAlign: "center" }}>Ingresa tu nueva contraseña.</p>
          <div className="p-grid p-align-center p-justify-center">
            <div className="p-col-5">
              <p className="login-label">Contraseña:</p>
            </div>
            <div className="p-col-6 p-md-7">
              <span className="p-input-icon-right">
                <i
                  className={password === "" ? "pi pi-exclamation-circle" : ""}
                  style={{ color: "#3eb978" }}
                />

                <InputText
                  className="p-inputtext-sm"
                  value={password}
                  onChange={event => {
                    setPassword(event.target.value)
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
                    passwordConf === "" ? "pi pi-exclamation-circle" : ""
                  }
                  style={{ color: "#3eb978" }}
                />

                <InputText
                  className="p-inputtext-sm"
                  value={passwordConf}
                  onChange={event => {
                    setPasswordConf(event.target.value)
                  }}
                  type="password"
                />
              </span>
            </div>
          </div>

          <div className="p-grid p-align-center p-justify-center">
            <Button
              onClick={() => {
                handleChangePassword()
              }}
              className="login-btn"
              label="Cambiar contraseña"
              style={{ width: "250px", marginTop: "2rem" }}
              disabled={password === "" || passwordConf === ""}
            />
          </div>
        </Layout>
      </>
    )
  })
)

export default IndexPage
