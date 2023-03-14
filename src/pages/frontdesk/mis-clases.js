import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from "primereact/progressspinner"
import { AutoComplete } from "primereact/autocomplete"
import { BrowserView, MobileView } from 'react-device-detect'

import Loader from "react-loader-spinner"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import Item from "../../components/item-profile"
import MisClases from "../../assets/images/web4.jpg"

import * as LocationsApi from '../../api/v0/locations'
import * as MeApi from '../../api/v0/me'
import * as Schedules from '../../api/v0/schedules'
import * as ClientsAPI from '../../api/v0/clients'

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
            backgroundColor: forbidden && isReserved ? '#ffffff' : forbidden ? '#3eb978' : disabled ? '#00000020' : isReserved ? '#ffffff' : now >= end ? '#00000020' : !havePackage && !canReservate ? '#3eb978' :'#3eb978', 
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
              }  

              /* if (!disabled && !(now >= end) && !forbidden && havePackage) {
                !readonly && onPress()
              } else if(!disabled && !(now >= end) && forbidden && isReserved) {
                !readonly && onPress()
              } else if(!disabled && !(now >= end) && isReserved) {
                !readonly && onPress()
              } */
          }}
        >
          {isFull && <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}>
            <img style={{ width: 50, height: 90, objectFit: 'contain' }} src="https://www.bloomcycling.com/assets/img/SoldOut_01.png" />
          </div>}
          <p className="classes-taken" style={{ color: forbidden && isReserved ? '#495057' : isReserved && !disabled ? '#495057' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : '#495057', fontWeight: 'bold', opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0 }}>{item.occupied}/25</p>
          <p style={{ color: forbidden && isReserved ? '#ffffff' : isReserved && !disabled ? '#ffffff' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000050' : !havePackage && !canReservate ? '#FFFFFF' : '#ffffff', margin: 0, opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{hour}</p>
          <p style={{ color: forbidden && isReserved ? '#495057' : isReserved && !disabled ? '#495057' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : !havePackage && !canReservate ? '#FFFFFF' : '#495057', margin: 0, fontWeight: 'bold', opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{instructor}</p>
          <p style={{ color: forbidden && isReserved ? '#495057' : isReserved && !disabled ? '#495057' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : !havePackage && !canReservate ? '#FFFFFF' : '#495057', margin: 0, fontWeight: 'bold', textAlign: 'center', minHeight: 30, opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{item.theme ? item.theme : ""}</p>
          <p style={{ color: forbidden && isReserved ? '#ffffff' : isReserved && !disabled ? '#ffffff' : forbidden ? '#FFFFFF' : (disabled || now >= end) ? '#00000030' : !havePackage && !canReservate ? '#FFFFFF' : '#ffffff', margin: 0, opacity: forbidden && isReserved ? 1.0 : isReserved && !disabled ? 1.0 : forbidden ? 0.5 : !havePackage && !canReservate ? 0.5 : 1.0, fontSize: 12 }}>{item.Rooms.name}</p>
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
  
const getCurrentMonth = (date) => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    return months[date.getMonth()]
}

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore

    let toast = useRef(null)

    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })
    const [state, setState] = useState({
        events: [],
        days: []
    })

    const [selectedClient, setSelectedClient] = useState(null)
    const [week, setWeek] = useState(moment().week())

    const [showCalendar, setShowCalendar] = useState(true)
    const [showActiveCalendar, setShowActiveCalendar] = useState(false)
    const [isClass, setIsClass] = useState(true)
    const [isGrupal, setIsGrupal] = useState(false)
    const [inGrup, setinGrup] = useState(false)
    const [myClasses, setMyClasses] = useState(null)

    useEffect(() => {
      const loadMyClasses = async () => {
        setShowCalendar(true)
        let response = await MeApi.classes(store.token)
        let responseMe = await MeApi.me(store.token)
        if (response.success) {
          //console.log(response)
          setMyClasses(response.data)

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
      loadMyClasses()
    }, [])

    useEffect(() => {
      const loadEvents = async () => {
        const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
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

    const openMap = (id, index) => {
      var bookings = []
      if(state.events) {
        for(var i in state.events[index]) {
          const b = state.events[index][i]
          if(b.id === id) {
            bookings = b.booking
          }
        }
      }

      navigate("/frontdesk/cycling-room", {
        state: {
          id: id,
          selectedClient: selectedClient,
          myClasses: myClasses,
          booking: bookings
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
                items[j].push(item)
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
                      readonly={!showActiveCalendar} 
                      havePackage={!showActiveCalendar && nextExpiration === null}
                      forbidden={myClasses && nextExpiration && moment(`${hour[0][0].date.substring(0, 10)} ${hour[0][0].start}`).isAfter(nextExpiration)} 
                      isFull={hour[0][0].soldOut} 
                      item={hour[0][0]} 
                      hour={hour[0][0].start} 
                      instructor={hour[0][0].Instructor.name} 
                      onPress={() => { openMap(hour[0][0].id, 0) }} 
                      disabled={moment().diff(moment(`${hour[0][0].date.substring(0, 10)} ${hour[0][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                      onAlreadyBooked={() => {
                        toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                      }} isReserved={(isAlreadyBooked(hour[0][0].id, 0))} /> 
                    : <EventItemEmpty />
                  }
                </td>


                <td>
                  {hour[1][0] 
                    ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[1][0].date.substring(0, 10)} ${hour[1][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[1][0].soldOut} 
                        item={hour[1][0]} 
                        hour={hour[1][0].start} 
                        instructor={hour[1][0].Instructor.name} 
                        onPress={() => { openMap(hour[1][0].id, 1) }} 
                        disabled={moment().diff(moment(`${hour[1][0].date.substring(0, 10)} ${hour[1][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }}    
                        isReserved={(isAlreadyBooked(hour[1][0].id, 1))} /> 
                    : <EventItemEmpty />
                  }
                </td>
                <td>
                  {hour[2][0] 
                    ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[2][0].date.substring(0, 10)} ${hour[2][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[2][0].soldOut} 
                        item={hour[2][0]}
                        hour={hour[2][0].start} 
                        instructor={hour[2][0].Instructor.name} 
                        onPress={() => { openMap(hour[2][0].id, 2) }} 
                        disabled={moment().diff(moment(`${hour[2][0].date.substring(0, 10)} ${hour[2][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                            toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }} 
                        isReserved={(isAlreadyBooked(hour[2][0].id, 2))} /> 
                    : <EventItemEmpty />}
                </td>
                <td>
                  {hour[3][0] 
                    ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[3][0].date.substring(0, 10)} ${hour[3][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[3][0].soldOut} 
                        item={hour[3][0]} 
                        hour={hour[3][0].start} 
                        instructor={hour[3][0].Instructor.name} 
                        onPress={() => { openMap(hour[3][0].id, 3) }} 
                        disabled={moment().diff(moment(`${hour[3][0].date.substring(0, 10)} ${hour[3][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }} 
                        isReserved={(isAlreadyBooked(hour[3][0].id, 3))} /> 
                      : <EventItemEmpty />
                    }
                </td>
                <td>
                  {hour[4][0] 
                    ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[4][0].date.substring(0, 10)} ${hour[4][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[4][0].soldOut} 
                        item={hour[4][0]} 
                        hour={hour[4][0].start} 
                        instructor={hour[4][0].Instructor.name} 
                        onPress={() => { openMap(hour[4][0].id, 4) }} 
                        disabled={moment().diff(moment(`${hour[4][0].date.substring(0, 10)} ${hour[4][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }} 
                        isReserved={(isAlreadyBooked(hour[4][0].id, 4))} /> 
                      : <EventItemEmpty />
                    }
                </td>
                <td>
                  {hour[5][0] 
                    ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[5][0].date.substring(0, 10)} ${hour[5][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[5][0].soldOut} 
                        item={hour[5][0]} 
                        hour={hour[5][0].start} 
                        instructor={hour[5][0].Instructor.name} 
                        onPress={() => { openMap(hour[5][0].id, 5) }} 
                        disabled={moment().diff(moment(`${hour[5][0].date.substring(0, 10)} ${hour[5][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }} 
                        isReserved={(isAlreadyBooked(hour[5][0].id, 5))} /> 
                      : <EventItemEmpty />
                    }
                </td>
                <td>
                  {hour[6][0] 
                    ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[6][0].date.substring(0, 10)} ${hour[6][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[6][0].soldOut} 
                        item={hour[6][0]} 
                        hour={hour[6][0].start} 
                        instructor={hour[6][0].Instructor.name} 
                        onPress={() => { openMap(hour[6][0].id, 6) }} 
                        disabled={moment().diff(moment(`${hour[6][0].date.substring(0, 10)} ${hour[6][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }} 
                        isReserved={(isAlreadyBooked(hour[6][0].id, 6))} /> 
                      : <EventItemEmpty />
                    }
                </td>
                {state.events.length == 8 &&
                  <td>
                    {hour[7][0] 
                      ? <EventItem 
                        readonly={!showActiveCalendar} 
                        havePackage={!showActiveCalendar && nextExpiration === null}
                        forbidden={myClasses && nextExpiration && moment(`${hour[7][0].date.substring(0, 10)} ${hour[7][0].start}`).isAfter(nextExpiration)} 
                        isFull={hour[7][0].soldOut} 
                        item={hour[7][0]} 
                        hour={hour[7][0].start} 
                        instructor={hour[7][0].Instructor.name} 
                        onPress={() => { openMap(hour[7][0].id, 7) }} 
                        disabled={moment().diff(moment(`${hour[7][0].date.substring(0, 10)} ${hour[7][0].start}`), 'minutes') > 15} 
                        myClasses={myClasses}
                        onAlreadyBooked={() => {
                          toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                        }} 
                        isReserved={(isAlreadyBooked(hour[7][0].id, 7))} /> 
                      : <EventItemEmpty />
                    }
                  </td> 
                }
              </tr>
            )
          }
        }
        return rows
    }

    const loadSchedule = async (id) => {
        const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response = await LocationsApi.schedulesAdmin(1, `${date.year()}-${date.month() + 1}-${day}`, store.token, id)
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

    const loadScheduleGeneral = async () => {
      const date = moment()
      const day = `${date.date()}`.padStart(2, '0')
      let response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
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

    ///Buscador
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

    return (
        <Layout page="reservas">
        <Toast ref={(el) => toast.current = el} />
        <SEO title={store.token ? "Mis Clases" : "Horarios"} />

            <div className="p-grid p-align-center p-justify-center" style={{marginTop: 50}}>
                <div className="p-col-12">
                    <p 
                        className="login-label"
                        style={{ textAlign: 'left', margin: 0}}
                    >
                        Buscar cliente:
                    </p>
                    <div style={{ width: '100%' }}>
                        <AutoComplete
                            value={selectedClient}
                            suggestions={filtered}
                            completeMethod={searchClient}
                            type="search"
                            field="name"
                            delay={1000}
                            itemTemplate={optionTemplate}
                            onChange={e => {
                                setSelectedClient(e.target.value)
                                setMyClasses({
                                    nextClass: e.target.value.nextClass,
                                    taken: e.target.value.taken,
                                    pending: e.target.value.pending,
                                    isUnlimited: e.target.value.isUnlimited,
                                    takenPasses: e.target.value.takenPasses,
                                    pendingPasses: e.target.value.pendingPasses,
                                    takenGroup: e.target.value.takenGroup,
                                    pendingGroup: e.target.value.pendingGroup,
                                    isUnlimitedGroup: e.target.value.isUnlimitedGroup,
                                    nextExpirationDate: e.target.value.nextExpirationDate,
                                    nextGroupExpirationDate: e.target.value.nextGroupExpirationDate,
                                })
                                if (e.target.value.isLeader || e.target.value.fromGroup) {
                                    setinGrup(true)
                                }

                                if(e.target.value.id) {
                                    setShowActiveCalendar(true)
                                    loadSchedule(e.target.value.id)
                                }

                                if(!e.target.value) {
                                  setShowActiveCalendar(false)
                                  loadScheduleGeneral()
                                }
                            }}
                            style={{ width: '100% ' }}
                            inputStyle={{ width: '100% ' }}
                        />
                    </div>
                </div>
            </div>

        {selectedClient && selectedClient.name && <div className="p-col-12 header-mis-clases">
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
                Nombre: <strong>{selectedClient.name + " " + selectedClient.lastname}</strong>
            </p>
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
                Email: <strong>{selectedClient.email}</strong>
            </p>
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
            </p>
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
            </p>
        </div>}

        {selectedClient && selectedClient.name && <hr/>}

        {store.token && selectedClient && typeof selectedClient.pending !== 'undefined' && <div className="p-col-12 header-mis-clases">
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
                Clases disponibles: <strong>{myClasses && myClasses.isUnlimited ? 'Ilimitadas' : `${myClasses ? myClasses.pending : ''}`}</strong>
            </p>
        </div>}
        {store.token && selectedClient && typeof selectedClient.pendingPasses !== 'undefined' && <div className="p-col-12 header-mis-clases">
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
                Pases disponibles: <strong>{myClasses.pendingPasses}</strong>
            </p>
        </div>}
        {selectedClient && typeof selectedClient.pendingGroup !== 'undefined' && store.token && <div className="p-col-12 header-mis-clases">
            <p style={{ margin: 0, marginLeft: "2px", marginRight: "2px", color: "#3eb978" }}>
                Clases grupales disponibles: <strong>{myClasses && myClasses.isUnlimitedGroup ? 'Ilimitadas' : `${myClasses ? myClasses.pendingGroup : ''}`}</strong>
            </p>
        </div>}

        {selectedClient && selectedClient.name && <hr/>}

        <h2 style={{ marginBottom: 10, marginLeft: 10 }}>{getCurrentMonth(new Date())}</h2>
        {showCalendar && <div className="indicators" style={{
            display: 'flex', justifyContent: 'space-evenly', paddingLeft: 10, paddingRight: 10, margin: 0
        }}>
            <Indicator style={{ marginLeft: 10 }} color="#3eb978" label="Clases disponibles" />
            <Indicator style={{ marginLeft: 10 }} color="#00000020" label="Clases pasadas" />
            <Indicator style={{ marginLeft: 10 }} color="white" label="Clases reservadas" borderStyle="1px solid black" />
            <Indicator style={{ marginLeft: 10 }} color="#3eb978" label="Clases fuera de vigencia/Sin clases" />
        </div>}

        {showCalendar && (state.days.length == 7 || state.days.length == 8) &&
            <div style={{ overflow: 'scroll' }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 100, marginTop: 20, tableLayout: 'fixed', minWidth: 800 }}>
                    <thead>
                        <tr>
                        <th style={{ color: '#3eb978' }}>
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