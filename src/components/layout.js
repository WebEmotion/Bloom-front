import React, { useState, useEffect } from "react"
import { inject, observer } from "mobx-react"
import Img from "gatsby-image"
import PropTypes from "prop-types"
import { useStaticQuery, graphql, navigate, Link } from "gatsby"
import { ScrollPanel } from "primereact/scrollpanel"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Sidebar } from "primereact/sidebar"

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import "../assets/scss/global.scss"
import { useClearCache } from 'react-clear-cache'

import version from '../assets/version.json'
import * as VersionAPI from '../api/v0/version'
import * as MeAPI from '../api/v0/me'

import { Facebook, InstagramCircle, WhatsappCircle } from "./icons"

import Login from "./Login"

const Layout = inject("RootStore")(
  observer(({ RootStore, children, page, displayLogin, signupFailed }) => {
    const store = RootStore.UserStore
    const images = useStaticQuery(graphql`
      query {
        bloom: file(relativePath: { eq: "icons/BLOOM.png" }) {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `)
    const [state, setState] = useState({
      visibleLeft: false,
      visibleRight: false,
      visibleTop: false,
      visibleBottom: false,
      visibleFullScreen: false,
      visibleCustomToolbar: false,
    })
    const [visibleDialog, setVisibleDialog] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [latest, setLatest] = useState(true)
    const [hasActiveClasses, setHasActiveClasses] = useState(false)
    const { emptyCacheStorage } = useClearCache()
    useEffect(() => {
      if (page === "cycling-room") {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = "unset"
      }
      const getVersion = async () => {
        const response = await VersionAPI.checkVersion(version.version)
        if (response.success) {
          if (response.version.version === version.version) {
            setLatest(true)
          } else {
            setLatest(false)
            store.token = null
            store.isAdmin = false
            emptyCacheStorage()
          }
        } else {
          setLatest(false)
          store.token = null
          store.isAdmin = false
          //emptyCacheStorage()
        }
      }
      const load = async () => {
        const response = await MeAPI.me(store.token)
        if (response.success && response.data.profile.User_categories.length === 0 && !store.alertDisplayed && store.showAlertAgain) {
          setVisibleDialog(true)
        }
        /* const r2 = await MeAPI.classes(store.token)
        if (r2.success && r2.data.pending > 0) {
          setHasActiveClasses(true)
        } */
        setShowAlert(true)
      }
      getVersion()
      if (store.token && !store.isAdmin) { load() }
      else { setShowAlert(true) }
    }, [page])

    const [headerState, setHeaderState] = useState({
      collapseOpen: false,
      loginOpen: false,
    })

    const checkRegister = () => {
      if (displayLogin && !headerState.loginOpen) {
        console.log("LAYOUT")
        setHeaderState({ loginOpen: true })
      }
    }

    const toggleLogin = () => {
      setState({ visibleRight: false })
      setHeaderState({ loginOpen: !headerState.loginOpen })
    }
    const closeDialogLogin = () => {
      setHeaderState({ loginOpen: false })
      if (page === "terminos&condiciones") {
        signupFailed()
      }
    }

    const isLogued = () => {
      setHeaderState({ loginOpen: false })
      const load = async () => {
        const response = await MeAPI.me(store.token)
        if (response.success && response.data.profile.User_categories.length === 0 && !store.alertDisplayed && store.showAlertAgain) {
          setVisibleDialog(true)
        }
      }
      if (store.token && !store.isAdmin) load()
    }

    return (
      <>
        {checkRegister()}
        <Login
          open={headerState.loginOpen}
          toggle={closeDialogLogin}
          onLogin={isLogued}
        />
        <div style={{ width: "100%", margin: 0 }} className="p-grid">
          <div className="p-d-inline-flex p-d-md-none menu">
            <Button
              icon="pi pi-ellipsis-v"
              className="p-button-rounded menu-button"
              onClick={() => setState({ visibleRight: true })}
            />
          </div>
          <Sidebar
            visible={state.visibleRight}
            position="left"
            baseZIndex={1000000}
            onHide={() => setState({ visibleRight: false })}
          >
            <div className="p-grid p-justify-center">
              <div className="p-col-6">
                <Link to="/">
                  <Img
                    style={{
                      maxWidth: "100%",
                      marginTop: "2rem",
                      marginBottom: "1rem",
                    }}
                    fluid={images.bloom.childImageSharp.fluid}
                    imgStyle={{ objectFit: "contain" }}
                    className="fade-in"
                    onClick={() => navigate("/")}
                  />
                </Link>
              </div>
              <div className="p-col-12 p-md-10 p-lg-8">
                <ScrollPanel
                  style={{ width: "100%", height: "60vh" }}
                  className="custombar"
                >
                  <div className="p-grid p-justify-center"></div>
                  {!store.token && (<div className="p-col-12">
                    <Button
                      className={
                        page === "home"
                          ? "p-button menu-button active"
                          : "p-button menu-button"
                      }
                      label="HOME"
                      onClick={() => navigate("/")}
                    />
                  </div>)}
                  {!store.token && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "login" || page === "terminos&condiciones"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="LOGIN"
                        onClick={toggleLogin}
                      />
                    </div>
                  )}

                  {store.token && !store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "perfil"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="PERFIL"
                        onClick={() => navigate("/perfil")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "ventas"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="VENTAS"
                        onClick={() => navigate("/frontdesk/ventas")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "mis-clases" || page === "cycling-room" || page === "reservas"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={store.isAdmin ? "RESERVAR" : "MIS CLASES"}
                        onClick={() => navigate("/frontdesk/mis-clases")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "instructores"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={"INSTRUCTORES"}
                        onClick={() => navigate("/frontdesk/instructores")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "lugares"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={"CLIENTES"}
                        onClick={() => navigate("/frontdesk/clientes")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "lugares"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={"CLASES"}
                        onClick={() => navigate("/frontdesk/lugares")}
                      />
                    </div>
                  )}

                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "paquetes"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="PAQUETES"
                        onClick={() => navigate("/frontdesk/paquetes")}
                      />
                    </div>
                  )}

                  {/* {store.token && !store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "compra"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="COMPRA"
                        onClick={() => navigate("/compra")}
                      />
                    </div>
                  )} */}
                  {(!store.token || (store.token && !store.isAdmin)) && (<div className="p-col-12">
                    <Button
                      className={
                        page === "paquetes"
                          ? "p-button menu-button active"
                          : "p-button menu-button"
                      }
                      label="PAQUETES"
                      onClick={() => navigate("/paquetes")}
                    />
                  </div>)}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "grupos"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="GRUPOS"
                        onClick={() => navigate("/frontdesk/grupos")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "transacciones"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="TRANSACCIONES"
                        onClick={() => navigate("/frontdesk/transacciones")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "imagenes"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="IMAGENES"
                        onClick={() => navigate("/frontdesk/imagenes-home")}
                      />
                    </div>
                  )}

                  {/* <div className="p-col-12">
                    <Button
                      className={
                        page === "cycling-room"
                          ? "p-button menu-button active"
                          : "p-button menu-button"
                      }
                      label="CYCLING ROOM"
                      onClick={() => navigate("/cycling-room")}
                    />
                  </div> */}
                  {(!store.token || (store.token && !store.isAdmin)) && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "instructores"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="INSTRUCTORES"
                        onClick={() => navigate("/instructores")}
                      />
                    </div>
                  )}
                  {/* {(!store.token || (store.token && !store.isAdmin)) && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "quienes-somos"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="QUIÉNES SOMOS"
                        onClick={() => navigate("/quienes-somos")}
                      />
                    </div>
                  )} */}

                  {!store.token && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "horarios"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="HORARIOS"
                        onClick={() => navigate("/mis-clases")}
                      />
                    </div>
                  )}
                  {(!store.token || (store.token && !store.isAdmin)) && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "mapa"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="MAPA"
                        onClick={() => navigate("/mapa")}
                      />
                    </div>
                  )}
                  <div className="p-col-12">
                    <p style={{ margin: 0, textAlign: 'center', color: '#00000033' }}>Versión: {version.version} {latest ? '' : <span style={{ color: 'red' }}>No es la última versión</span>}</p>
                  </div>
                </ScrollPanel>
              </div>
              <div className="p-col-12 p-md-10 p-lg-8">
                <div className="p-d-flex p-jc-center p-ai-center">
                  <a
                    href="https://www.instagram.com/bloom.cycling/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social"
                  >
                    <InstagramCircle />
                  </a>
                  <a
                    href="https://www.facebook.com/bloomcycling-104800264716861"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social"
                  >
                    <Facebook />
                  </a>
                </div>
              </div>
            </div>
          </Sidebar>

          {/* <Dialog header="Estimado Bloomer" className="spDialog" visible={!store.isAdmin && store.token && showAlert && !store.showAlert} onHide={() => {
            setShowAlert(false)
            store.showAlert = true
          }}>
            <p>Estimado Bloomer, <span style={{ fontWeight: 'bold' }}>si has tenido algún contratiempo con tus compras</span>, te pedimos que nos ayudes con más detalles, respondiendo el siguiente cuestionario.</p>
            <div className="p-d-flex p-jc-center" style={{ width: '100%', paddingTop: 20, paddingBottom: 20 }}>
              <Button 
                  onClick={() => {
                    setShowAlert(false)
                    store.showAlert = true
                    navigate('/encuesta')
                  }} 
                  className="p-button-rounded p-button-pink" 
                  label={"Realizar cuestionario"} 
              />
            </div>
          </Dialog> */}
          {/* <Dialog header="Estimado Bloomer" className="spDialog" visible={showAlert && !store.showAlert && !hasActiveClasses} onHide={() => {
            setShowAlert(false)
            store.showAlert = true
          }}>
            <p>Por disposición oficial nos hemos visto en la necesidad de cerrar todas las clases programadas del mes y cancelar las reservaciones que se hicieron. No te preocupes, todas tus compras permanecerán congeladas hasta nuevo aviso y no perderán vigencia. Si reservaste para una clase futura, podrás recuperarla en cuanto la situación mejore.</p>
            <p style={{ fontWeight: 'bold' }}>¡Estamos contando los días para vernos de nuevo!</p>
          </Dialog> */}
          <Dialog header="Atención" className="spDialog" visible={visibleDialog} onHide={() => {
            setVisibleDialog(false)
            store.alertDisplayed = true
          }}>
            <p style={{ fontWeight: 'bold' }}>¡Hola de nuevo, Bloomer!</p>
            <p>Ahora puedes configurar tu calzado y el peso de tus mancuernas desde tu perfil. De esta manera será más agil tu ingreso a cada una de nuestras clases.</p>
            <div className="p-d-flex p-jc-end p-ai-end">
              <Button style={{ backgroundColor: 'white', color: '#828282', borderRadius: 20, border: 'none' }} label="No mostrar de nuevo" onClick={() => {
                setVisibleDialog(false)
                store.alertDisplayed = true
                store.showAlertAgain = false
              }} />
              <Button style={{ backgroundColor: '#3eb978', color: '#fff', borderRadius: 20, border: 'none' }} label="Ir a mi configuración" onClick={() => {
                setVisibleDialog(false)
                store.alertDisplayed = true
                navigate('/configuracion')
              }} />
            </div>
          </Dialog>
          <div
            className="p-col-3 p-shadow-3 p-d-none p-d-md-inline-flex"
            style={{ zIndex: 2, background: `#fff` }}
          >
            <div
              className="p-grid p-justify-center p-align-start vertical-container"
              style={{ display: "flow-root", width: "23%", position: 'fixed' }}
            >
              <div className="p-col-12">
                <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
                  <div className="p-col-12 p-md-10 p-lg-8">
                    <Link to="/">
                      <Img
                        style={{
                          maxWidth: "100%",
                          marginTop: "2rem",
                          marginBottom: "1rem",
                        }}
                        fluid={images.bloom.childImageSharp.fluid}
                        imgStyle={{ objectFit: "contain" }}
                        className="fade-in"
                      />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="p-col-12">
                <ScrollPanel
                  style={{
                    width: "100%",
                    height:
                      page === "mis-clases" || page === "cycling-room"
                        ? "100%"
                        : "60vh",
                    marginLeft: 10
                  }}
                  className="custombar"
                >
                  <div className="p-grid p-justify-center"></div>
                  {!store.token && (<div className="p-col-12">
                    <Button
                      className={
                        page === "home"
                          ? "p-button menu-button active"
                          : "p-button menu-button"
                      }
                      label="HOME"
                      onClick={() => navigate("/")}
                    />
                  </div>)}
                  {!store.token && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "login" || page === "terminos&condiciones"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="LOGIN"
                        onClick={toggleLogin}
                      />
                    </div>
                  )}

                  {store.token && !store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "perfil"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="PERFIL"
                        onClick={() => navigate("/perfil")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "ventas"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="VENTAS"
                        onClick={() => navigate("/frontdesk/ventas")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "mis-clases" || page === "cycling-room" || page === "reservas"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={store.isAdmin ? "RESERVAR" : "MIS CLASES"}
                        onClick={() => navigate("/frontdesk/mis-clases")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "instructores"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={"INSTRUCTORES"}
                        onClick={() => navigate("/frontdesk/instructores")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "clientes"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={"CLIENTES"}
                        onClick={() => navigate("/frontdesk/clientes")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "lugares"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label={"CLASES"}
                        onClick={() => navigate("/frontdesk/lugares")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "paquetes"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="PAQUETES"
                        onClick={() => navigate("/frontdesk/paquetes")}
                      />
                    </div>
                  )}

                  {/* {store.token && !store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "historial"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="HISTORIAL"
                        onClick={() => navigate("/historial")}
                      />
                    </div>
                  )} */}
                  {/* {store.token && !store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "compra"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="COMPRA"
                        onClick={() => navigate("/compra")}
                      />
                    </div>
                  )} */}
                  {(!store.token || (store.token && !store.isAdmin)) && (<div className="p-col-12">
                    <Button
                      className={
                        page === "paquetes"
                          ? "p-button menu-button active"
                          : "p-button menu-button"
                      }
                      label="PAQUETES"
                      onClick={() => navigate("/paquetes")}
                    />
                  </div>)}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "grupos"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="GRUPOS"
                        onClick={() => navigate("/frontdesk/grupos")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "transacciones"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="TRANSACCIONES"
                        onClick={() => navigate("/frontdesk/transacciones")}
                      />
                    </div>
                  )}
                  {store.token && store.isAdmin && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "imagenes"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="IMAGENES"
                        onClick={() => navigate("/frontdesk/imagenes-home")}
                      />
                    </div>
                  )}

                  {/* <div className="p-col-12">
                    <Button
                      className={
                        page === "cycling-room"
                          ? "p-button menu-button active"
                          : "p-button menu-button"
                      }
                      label="CYCLING ROOM"
                      onClick={() => navigate("/cycling-room")}
                    />
                  </div> */}
                  {(!store.token || (store.token && !store.isAdmin)) && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "instructores"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="INSTRUCTORES"
                        onClick={() => navigate("/instructores")}
                      />
                    </div>
                  )}
                  {/* {(!store.token || (store.token && !store.isAdmin)) && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "quienes-somos"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="QUIÉNES SOMOS"
                        onClick={() => navigate("/quienes-somos")}
                      />
                    </div>
                  )} */}

                  {!store.token && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "horarios"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="HORARIOS"
                        onClick={() => navigate("/mis-clases")}
                      />
                    </div>
                  )}
                  {(!store.token || (store.token && !store.isAdmin)) && (
                    <div className="p-col-12">
                      <Button
                        className={
                          page === "mapa"
                            ? "p-button menu-button active"
                            : "p-button menu-button"
                        }
                        label="MAPA"
                        onClick={() => navigate("/mapa")}
                      />
                    </div>
                  )}
                  <div className="p-col-12">
                    <p style={{ margin: 0, textAlign: 'center', color: '#00000033' }}>Versión: {version.version} {latest ? '' : <span style={{ color: 'red' }}>No es la última versión</span>}</p>
                  </div>
                </ScrollPanel>
              </div>
              <div className="p-col-12">
                <div className="p-d-flex p-jc-center p-ai-center">
                  <a
                    href="https://www.instagram.com/bloom.cycling/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social"
                  >
                    <InstagramCircle />
                  </a>
                  <a
                    href="https://www.facebook.com/bloomcycling-104800264716861"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social"
                  >
                    <Facebook />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-col-12 p-md-9"
            style={{
              padding: 0,
              zIndex:
                page === "home" ||
                  page === "terminos&condiciones" ||
                  page === "contacto"
                  ? 1
                  : 2,
            }}
          >
            <div
              className="p-d-flex p-flex-column"
              style={{
                margin: 0,
                padding: `0 1.0875rem 1.45rem`,
                minHeight: `100vh`,
                zIndex: 1,
              }}
            >
              <main className="p-mt-auto p-as-stretch" style={{ zIndex: 1, height: '100%' }}>
                {children}
              </main>
              <footer
                className="p-mt-auto footer"
                style={{
                  zIndex:
                    page === "home" ||
                      page === "terminos&condiciones" ||
                      page === "contacto"
                      ? 2
                      : 0,
                  color: page === "home" ? 'white' : '#00000055',
                  textShadow: page === "home" ? '2px 1px 7px rgba(0,0,0,0.46)' : 'none'
                }}
              >
                Bloom Cycling Studio - Derechos Reservados{" "}
                {new Date().getFullYear()}
                <br />
                <Link to="/terminosycondiciones" style={{ textDecoration: "none" }}>
                  <small style={{ color: page === "home" ? 'white' : '#00000055' }} className="footer">Terminos y Condiciones del Servicio</small>
                </Link>
                <br/>
                <a href="https://wa.me/+525580510715?text=Quiero Bloom" target="_blank" rel="noopener noreferrer" style={{ color: page === "home" ? 'white' : '#00000055', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><WhatsappCircle/><span style={{ marginLeft: 10 }}>5580510715</span></a>
              </footer>
            </div>
          </div>
        </div>
      </>
    )
  })
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
