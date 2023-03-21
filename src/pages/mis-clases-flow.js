import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from "primereact/progressspinner"
import { BrowserView, MobileView } from 'react-device-detect'

import Loader from "react-loader-spinner"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"
import MisClases from "../assets/images/flow-image-2.png"

import * as LocationsApi from '../api/v0/locations'
import * as MeApi from '../api/v0/me'
import * as Schedules from '../api/v0/schedules'

import * as moment from 'moment'

const Indicator = ({ color, label, borderStyle }) => (
  <div>
    <p style={{ display: 'flex', alignItems: 'center', margin: 0, fontSize: 12, fontWeight: 'bold' }}><div style={{ width: 12, height: 12, borderRadius: '100%', backgroundColor: color, marginRight: 5, border: borderStyle }}></div>{label}</p>
  </div>
)

const EventItem = ({ item, hour, instructor, onPress, disabled, isReserved, onAlreadyBooked, isFull, forbidden, readonly, myClasses, havePackage }) => {
  let end = new Date()
  end = new Date(end.setFullYear(item.date.substring(0, 4)))
  end = new Date(end.setMonth(parseInt(item.date.substring(5, 7)) - 1))
  end = new Date(end.setDate(item.date.substring(8, 10)))
  end = new Date(end.setHours(item.end.substring(0, 2)))
  end = new Date(end.setMinutes(item.end.substring(3, 5)))
  const now = new Date()
  
  //Validation to go room-class if exist object myClasses and the user have unlimited classes, pending classes or some passes
  const canReservate = myClasses && (myClasses.isUnlimited || myClasses.pending !== 0 || myClasses.pendingPasses !== 0 || myClasses.isUnlimitedGroup || myClasses.pendingGroup !== 0)

  //console.log('canReservate: ', canReservate, 'havePackage: ', !havePackage, 'onAlreadyBooked:', onAlreadyBooked, 'item: ', item, 'hour: ', hour, 'instructor: ', instructor, 'onPress: ', onPress, 'disabled: ', disabled, 'isReserved: ', isReserved, 'isFull: ', isFull, 'forbidden: ', forbidden, 'readonly: ', readonly)

  return (
    <div>
      <div 
        className={`eventItem ${isReserved ? 'reserved' : ''}`} 
        style={{ 
          backgroundColor: forbidden && isReserved ? '#ffffff' : forbidden ? '#E6CDB5' : disabled ? '#00000020' : isReserved ? '#ffffff' : now >= end ? '#00000020' : !havePackage && !canReservate ? '#E6CDB5' : '#E6CDB5', 
          border: isReserved ? "1px solid" : '',
          cursor: forbidden && isReserved ? 'pointer' : isReserved && !(now >= end) ? 'pointer' : forbidden ? 'not-allowed' : disabled ? 'not-allowed' : now >= end ? 'not-allowed' : readonly ? 'default' : !havePackage && !canReservate ? 'not-allowed' : 'pointer' }} 
          disabled={now >= end} 
          onClick={() => {
            /*
              * if can reservate then the user can open class and see seats
              * else if can't reservate but have at least a reservation then the user can open class and see your reservation
              * else if display dialog to inform that situation at user
            */
            if(canReservate) {
              if (!disabled && !(now >= end) && !forbidden) {
                !readonly && onPress()
              } else if(!disabled && !(now >= end) && forbidden && isReserved) {
                !readonly && onPress()
              }
            } else if(!canReservate && isReserved && !disabled) {
              if (!disabled && !(now >= end) && !forbidden) {
                !readonly && onPress()
              } else if(!disabled && !(now >= end) && forbidden && isReserved) {
                !readonly && onPress()
              }
            } else {
              !readonly && onAlreadyBooked()
            }            
          }
        }>
        {isFull && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
          <img style={{ width: 50, height: 90, objectFit: 'contain' }} src="https://www.bloomcycling.com/assets/img/SoldOut_01.png" />
        </div>}
        <p style={{ color: forbidden && isReserved ? '#ffffff' : isReserved && !disabled ? '#ffffff' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000050' : !havePackage && !canReservate ? '#FFFFFF' : '#ffffff', margin: 0, opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{hour}</p>
        <p style={{ color: forbidden && isReserved ? '#ffffff' : isReserved && !disabled ? '#ffffff' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : !havePackage && !canReservate ? '#FFFFFF' : '#ffffff', margin: 0, fontWeight: 'bold', opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{instructor}</p>
        <p style={{ color: forbidden && isReserved ? '#ffffff' : isReserved && !disabled ? '#ffffff' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : !havePackage && !canReservate ? '#FFFFFF' : '#ffffff', margin: 0, fontWeight: 'bold', textAlign: 'center', minHeight: 30, opacity: forbidden && isReserved ? 1.0 :isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{item.theme ? item.theme : ""}</p>
        <p style={{ color: forbidden && isReserved ? '#ffffff' : isReserved && !disabled ? '#ffffff' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : !havePackage && !canReservate ? '#FFFFFF' : '#ffffff', margin: 0, opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{item.Rooms.name}</p>
      </div>
    </div>
  )
}
const EventItemWithCancel = ({ item, hour, seat, instructor, isPass, isOnlyPass, onPress, disabled, isReserved, onAlreadyBooked, onSeeDetails, hasPassed }) => {
  return (
    <div>
      <div className={`eventItem ${isReserved ? 'reserved' : ''}`} style={{ position: "relative !important", backgroundColor: disabled ? '#00000020' : isReserved ? '#ffffff10' : '#eec0bc4', cursor: hasPassed ? 'default' : disabled ? 'not-allowed' : 'pointer', fontSize: isPass.length > 0 ? "x-small" : "small", paddingTop: isPass.length > 0 ? "6px" : "8px", paddingBottom: isPass.length > 0 ? "6px" : "8px" }}>
        {!hasPassed && <i className="pi pi-times icon-deleted" onClick={() => {
          if (!disabled && !hasPassed) {
            onPress()
          }
        }}></i>}
        <p style={{ color: disabled ? '#00000050' : '#ffffff', margin: 0, marginTop: "5px" }}>{hour}</p>
        <p style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0 }}>{instructor}</p>
        <p style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0 }}>{item.location.name}</p>
        <div style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0, marginTop: !isPass.length > 0 || !isOnlyPass ? "0.5rem" : 0, marginBottom: !isPass.length > 0 || !isOnlyPass ? "0.4rem" : 0 }}>Lugar <div style={{ borderRadius: "15px", background: "#E6CDB5", color: "#fff", paddingLeft: "4px", paddingRight: "4px", display: "inline" }}>{seat.number}</div></div>
        {isPass.length > 0 && !isOnlyPass && (<p style={{ color: disabled ? '#00000030' : 'gray', margin: 0 }}>+ {isPass.length} pase(s)</p>)}
        {isOnlyPass && <p style={{ margin: 0, marginTop: 10 }}>{isPass.length} pase(s)</p>}
        {isPass.length > 1 && <a style={{ margin: 0, fontWeight: 'bold' }} onClick={() => {
          if (onSeeDetails) {
            onSeeDetails()
          }
        }}>Ver detalles</a>}
      </div>
    </div>
  )
}

const EventItemEmpty = () => {
  return (
    <div>
      <div className="eventItemEmpty">
      </div>
    </div>
  )
}

const getWeekDays = (date, schedules) => {
    //date = '2021-12-26'
    //console.log(date, schedules)
    let firstDayOfWeek
    let countDays
    if (schedules.length == 8) {
        if (moment(date).weekday() == 0) {
            firstDayOfWeek = moment(date)
        } else {
            firstDayOfWeek = moment(date).add(1, 'days')
        }
        //firstDayOfWeek = moment().isoWeek(moment(date).week()).startOf("isoWeek").add(-1, 'days')
        countDays = 8
    }
    else {
        //firstDayOfWeek = moment().isoWeek(moment(date).week() - 1).startOf("isoWeek")
        firstDayOfWeek = moment().day("Monday")
        countDays = 7
    }
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    const data = []

    for (var i = 0; i < countDays; i++) {
        let numberDay = firstDayOfWeek.weekday() - 1;
        if (numberDay == -1) {
            numberDay = 6
        }
        const dayName = days[numberDay]
        const dayNumber = firstDayOfWeek.format('D')
        data.push({
        name: dayName,
        number: dayNumber
        })
        firstDayOfWeek = firstDayOfWeek.add(1, 'days')
    }
    return data
}

const getWeekDates = (date, events) => {
  const nDate = moment(date, "YYYY-MM-DD").set('hours', 0).set('minutes', 0).set('milliseconds', 0)
  const day = `${nDate.date()}`.padStart(2, '0')
  //let current = moment(`${nDate.year()}-${nDate.month() + 1}-${day} 00:00:00`, "YYYY-MM-DD")
  var current
  const data = []
  let counter

  if (events.length == 8) {
    counter = 8
    if (moment(date).weekday() == 0) {
        current = moment(date).set({hour:0,minute:0,second:0,millisecond:0})
    } else {
        current = moment(date).add(1, 'days').set({hour:0,minute:0,second:0,millisecond:0})
    }
  } else {
    counter = 7
    //current = moment().isoWeek(moment(date).week() - 1).startOf("isoWeek").set({hour:0,minute:0,second:0,millisecond:0})
    current = moment().day("Monday").set({hour:0,minute:0,second:0,millisecond:0})
    //let daysLess = (moment(date).weekday - 1) * -1
    //current = moment(date).add(daysLess, "days")
  }

  for (var i = 0; i < counter; i++) {
      const loquesea = current
    data.push(loquesea)
    current = moment(current).add(1, 'days')
  }
  return data
}

const getCurrentMonth = (date) => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[date.getMonth()]
}

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore

    let toast = useRef(null)

    const [state, setState] = useState({
      events: [],
      days: []
    })

    const [warning, setWarning] = useState({
      visible: false,
      classId: undefined
    })

    const [classId, setClassId] = useState(null)

    const [week, setWeek] = useState(moment().week())
    const [showCalendar, setShowCalendar] = useState(true)
    const [isClass, setIsClass] = useState(true)
    const [isGrupal, setIsGrupal] = useState(false)
    const [inGrup, setinGrup] = useState(false)
    const [myClasses, setMyClasses] = useState(null)
    const [pending, setPending] = useState({
      pending: 0,
      taken: 0
    })

    const [details, setDetails] = useState(null)

    const [loading, setLoading] = useState({
      loading: true,
      animateIn: true
    })

    useEffect(() => {
      const loadEvents = async () => {
        const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
        //let response = await LocationsApi.schedules(1, `2021-02-21`, store.token)
        // console.log(response)
        setState({
          events: response.schedules,
          days: getWeekDays(new Date(), response.schedules)
          //days: getWeekDays(`2021-02-21`, response.schedules)
        })
        setLoading({
          loading: true,
          animateIn: false
        })
        if (!store.token) setShowCalendar(true)
        setTimeout(() => {
          setLoading({
            animateIn: false,
            loading: false
          })
        }, 500);
      }
      const loadMyClasses = async () => {
        let response = await MeApi.classes(store.token)
        let responseMe = await MeApi.me(store.token)
        if (response.success) {
          //console.log(response)
          setMyClasses(response.data)

          let pending = 0
          let taken = 0
          for (var i in response.data.bookings) {
            const sch = response.data.bookings[i].Schedule
            const date = moment(sch.date.substring(0, 10) + " " + sch.start)
            if (date.isAfter()) {
              pending = pending + 1
            } else {
              taken = taken + 1
            }
          }
          setPending({
            pending,
            taken
          })
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
        if (responseMe.success) {
            // console.log(responseMe.data.profile);
            if (responseMe.data.profile.isLeader || responseMe.data.profile.fromGroup) {
                setinGrup(true)
            }
        }
      }
      //loadEvents()
      if (!store.isAdmin) loadMyClasses()
    }, [])

    useEffect(() => {
      const loadEvents = async () => {
        const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response 
        
        if(store.token) {
          response = await LocationsApi.schedulesClient(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
        } else {
          response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
        }
        //let response = await LocationsApi.schedules(1, `2021-02-14`, store.token)
        // console.log(response)
        setState({
          events: response.schedules,
          days: getWeekDays(new Date(), response.schedules)
        })
        loadEventItems()
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
      loadEvents()
    }, [week])

    const checkIfExpired = (date) => {
      const _date = moment(date)
      if (moment().isAfter(_date)) return true
      return false
    }

    const checkIfUnlimited = () => {
      let opened = false
      for (var i in myClasses.compras) {
        const compra = myClasses.compras[i]
        if (compra.Bundle.isUnlimited && !checkIfExpired(compra.expirationDate)) {
          setWarning({
            ...warning,
            visible: true
          })
          opened = true
          break
        }
      }
      if (!opened) {
        setTimeout(() => {
          openMapOk()
        }, 500);
        //openMapOk()
      }
    }

    const [booking, setBooking] = useState(null)
    const openMap = (id, index) => {
      setClassId(id)
      var bookings = []
      if(state.events) {
        for(var i in state.events[index]) {
          const b = state.events[index][i]
          if(b.id === id) {
            setBooking(b.booking)
            bookings = b.booking
          }
          
        }
      }

      let opened = false
      if (!store.isAdmin) {
        //console.log(myClasses)
        if (myClasses.isUnlimited && typeof myClasses.isUnlimited !== 'undefined') {
          setWarning({
            ...warning,
            visible: true
          })
          opened = true
        }
        if (!opened) {
          navigate("/flow-room", {
            state: {
              id: id,
              myClasses: myClasses,
              booking: bookings
            }
          })
        }
      } else {
        navigate("/flow-room", {
          state: {
            id: id,
            isClass: isClass,
            isGrupal: isGrupal
          }
        })
      }
    }

    const openMapOk = () => {
      navigate("/flow-room", {
        state: {
          id: classId,
          myClasses: myClasses,
          booking: booking
        }
      })
    }

    const isAlreadyBooked = (id, index) => {
      if(state.events) {
        for(var i in state.events[index]) {
          var b = state.events[index][i]

          //console.log(index, id, b.booking, state.events[index][i])
          if(b.id === id && b.booking && b.booking.length !== 0) {
            return true
          }
        }

        return false
      }
      
      return false
    }

    /* const isAlreadyBooked = (id) => {
      if (myClasses) {
        for (var i in myClasses.bookings) {
          const b = myClasses.bookings[i]
          const sch = b.Schedule
          if (sch.id === id && !b.isPass) {
            return true
          }
        }
        return false
      }
      return false
    } */

    const loadEventItems = () => {
      let rows = []
      let num = 0
      for (let i in state.events) {
        const day = state.events[i]
        if (day.length > num) {
          num = day.length
        }
      }
      let numberSchedules
      let items
      let hours = []
      for (let i = 0; i < 24; i++) {
          if (state.events.length == 8) {
            numberSchedules = 8
            items = [[], [], [], [], [], [], [], []]
          } else {
            numberSchedules = 7
            items = [[], [], [], [], [], [], []]
          }
          const h = "" + i
        const hour = `${h.padStart(2, '0')}:00:00`
        for (let j = 0; j < numberSchedules; j++) {
          const day = state.events[j]
          for (let k in day) {
            const item = day[k]
            const date = moment(item.date.substring(0, 10) + " " + item.start)
            const dStart = "" + date.hour()
            if (`${dStart.padStart(2, '0')}:00:00` === hour) {
              // Agregar condición para mostrar solo los eventos de la sala "Flow"
    if (item.Rooms.name === "Flow") {
      items[j].push(item)
    }
              break
            }
          }
        }
        hours.push(items)
      }
      for (let i in hours) {
        const hour = hours[i]
        let add = false
        for (let j in hour) {
          if (hour[j].length !== 0) {
            add = true
            break
          }
        }
        const nextExpirationDay = myClasses && myClasses.nextExpirationDate ? moment(myClasses.nextExpirationDate) : null
        nextExpirationDay && nextExpirationDay.set('minutes', 59)
        nextExpirationDay && nextExpirationDay.set('seconds', 0)
        nextExpirationDay && nextExpirationDay.set('hours', 23)

        const nextGroupExpirationDay = myClasses && myClasses.nextGroupExpirationDate ? moment(myClasses.nextGroupExpirationDate) : null
        nextGroupExpirationDay && nextGroupExpirationDay.set('minutes', 59)
        nextGroupExpirationDay && nextGroupExpirationDay.set('seconds', 0)
        nextGroupExpirationDay && nextGroupExpirationDay.set('hours', 23)

        var nextExpiration
        if(nextExpirationDay === null && nextGroupExpirationDay !== null) {
          //console.log("null individual, existe grupal")
          nextExpiration = nextGroupExpirationDay
        } else if(nextExpirationDay !== null && nextGroupExpirationDay === null) {
          //console.log("null grupal, existe individual")
          nextExpiration = nextExpirationDay
        } else if (nextExpirationDay === null && nextGroupExpirationDay === null) {
          //console.log("null individual y grupal")
          nextExpiration = null
        } else if(nextExpirationDay.isAfter(nextGroupExpirationDay) && nextExpirationDay.isBefore(nextGroupExpirationDay)) {
          //console.log("expira grupal")
          nextExpiration = nextGroupExpirationDay
        } else if (nextGroupExpirationDay.isBefore(nextExpirationDay) && nextExpirationDay.isAfter(nextGroupExpirationDay)) {
          //console.log("expira individual")
          nextExpiration = nextExpirationDay
        }

        if (add) {
          rows.push(
            <tr key={i}>
              <td>
                {hour[0][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[0][0].date.substring(0, 10)} ${hour[0][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[0][0].soldOut} 
                    item={hour[0][0]} 
                    hour={hour[0][0].start} 
                    instructor={hour[0][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[0][0].id, 0) 
                    }} 
                    disabled={moment().diff(moment(`${hour[0][0].date.substring(0, 10)} ${hour[0][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[0][0].id, 0)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              <td>
                {hour[1][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[1][0].date.substring(0, 10)} ${hour[1][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[1][0].soldOut} 
                    item={hour[1][0]} 
                    hour={hour[1][0].start} 
                    instructor={hour[1][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[1][0].id, 1) 
                    }} 
                    disabled={moment().diff(moment(`${hour[1][0].date.substring(0, 10)} ${hour[1][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[1][0].id, 1)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              <td>
                {hour[2][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[2][0].date.substring(0, 10)} ${hour[2][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[2][0].soldOut} 
                    item={hour[2][0]} 
                    hour={hour[2][0].start} 
                    instructor={hour[2][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[2][0].id, 2) 
                    }} 
                    disabled={moment().diff(moment(`${hour[2][0].date.substring(0, 10)} ${hour[2][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[2][0].id, 2)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              <td>
                {hour[3][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[3][0].date.substring(0, 10)} ${hour[3][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[3][0].soldOut} 
                    item={hour[3][0]} 
                    hour={hour[3][0].start} 
                    instructor={hour[3][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[3][0].id, 3) 
                    }} 
                    disabled={moment().diff(moment(`${hour[3][0].date.substring(0, 10)} ${hour[3][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[3][0].id, 3)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              <td>
                {hour[4][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[4][0].date.substring(0, 10)} ${hour[4][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[4][0].soldOut} 
                    item={hour[4][0]} 
                    hour={hour[4][0].start} 
                    instructor={hour[4][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[4][0].id, 4) 
                    }} 
                    disabled={moment().diff(moment(`${hour[4][0].date.substring(0, 10)} ${hour[4][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[4][0].id, 4)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              <td>
                {hour[5][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[5][0].date.substring(0, 10)} ${hour[5][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[5][0].soldOut} 
                    item={hour[5][0]} 
                    hour={hour[5][0].start} 
                    instructor={hour[5][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[5][0].id, 5) 
                    }} 
                    disabled={moment().diff(moment(`${hour[5][0].date.substring(0, 10)} ${hour[5][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[5][0].id, 5)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              <td>
                {hour[6][0] 
                  ? <EventItem 
                    readonly={!store.token} 
                    havePackage={!store.token && nextExpiration === null}
                    forbidden={myClasses && nextExpiration && moment(`${hour[6][0].date.substring(0, 10)} ${hour[6][0].start}`).isAfter(nextExpiration)} 
                    isFull={hour[6][0].soldOut} 
                    item={hour[6][0]} 
                    hour={hour[6][0].start} 
                    instructor={hour[6][0].Instructor.name} 
                    onPress={() => { 
                      openMap(hour[6][0].id, 6) 
                    }} 
                    disabled={moment().diff(moment(`${hour[6][0].date.substring(0, 10)} ${hour[6][0].start}`), 'minutes') > 15} 
                    myClasses={myClasses}
                    onAlreadyBooked={() => {
                      //console.log("no tiene clases")
                      setDisplayAlert(true)
                    }} 
                    isReserved={(isAlreadyBooked(hour[6][0].id, 6)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                  : <EventItemEmpty />
                }
              </td>
              {state.events.length == 8 &&
                <td>
                    {hour[7][0] 
                      ? <EventItem 
                        readonly={!store.token} 
                        havePackage={!store.token && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[7][0].date.substring(0, 10)} ${hour[7][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[7][0].soldOut} 
                        item={hour[7][0]} 
                        hour={hour[7][0].start} 
                        instructor={hour[7][0].Instructor.name} 
                        onPress={() => { 
                          openMap(hour[7][0].id, 7) 
                        }} 
                        disabled={moment().diff(moment(`${hour[7][0].date.substring(0, 10)} ${hour[7][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          //console.log("no tiene clases")
                          setDisplayAlert(true)
                        }} 
                        isReserved={(isAlreadyBooked(hour[7][0].id, 7)) || (myClasses && myClasses.pendingPasses == 0 && !isClass && !isGrupal) || (myClasses && myClasses.pendingGroup == 0 && !isGrupal && !isClass)} /> 
                      : <EventItemEmpty />}
                </td> 
              }
            </tr>
          )
        }
      }
      return rows
    }

    const loadClassesItems = () => {
      let rows = []
      let currents = []
      const dates = getWeekDates(new Date(), state.events)
      //const dates = getWeekDates("2021-02-21", state.events)
      if (myClasses) {
        for (var i in myClasses.bookings) {
          const schedule = myClasses.bookings[i].Schedule
          const location = myClasses.bookings[i].Seat.Room
          if (location === 'Flow') continue // <-- Agregar esta línea
          for (var d in dates) {
            const _date = dates[d]
            const sDate = moment(`${schedule.date.substring(0, 10)} 00:00:00`)
            
            if (sDate.isSame(_date)) {
              //console.log(myClasses.bookings[i].id)
              if (!myClasses.bookings[i].isPass) {
                currents.push({ ...schedule, bookingId: myClasses.bookings[i].id, isPass: [], seat: myClasses.bookings[i].Seat, isOnlyPass: false, location })
              } else {
                let added = false
                currents.forEach((element, index) => {
                  if (element.date === myClasses.bookings[i].Schedule.date && element.start === myClasses.bookings[i].Schedule.start && element.end === myClasses.bookings[i].Schedule.end) {
                    //console.log(myClasses.bookings[i])
                    added = true
                    currents[index].isPass.push(myClasses.bookings[i])
                  }
                });
                if (!added) {
                  currents.push({ ...schedule, bookingId: myClasses.bookings[i].id, isPass: [myClasses.bookings[i]], seat: myClasses.bookings[i].Seat, isOnlyPass: true })
                }
              }
              break
            }
          }
        }        
        let numberSchedules
        let items
        let hours = []
        for (let i = 0; i < 24; i++) {
          //             L    M   M   J   V   S   D 
          if (state.events.length == 8) {
            numberSchedules = 8
            items = [[], [], [], [], [], [], [], []]
          } else {
            numberSchedules = 7
            items = [[], [], [], [], [], [], []]
          }
          //const items = [[], [], [], [], [], [], []]
          const h = "" + i
          const hour = `${h.padStart(2, '0')}:00:00`
          for (let j = 0; j < numberSchedules; j++) {
            for (let k in currents) {
              const sch = currents[k]
              const date = moment(sch.date.substring(0, 10) + " " + sch.start)
              const start = date.startOf("minute")
              const dStart = "" + start.hour()
              if (`${dStart.padStart(2, '0')}:00:00` === hour) {
                const _date = dates[j]
                if (_date.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")) {
                  items[j].push(sch)
                }
              }
            }
          }
          hours.push(items)
        }
        for (let i in hours) {
          const hour = hours[i]
          let add = false
          for (let j in hour) {
            if (hour[j].length !== 0) {
              add = true
              break
            }
          }
          if (add) {
            rows.push(
              <tr key={i}>
                <td>
                  {hour[0][0] ? <EventItemWithCancel item={hour[0][0]} hasPassed={moment().isAfter(moment(`${hour[0][0].date.substring(0, 10)} ${hour[0][0].start}`).add(-3, 'hours'))} hour={hour[0][0].start} seat={hour[0][0].seat} instructor={hour[0][0].Instructor.name} isOnlyPass={hour[0][0].isOnlyPass} isPass={hour[0][0].isPass} onSeeDetails={() => {
                    setDetails(hour[0][0])
                  }} onPress={() => { handleDelete(hour[0][0]) }} disabled={moment().diff(moment(hour[0][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[1][0] ? <EventItemWithCancel item={hour[1][0]} hasPassed={moment().isAfter(moment(`${hour[1][0].date.substring(0, 10)} ${hour[1][0].start}`).add(-3, 'hours'))} hour={hour[1][0].start} seat={hour[1][0].seat} instructor={hour[1][0].Instructor.name} isOnlyPass={hour[1][0].isOnlyPass} isPass={hour[1][0].isPass} onSeeDetails={() => {
                    setDetails(hour[1][0])
                  }} onPress={() => { handleDelete(hour[1][0]) }} disabled={moment().diff(moment(hour[1][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[2][0] ? <EventItemWithCancel item={hour[2][0]} hasPassed={moment().isAfter(moment(`${hour[2][0].date.substring(0, 10)} ${hour[2][0].start}`).add(-3, 'hours'))} hour={hour[2][0].start} seat={hour[2][0].seat} instructor={hour[2][0].Instructor.name} isOnlyPass={hour[2][0].isOnlyPass} isPass={hour[2][0].isPass} onSeeDetails={() => {
                    setDetails(hour[2][0])
                  }} onPress={() => { handleDelete(hour[2][0]) }} disabled={moment().diff(moment(hour[2][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[3][0] ? <EventItemWithCancel item={hour[3][0]} hasPassed={moment().isAfter(moment(`${hour[3][0].date.substring(0, 10)} ${hour[3][0].start}`).add(-3, 'hours'))} hour={hour[3][0].start} seat={hour[3][0].seat} instructor={hour[3][0].Instructor.name} isOnlyPass={hour[3][0].isOnlyPass} isPass={hour[3][0].isPass} onSeeDetails={() => {
                    setDetails(hour[3][0])
                  }} onPress={() => { handleDelete(hour[3][0]) }} disabled={moment().diff(moment(hour[3][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[4][0] ? <EventItemWithCancel item={hour[4][0]} hasPassed={moment().isAfter(moment(`${hour[4][0].date.substring(0, 10)} ${hour[4][0].start}`).add(-3, 'hours'))} hour={hour[4][0].start} seat={hour[4][0].seat} instructor={hour[4][0].Instructor.name} isOnlyPass={hour[4][0].isOnlyPass} isPass={hour[4][0].isPass} onSeeDetails={() => {
                    setDetails(hour[4][0])
                  }} onPress={() => { handleDelete(hour[4][0]) }} disabled={moment().diff(moment(hour[4][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[5][0] ? <EventItemWithCancel item={hour[5][0]} hasPassed={moment().isAfter(moment(`${hour[5][0].date.substring(0, 10)} ${hour[5][0].start}`).add(-3, 'hours'))} hour={hour[5][0].start} seat={hour[5][0].seat} instructor={hour[5][0].Instructor.name} isOnlyPass={hour[5][0].isOnlyPass} isPass={hour[5][0].isPass} onSeeDetails={() => {
                    setDetails(hour[5][0])
                  }} onPress={() => { handleDelete(hour[5][0]) }} disabled={moment().diff(moment(hour[5][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[6][0] ? <EventItemWithCancel item={hour[6][0]} hasPassed={moment().isAfter(moment(`${hour[6][0].date.substring(0, 10)} ${hour[6][0].start}`).add(-3, 'hours'))} hour={hour[6][0].start} seat={hour[6][0].seat} instructor={hour[6][0].Instructor.name} isOnlyPass={hour[6][0].isOnlyPass} isPass={hour[6][0].isPass} onSeeDetails={() => {
                    setDetails(hour[6][0])
                  }} onPress={() => { handleDelete(hour[6][0]) }} disabled={moment().diff(moment(hour[6][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                {state.events.length == 8 &&
                <td>
                {hour[7][0] ? <EventItemWithCancel item={hour[7][0]} hasPassed={moment().isAfter(moment(`${hour[7][0].date.substring(0, 10)} ${hour[7][0].start}`).add(-3, 'hours'))} hour={hour[7][0].start} seat={hour[7][0].seat} instructor={hour[7][0].Instructor.name} isOnlyPass={hour[7][0].isOnlyPass} isPass={hour[7][0].isPass} onSeeDetails={() => {
                  setDetails(hour[7][0])
                }} onPress={() => { handleDelete(hour[7][0]) }} disabled={moment().diff(moment(hour[7][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>}
              </tr>
            )
          }
        }
      }

      return rows
    }

    const [displayConfirmation, setDisplayConfirmation] = useState(false)
    const [displayAlert, setDisplayAlert] = useState(pending.pending === 0)

    const loadMyClasses = async () => {
        setShowCalendar(false)
        let response = await MeApi.classes(store.token)
        let responseMe = await MeApi.me(store.token)
        if (response.success) {
            //console.log(response)
            setMyClasses(response.data)
            let pending = 0
            let taken = 0
            for (var i in response.data.bookings) {
            const sch = response.data.bookings[i].Schedule
            const date = moment(sch.date.substring(0, 10) + " " + sch.start)
            if (date.isAfter()) {
                pending = pending + 1
            } else {
                taken = taken + 1
            }
            }
            setPending({
            pending,
            taken
            })
        }
        if (responseMe.success) {
            // console.log(responseMe.data.profile);
            if (responseMe.data.profile.isLeader || responseMe.data.profile.fromGroup) {
                setinGrup(true)
            }
        }
    }
    const [deleting, setDeleting] = useState(false)
    const [currentSchedule, setCurrrentSchedule] = useState(null)
    const handleDelete = async (schedule) => {
      setCurrrentSchedule(schedule)
      //console.log(schedule)
      setDisplayConfirmation(true)
    }

    const getBookedPlaces = (passes) => {
      let added = [passes.seat]
      let val = passes.seat.number + ' '
      for (var i in passes.isPass) {
        const pass = passes.isPass[i]
        let _in = false
        for (var j in added) {
          const _added = added[j]
          if (_added === pass.Seat.number) {
            _in = true
            break
          }
        }
        if (!_in) val = `${val}${pass.Seat.number} `
      }
      return val
    }

    const renderFooter = (name) => {
      return (
        <div>
          <Button disabled={deleting} label="No" icon="pi pi-times" onClick={() => { setDisplayConfirmation(false) }} className="p-button-text" />
          {currentSchedule?.isPass.length === 0 ? (
            <Button disabled={deleting} label="Sí" icon={deleting ? "pi pi-spin pi-spinner" : "pi pi-check"} onClick={async () => {
              setDeleting(true)
              let response = await Schedules.deleteSchedule(currentSchedule.bookingId, store.token)
              if (response.success) {
                if (!store.isAdmin) loadMyClasses()
                setCurrrentSchedule(null)
                setDisplayConfirmation(false)
              } else {
                toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Esta reservación ya no se puede cancelar' });
              }
              setDeleting(false)
              setDisplayConfirmation(false)
            }} autoFocus />) : (
              <div>
                <Button disabled={deleting} label="Sí, solo pases" icon={deleting ? "pi pi-spin pi-spinner" : "pi pi-check"} onClick={async () => {
                  setDeleting(true)
                  let allOk = true
                  currentSchedule.isPass.forEach(async (element) => {
                    let response = await Schedules.deleteSchedule(element.id, store.token)
                    if (!response.success) {
                      allOk = false
                    }
                  });
                  if (allOk) {
                    if (!store.isAdmin) loadMyClasses()
                    setCurrrentSchedule(null)
                    setDisplayConfirmation(false)
                  } else {
                    toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Esta reservación ya no se puede cancelar' });
                  }
                  setDeleting(false)
                  setDisplayConfirmation(false)
                }} autoFocus />
                <Button disabled={deleting} label="Sí, ambos" icon={deleting ? "pi pi-spin pi-spinner" : "pi pi-check"} onClick={async () => {
                  setDeleting(true)
                  let allOk = true
                  currentSchedule.isPass.forEach(async (element) => {
                    let response = await Schedules.deleteSchedule(element.id, store.token)
                    if (!response.success) {
                      allOk = false
                    }
                  });
                  let response = await Schedules.deleteSchedule(currentSchedule.bookingId, store.token)

                  if (response.success && allOk) {
                    if (!store.isAdmin) loadMyClasses()
                    setCurrrentSchedule(null)
                    setDisplayConfirmation(false)
                  } else {
                    toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Esta reservación ya no se puede cancelar' });
                  }
                  setDeleting(false)
                  setDisplayConfirmation(false)
                }} autoFocus />
              </div>)}

        </div>
      );
    }
    return (
      <Layout page="perfil">
        <Toast ref={(el) => toast.current = el} />
        <Dialog header="Confirmación" visible={displayConfirmation} modal style={{ width: '400px' }} footer={renderFooter('displayConfirmation')} onHide={() => { setDisplayConfirmation(false) }}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
            <span>¿Estas seguro que deseas continuar?</span>
          </div>
        </Dialog>
        <Dialog header="Detalles de la reservación" visible={details} style={{ width: '50vw' }} onHide={() => setDetails(null)}>
          <p>Fecha: <span style={{ fontWeight: 'bold' }}>{details && details.date.substring(0, 10)}</span></p>
          <p>Horario: <span style={{ fontWeight: 'bold' }}>{details && details.start.substring(0, 5)} - {details && details.end.substring(0, 5)}</span></p>
          <p>Instructor: <span style={{ fontWeight: 'bold' }}>{details && details.Instructor.name} {details && details.Instructor.lastname}</span></p>
          <p>Lugares reservados: <span style={{ fontWeight: 'bold' }}>{details && getBookedPlaces(details)}</span></p>
        </Dialog>
        <Dialog header="¡Espera!" className="spDialog" visible={warning.visible} onHide={() => {
          setWarning({
            ...warning,
            visible: false
          })
        }}>
          <p>Bloomer, recuerda que si reservas y no vienes, le quitas la oportunidad de venir a alguien más. Procura cancelar con 3hrs de anticipación o mándanos DM.</p>
          <Button className="p-button-rounded p-button-pink" label="Quiero continuar" onClick={() => {
            openMapOk()
          }} />
        </Dialog>
        <SEO title={store.token ? "Mis Clases" : "Horarios"} />
        <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
          <div className="p-col">
            {!store.isAdmin && <div className="p-d-flex p-flex-column p-jc-center">
              <div className="p-mb-1 p-as-center">
                <Button
                  className="card primary-box p-ripple item-profile"
                  style={{
                    background: `url(${MisClases})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  label=""
                  onClick={() => navigate("/mis-clases-flow")}
                ></Button>
              </div>
              <div
                className="p-as-center item-text-profile"
                style={{ color: "#E6CDB5" }}
              >
                {store.token ? 'Mis clases' : 'Horarios'}
              </div>
            </div>}
          </div>
          {store.token && (
            <div className="p-col-fixed" style={{ width: "100px" }}>
              <Item color="#E6CDB5" icon="pi pi-user" store={store} />
            </div>
          )}
        </div>
        {!store.isAdmin && showCalendar && myClasses && myClasses.pending === 0 && myClasses.pendingGroup === 0 &&
          <Dialog header="Atención" visible={displayAlert} modal style={{ width: '400px' }} onHide={() => { setDisplayAlert(false) }}>
            <div className="confirmation-content" style={{ marginBottom: 20 }}>
              <span>No tienes clases disponibles. Por favor, acercate a front-desk para adquirir un paquete o compra uno dando click <a href="#paquetes" onClick={() => {
                navigate('/paquetes')
              }}>aquí</a>.</span>
            </div>
          </Dialog>
        }
        {!store.isAdmin && showCalendar && store.token && <div className="p-col-12 header-mis-clases">
          <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#E6CDB5" }}>
            Clases tomadas: <strong>{myClasses && myClasses.taken}</strong>
          </p>
        </div>}
        {!store.isAdmin && showCalendar && store.token && <div className="p-col-12 header-mis-clases">
          <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#E6CDB5" }}>
            Clases disponibles: <strong>{myClasses && myClasses.isUnlimited ? 'Ilimitadas' : `${myClasses ? myClasses.pending : ''}`}</strong>
          </p>
        </div>}
        {!store.isAdmin && showCalendar && store.token && <div className="p-col-12 header-mis-clases">
          <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#E6CDB5" }}>
            Pases tomados: <strong>{myClasses && myClasses.takenPasses}</strong>
          </p>
        </div>}
        {!store.isAdmin && showCalendar && store.token && <div className="p-col-12 header-mis-clases">
          <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#E6CDB5" }}>
            Pases disponibles: <strong>{myClasses && myClasses.pendingPasses}</strong>
          </p>
        </div>}

        {!store.isAdmin && inGrup && showCalendar && store.token && <div className="p-col-12 header-mis-clases">
          <p style={{ margin: 0, marginLeft: "2px", marginRight: "22px", color: "#E6CDB5" }}>
            Clases grupales tomadas: <strong>{myClasses && myClasses.takenGroup}</strong>
          </p>
        </div>}
        {!store.isAdmin && inGrup && showCalendar && store.token && <div className="p-col-12 header-mis-clases">
          <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#E6CDB5" }}>
            Clases grupales disponibles: <strong>{myClasses && myClasses.isUnlimitedGroup ? 'Ilimitadas' : `${myClasses ? myClasses.pendingGroup : ''}`}</strong>
          </p>
        </div>}
        


        {!store.isAdmin && !showCalendar && store.token && <div className="p-col-12 p-mt-2 header-mis-clases p-justify-center" style={{ marginTop: '-30px' }}>
          <div>
            <Button style={{ marginTop: 20 }} label={showCalendar ? "Cancelar" : "Reservar"} className="p-button-rounded" disabled={myClasses && myClasses.pending <= 0} onClick={() => {
              if (showCalendar) {
                setShowCalendar(false)
              } else {
                setIsClass(true)
                setIsGrupal(false)
                setShowCalendar(true)
              }
            }} />
            <Button style={{ marginTop: 20, marginLeft: 20, backgroundColor: '#E6CDB5', borderColor: '#E6CDB5' }} label={showCalendar ? "Cancelar" : "Reservar pase"} className="p-button-rounded" disabled={myClasses && myClasses.pendingPasses <= 0} onClick={() => {
              if (showCalendar) {
                setShowCalendar(false)
              } else {
                setIsClass(false)
                setIsGrupal(false)
                setShowCalendar(true)
              }
            }} />
            {inGrup && <Button style={{ marginTop: 20, marginLeft: 20, backgroundColor: '#E6CDB5', borderColor: '#E6CDB5' }} label={showCalendar ? "Cancelar" : "Reservar grupal"} className="p-button-rounded" disabled={myClasses && myClasses.pendingGroup <= 0} onClick={() => {
              if (showCalendar) {
                setShowCalendar(false)
              } else {
                setIsClass(false)
                setIsGrupal(true)
                setShowCalendar(true)
              }
            }} />}
          </div>

          <small style={{ fontSize: "x-small" }}>*Para cancelar una reserva da click en (<i className="pi pi-times" style={{ color: "red", fontSize: "x-small" }}></i>)</small>
        </div>}
        {!store.isAdmin && !showCalendar && <div className="p-col-12 p-mt-2">
          {isClass && store.token && !isGrupal && <p style={{ margin: 0, color: "#E6CDB5" }}>
            Clases disponibles: <strong>{myClasses && myClasses.isUnlimited ? 'Ilimitadas' : `${myClasses ? myClasses.pending : ''}`}</strong>
          </p>}
          {!isClass && !isGrupal && <p style={{ margin: 0, color: "#E6CDB5" }}>
            Pases disponibles: <strong>{myClasses && myClasses.pendingPasses}</strong>
          </p>}
          {!isClass && isGrupal && <p style={{ margin: 0, color: "#E6CDB5" }}>
            Clases grupales disponibles: <strong>{myClasses && myClasses.isUnlimitedGroup ? 'Ilimitadas' : `${myClasses ? myClasses.pendingGroup : ''}`}</strong>
          </p>}
          {store.token && <Button style={{ marginTop: 20 }} label={showCalendar ? "Cancelar" : "Reservar"} className="p-button-rounded p-button-pink" disabled={myClasses && myClasses.pending <= 0 && myClasses.pendingGroup <= 0} onClick={() => {
            if (showCalendar) {
              setShowCalendar(false)
            } else {
              setShowCalendar(true)
            }
          }} />}
        </div>}
        
        <hr/>

        <h2 style={{ marginBottom: 10, marginLeft: 10 }}>{getCurrentMonth(new Date())}</h2>
        {!store.isAdmin && showCalendar && <div className="indicators" style={{
          display: 'flex', justifyContent: 'space-evenly', paddingLeft: 10, paddingRight: 10, margin: 0
        }}>
          <Indicator style={{ marginLeft: 10 }} color="#E6CDB5" label="Clases disponibles" />
          <Indicator style={{ marginLeft: 10 }} color="#00000020" label="Clases pasadas" />
          {store.token && <Indicator style={{ marginLeft: 10 }} color="white" label="Clases reservadas" borderStyle="1px solid black" />}
          {store.token && <Indicator style={{ marginLeft: 10 }} color="#E6CDB5" label="Clases fuera de vigencia/Sin clases" />}
        </div>}
        {/* <Button icon="pi pi-angle-left" className='p-button-rounded' style={{ height: 30, width: 30, backgroundColor: 'white', border: 'none', color: 'black', marginLeft: 10 }} onClick={() => {
            setWeek(week - 1)
          }} />
          <span style={{ marginLeft: 10, marginRight: 10 }}>Cambiar semana</span>
          <Button icon="pi pi-angle-right" className='p-button-rounded' style={{ height: 30, width: 30, backgroundColor: 'white', border: 'none', color: 'black' }} onClick={() => {
            setWeek(week + 1)
          }} /> */}
        {!showCalendar && (state.days.length == 7 || state.days.length == 8) &&
          <div style={{ overflow: 'scroll' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 100, marginTop: 20, tableLayout: 'fixed', minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={{ color: '#E6CDB5' }}>
                    {state.days[0].name}
                    <p style={{ margin: 0 }}>{state.days[0].number}</p>
                  </th>
                  <th>
                    {state.days[1].name}
                    <p style={{ margin: 0 }}>{state.days[1].number}</p>
                  </th>
                  <th>
                    {state.days[2].name}
                    <p style={{ margin: 0 }}>{state.days[2].number}</p>
                  </th>
                  <th>
                    {state.days[3].name}
                    <p style={{ margin: 0 }}>{state.days[3].number}</p>
                  </th>
                  <th>
                    {state.days[4].name}
                    <p style={{ margin: 0 }}>{state.days[4].number}</p>
                  </th>
                  <th>
                    {state.days[5].name}
                    <p style={{ margin: 0 }}>{state.days[5].number}</p>
                  </th>
                  <th>
                    {state.days[6].name}
                    <p style={{ margin: 0 }}>{state.days[6].number}</p>
                  </th>
                  {state.days.length == 8 && <th>
                    {state.days[7].name}
                    <p style={{ margin: 0 }}>{state.days[7].number}</p>
                  </th>}
                </tr>
              </thead>
              <tbody>
                {loadClassesItems()}
              </tbody>
            </table>
          </div>

        }
        {showCalendar && (state.days.length == 7 || state.days.length == 8) &&
          <div style={{ overflow: 'scroll' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 100, marginTop: 20, tableLayout: 'fixed', minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={{ color: '#E6CDB5' }}>
                    {state.days[0].name}
                    <p style={{ margin: 0 }}>{state.days[0].number}</p>
                  </th>
                  <th>
                    {state.days[1].name}
                    <p style={{ margin: 0 }}>{state.days[1].number}</p>
                  </th>
                  <th>
                    {state.days[2].name}
                    <p style={{ margin: 0 }}>{state.days[2].number}</p>
                  </th>
                  <th>
                    {state.days[3].name}
                    <p style={{ margin: 0 }}>{state.days[3].number}</p>
                  </th>
                  <th>
                    {state.days[4].name}
                    <p style={{ margin: 0 }}>{state.days[4].number}</p>
                  </th>
                  <th>
                    {state.days[5].name}
                    <p style={{ margin: 0 }}>{state.days[5].number}</p>
                  </th>
                  <th>
                    {state.days[6].name}
                    <p style={{ margin: 0 }}>{state.days[6].number}</p>
                  </th>
                  {state.days.length == 8 && <th>
                    {state.days[7].name}
                    <p style={{ margin: 0 }}>{state.days[7].number}</p>
                  </th>}
                </tr>
              </thead>
              <tbody>
                {loadEventItems()}
              </tbody>

            </table>
          </div>
        }
        {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration="5000" strokeWidth="3" />
        </div>}
      </Layout>
    )
  })
)

export default IndexPage