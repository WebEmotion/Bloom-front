import React, { useState, useEffect, useRef } from "react"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Checkbox } from 'primereact/checkbox'
import { Toast } from "primereact/toast"
import { InputTextarea } from "primereact/inputtextarea"

import Loader from "react-loader-spinner"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as Instructors from "../../api/v0/instructors"
import * as Schedules from "../../api/v0/schedules"
import * as Constants from "../../environment"

const Loading = ({ message }) => {
  return (
    <div className="loader-login">
      <Loader
        style={{ marginTop: "calc(40vh - 50px)" }}
        type="Grid"
        color={Constants.COLORS.primary}
        height={100}
        width={100}
      />
      <p className="login-info">{message}</p>
    </div>
  )
}

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const [seats, setSeats] = useState([])

    const [cancelation, setCancelation] = useState({
      display: false,
      free: false,
      selectedBooking: null
    })

    useEffect(() => {
      async function fetchData(id) {
        //console.log(store.token)
        const data = await Schedules.getBookingListAdmin(store.token, id)
        if (data.success) {
          //console.log(data.data)
          let newList = []
          data.data.forEach(element => {
            let temp = element
            temp.selected = false
            temp.color = "#788ba5"
            temp.icon = "pi pi-user"
            newList.push(temp)
          })
          setSeats(newList)         
        }
      }
      const id = window.history.state?.id
      if (id) {
        fetchData(id)
      } else {
        navigate("/frontdesk/lugares")
      }
    }, [])

    const idBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">ID</span>
          {rowData.id}
        </React.Fragment>
      )
    }

    const update = async () => {
      const data = await Schedules.getBookingListAdmin(store.token, window.history.state?.id)
      if (data.success) {
        //console.log(data.data)
        let newList = []
        data.data.forEach(element => {
          let temp = element
          temp.selected = false
          temp.color = "#788ba5"
          temp.icon = "pi pi-user"
          newList.push(temp)
        })
        setSeats(newList)
        setGlobalFilter(null)
        setSearch('')
      }
    }

    const updateAssistance = async (id) => {
      const response = await Schedules.assistance(store.token, id)
      if (response.success) {
        await update()
      } else {
        showToast("error", "Upps!", response.message)
      }
    }

    const cancelBooking = async (id) => {
      setCancelation({
        display: true,
        free: false,
        selectedBooking: id
      })
    }

    const cancelBookingRequest = async () => {
      const response = await Schedules.deleteScheduleAdmin(cancelation.selectedBooking, store.token, cancelation.free)
      if (response.success) {
        setCancelation({
          display: false,
          free: false,
          selectedBooking: null
        })
        await update()
      }
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

    const nameBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Nombre</span>
          {rowData.name}
        </React.Fragment>
      )
    }

    const lastnameBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Apellido</span>
          {rowData.lastname}
        </React.Fragment>
      )
    }

    const createdAtBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Fecha</span>
          {rowData.date.substring(0, 10)}
        </React.Fragment>
      )
    }

    const statusBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Lugar</span>
          {rowData.seat}
        </React.Fragment>
      )
    }

    const itemsBodyTemplate = rowData => {
      let items = ""
      for (var i in rowData.items) {
        const item = rowData.items[i].Categories
        const _item = item.User_items.name
        const type = item.type
        const val = item.name
        items = `${items}${_item} - ${val}\n\n`
      }
      return (
        <React.Fragment>
          <span className="p-column-title">Items</span>
          <p style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>{items}</p>
        </React.Fragment>
      )
    }

    const statusStartTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Inicia</span>
          {rowData.start.substring(0, 5)}
        </React.Fragment>
      )
    }

    const statusEndTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Paquete</span>
          {rowData.bundle}
          {/* rowData.isPass ? 'Pase' : 'Cliente' */}
        </React.Fragment>
      )
    }

    const actionsTemplate = rowData => {
      return (
        <React.Fragment>
          <div className="p-d-flex p-ai-center p-jc-center">
            <Checkbox value="asistencia" checked={rowData.assistance} onChange={(e) => updateAssistance(rowData.id)}></Checkbox>
          </div>
        </React.Fragment>
      )
    }

    const actionsTwoTemplate = rowData => {
      return (
        <React.Fragment>
          <Button icon="pi pi-trash" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} onClick={(e) => {
            cancelBooking(rowData.id)
          }} />
        </React.Fragment>
      )
    }

    const renderFooterComplete = (
      <div>
        <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
          setCancelation({
            display: false,
            free: false
          })
        }} />
        <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} className="p-button-text p-button-pink" autoFocus onClick={async () => {
          await cancelBookingRequest()
        }} />
      </div>
    )

    const [search, setSearch] = useState('')
    const [globalFilter, setGlobalFilter] = useState(null)
    const header = (
      <div className="table-header p-grid p-justify-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            value={search}
            onChange={(e) => { 
              setGlobalFilter(e.target.value)
              setSearch(e.target.value) 
            }}
            placeholder="Buscar..."
          />
        </span>

        {/* <Button
          label="Nuevo"
          icon="pi pi-user-plus"
          className="p-button menu-button"
          style={{ width: "auto" }}
          onClick={() => {
            setOpenNew(true)
          }}
        /> */}
      </div>
    )
    /* const footer = (
      <React.Fragment>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          className="p-button-text login-btn2"
          onClick={() => {
            hideDialog()
          }}
        />
        <Button
          label={openNew ? "Registrar" : openUpdate ? "Actualizar" : ""}
          icon="pi pi-check"
          className="p-button-text login-btn2"
          onClick={() => {
            saveInstructor()
          }}
        />
      </React.Fragment>
    ) */
    const [currentInstructor, setCurrentInstructor] = useState(null)
    const [openNew, setOpenNew] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const hideDialog = () => {
      setOpenNew(false)
      setOpenUpdate(false)
    }
    const saveInstructor = async () => {
      if (
        clientInformation.name !== "" &&
        clientInformation.lastname !== "" &&
        clientInformation.description !== "" &&
        clientInformation.profilePicture !== ""
      ) {
        if (openNew) {
          console.log("CREAR")
          setIsRegistering(true)
          const data = await Instructors.createInstructor(
            store.token,
            clientInformation
          )
          console.log(data)
          setIsRegistering(false)
          if (!data.success) {
            showToast("error", "Upps!", data.message)
          } else {
            setSuccess(true)
          }
        } else if (openUpdate) {
          console.log("ACTUALIZAR")
        }
        setOpenNew(false)
        setOpenUpdate(false)
      } else {
        showToast("error", "Upps!", "Completa todos los campos.")
      }
    }
    ///SUCCESS
    const [success, setSuccess] = useState(false)
    const [isRegistering, setIsRegistering] = useState(false)
    const [registered, setRegistered] = useState(true)
    const [clientInformation, setClientInformation] = useState({
      name: "",
      lastname: "",
      description: "",
      profilePicture: "",
    })
    return (
      <>
        {/* <Dialog
          visible={openNew || openUpdate}
          header={
            openNew
              ? "Nuevo Instructor"
              : openUpdate
                ? "Modificar Instructor"
                : ""
          }
          className="p-fluid login-dialog"
          onHide={hideDialog}
          maximizable
          modal
        >
          <Toast ref={myToast} />
          {isRegistering && <Loading message="Guardando instructor..." />}
          {!isRegistering && !success && (
            <div>
              <div className="p-grid p-align-center p-justify-center">
                <div className="p-col-12 p-md-6">
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
                          value={clientInformation.name}
                          onChange={event => {
                            setClientInformation(clientInformation => ({
                              ...clientInformation,
                              name: event.target.value,
                            }))
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
                            store.lastname_invalid
                              ? "pi pi-exclamation-circle"
                              : ""
                          }
                          style={{ color: "red" }}
                        />

                        <InputText
                          className="p-inputtext-sm form-input"
                          value={clientInformation.lastname}
                          onChange={event => {
                            setClientInformation(clientInformation => ({
                              ...clientInformation,
                              lastname: event.target.value,
                            }))
                          }}
                          type="text"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="p-grid p-align-center p-justify-center">
                    <div className="p-col-5">
                      <p className="login-label">Acerca de:</p>
                    </div>
                    <div className="p-col-6 p-md-7">
                      <span className="p-input-icon-right">
                        <i
                          className={
                            store.description_signup_invalid
                              ? "pi pi-exclamation-circle"
                              : ""
                          }
                          style={{ color: "red" }}
                        />
                        <InputTextarea
                          className="form-area"
                          value={clientInformation.description}
                          onChange={event => {
                            setClientInformation(clientInformation => ({
                              ...clientInformation,
                              description: event.target.value,
                            }))
                          }}
                          rows={5}
                          cols={30}
                          autoResize
                        />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-col-12 p-md-6">
                  <div className="p-grid p-align-center p-justify-center">
                    <div className="p-col-5">
                      <p className="login-label">Foto:</p>
                    </div>
                    <div className="p-col-6 p-md-7">
                      <div>
                        {Boolean(clientInformation.profilePicture !== "") && (
                          <div>{clientInformation.profilePicture.name}</div>
                        )}
                        <input
                          accept="image/*"
                          type="file"
                          onChange={e => {
                            console.log(e.target.files)
                            setClientInformation(clientInformation => ({
                              ...clientInformation,
                              profilePicture: e.target.files[0],
                            }))
                          }}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-grid p-align-center p-justify-center p-mb-2">
                    <Button
                      onClick={() => {
                        saveInstructor()
                      }}
                      className="login-btn2"
                      label="Registrar"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div
              style={{ height: "100%" }}
              className="p-grid p-align-center p-justify-center"
            >
              <div className="p-col-10">
                <h1 style={{ textAlign: "center" }}>¡Guardado con éxito!</h1>
              </div>
              <div className="p-col-10">
                <p>
                  <strong>Nombre:</strong> {clientInformation.name}
                </p>
                <p>
                  <strong>Apellido:</strong> {clientInformation.lastname}
                </p>
              </div>
            </div>
          )}
        </Dialog>
         */}
        <Layout page="lugares">
          <Toast ref={myToast} />
          <SEO title="Lugares" />
          <Dialog header="Cancelar reserva" className="spDialog" visible={cancelation.display} footer={renderFooterComplete} onHide={() => {
            setCancelation({
              display: false,
              free: false
            })
          }}>
            <p style={{fontWeight: 'bold'}}>¿Estás seguro de cancelar la reserva?</p>
            <div className="p-d-flex p-jc-start p-ai-center">
              <p style={{marginRight: 20}}>¿Devolver clase al cliente?</p><Checkbox value="liberar" checked={cancelation.free} onChange={(e) => {
                setCancelation({
                  ...cancelation,
                  free: e.target.checked
                })
              }}></Checkbox>
            </div>
          </Dialog>
          <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
            <div className="p-col-12 p-md-9">
              <h1 className="title-page" style={{ paddingLeft: 0 }}>
                LUGARES
              </h1>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <ItemProfile color="#d78676" icon="pi pi-user" store={store} />
              </div>
            </div>
          </div>
          <div className="p-d-flex">
            <p style={{ marginRight: 20 }}>Fecha: <span style={{ fontWeight: 'bold' }}>{window.history.state?.schedule.date.substring(0, 10)}</span></p>
            <p>Hora de inicio: <span style={{ fontWeight: 'bold' }}>{window.history.state?.schedule.start.substring(0, 5)}</span></p>
          </div>
          <div className="p-grid p-align-center fade-in">
            <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-pink" label="Regresar" onClick={() => navigate('/frontdesk/lugares')} />
            {window.history.state?.schedule && <div>
              <Button className='p-button-rounded p-button-pink' label='Editar' onClick={() => {
                navigate('/frontdesk/editar-clase', {
                  state: {
                    schedule: window.history.state?.schedule
                  }
                })
              }} />
            </div>}
            <div className="p-col-12">
              <div className="datatable-responsive-demo">
                <DataTable
                  value={seats}
                  className="p-datatable-responsive-demo"
                  paginator
                  rows={10}
                  globalFilter={globalFilter}
                  header={header}
                >
                  {/* <Column
                    sortable
                    field="id"
                    header="ID"
                    body={idBodyTemplate}
                  /> */}
                  <Column
                    sortable
                    field="name"
                    header="Nombre"
                    body={nameBodyTemplate}
                  />
                  <Column
                    sortable
                    field="lastname"
                    header="Apellido"
                    body={lastnameBodyTemplate}
                  />
                  <Column
                    sortable
                    field="end"
                    header="Tipo de paquete"
                    body={statusEndTemplate}
                  />
                  <Column
                    sortable
                    field="seat"
                    header="Lugar"
                    body={statusBodyTemplate}
                  />
                  <Column
                    header="Items"
                    body={itemsBodyTemplate}
                  />
                  <Column
                    header="Asistencia"
                    body={actionsTemplate}
                  />
                  <Column
                    header=""
                    body={actionsTwoTemplate}
                  />
                </DataTable>
              </div>
            </div>
          </div>
        </Layout>
      </>
    )
  })
)

export default IndexPage
