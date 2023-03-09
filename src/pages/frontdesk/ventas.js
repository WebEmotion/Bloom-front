import React, { useEffect, useState, useRef } from "react"
import { navigate } from "gatsby"
import { InputTextarea } from 'primereact/inputtextarea'
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"
import { Button } from "primereact/button"
import { ListBox } from "primereact/listbox"
import { Dropdown } from 'primereact/dropdown'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { ScrollPanel } from "primereact/scrollpanel"
import { AutoComplete } from "primereact/autocomplete"
import { ProgressSpinner } from "primereact/progressspinner"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import Item from "../../components/item-profile"

import * as Clients from "../../api/v0/clients"
import * as Constants from "../../environment"
import { FaGlasses } from "react-icons/fa"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const clientStore = RootStore.ClientsStore
    const [state, setState] = useState({
      bundles: [],
      loading: false,
    })
    const [discountList, setDiscountList] = useState([])
    const [allClients, setAllClients] = useState([])
    const [loadingClients, setLoadingClients] = useState(false)
    const [loading, setLoading] = useState({
      loading: true,
      animateIn: true
    })
    useEffect(() => {
      async function fetchData() {
        const data = await Clients.bundles()
        if (data.success) {
          let newList = []
          data.data.forEach((element, i) => {
            let temp = element
            temp.selected = false
            temp.times = 0
            temp.index = i
            newList.push(temp)
          })
          setState({
            bundles: newList
          })
        }
        const disc = await Clients.getDiscounts(store.token)
        if (disc.success) {
          let d = []
          for (var i in disc.discount) {
            d.push(disc.discount[i].description)
          }
          d.push('Otro')
          setDiscountList(d)
        }
        setLoading({
          loading: true,
          animateIn: false
        })
        setTimeout(() => {
          setLoading({
            animateIn: false,
            loading: false
          })
        }, 500);
      }
      fetchData()
    }, [store.token])

    ///PAQUETES
    const [selected, setSelected] = useState([])
    const [discounts, setDiscounts] = useState({
      showDisccounts: false,
      discount: 0,
      comment: '',
      commentText: ''
    })
    const [total, setTotal] = useState(0)
    const addItem = (paquete, i) => {
      setSelected(selected => [...selected, paquete])
      if (paquete.offer > 0) {
        setTotal(total + paquete.offer)
      } else {
        setTotal(total + paquete.price)
      }

      // 1. Make a shallow copy of the items
      let items = [...state.bundles]
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...items[i] }
      // 3. Replace the property you're intested in
      item.selected = true
      item.times = item.times + 1
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      items[i] = item
      // 5. Set the state to our new copy
      setState({ bundles: items, loading: false })
    }

    const removeItemS = (paquete, i) => {
      if (paquete.offer > 0) {
        setTotal(total - paquete.offer)
      } else {
        setTotal(total - paquete.price)
      }
      // 1. Make a shallow copy of the items
      let items = [...state.bundles]
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...items[i] }
      // 3. Replace the property you're intested in
      item.times = item.times - 1
      let s = selected
      for (var j in s) {
        const item = s[j]
        console.log(item, paquete)
        if (item.id === paquete.id) {
          s.splice(j, 1)
          break
        }
      }
      setSelected(s)
      if (item.times === 0) {
        item.selected = false
      }
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      items[i] = item
      // 5. Set the state to our new copy
      setState({ bundles: items, loading: false })
    }

    const removeItem = paquete => {
      if (paquete.offer > 0) {
        setTotal(total - paquete.offer)
      } else {
        setTotal(total - paquete.price)
      }
      let s = selected
      for (var j in s) {
        const item = s[j]
        if (item.id === paquete.id) {
          s.splice(j, 1)
          break
        }
      }
      setSelected(s)
      // 1. Make a shallow copy of the items
      let items = [...state.bundles]
      // 2. Make a shallow copy of the item you want to mutate
      let item = { ...items[paquete.index] }
      // 3. Replace the property you're intested in
      item.times = item.times - 1
      if (item.times === 0) {
        item.selected = false
      }
      // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
      items[paquete.index] = item
      // 5. Set the state to our new copy
      setState({ bundles: items, loading: false })
    }

    const removeAll = () => {
      setSelected([])
      let items = [...state.bundles]
      let temp = []
      items.forEach(element => {
        let item = element
        item.selected = false
        item.times = 0
        temp.push(item)
      })
      setClientInformation({
        name: "",
        lastname: "",
        email: "",
        confirmEmail: "",
        transaction: ""
      })
      setRegistered(true)
      setState({ bundles: temp, loading: false })
      setTotal(0)
      setPaymentMethod("")
      setCurrentClient("")
    }

    const itemTemplate = option => {
      return (
        <div className="p-grid p-justify-between p-align-center p-mt-1 p-mb-1">
          <div>{option.name}</div>
          <i className="pi pi-times"></i>
        </div>
      )
    }
    ///Handle errors
    const myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    ///PAGAR
    const [open, setOpen] = useState(false)
    const [clientInformation, setClientInformation] = useState({
      name: "",
      lastname: "",
      email: "",
      confirmEmail: "",
      transaction: "",
    })

    const changeTransactionValue = (e) => {
      setClientInformation({
        ...clientInformation,
        transaction: e.target.value
      })
      //console.log(e.target.value)
    }

    const changePercentageValue = (e) => {
      setDiscounts({
        ...discounts,
        discount: parseInt(e.target.value)
      })
      //console.log(e.target.value)
    }

    const changeCommentsValue = (e) => {
      setDiscounts({
        ...discounts,
        comment: e.value
      })
      //console.log(e.target.value)
    }

    const changeCommentsTextValue = (e) => {
      setDiscounts({
        ...discounts,
        commentText: e.target.value
      })
      //console.log(e.target.value)
    }

    const changeName = (e) => {
      setClientInformation({
        ...clientInformation,
        name: e.target.value
      })
      console.log(e.target.value)
    }

    const changeLastname = (e) => {
      setClientInformation({
        ...clientInformation,
        lastname: e.target.value
      })
      console.log(e.target.value)
    }

    const changeEmail = (e) => {
      setClientInformation({
        ...clientInformation,
        email: e.target.value
      })
      console.log(e.target.value)
    }

    const changeConfirmEmail = (e) => {
      setClientInformation({
        ...clientInformation,
        confirmEmail: e.target.value
      })
      console.log(e.target.value)
    }

    const optionTemplate = option => {
      return (
        <div className="country-item">
          <div>
            {option.name} {option.lastname}
          </div>
          <div style={{ opacity: 0.5 }}>{option.email}</div>
        </div>
      )
    }

    //PAYMENT METHOD
    const [paymentMethod, setPaymentMethod] = useState("")
    const [paymentMethods, setPaymentMethods] = useState(["Efectivo", "Tarjeta"])
    const changePaymentMethod = (e) => {
      setPaymentMethod(e.target.value)
      //console.log(e.target.value)
    }

    const [isRegistering, setIsRegistering] = useState(false)
    const [registered, setRegistered] = useState(true)
    const handleClientRegister = async () => {
      if (
        clientInformation.name !== "" &&
        clientInformation.lastname !== "" &&
        clientInformation.email !== "" &&
        clientInformation.confirmEmail !== ""
      ) {
        if (clientInformation.email === clientInformation.confirmEmail) {
          setIsRegistering(true)

          let payment
          if(paymentMethod === "Tarjeta") {
            payment = "tarjeta"
          } else if(paymentMethod === "Efectivo") {
            payment = "efectivo"
          }

          const data = await Clients.createClient(
            store.token,
            clientInformation,
            selected,
            currentClient,
            discounts,
            payment
          )
          console.log(data)
          setIsRegistering(false)
          if (!data.success) {
            showToast("error", "Upps!", data.message)
          } else {
            store.currentClient = data.client.client
            setSuccess(true)
            setPaymentMethod("")
            setCurrentClient("")
          }
        } else {
          showToast("error", "Upps!", "Los email no coinciden.")
        }
      } else {
        showToast("error", "Upps!", "Completa todos los campos.")
      }
    }

    ///SUCCESS
    const [success, setSuccess] = useState(false)

    ///Buscador
    const [currentClient, setCurrentClient] = useState(null)
    const [filtered, setFiltered] = useState(null)
    const searchClient = async event => {
      let searchClients
      const search = await Clients.searchClient(store.token, event.query.toLowerCase())
      
      if(search.success) {
        searchClients = search.clients
      } else {
        searchClients = null
      }

      setFiltered(searchClients)
    }

    return (
      <div>
        <Dialog
          header="Pagar"
          visible={open}
          modal
          onHide={() => {
            setOpen(false)
            setSuccess(false)
            removeAll()
          }}
          className="login-dialog"
          style={{ zIndex: 100 }}
        >
          <Toast ref={myToast} />
          <ScrollPanel
            style={{ height: "70vh" }}
            className="custombar-login"
          >
            {!isRegistering && !success && (
              <div>
                <h4>1. Haz un cobro en la TPV por ${(total * (1 - (discounts.discount / 100))).toFixed(2)} MXN.</h4>
                <h4>
                  2. Si la transacción es exitosa, ingresa el código de
                  transacción.
                </h4>
                <h4>3. Da click en confirmar.</h4>
                <div className="p-grid p-align-center p-justify-center">
                  <div className="p-col-5">
                    <p className="login-label">Transacción:</p>
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
                        value={clientInformation.transaction}
                        onChange={changeTransactionValue.bind(this)}
                        type="text"
                        disabled={!registered}
                      />
                    </span>
                  </div>
                </div>
                <div className="p-grid p-align-center p-justify-center">
                  <div className="p-col-5">
                    <p className="login-label">Método de pago:</p>
                  </div>
                  <div className="p-col-6 p-md-7">
                    <span className="p-input-icon-right">
                      <i
                        className={
                          store.name_invalid ? "pi pi-exclamation-circle" : ""
                        }
                        style={{ color: "red" }}
                      />
                      <Dropdown 
                        style={{ 'max-width': '190px', 'min-width': '190px' }}
                        className="p-inputtext-sm form-input"
                        value={paymentMethod} 
                        options={paymentMethods} 
                        onChange={changePaymentMethod.bind(this)} 
                        placeholder="Selecciona un tipo de pago"
                        disabled={!registered}
                      />
                    </span>
                  </div>
                </div>

                <div className="p-grid p-align-center p-justify-center p-mb-2">
                  <Button
                    onClick={async () => {
                      setLoadingClients(false)
                      setRegistered(false)
                    }}
                    className="login-btn2"
                    label="Confirmar"
                    icon={loadingClients ? "pi pi-spin pi-spinner" : ""}
                    disabled={
                      !registered || clientInformation.transaction === "" || paymentMethod === ""
                    }
                  />
                </div>
                <div>
                  <h4>4. Ingresa los datos del cliente para darlo de alta.</h4>
                  {/* <p style={{ marginTop: 0 }}>
                    Confirma que la dirección de correo electrónico esté escrita
                    correctamente.
                  </p> */}
                  <div className="p-grid p-align-center p-justify-center">

                    <div className="p-col-5">
                      <p className="login-label">Buscar cliente:</p>
                    </div>
                    <div className="p-col-7">
                      <div style={{ width: '100%' }}>
                        <AutoComplete
                          value={currentClient}
                          suggestions={filtered}
                          completeMethod={searchClient}
                          field="name"
                          delay={1000}
                          itemTemplate={optionTemplate}
                          onChange={e => {
                            //console.log(e.target, currentClient)
                            if (e.target.value.id) {
                              setClientInformation(clientInformation => ({
                                ...clientInformation,
                                name: e.target.value.name,
                                lastname: e.target.value.lastname,
                                email: e.target.value.email,
                                confirmEmail: e.target.value.email,
                              }))
                            } else {
                              setClientInformation(clientInformation => ({
                                ...clientInformation,
                                name: "",
                                lastname: "",
                                email: "",
                                confirmEmail: "",
                              }))
                            }
                            setCurrentClient(e.target.value)
                          }}
                          disabled={registered || loadingClients}
                          inputStyle={{
                            width: '100% !important'
                          }}
                        />
                      </div>

                    </div>
                  </div>
                  {clientInformation && clientInformation.name && <div className="p-grid p-align-center p-justify-center">
                    <div className="p-col-5">
                      <p className="login-label">Nombre:</p>
                    </div>
                    <div className="p-col-6 p-md-7">
                      <p 
                        className="login-label"
                        style={{ textAlign: 'start',  }}
                      >
                        <strong>{clientInformation.name + " " + clientInformation.lastname}</strong>
                      </p>
                    </div>
                  </div>}
                  {clientInformation && clientInformation.email && <div className="p-grid p-align-center p-justify-center">
                    <div className="p-col-5">
                      <p className="login-label">Email:</p>
                    </div>
                    <div className="p-col-6 p-md-7">
                      <p 
                        className="login-label"
                        style={{ textAlign: 'start' }}
                      >
                        <strong>{clientInformation.email}</strong>
                      </p>
                    </div>
                  </div>}
                  <div className="p-grid p-align-center p-justify-center p-mb-2">
                    <Button
                      onClick={handleClientRegister}
                      className="login-btn2"
                      label={"Registrar"}
                      disabled={registered}
                    />
                  </div>
                </div>
              </div>
            )}
            {
              isRegistering && (
                <div style={{ height: '100%' }} className="p-d-flex p-jc-center p-ai-center">
                  <ProgressSpinner />
                </div>
              )
            }
            {success && (
              <div
                style={{ height: "100%" }}
                className="p-grid p-align-center p-justify-center"
              >
                <div className="p-col-10">
                  <h1 style={{ textAlign: "center" }}>{"Venta exitosa"}</h1>
                </div>
                <div className="p-col-10">
                  <p>
                    <strong>Nombre:</strong> {store.currentClient.name}
                  </p>
                  <p>
                    <strong>Apellido:</strong> {store.currentClient.lastname}
                  </p>
                  <p>
                    <strong>ID:</strong> {store.currentClient.id}
                  </p>
                </div>
                <div className="p-col-10">
                  <p style={{ textAlign: "center", marginBottom: 0 }}>¿El cliente quiere reservar una clase?</p>
                </div>
                <Button
                  onClick={() => {
                    navigate("/frontdesk/mis-clases")
                  }}
                  className="login-btn2"
                  label="Reservar"
                  style={{ marginTop: 0 }}
                />
              </div>
            )}
          </ScrollPanel>
        </Dialog>
        <Layout page="ventas">
          <SEO title="Ventas" />
          <div
            className="p-grid p-align-center"
            style={{ marginTop: "2rem" }}
          >
            <div className="p-col-12 p-md-9">
              <h1 className="title-page" style={{ paddingLeft: 0 }}>
                PAQUETES
              </h1>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <Item color="#3eb978" icon="pi pi-user" store={store} />
              </div>
            </div>
          </div>


          <div
            className="p-grid p-align-start p-justify-center"
            style={{ marginTop: "1rem" }}
          >
            <div className="p-col-12 p-md-9">
              {!loading.loading && <div className="p-grid p-align-start p-justify-center">
                {state.bundles.map((paquete, index) => {
                  if (!paquete.isDeleted) {
                    return (
                      <div className="p-col-12 p-md-4" key={index}>
                        <div className="product-item">
                          <div className="product-item-content clases fade-in">
                            <div>
                              <h3 className="p-mb-1 p-ml-1 p-mr-1">{paquete.name}</h3>
                              {!paquete.isUnlimited && <small className="decoration">
                                Incluye {paquete.classNumber} clase(s)
                                </small>}
                              {paquete.isUnlimited && <small className="decoration">
                                Clases ilimitadas
                                </small>}
                              <h4
                                className="p-mt-0 p-mb-3"
                                style={{
                                  textDecoration:
                                    paquete.offer > 0
                                      ? "line-through"
                                      : "none",
                                  opacity: paquete.offer > 0 ? 0.8 : 1,
                                  fontSize:
                                    paquete.offer > 0 ? "small" : "normal",
                                }}
                              >
                                ${paquete.offer > 0 ? paquete.offer : paquete.price}
                              </h4>
                              <p className="p-mt-0 p-mb-0">
                                <small>
                                  *Vigencia de {paquete.expirationDays} días
                                  </small>
                              </p>

                              <div className="car-buttons p-mt-4">
                                {paquete.times < paquete.max && <Button
                                  label="Agregar"
                                  onClick={() => {
                                    addItem(paquete, index)
                                  }}
                                  className="simple-button"
                                />}
                              </div>
                              <div className="car-buttons">
                                {paquete.times > 0 && <Button
                                  label="Remover"
                                  onClick={() => {
                                    removeItemS(paquete, index)
                                  }}
                                  className="simple-button"
                                />}
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  } else {
                    return <div></div>
                  }
                })}
              </div>}
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center p-align-start">
                <h4 className="classes-sub">Paquetes agregados</h4>
                <ListBox
                  optionLabel="name"
                  options={selected}
                  onChange={e => {
                    removeItem(e.value)
                  }}
                  style={{ width: "100%" }}
                  itemTemplate={itemTemplate}
                />
                <div
                  className="p-grid p-justify-between p-align-center p-mt-2 p-mb-2"
                  style={{ width: "100%" }}
                >
                <InputText value={discounts.discount} placeholder="Ingrese un código de descuento" onChange={handleDiscountCodeChange.bind(this)} />
                  <strong>Total:</strong>${(total * (1 - (discounts.discount / 100))).toFixed(2)}
  
                </div>
                <div
                  className="p-grid p-justify-between p-align-center p-mt-2 p-mb-2"
                  style={{ width: "100%" }}
                >
                  <div className="p-field-checkbox">
                    <Checkbox checked={discounts.showDisccounts} onChange={e => {
                      setDiscounts({
                        ...discounts,
                        showDisccounts: e.checked,
                        discount: 0,
                        comment: '',
                        commentText: ''
                      })
                    }} />
                    <label htmlFor="binary">Aplicar descuento</label>
                  </div>
                </div>
                {discounts.showDisccounts && <div
                  className="p-grid p-justify-between p-align-center p-mt-2 p-mb-2"
                  style={{ width: "100%" }}
                >
                  <strong>Descuento:</strong><InputText value={discounts.discount} placeholder="%" type="number" min={0} max={100} onChange={changePercentageValue.bind(this)} />
                </div>}
                {discounts.showDisccounts && <div
                  className="p-grid p-justify-between p-align-center p-mt-2 p-mb-2"
                  style={{ width: "100%" }}
                >
                  {discounts.discount !== 0 &&
                    <Dropdown style={{ width: '100%' }} value={discounts.comment} options={discountList} onChange={changeCommentsValue.bind(this)} placeholder="Selecciona un tipo de descuento" />}
                </div>}
                {discounts.showDisccounts && <div
                  className="p-grid p-justify-between p-align-center p-mt-2 p-mb-2"
                  style={{ width: "100%" }}
                >
                  {discounts.comment === 'Otro' &&
                    <InputTextarea rows={5} cols={30} value={discounts.commentText} onChange={changeCommentsTextValue.bind(this)} />}
                </div>}
                <Button
                  onClick={() => {
                    setOpen(true)
                  }}
                  className="login-btn btn-secondary"
                  label="Pagar"
                  style={{ width: "90%", background: "#3eb978" }}
                  disabled={selected.length === 0}
                />
                <Button
                  label="Cancelar"
                  icon="pi pi-times"
                  iconPos="right"
                  className="p-button-rounded p-button-danger p-button-outlined danger-button"
                  onClick={() => {
                    removeAll()
                  }}
                  style={{ width: "90%" }}
                />
              </div>
            </div>
          </div>
        </Layout>
        {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10000 !important' }}>
          <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} strokeWidth="3" />
        </div>}
      </div>
    )
  })
)

export default IndexPage
