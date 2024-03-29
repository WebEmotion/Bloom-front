import React, { useEffect, useState, useRef } from "react"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"
import { inject, observer } from "mobx-react"
import { Planet } from "react-planet"
import { Button } from "primereact/button"
import { navigate } from "gatsby"
import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import { Dropdown } from "primereact/dropdown"
import { ScrollPanel } from "primereact/scrollpanel"
import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from "primereact/progressspinner"
import { AutoComplete } from 'primereact/autocomplete'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

import * as moment from "moment"

import Logo from "../assets/images/flow-image-2.png"
import Tree from "../assets/images/tree.png"
import * as SchedulesAPI from "../api/v0/schedules"
import * as ClientsAPI from "../api/v0/clients"
import * as MeAPI from "../api/v0/me"

import "../assets/scss/cycling.scss"
import { FiList } from "react-icons/fi"

const MemberItem = ({ id, name, picture, onClick }) => {
  return (
    <div className="p-d-flex p-ai-center member-item" onClick={() => onClick && onClick(id)}>
      {picture ? <img style={{ width: 30, height: 30, borderRadius: '100%', marginRight: 10 }} src={picture} /> : <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ width: 30, height: 30, borderRadius: '100%', backgroundColor: '#f6b3a3', marginRight: 10 }}><span style={{ color: 'black', opacity: 0.75, fontFamily: 'Poppins-Bold' }}>{`${name.split(' ')[0].substring(0, 1).toUpperCase()}${name.split(' ')[1] ? name.split(' ')[1].substring(0, 1).toUpperCase() : ''}`}</span></div>}
      <p>{name}</p>
    </div>
  )
}

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore

    const images = useStaticQuery(graphql`
      query {
        bloom: file(relativePath: { eq: "icons/logo-white.png" }) {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `)

    const [isClass, setIsClass] = useState(true)
    const [isGrupal, setIsGrupal] = useState(false)
    const [isGrupalAdmin, setIsGrupalAdmin] = useState(false)

    
    const [selected, setSelected] = useState(null)
    const [selectedPasses, setSelectedPasses] = useState(null)
    const [selectedGroup, setSelectedGroup] = useState(null)

    const [seats, setSeats] = useState([])
    const [occupiedSeats, setOccupiedSeats] = useState([])
    const [reservations, setReservations] = useState(null)
    const [myClasses, setMyClasses] = useState(null)
    const [selectedClient, setSelectedClient] = useState(null)
    const [clients, setClients] = useState([])
    const [adminUsePass, setAdminUsePass] = useState(false)
    const [isLeader, setIsLeader] = useState(false)
    const [inMembers, setInMembers] = useState([])
    const [grupalBookings, setGrupalBookings] = useState({
      members: [],
      bookings: [],
      display: false
    })
    const [loading, setLoading] = useState({
      loading: true,
      animateIn: true
    })

    const [openConfirmBooking, setOpenConfirmBooking] = useState(false)
    const [openSuccess, setOpenSuccess] = useState(false)

    const [cancelation, setCancelation] = useState({
      display: false,
      free: true,
      selectedBooking: null
    })

    let toast = useRef(null)

    const isOccupied = number => {
      for (var i in seats) {
        const seat = seats[i]
        //console.log(seat)
        for (var j in seat.Booking) {
          const book = seat.Booking[j]
          if (book.Seat.number === number) {
            return true
          }
        }
      }
      return false
    }

    const getUpdatedMembersList = () => {
      const members = grupalBookings.members
      const bookings = grupalBookings.bookings
      let list = []
      for (var i in members) {
        let added = false
        const m = members[i]
        for (var j in bookings) {
          const b = bookings[j]
          if (b.member.id === m.id) {
            added = true
            break
          }
        }
        if (!added) list.push(m)
      }
      let realList = []
      let addedMembers = []
      let adminAdded = false
      for (var j in list) {
        let m = list[j]
        let booked = false
        for (var i in seats[0].Booking) {
          const un = seats[0].Booking[i]
          const u = un.User
          m['number'] = un.Seat.number
          if (m.id === u.id) {
            booked = true
          } else if (m.id === -1 && u.id === store.id) {
            adminAdded = true
          }
        }
        if (!booked) realList.push(m)
        else addedMembers.push(m)
      }
      //console.log(addedMembers)
      return [realList, addedMembers]
    }

    const optionTemplate = option => {
      return (
        <div className="country-item">
          <div>
            {option.name} {option.lastname}
          </div>
          <div style={{ opacity: 0.5 }}>{option.email}</div>
          {/* <div style={{ opacity: 0.25 }}>{option.pending} reservas disponibles y {option.pendingPasses} pases disponibles</div> */}
        </div>
      )
    }

    const [canReservateClass, setCanReservateClass] = useState(false)
    const [canReservateGroupClass, setCanReservateGroupClass] = useState(false)

    useEffect(() => {
      const loadSeats = async (id, classes) => {
        const response = await SchedulesAPI.schedule(id)
        if (response.success) {
          setSeats([response.data])

          const roomDate = moment(response.data.date)

          const nextExpirationDay = classes && classes.nextExpirationDate ? moment(classes.nextExpirationDate) : null
          nextExpirationDay && nextExpirationDay.set('minutes', 59)
          nextExpirationDay && nextExpirationDay.set('seconds', 0)
          nextExpirationDay && nextExpirationDay.set('hours', 23)

          const nextGroupExpirationDay = classes && classes.nextGroupExpirationDate ? moment(classes.nextGroupExpirationDate) : null
          nextGroupExpirationDay && nextGroupExpirationDay.set('minutes', 59)
          nextGroupExpirationDay && nextGroupExpirationDay.set('seconds', 0)
          nextGroupExpirationDay && nextGroupExpirationDay.set('hours', 23)

          if(nextExpirationDay !== null && nextGroupExpirationDay !== null) {
            if(roomDate.isBefore(nextExpirationDay) && roomDate.isBefore(nextGroupExpirationDay)) {
              setCanReservateClass(true)
              setCanReservateGroupClass(true)
            } else if(roomDate.isAfter(nextExpirationDay) && roomDate.isBefore(nextGroupExpirationDay)) {
              setCanReservateClass(false)
              setCanReservateGroupClass(true)
            } else if(roomDate.isBefore(nextExpirationDay) && roomDate.isAfter(nextGroupExpirationDay)) {
              setCanReservateClass(true)
              setCanReservateGroupClass(false)
            } else {
              setCanReservateClass(false)
              setCanReservateGroupClass(false)
            }
          } else if(nextExpirationDay === null && nextGroupExpirationDay !== null) {
            if(roomDate.isBefore(nextGroupExpirationDay)) {
              setCanReservateClass(false)
              setCanReservateGroupClass(true)
            } else {
              setCanReservateClass(false)
              setCanReservateGroupClass(false)
            }
          } else if(nextExpirationDay !== null && nextGroupExpirationDay === null) {
            if(roomDate.isBefore(nextExpirationDay)) {
              setCanReservateClass(true)
              setCanReservateGroupClass(false)
            } else {
              setCanReservateClass(false)
              setCanReservateGroupClass(false)
            }
          }
        }
        setLoading({
          loading: false,
          animateIn: false
        })
      }

      const loadMembers = async () => {
        const response = await MeAPI.getGroupMembers(store.token)
        if (response.success) {
          const r = await MeAPI.me(store.token)
          if (r.success) {
            setIsLeader(r.data.profile.isLeader)
          }
          let list = response.data[0]
          list.unshift({
            name: 'Yo',
            pictureUrl: store.pictureUrl,
            id: -1
          })
          setGrupalBookings({
            ...grupalBookings,
            members: list
          })
        }
      }

      const id = window.history.state?.id
      const classes = window.history.state?.myClasses
      const reserv = window.history.state?.booking

      //console.log(id, classes, reserv)
      /*if(!id && !classes && !reserv) {
        navigate("/mis-clases-flow")
      }*/

      loadSeats(id, classes)
      setMyClasses(classes)
      setReservations(reserv)

      var seatsOccup = []
      for(var i in reserv) {
          const reserva = reserv[i]
          seatsOccup.push(reserva.Seat.name)
      }
      setOccupiedSeats(seatsOccup)
      // TODO: CHECK ISADMIN OR NOT
    }, [selected])

    const selectSeat = async (seat) => {
      //console.log(canReservateGroupClass, canReservateClass)

      //console.log(seat)
      var name = ""
      var id = 0
      switch(seat) {
        case "1":
          name = "1"
          id = 1
          break
        case "2":
          name = "2"
          id = 2
          break
        case "3":
          name = "3"
          id = 3
          break
        case "4":
          name = "4"
          id = 4
          break
        case "5":
          name = "5"
          id = 5
          break
        case "6":
          name = "6"
          id = 6
          break
        case "7":
          name = "7"
          id = 7
          break
        case "8":
          name = "8"
          id = 8
          break

        case "9":
          name = "9"
          id = 9
          break
        case "10":
          name = "10"
          id = 10
          break
        case "11":
          name = "11"
          id = 11
          break
        case "12":
          name = "12"
          id = 12
          break
        case "13":
          name = "13"
          id = 13
          break
        case "14":
          name = "14"
          id = 14
          break
        case "15":
          name = "15"
          id = 15
          break
        case "16":
          name = "16"
          id = 16
          break
      }

      //console.log(name, id)

      if(myClasses && occupiedSeats.length === 0) {
        if(myClasses.pending && canReservateClass) {
            setSelected({
                name,
                id,
            })
        }

        if(myClasses.pendingPasses && canReservateClass) {
            setSelectedPasses({
                name,
                id,
            })
        }

        if(myClasses.pendingGroup && canReservateGroupClass) {
            setSelectedGroup({
                name,
                id,
            })
        }
      }

      if (isLeader) {
        setGrupalBookings({
          ...grupalBookings,
          display: true
        })
      } /* else {
        setSelectedClient(null)
      } */
    }

    const getClients = async (query) => {
      let response = await ClientsAPI.searchClient(store.token, query)
      if (response.success) {
        let _clients = []
        for (var j in response.data) {
          const client = response.data[j]
          _clients.push({
            ...client.client,
            pending: client.pending,
            pendingPasses: client.pendingPasses
          })
        }
        setClients(_clients)
      }
    }

    useEffect(() => {
      //getClients()
    }, [adminUsePass])

    const getClientsAlt = async () => {
      let response = await ClientsAPI.getClients(store.token)
      if (response.success) {
        let _clients = []
        for (var j in response.data) {
          const client = response.data[j]
          if ((!adminUsePass && client.pending > 0) || (adminUsePass && client.pendingPasses > 0)) {
            _clients.push({
              ...client.client,
              pending: client.pending,
              pendingPasses: client.pendingPasses
            })
          }
        }
        return _clients
      }
    }

    const openConfirmBookingModal = async () => {
      setLoading({
        animateIn: true,
        loading: true
      })
      //store.isAdmin && (await getClients())
      setOpenConfirmBooking(true)
      setLoading({
        animateIn: false,
        loading: false
      })
    }

    const createBooking = async () => {
      setLoading({
        animateIn: true,
        loading: true
      })
      let response
      if (isGrupalAdmin) {
        response = await SchedulesAPI.createBookingGroupAdmin(
          store.token,
          window.history.state.id,
          selected.id,
          selectedClient.id
        )
      } else {
        response = await SchedulesAPI.createBooking(
          store.token,
          window.history.state.id,
          isClass ? selected.id :  selectedPasses.id,
          selectedClient.id,
          adminUsePass
        )
      }

      if (response.success) {
        setOpenConfirmBooking(false)
        setOpenSuccess(true)
      } else {
        toast.current.show({
          severity: "error",
          summary: "Atención",
          detail: response.message,
        })
      }
      setLoading({
        animateIn: false,
        loading: false
      })
    }
    const [isPass, setIsPass] = useState(false)
    const [isPassSelected, setIsPassSelected] = useState(false)
    const [nPasses, setNPasses] = useState(0)
    const createBookingClient = async () => {
      setLoading({
        animateIn: true,
        loading: true
      })
      const response = await SchedulesAPI.createBookingClient(
        store.token,
        window.history.state.id,
        isClass ? selected.id :  selectedPasses.id,
        !isClass
      )
      if (response.success) {
        setOpenConfirmBooking(false)
        setOpenSuccess(true)
        if (response.passes > 0 || isPassSelected) {
          setNPasses(response.passes)
          setIsPass(false)
        }
      } else {
        toast && toast.current && toast.current.show({
            severity: "error",
            summary: "Error",
            detail: response.message,
          })
      }
      setLoading({
        animateIn: false,
        loading: false
      })
    }

    const createGrupalBooking = async () => {
      setLoading({
        animateIn: true,
        loading: true
      })
      const response = await SchedulesAPI.createBookingGroup(
        store.token,
        window.history.state.id,
        selectedGroup.id,
        store.id
        //selectedClient.id === -1 ? store.id : selectedClient.id
      )
      if (response.success) {
        setOpenConfirmBooking(false)
        setOpenSuccess(true)
        if (response.passes > 0 || isPassSelected) {
          setNPasses(response.passes)
          setIsPass(false)
        }
      } else {
        toast && toast.current && toast.current.show({
            severity: "error",
            summary: "Error",
            detail: response.message,
          })
      }
      setLoading({
        animateIn: false,
        loading: false
      })
    }


    const loadSeats = async id => {
      const response = await SchedulesAPI.schedule(id)
      if (response.success) {
        setSeats(response.data)
      }
    }

    ///Buscador
    const [currentClient, setCurrentClient] = useState(null)
    const [filtered, setFiltered] = useState(null)
    const searchClient = async event => {
      let searchClients
      const search = await ClientsAPI.searchClient(store.token, event.query.toLowerCase())
      
      if(search.success) {
        searchClients = search.clients
      } else {
        searchClients = null
      }

      setFiltered(searchClients)
    }

    
  const cancelBooking = async (id) => {
      setCancelation({
        display: true,
        free: false,
        selectedBooking: id
      })
  }

  const cancelBookingRequest = async () => {
      const response = await SchedulesAPI.deleteSchedule(cancelation.selectedBooking, store.token, cancelation.free)
      if (response.success) {
        setCancelation({
          display: false,
          free: false,
          selectedBooking: null
        })
        navigate("/mis-clases-flow")
        //await update()
      } else {
        toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: response.message });
      }
  }

  const renderFooterComplete = (
    <div>
        <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
          setCancelation({
            display: false,
            free: false
          })
        }} />
        <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#E6CDB5', fontWeight: 'bold' }} className="p-button-text p-button-pink-flow" autoFocus onClick={async () => {
          await cancelBookingRequest()
        }} />
      </div>
  )

    return (
      <Layout page="perfil">
        <div style={{ overflow: "scroll" }}>
          <SEO title="FLOW ROOM" />
          <Toast ref={el => (toast.current = el)} />
          <Dialog header="Cancelar reserva" className="spDialog" visible={cancelation.display} footer={renderFooterComplete} onHide={() => {
                setCancelation({
                    display: false,
                    free: false
                })
            }}
          >
            <p style={{fontWeight: 'bold'}}>¿Estás seguro de cancelar la reserva?</p>
          </Dialog>

          <Dialog
            header="Seleccionar asistente"
            visible={grupalBookings.display}
            modal
            className="spDialog"
            closable={false}
            position="bottom"
            onHide={() => {
            }}
          >
            <p>Selecciona al miembro de tu grupo al que le corresponde la reservación. Puedes ser tú mismo.</p>
            <div className="p-d-flex p-flex-column"></div>
            {seats.length > 0 && getUpdatedMembersList()[0].map((elem, index) => <MemberItem key={index} name={`${elem.name} ${elem.lastname ? elem.lastname : ''}`.trim()} picture={elem.pictureUrl} id={elem.id} onClick={(id) => {
              setSelectedClient(elem)
              setGrupalBookings({
                ...grupalBookings,
                display: false
              })
            }} />)}
            <Button
              style={{ marginTop: 20, maxWidth: 200 }}
              label="Cancelar"
              className="p-button-rounded p-button-pink-flow"
              onClick={() => {
                setSelected(null)
                setGrupalBookings({
                  ...grupalBookings,
                  display: false
                })
              }
              }
            />
          </Dialog>
          <Dialog
            header="Reservar"
            visible={openConfirmBooking}
            maximizable
            modal
            onHide={() => {
              setOpenConfirmBooking(false)
            }}
            className="login-dialog"
          >
            <ScrollPanel
              style={{ width: "100%", height: "70vh" }}
              className="custombar-login"
            >
              <div className="p-grid">
                {store.isAdmin && (
                  <div className="p-col-12">
                    <div className="p-field-checkbox">
                      {!isGrupalAdmin && <Checkbox inputId="binary" checked={adminUsePass} onChange={async e => {
                        setAdminUsePass(e.checked)
                        setSelectedClient(null)
                        //await getClients()
                      }} />}
                      {!isGrupalAdmin && <label htmlFor="binary">Utilizar pase</label>}
                    </div>
                    <div className="p-field-checkbox">
                      {!adminUsePass && <Checkbox inputId="group" checked={isGrupalAdmin} onChange={async e => {
                        setIsGrupalAdmin(e.checked)
                        setSelectedClient(null)
                        //await getClients()
                      }} />}
                      {!adminUsePass && <label htmlFor="group">Reservación Grupal</label>}
                    </div>
                    <h3>Seleccione al cliente que reservará el lugar (solo aparecerán los que tienen {adminUsePass ? 'pases' : 'reservas'} disponibles):</h3>
                    {/* <Dropdown
                      value={selectedClient}
                      options={clients}
                      onChange={e => setSelectedClient(e.value)}
                      optionLabel="name"
                      filter
                      filterBy="name,email"
                      placeholder="Clientes"
                      itemTemplate={optionTemplate}
                      style={{ width: "100%" }}
                    /> */}

                    <AutoComplete
                      value={selectedClient}
                      suggestions={filtered}
                      completeMethod={searchClient}
                      field="name"
                      delay={1000}
                      itemTemplate={optionTemplate}
                      onChange={e => {
                        setSelectedClient(e.target.value)
                      }}
                      style={{ width: '100% ' }}
                      inputStyle={{ width: '100% ' }}
                    />
                  </div>
                )}
                <div className="p-col-12 p-d-flex p-ai-center p-flex-column">
                  <h4 style={{ textAlign: "center" }}>
                    Lugar reservado: {selected ? selected.name : ""}
                  </h4>
                  <p style={{ textAlign: "center" }}>
                    Día: {seats[0] && `${seats[0].date.substring(0, 10)}`}
                  </p>
                  <p style={{ textAlign: "center" }}>
                    Horario: {seats[0] && seats[0].start.substring(0, 5)} -{" "}
                    {seats[0] && seats[0].end.substring(0, 5)}
                  </p>
                  {isGrupal && selectedClient && <p>Miembro: {selectedClient.id === -1 ? 'Para mi' : `${selectedClient.name} ${selectedClient.lastname}`}</p>}
                  {!isClass && !isGrupal && <p style={{ marginTop: 100, fontWeight: 'bold' }}>¡Estás usando uno de tus pases!</p>}
                  {!isClass && isGrupal && <p style={{ marginTop: 100, fontWeight: 'bold' }}>¡Estás usando una de tus clases grupales disponibles!</p>}
                  <Button
                    style={{ marginTop: 20, maxWidth: 200 }}
                    label="Confirmar reserva"
                    className="p-button-rounded p-button-pink-flow"
                    disabled={(!selectedClient && store.isAdmin) || loading.loading}
                    onClick={() =>
                      store.isAdmin ? createBooking() : isGrupal ? createGrupalBooking() : createBookingClient()
                    }
                  />
                </div>
              </div>
            </ScrollPanel>
          </Dialog>
          <Dialog
            header=""
            visible={openSuccess}
            onHide={async () => {
              setSelectedClient(null)
              setSelected(null)
              setOpenSuccess(false)
              if (!store.isAdmin) {
                navigate("/mis-clases-flow")
              }
            }}
            maximizable
            modal
            className="login-dialog"
          >
            <ScrollPanel
              style={{ width: "100%", height: "70vh" }}
              className="custombar-login"
            >
              <div className="p-grid">
                <div className="p-col-12 p-d-flex p-ai-center p-flex-column">
                  <h1 style={{ textAlign: "center" }}>RESERVA CREADA</h1>
                  <h2 style={{ textAlign: "center" }}>
                    Lugar reservado: {selected ? selected.name : ""}
                  </h2>
                  <p style={{ textAlign: "center" }}>
                    Día: {seats[0] && `${seats[0].date.substring(0, 10)}`}
                  </p>
                  <p style={{ textAlign: "center" }}>
                    Horario: {seats[0] && seats[0].start.substring(0, 5)} -{" "}
                    {seats[0] && seats[0].end.substring(0, 5)}
                  </p>
                </div>
              </div>
            </ScrollPanel>
          </Dialog>
          <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
            <div className="p-col-12 p-md-9">
              <h1 className="title-page" style={{ paddingLeft: 0 }}>
                FLOW ROOM
              </h1>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <Item color="#E6CDB5" icon="pi pi-user" store={store} />
              </div>
            </div>
          </div>
          <div
            className="p-grid p-justify-center"
            style={{ marginBottom: "2rem" }}
          >
            {seats.length > 0 &&  <div className={getUpdatedMembersList()[1].length > 0 ? 'p-col-5' : 'p-col-10'} style={{ zIndex: 10 }}>
              <div className="p-row">
                {!store.isAdmin && <p style={{ color: '#E6CDB5', fontWeight: 'bold' }}>{isClass ? 'Estás usando una clase' : isGrupal ? 'Estás usando una clase grupal' : 'Estás usando un pase'}</p>}
                <p>Fecha: {seats[0] && `${seats[0].date.substring(0, 10)}`}</p>
                <p>
                  Horario: {seats[0] && seats[0].start.substring(0, 5)} -{" "}
                  {seats[0] && seats[0].end.substring(0, 5)}
                </p>
                <p>
                  Tapete reservado:{" "}
                  {selected
                    ? selected.name
                    : "No has seleccionado ningún lugar"}
                </p>
                {isGrupal && selectedClient && <p>Miembro: {selectedClient.id === -1 ? 'Para mi' : `${selectedClient.name} ${selectedClient.lastname}`}</p>}
                <Button
                  style={{ margin: "3px 20px 3px 0px", border: selected ? '6px solid #495057' : '' }}
                  label="Reservar"
                  className="p-button-rounded"
                  disabled={!selected}
                  onClick={() => openConfirmBookingModal()}
                />
                <Button
                  style={{ margin: "3px 20px 3px 0px", backgroundColor: '#E6CDB5', borderColor: '#E6CDB5', border: selectedPasses ? '6px solid #495057' : ''  }}
                  label="Reservar con pase"
                  className="p-button-rounded"
                  disabled={!selectedPasses}
                  onClick={() => {
                    openConfirmBookingModal()
                    setIsClass(false)
                }}
                />
                <Button
                  style={{ margin: "3px 20px 3px 0px", backgroundColor: '#E6CDB5', borderColor: '#E6CDB5', border: selectedGroup ? '6px solid #495057' : '' }}
                  label="Reserva grupal"
                  className="p-button-rounded"
                  disabled={!selectedGroup}
                  onClick={() => {
                      openConfirmBookingModal()
                      setIsGrupal(true)
                    }}
                />
              </div>
            </div>}
            {seats.length > 0 && getUpdatedMembersList()[1].length > 0 && <div className="p-col-5">
              <div className="p-row">
                <p style={{ color: '#E6CDB5', fontWeight: 'bold' }}>Miembros de tu grupo en esta clase:</p>
                {getUpdatedMembersList()[1].map((elem, index) => (
                  <p>{elem.name} {elem.lastname ? elem.lastname : ''} - Tapete reservado: {elem.number}</p>
                ))}
              </div>
            </div>}
            
            {reservations && <div className="p-col-10" style={{ marginTop: 40, zIndex: 10 }}>
                <div className="p-row">
                        {reservations.length !== 0 ? 'Lugar(es) reservado(s):' : ''}
                        {reservations.length !== 0 ? <div>
                            <small style={{ fontSize: "x-small" }}>*Para cancelar una reserva da click en (<i className="pi pi-times" style={{ color: "red", fontSize: "x-small" }}></i>)</small>
                        </div>: ''}
                        {
                            reservations.map((element, index) => (
                                <div>
                                    <p>Tapete reservado <strong>{element.Seat.number}</strong> reservado <i className="pi pi-times icon-deleted" style={{ position: 'initial', display: "initial" }} onClick={() => {
                                        cancelBooking(reservations[index].id)
                                    }} /></p>
                                </div>
                            ))
                        }
                </div>
            </div>}
            
            {occupiedSeats && <div className="p-col-10">
              <div className="p-grid p-align-center p-justify-center mapa-cycling">
                <div>
                  <div
                    centerContent={
                      <div
                        style={{
                          height: 50,
                          width: 100,
                          backgroundColor: "#E6CDB5",
                          display: "none",
                        }}
                      />
                    }
                    open
                    //86 normal (stage down), 265 for 180° (stage up)
                    rotation={265}
                    orbitStyle={() => ({
                      border: "none",
                      zIndex: 0,
                      position: "absolute",
                      borderRadius: "100%",
                    })}
                  >
                    <h1 className="fila"></h1>
                    {
                      [9, 10, 11, 12, 13, 14, 15, 16].map(n => (
                        <Button
                          label={`${n}`}
                          className={`${occupiedSeats.includes(`${n}`) ? 'p-button-rounded-c-o' : "p-button-rounded-c"} ${occupiedSeats.includes(`${n}`) ? '' : "p-button-pink-flow"}`}
                          style={{ fontWeight: 'bold' }}
                          badge={selected && selected.name === `${n}` && occupiedSeats.length === 0 ? "✓" : selectedPasses && selectedPasses.name === `${n}`  && occupiedSeats.length === 0 ? "✓" : selectedGroup && selectedGroup.name === `${n}`  && occupiedSeats.length === 0 ? "✓" : ""}
                          disabled={isOccupied(`${n}`)}
                          onClick={() => {
                            selectSeat(`${n}`)
                          }}
                        >
                        </Button>
                      ))
                    }
                    <h1 className="fila"></h1>
                    {/* Number of divs is same userCircle number + 1 */}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div
                   style={{
                    textAlign: 'center'
                   }}
                    orbitStyle={() => ({
                      border: "none",
                      zIndex: 0,
                      position: "absolute",
                      borderRadius: "100%",
                    })}
                  >
                    <h1 className="fila"></h1>
                    {
                      [1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                        <Button
                          label={`${n}`}
                          className={`${occupiedSeats.includes(`${n}`) ? 'p-button-rounded-c-o' : "p-button-rounded-c"} ${occupiedSeats.includes(`${n}`) ? '' : "p-button-pink-flow"}`}
                          style={{ fontWeight: 'bold' }}
                          badge={selected && selected.name === `${n}` && occupiedSeats.length === 0 ? "✓" :  selectedPasses && selectedPasses.name === `${n}`  && occupiedSeats.length === 0 ? "✓" : selectedGroup && selectedGroup.name === `${n}`  && occupiedSeats.length === 0 ? "✓" : ""}
                          disabled={isOccupied(`${n}`)}
                          onClick={() => {
                            selectSeat(`${n}`)
                          }}
                        >
                        </Button>
                      ))
                    }
                    <h1 className="fila"></h1>
                    {/* Number of divs is same userCircle number + 1 */}
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div>
                        <div
                          style={{
                            width: 130,
                            height: 130,
                            borderRadius: '100%',
                            backgroundColor: "#E6CDB5",
                            position: "static",
                            display: "flex",
                            alignItems: "center",
                            color: "#fff",
                            textAlign: "center",
                            justifyContent: "center",
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: 60
                          }}
                        >
                          <div className="p-grid p-align-center p-justify-center" >
                            <div className="p-col-12">
                              <p
                                style={{
                                  marginBottom: 0,
                                  color: 'transparent'
                                }}
                              >
                                Instructor
                              </p>
                            </div>
                            <div className="p-col-8">
                              <img
                                style={{
                                  maxWidth: "100%",
                                  marginBottom: "0.5rem",
                                  marginTop: -30,
                                  marginRight: 30
                                }}
                                src={Logo}
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            width: 130,
                            height: 130,
                            borderRadius: '100%',
                            position: "static",
                            display: "flex",
                            alignItems: "center",
                            color: "#fff",
                            textAlign: "center",
                            justifyContent: "center",
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            marginTop: -20,
                          }}
                        >
                          <div className="p-grid p-align-center p-justify-center">
                            <div className="p-col-12">
                              <p
                                style={{
                                  marginBottom: 0,
                                  color: 'black'
                                }}
                              >
                                Flow's Coach
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              </div>
            </div>}
          </div>
        </div>
        {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration="5000" strokeWidth="3" />
        </div>}
      </Layout>
    )
  })
)

export default IndexPage