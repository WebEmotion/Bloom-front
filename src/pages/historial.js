import React, { useState, useEffect } from "react"
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator'
import { navigate } from "gatsby"
import * as moment from 'moment'
import QRCode from 'react-qr-code'
import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

import * as Auth from "../api/v0/auth"
import { FaClosedCaptioning } from "react-icons/fa"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const [loading, setLoading] = useState({
      loading: true,
      animateIn: true
    })

    const [history, setHistory] = useState({
      pending: 0,
      taken: 0,
      purchases: [],
    })

    const [details, setDetails] = useState({
      display: false,
      data: null
    })

    const hasExpired = (purchase) => {
      const expiresAt = moment(purchase.expirationDate)
      if (moment().isAfter(expiresAt)) {
        return true
      }
      return false
    }
    
    const getTransactionDate = (purchase) => {
      return purchase.date.substring(0, 10)
    }

    const showDetails = (data) => {
      setDetails({
        display: true,
        data: data
      })
    }

    const [first, setFirst] = useState(0)
    const [historyCount, setHistoryCount] = useState(0)
    const changePage = (e) => {
      //console.log(e)
      setFirst(e.first)
      reload(e.page + 1)
    }

    const reload = async (pages) => {
      setLoading({
          loading: true,
          animateIn: true
      })

      const data = await Auth.history(store.token, pages)
      if (data.success) {
        setHistory(data.data)
        setHistoryCount(data.data.pages)
      }

      setLoading({
          loading: false,
          animateIn: false
      })
  }

    useEffect(() => {
      async function fetchData() {
        const data = await Auth.history(store.token, 1)
        if (data.success) {
          setHistory(data.data)
          setHistoryCount(data.data.pages)
        }
      }
      fetchData()
    }, [store.token])

    if (!store.token) {
      navigate("/")
      return (
        <div className="loader-login">
          <Loader
            style={{ marginTop: "calc(40vh - 50px)" }}
            type="Grid"
            height={100}
            width={100}
            color="#d78676"
          />
          <p>Cargando...</p>
        </div>
      )
    } else {
      return (
        <Layout page="perfil">
          <Dialog header="Detalles de la promoción" visible={details.display} modal className="spDialog" onHide={() => {
            setDetails({
              display: false
            })
          }}>
            <div className="confirmation-content">
              <h2>{details.data && details.data.Bundle.name}</h2>
              <p style={{whiteSpace: 'pre-wrap'}}>{details.data && details.data.Bundle.description}</p>
              <h4>Detalles de la promoción</h4>
              <p>{details.data && details.data.Bundle.especialDescription ? details.data.Bundle.especialDescription : ''}</p>
              <h4>Datos de contacto</h4>
              <p style={{whiteSpace: 'pre-wrap'}}>{details.data && details.data.folio && details.data.folio.Alternate_users && details.data.folio.Alternate_users.contact ? details.data.folio.Alternate_users.contact : ''}</p>
              <div style={{marginTop: 20}} className="p-d-flex p-flex-column p-jc-center p-ai-center">
                <QRCode size={100} value={details.data && details.data.folio && details.data.folio.folio && details.data.folio.folio ? details.data.folio.folio : ''}/>
                <p>{details.data && details.data.folio && details.data.folio.folio && details.data.folio.folio}</p>
              </div>
            </div>
          </Dialog>
          <SEO title="Historial" />
          <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
            <div className="p-col-12 p-md-9">
              <h1 className="title-page" style={{ paddingLeft: 0 }}>
                HISTORIAL
              </h1>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <Item color="#d78676" icon="pi pi-user" store={store} />
              </div>
            </div>
          </div>
          <div className="p-grid p-align-center p-justify-center" style={{ marginTop: 0 }}>
            <h3 style={{ color: "#d78676", marginBottom: "0.5rem" }}>
              COMPRAS
            </h3>
            <div className="p-col-12 table">
              <h6 style={{ marginLeft: 20 }}>* Da click en los paquetes promocionales para ver los detalles</h6>
              <div className="thead">
                <div className="th">
                  <h3>Paquete</h3>
                </div>
                <div className="th">
                  <h3>Costo</h3>
                </div>
                <div className="th">
                  <h3>Fecha compra</h3>
                </div>
                <div className="th">
                  <h3>Vigencia</h3>
                </div>
                <div className="th">
                  <h3>Estado</h3>
                </div>
              </div>
              <div className="">
                {history.purchases.map((item, index) => {
                  return (
                    <div className="tbody" key={index} style={{ cursor: item.Bundle.isEspecial ? 'pointer' : 'default' }} onClick={() => {
                      item.Bundle.isEspecial && showDetails(item)
                    }}>
                      <div className="td" style={{backgroundColor: item.Bundle.isEspecial ? '#d7867630' : '#788ba555'}}>
                        <p className="tcontent" key={index}>
                          {item.Bundle.name}
                        </p>
                      </div>
                      <div className="td" style={{backgroundColor: item.Bundle.isEspecial ? '#d7867630' : '#788ba555'}}>
                        <p className="tcontent" key={index} >
                          ${" "}
                          {item.Bundle.offer > 0
                            ? item.Bundle.offer
                            : item.Bundle.price}
                        </p>
                      </div>
                      <div className="td" style={{backgroundColor: item.Bundle.isEspecial ? '#d7867630' : '#788ba555'}}>
                        <p className="tcontent" key={index} >
                          {getTransactionDate(item)}
                        </p>
                      </div>
                      <div className="td" style={{backgroundColor: item.Bundle.isEspecial ? '#d7867630' : '#788ba555'}}>
                        <p className="tcontent" key={index} >
                          {item.expirationDate.substring(0, 10)}
                        </p>
                      </div>
                      <div className="td" style={{backgroundColor: item.Bundle.isEspecial ? '#d7867630' : '#788ba555', color: item.isCanceled ? '#D44949' : hasExpired(item) ? "#d78676" : "#788ba5 !important"}}>
                        <p
                          className="tcontent"
                          key={index}
                        >
                          {item.isCanceled ? "Cancelado" : hasExpired(item) ? "Vencido" : "Activo"}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Paginator 
                rows={10} totalRecords={historyCount} first={first} onPageChange={changePage}
              />
            </div>
          </div>
        </Layout>
      )
    }
  })
)

export default IndexPage
