import React, { useEffect, useState, useCallback } from "react"
import Img from "gatsby-image"
import QRCode from 'react-qr-code'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from 'react-helmet'
import { v4 as uuidv4 } from 'uuid';
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import { Carousel } from "primereact/carousel"
import Layout from "../components/layout"
import SEO from "../components/seo"
import * as moment from 'moment'

import * as Clients from "../api/v0/clients"
import * as Purchase from "../api/v0/purchases"
import * as Auth from "../api/v0/auth"

import { generateVoucher } from '../utils'

import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { addDays } from 'date-fns'
import queryString from 'query-string'

import { URLS, API } from '../environment'

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const images = useStaticQuery(graphql`
      query {
        bloom: file(relativePath: { eq: "icons/logo.png" }) {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `)

    const location = useLocation()
    const [showSpecial, setShowSpecial] = useState(true)
    const [showGrupal, setShowGrupal] = useState(false)
    const [showFlow, setShowFlow] = useState(false)
    const [allowGrupal, setAllowGrupal] = useState(true)
    const [state, setState] = useState({
      bundles: [],
      specialBundles: [],
      groupBundles: [],
      flowBundles: [],
      loading: true,
      displayBuy: false,
      displaySuccess: false,
      displaySpecial: false,
      special: null,
      selectedBundle: null,
      processing: false,
      displayError: false,
      registering: false,
      showNotAvailable: false,
      voucher: '',
      page: 0
    })
    useEffect(() => {
      async function fetchData() {
        const token = store.token ? store.token : null
        const data = await Clients.bundles(token)
        let newList = [{ invisible: true }]
        let specialList = [{ invisible: true }]
        let groupal = [{ invisible: true }]
        if (data.success) {
          for (var i in data.data) {
            const element = data.data[i]
            if (element.isDeleted) continue
            let temp = element
            temp.selected = false
            temp.index = i
            if (temp.isGroup) {
              groupal.push(temp)
            } else if (temp.isEspecial) {
              specialList.push(temp)
            } else {
              newList.push(temp)
            }

          }
          newList.push({ invisible: true })
          specialList.push({ invisible: true })
          groupal.push({ invisible: true })
          if (specialList.length < 3) {
            setShowSpecial(false)
          }
        }
        const queries = queryString.parse(location.search)
        console.log(queries, location.search)
        if (queries.cancelled) {
          setState({ ...state, bundles: newList, specialBundles: specialList, groupBundles: groupal, loading: false })
          store.successIndicator = null
        } else if (queries.resultIndicator) {
          if (store.successIndicator === queries.resultIndicator) {
            setState({
              ...state,
              registering: true,
            })
            const response = await Purchase.purchaseClient(store.token, store.voucher)
            if (response.success && response.folio) {
              setState({
                ...state,
                bundles: newList,
                specialBundles: specialList,
                groupBundles: groupal,
                displaySpecial: true,
                selectedBundle: store.buyed,
                loading: false,
                registering: false,
                special: response.folio,
                voucher: store.voucher
              })
            } else {
              setState({
                ...state,
                bundles: newList,
                specialBundles: specialList,
                groupBundles: groupal,
                displaySuccess: true,
                selectedBundle: store.buyed,
                loading: false,
                registering: false,
                voucher: store.voucher
              })
            }
          } else {
            setState({ ...state, bundles: newList, specialBundles: specialList, groupBundles: groupal, loading: false, registering: false })
          }
        } else {
          setState({ ...state, bundles: newList, specialBundles: specialList, groupBundles: groupal, loading: false, registering: false })
        }
        store.successIndicator = null
        store.voucher = null
        store.buyed = null
      }
      const getHistory = async () => {
        const response = await Auth.history(store.token)
        if (response.success) {
          const purchases = response.data.purchases
          for (var i in purchases) {
            const p = purchases[i]
            const expiresAt = p.expirationDate
            const isGroup = p.Bundle.isGroup
            const isCanceled = p.isCanceled
            if (isGroup && !isCanceled && moment().isBefore(moment(expiresAt))) {
              setAllowGrupal(false)
              break
            }
          }
        }
      }
      fetchData()
      if (store.token && !store.isAdmin) {
        getHistory()
      } else {
        setAllowGrupal(true)
      }
      //insertScript()
    }, [store.token])

    const buyFooter = (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', left: 10, bottom: 10 }}>
          <img style={{ height: 50, objectFit: 'contain' }} src="https://www.gaxco.com.mx/home/visamastercard.jpg" alt="" srcset="" />
        </div>
        <Button className="p-button-text p-button-secondary" label="Cancelar" onClick={() => {
          setState({
            ...state,
            displayBuy: false,
            selectedBundle: null
          })
        }} />
        <Button className="p-button-pink" label="Continuar con la compra" onClick={async () => {
          setState({
            ...state,
            processing: true
          })
          setTimeout(async () => {
            await startPayment()
          }, 3000);
        }} />
      </div>
    )

    const initPayment = async () => {
        const response = await Purchase.initPurchase(store.token, state.selectedBundle.id, store.voucher)
        if (response.success) {
            console.log("Entra a Init");
            return true
        } else {
            return false
        }
    }

    const validateBundle = async (id) => {
      const data = await Clients.bundles(null)
      for (var i in data.data) {
        const element = data.data[i]
        if (element.id === id) {
          if (element.isDeleted) return false
          return true
        } 
      }
    }

    const startPayment = async () => {
      const checkout = window.Checkout
      var body = new URLSearchParams();
      const voucher = generateVoucher()
      body.append('apiOperation', 'CREATE_CHECKOUT_SESSION')
      body.append('interaction.returnUrl', `${URLS.official_site}/paquetes`)
      body.append('interaction.cancelUrl', `${URLS.official_site}/paquetes?cancelled=true`)
      body.append('interaction.operation', 'PURCHASE')
      body.append('order.id', voucher)
      body.append('order.amount', state.selectedBundle.offer ? state.selectedBundle.offer : state.selectedBundle.price)
      body.append('order.currency', 'MXN')
      body.append('order.description', state.selectedBundle.description)
      body.append('order.item.name', state.selectedBundle.name)
      body.append('order.item.quantity', 1)
      body.append('order.item.unitPrice', state.selectedBundle.offer ? state.selectedBundle.offer : state.selectedBundle.price)
      body.append('order.item.unitTaxAmount', 0)
      const response = await fetch(`${API.BASE_URL}/purchase/createSession`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
      console.log(response)
      const res = await response.text()
      console.log(res)
      const elems = res.split('&')
      const data = {}
      for (var i in elems) {
        const elem = elems[i]
        const _elem = elem.split('=')
        data[_elem[0]] = _elem[1]
      }
      if (data.result === 'SUCCESS') {
          console.log(data)
          store.successIndicator = data.successIndicator
          store.buyed = state.selectedBundle
          store.voucher = voucher
          
          if (await initPayment()) {
              
              checkout.configure({
                session: {
                  id: data['session.id']
                },
                interaction: {
                  merchant: {
                    name: 'Bloom',
                    address: {
                      line1: '200 Sample St',
                      line2: '1234 Example Town'
                    },
                    logo: 'https://www.bloomcycling.com/static/54c801227cce968c028732241d089cd6/c95b5/BLOOM.png'
                  },
                  locale: 'es_ES',
                  country: 'MEX',
                  displayControl: {
                    billingAddress: 'HIDE',
                    orderSummary: 'SHOW'
                  }
                }
              });
              checkout.showLightbox()
              let submitButton = document.getElementsByClassName("submitButton");
              console.log(submitButton);
          }
      } else {
        setState({
          ...state,
          displayBuy: false,
          processing: false,
          selectedBundle: null
        })
      }
    }

    const responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: "600px",
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: "480px",
        numVisible: 1,
        numScroll: 1,
      },
    ]
    function productTemplate(paquete) {
      return (
        <div className="product-item">
          {!paquete.invisible && <div className="product-item-content clases fade-in">
            <div style={{ paddingLeft: 10, paddingRight: 10 }}>
              <h3 className="p-mb-1 p-ml-1 p-mr-1">{paquete.name}</h3>
              {!paquete.isUnlimited && <small className="decoration">
                Incluye {paquete.classNumber} clase(s)
              </small>}
              {paquete.isUnlimited && <small className="decoration">
                Clases ilimitadas
              </small>}
              <br/>
              {paquete.isGroup && <small style={{fontWeight: 'bold', marginTop: 20}}>Paquete Grupal</small>}
              {paquete.isGroup && <p>
                <small>Para hasta {paquete.memberLimit} personas</small>
              </p>}
              {paquete.pictureUrl && <div className="p-d-flex p-flex-column p-ai-center p-jc-center" style={{ width: '100%' }}>
                <p>En colaboración con:</p>
                <img style={{ maxHeight: 100, objectFit: 'contain', backgroundColor: 'transparent', borderRadius: 10 }} src={paquete.pictureUrl} />
              </div>}
              <p style={{ marginBottom: 0 }}>
                <small
                  style={{
                    fontSize: paquete.offer > 0 ? "small" : "normal",
                  }}
                >
                  Precio
                </small>
              </p>
              <h4
                className="p-mt-0 p-mb-3"
                style={{
                  textDecoration: paquete.offer > 0 ? "line-through" : "none",
                  opacity: paquete.offer > 0 ? 0.8 : 1,
                  fontSize: paquete.offer > 0 ? "small" : "normal",
                }}
              >
                ${paquete.price}
              </h4>
              {paquete.offer > 0 && (
                <div>
                  <small>
                    <strong>Descuento</strong> especial
                  </small>
                  <h2 className="p-mt-0 p-mb-3">${paquete.offer}</h2>
                </div>
              )}
              <small>{paquete.description}</small>
              <br />
              {paquete.especialDescription && <small style={{ whiteSpace: 'pre-wrap' }}>{paquete.especialDescription}</small>}
              <p className="p-mt-0 p-mb-0">
                <small>*Vigencia de {paquete.expirationDays} días</small>
              </p>
              {store.token && <Button style={{ marginTop: 10 }} className='p-button-pink-buy' label='Comprar' onClick={async () => {
                if (await validateBundle(paquete.id)) {
                  setState({
                    ...state,
                    selectedBundle: paquete,
                    displayBuy: true
                  })
                } else {
                  setState({
                    ...state,
                    showNotAvailable: true
                  })
                }
              }} />}
            </div>
          </div>}
        </div>
      )
    }
    return (
      <Layout page="paquetes">
        <SEO title="PAQUETES" />
        {state.processing && <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 10000, backgroundColor: 'white', opacity: 0.95, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{ marginBottom: 10 }}>Esperando respuesta del proveedor de pagos...</p>
          <p><strong>Por favor, no cierres ni actualices el navegador, ya que esto puede generar problemas con la transacción</strong></p>
          <p><img style={{ height: 50, objectFit: 'contain', marginBottom: -5 }} src="https://evopayments.com/wp-content/uploads/evo-logo-no-bkground-webres.png" alt="Evo Payments" /></p>
        </div>}
        {state.registering && <div style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 10000, backgroundColor: 'white', opacity: 0.95, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p>Registrando tu compra...</p>
          <p><strong>Por favor, no cierres ni actualices el navegador, ya que esto puede generar problemas con la transacción</strong></p>
          <p><img style={{ height: 50, objectFit: 'contain', marginBottom: -5 }} src="https://evopayments.com/wp-content/uploads/evo-logo-no-bkground-webres.png" alt="Evo Payments" /></p>
        </div>}
        <Helmet>
          <script src="https://evopaymentsmexico.gateway.mastercard.com/checkout/version/57/checkout.js" data-beforeRedirect="getPageState"></script>
          <script type="text/javascript">{`
            console.log("helmet")
            {/* function errorCallback(error) {
                console.log(JSON.stringify(error))
            }
            function cancelCallback() {
                location.reload()
            }
            function loaded(resultIndicator, sessionVersion) {
              console.log(resultIndicator, sessionVersion)
            } */}
            function getPageState(){
                console.log("BeforePurchase")
            }
          `}</script>
        </Helmet>
        <Dialog header="No se puede completar la compra" className="spDialog" visible={state.showNotAvailable} onHide={() => { window.location.reload() }}>
          <p>El paquete ya no está activo. Por favor, contacta al front-desk para más información</p>
        </Dialog>
        <Dialog footer={buyFooter} header="Iniciar compra" className="spDialog" visible={state.displayBuy} onHide={() => { setState({ ...state, displayBuy: false, selectedBundle: null }) }}>
          <p>Paquete: <span style={{ fontWeight: 'bold' }}>{state.selectedBundle && state.selectedBundle.name}</span></p>
          <p>Monto a pagar: <span style={{ fontWeight: 'bold' }}>$ {state.selectedBundle && (state.selectedBundle.offer ? state.selectedBundle.offer : state.selectedBundle.price)}</span></p>
          <p>Fecha de compra: <span style={{ fontWeight: 'bold' }}>{new Date().toLocaleDateString('en-GB')}</span></p>
          <p>Fecha de expiración: <span style={{ fontWeight: 'bold' }}>{addDays(new Date(), state.selectedBundle ? state.selectedBundle.expirationDays : 0).toLocaleDateString('en-GB')}</span></p>
          <br />
          {state.selectedBundle && state.selectedBundle.isEspecial && <div>
            <p>Detalles de la promoción: <span style={{ fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>{state.selectedBundle && state.selectedBundle.especialDescription}</span></p>
          </div>}
          <br />
          <p>Para continuar con tu compra, se abrirá una ventana de nuestro proveedor de pagos <span><img style={{ height: 20, objectFit: 'contain', marginBottom: -5 }} src="https://evopayments.com/wp-content/uploads/evo-logo-no-bkground-webres.png" alt="Evo Payments" /></span> donde podrás ingresar los datos de tu transacción de forma segura.</p>
        </Dialog>
        <Dialog header="Compra exitosa" className="spDialog" visible={state.displaySuccess} onHide={() => { setState({ ...state, displaySuccess: false, selectedBundle: null, voucher: '' }) }}>
          <p>Paquete: <span style={{ fontWeight: 'bold' }}>{state.selectedBundle && state.selectedBundle.name}</span></p>
          <p>Monto pagado: <span style={{ fontWeight: 'bold' }}>$ {state.selectedBundle && (state.selectedBundle.offer ? state.selectedBundle.offer : state.selectedBundle.price)}</span></p>
          <p>Fecha de expiración: <span style={{ fontWeight: 'bold' }}>{addDays(new Date(), state.selectedBundle ? state.selectedBundle.expirationDays : 0).toLocaleDateString('en-GB')}</span></p>
          <p>Orden: <span style={{ fontWeight: 'bold' }}>{state.voucher}</span></p>
          <br />
          {state.selectedBundle && !state.selectedBundle.isGroup && <p>¡Su compra se ha realizado exitosamente! Presione el siguiente botón para comenzar a reservar.</p>}
          {state.selectedBundle && !state.selectedBundle.isGroup && <Button className="p-button-rounded p-button-pink" label="Ir a Mis Clases" onClick={() => {
            navigate('/mis-clases')
          }} />}
          {state.selectedBundle && state.selectedBundle.isGroup && <p>¡Su compra se ha realizado exitosamente! Presione el siguiente botón para configurar tu grupo.</p>}
          {state.selectedBundle && state.selectedBundle.isGroup && <Button className="p-button-rounded p-button-pink" label="Ir a Mi Grupo" onClick={() => {
            navigate('/mi-grupo')
          }} />}
        </Dialog>
        <Dialog style={{fontSize: 14}} header="Compra exitosa" className="spDialog" visible={state.displaySpecial} onHide={() => { setState({ ...state, displaySpecial: false, special: null, selectedBundle: null, voucher: '' }) }}>
          <p style={{marginBottom: 5}}>Paquete: <span style={{ fontWeight: 'bold' }}>{state.selectedBundle && state.selectedBundle.name}</span></p>
          <p style={{marginBottom: 5}}>Monto pagado: <span style={{ fontWeight: 'bold' }}>$ {state.selectedBundle && (state.selectedBundle.offer ? state.selectedBundle.offer : state.selectedBundle.price)}</span></p>
          <p style={{marginBottom: 5}}>Fecha de expiración: <span style={{ fontWeight: 'bold' }}>{addDays(new Date(), state.selectedBundle ? state.selectedBundle.expirationDays : 0).toLocaleDateString('en-GB')}</span></p>
          <p style={{marginBottom: 5}}>Orden: <span style={{ fontWeight: 'bold' }}>{state.voucher}</span></p>
          <p style={{marginBottom: 5}}>Hiciste una compra de uno de nuestros paquetes promocionales. Estos son los datos que deberás proporcionar para hacer válido tu cupón:</p>
          <p style={{ fontWeight: 'bold' }}>{state.selectedBundle && state.selectedBundle.especialDescription ? state.selectedBundle.especialDescription : ''}</p>
          <div style={{ marginTop: 10, marginBottom: 10 }} className="p-d-flex p-flex-column p-jc-center p-ai-center">
            <QRCode size={80} value={state.special ? state.special.folio : ''} />
            <p>{state.special ? state.special.folio : ''}</p>
          </div>
          <p style={{marginBottom: 5}}>Datos de contacto con el colaborador: <span style={{ fontWeight: 'bold' }}>$ {state.special && state.special.folio && state.special.folio.Alternate_users && state.special.folio.Alternate_users.contact ? state.special.folio.Alternate_users.contact : '' }</span></p>
          <p style={{margin: 5}}>¡Su compra se ha realizado exitosamente! Presione el siguiente botón para comenzar a reservar.</p>
          <Button className="p-button-rounded p-button-pink" label="Ir a Mis Clases" onClick={() => {
            navigate('/mis-clases')
          }} />
        </Dialog>
        <Dialog header="Tuvimos un problema" className="spDialog" visible={state.displayError} onHide={() => { setState({ ...state, displayError: false, selectedBundle: null }) }}>
          <p>Tuvimos un problema al verificar tu compra. Ningún cargo fue aplicado a tu cuenta.</p>
        </Dialog>
        <div className="p-grid p-align-center p-justify-center" style={{ marginTop: "2rem" }}>
          <div className="p-col-12 p-md-12">
            <h1 className="title-page" style={{ paddingLeft: 0, color: "" }}>
              PAQUETES {showSpecial && !showGrupal ? 'ESPECIALES' : showGrupal ? 'GRUPALES' : showFlow ? 'PAQUETES FLOW' : 'CLÁSICOS'}
            </h1>
          </div>
        </div>
        <div className="p-d-flex p-jc-center p-ai-center">
          <Button label="Clásicos" style={{ backgroundColor: '#3eb978', color: '#fff', borderRadius: 50, border: 'none', marginRight: 10, width: 150 }} onClick={() => {
            setShowSpecial(false)
            setShowGrupal(false)
          }} />
          {state.specialBundles.length > 2 && <Button label="Especiales" style={{ backgroundColor: '#788ba5', color: '#fff', borderRadius: 50, border: 'none', width: 150, marginRight: 10 }} onClick={() => {
            setShowSpecial(true)
            setShowGrupal(false)
          }} />}
          {state.groupBundles.length > 2 && allowGrupal && <Button label="Grupales" style={{ backgroundColor: '#3eb978', color: '#fff', borderRadius: 50, border: 'none', width: 150 }} onClick={() => {
            setShowSpecial(false)
            setShowGrupal(true)
          }} />}
        </div>
        <div className="p-grid p-align-center p-justify-center p-mt-2">
          {showSpecial && <div className="p-col-12">
            <Carousel
            id='car1'
              value={state.specialBundles}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              className="custom-carousel"
              circular
              autoplayInterval={5000}
              itemTemplate={productTemplate}
            />
          </div>}
          {!showSpecial && !showGrupal && <div className="p-col-12">
            <Carousel
            id='car2'
              value={state.bundles}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              className="custom-carousel"
              circular
              autoplayInterval={5000}
              itemTemplate={productTemplate}
            />
          </div>}
          {showGrupal && <div className="p-col-12">
            <Carousel
            id='car2'
              value={state.groupBundles}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              className="custom-carousel"
              circular
              autoplayInterval={5000}
              itemTemplate={productTemplate}
            />
          </div>}
        </div>
        <div className="p-grid p-align-center p-justify-center">
          <div className="p-col-4 p-md-2">
            <Img
              style={{
                maxWidth: "60%",
                marginTop: "0.5rem",
              }}
              fluid={images.bloom.childImageSharp.fluid}
              imgStyle={{ objectFit: "contain" }}
              className="fade-in"
            />
          </div>
        </div>
      </Layout>
    )
  })
)

export default IndexPage
