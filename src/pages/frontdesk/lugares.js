import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { Dialog } from 'primereact/dialog';
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { ProgressSpinner } from "primereact/progressspinner"
import { Paginator } from 'primereact/paginator'

import Loader from "react-loader-spinner"

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as LocationsApi from '../../api/v0/locations'
import * as MeApi from '../../api/v0/me'
import * as Schedules from '../../api/v0/schedules'

import * as moment from 'moment'
import { addHours } from 'date-fns'
import { FaHourglassEnd, FaLessThanEqual } from "react-icons/fa"

const EventItem = ({ item, hour, instructor, onPress, disabled, isReserved, onAlreadyBooked, onSeeMap }) => {
  return (
    <div style={{marginBottom: 10}}>
      <div className={`eventItem2 ${isReserved ? 'reserved' : ''}`} style={{ backgroundColor: disabled ? '#00000020' : isReserved ? '#00000010' : '#3eb978', cursor: disabled ? 'not-allowed' : 'pointer' }} onClick={() => {
        if (isReserved) {
          onAlreadyBooked && onAlreadyBooked()
        } else if (!disabled) {
          onPress()
        }
      }}>
        <p style={{ color: disabled ? '#00000050' : '#ffffff', margin: 0, fontSize: 13 }}>{hour}</p>
        <p style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0, fontSize: 13 }}>{instructor}</p>
        <p style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0, fontSize: 13, textAlign: 'center', paddingLeft: 5, paddingRight: 5, minHeight: 20 }}>{item.theme ? item.theme : ""}</p>
        <p style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0, fontSize: 13, marginBottom: 20 }}>{item.Rooms.name}</p>
      </div>
      <div onClick={() => {onSeeMap()}} style={{backgroundColor: '#000000', borderRadius: 10, color: 'white', paddingLeft: 10, paddingRight: 10, fontSize: 12, cursor: 'pointer', marginTop: -30, textAlign: 'center', zIndex: '200 !important', width: '90%', marginLeft: '5%'}}>Pantalla</div>
    </div>
  )
}
const EventItemWithCancel = ({ hour, seat, instructor, isPass, onPress, disabled, isReserved, onAlreadyBooked, }) => {
  return (
    <div>
      <div className={`eventItem ${isReserved ? 'reserved' : ''}`} style={{ position: "relative !important", backgroundColor: disabled ? '#00000020' : isReserved ? '#00000010' : '#eec0bc4', cursor: disabled ? 'not-allowed' : 'pointer', fontSize: isPass.length > 0 ? "x-small" : "small", paddingTop: isPass.length > 0 ? "6px" : "8px", paddingBottom: isPass.length > 0 ? "6px" : "8px" }} onClick={() => {
        if (isReserved) {
          onAlreadyBooked && onAlreadyBooked()
        } else if (!disabled) {
          onPress()
        }
      }}>
        <i className="pi pi-times icon-deleted"></i>
        <p style={{ color: disabled ? '#00000050' : '#ffffff', margin: 0, marginTop: "5px" }}>{hour}</p>
        <p style={{ color: disabled ? '#00000030' : '#495057', margin: 0 }}>{instructor}</p>
        <p style={{ color: disabled ? '#00000030' : '#ffffff', margin: 0 }}>Outdoors</p>
        <p style={{ color: disabled ? '#00000030' : '#495057', margin: 0, marginTop: !isPass.length > 0 ? "0.5rem" : 0, marginBottom: !isPass.length > 0 ? "0.4rem" : 0 }}>Lugar <div style={{ borderRadius: "15px", background: "#3eb978", color: "#fff", paddingLeft: "4px", paddingRight: "4px", display: "inline" }}>{seat.number}</div></p>
        {isPass.length > 0 && (<p style={{ color: disabled ? '#00000030' : 'gray', margin: 0 }}>+ {isPass.length} pase</p>)}
        {isPass.length > 0 && (<p style={{ color: disabled ? '#00000030' : 'gray', margin: 0 }}>Lugar {isPass[0].Seat.number}</p>)}
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

    //let toast = useRef(null)

    const [state, setState] = useState({
      events: [],
      days: []
    })

    const [warning, setWarning] = useState({
      visible: false,
      classId: undefined
    })

    const [classId, setClassId] = useState(null)

    var timer = null

    const [week, setWeek] = useState(moment().week())
    const [showCalendar, setShowCalendar] = useState(true)
    const [showList, setShowList] = useState(false)
    const [schedules, setSchedules] = useState([])
    const [schedulesCount, setSchedulesCount] = useState(0)
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

    let toast = useRef(null)

    const openSeats = (schedule) => {
      navigate("/frontdesk/asientos", {
        state: {
          id: schedule.id,
          schedule
        }
      })
    }

    const isAlreadyBooked = (id) => {
      if (myClasses) {
        for (var i in myClasses.bookings) {
          const sch = myClasses.bookings[i].Schedule
          if (sch.id === id) {
            return true
          }
        }
        return false
      }
      return false
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
        //const items = [[], [], [], [], [], [], []]
        const h = "" + i
        const hour = `${h.padStart(2, '0')}:00:00`
        for (let j = 0; j < numberSchedules; j++) {
          const day = state.events[j]
          for (let k in day) {
            const item = day[k]
            const date = moment(item.date.substring(0, 10) + " " + item.start)
            const dStart = "" + date.hour()
            if (`${dStart.padStart(2, '0')}:00:00` === hour && (item.Rooms.name === "Indoors" || item.Rooms.name === "Outdoors")) {
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
        if (add) {
          rows.push(
            <tr key={i}>
              <td>
                {hour[0][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[0][0].id
                    }
                  })
                }} isFull={hour[0][0].soldOut} item={hour[0][0]} hour={hour[0][0].start} instructor={hour[0][0].Instructor.name} onPress={() => { openSeats(hour[0][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[0][0].id)} /> : <EventItemEmpty />}
              </td>
              <td>
                {hour[1][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[1][0].id
                    }
                  })
                }} isFull={hour[1][0].soldOut} item={hour[1][0]} hour={hour[1][0].start} instructor={hour[1][0].Instructor.name} onPress={() => { openSeats(hour[1][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[1][0].id)} /> : <EventItemEmpty />}
              </td>
              <td>
                {hour[2][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[2][0].id
                    }
                  })
                }} isFull={hour[2][0].soldOut} item={hour[2][0]} hour={hour[2][0].start} instructor={hour[2][0].Instructor.name} onPress={() => { openSeats(hour[2][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[2][0].id)} /> : <EventItemEmpty />}
              </td>
              <td>
                {hour[3][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[3][0].id
                    }
                  })
                }} isFull={hour[3][0].soldOut} item={hour[3][0]} hour={hour[3][0].start} instructor={hour[3][0].Instructor.name} onPress={() => { openSeats(hour[3][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[3][0].id)} /> : <EventItemEmpty />}
              </td>
              <td>
                {hour[4][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[4][0].id
                    }
                  })
                }} isFull={hour[4][0].soldOut} item={hour[4][0]} hour={hour[4][0].start} instructor={hour[4][0].Instructor.name} onPress={() => { openSeats(hour[4][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[4][0].id)} /> : <EventItemEmpty />}
              </td>
              <td>
                {hour[5][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[5][0].id
                    }
                  })
                }} isFull={hour[5][0].soldOut} item={hour[5][0]} hour={hour[5][0].start} instructor={hour[5][0].Instructor.name} onPress={() => { openSeats(hour[5][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[5][0].id)} /> : <EventItemEmpty />}
              </td>
              <td>
                {hour[6][0] ? <EventItem onSeeMap={() => {
                  navigate('/frontdesk/reservaciones', {
                    state: {
                      id: hour[6][0].id
                    }
                  })
                }} isFull={hour[6][0].soldOut} item={hour[6][0]} hour={hour[6][0].start} instructor={hour[6][0].Instructor.name} onPress={() => { openSeats(hour[6][0]) }} disabled={false} onAlreadyBooked={() => {
                  toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
                }} isReserved={isAlreadyBooked(hour[6][0].id)} /> : <EventItemEmpty />}
              </td>
              {state.events.length == 8 &&
              <td>
              {hour[7][0] ? <EventItem onSeeMap={() => {
                navigate('/frontdesk/reservaciones', {
                  state: {
                    id: hour[7][0].id
                  }
                })
              }} isFull={hour[7][0].soldOut} item={hour[7][0]} hour={hour[7][0].start} instructor={hour[7][0].Instructor.name} onPress={() => { openSeats(hour[7][0]) }} disabled={false} onAlreadyBooked={() => {
                toast && toast.current.show({ severity: 'warn', summary: 'Lo sentimos', detail: 'Solo puedes reservar lugares una vez por horario' });
              }} isReserved={isAlreadyBooked(hour[7][0].id)} /> : <EventItemEmpty />}
            </td>}
            </tr>
          )
        }
      }
      return rows
    }

    const loadClassesItems = () => {
      let rows = []
      let currents = []
      //console.log("load")
      if (myClasses) {
        for (var i in myClasses.bookings) {
          const schedule = myClasses.bookings[i].Schedule
          if (moment(schedule.date).week() === week && (schedule.Rooms.name === "Indoors" || schedule.Rooms.name === "Outdoors")) {
            //console.log(myClasses.bookings[i].id)
            if (!myClasses.bookings[i].isPass) {
              currents.push({ ...schedule, bookingId: myClasses.bookings[i].id, isPass: [], seat: myClasses.bookings[i].Seat })
            } else {
              currents.forEach((element, index) => {
                if (element.date === myClasses.bookings[i].Schedule.date && element.start === myClasses.bookings[i].Schedule.start && element.end === myClasses.bookings[i].Schedule.end) {
                  //console.log(myClasses.bookings[i])
                  currents[index].isPass.push(myClasses.bookings[i])
                }
              });
            }

          }
        }
        let days = [[], [], [], [], [], [], []]
        let hours = []
        for (let i = 0; i < 24; i++) {
          const items = [[], [], [], [], [], [], []]
          const h = "" + i
          const hour = `${h.padStart(2, '0')}:00:00`
          for (let j = 0; j < 7; j++) {
            for (let k in currents) {
              const sch = currents[k]
              const date = moment(sch.date.substring(0, 10) + " " + sch.start)
              const start = date.startOf("minute")
              const dStart = "" + start.hour()
              if (`${dStart.padStart(2, '0')}:00:00` === hour && (sch.Rooms.name === "Indoors" || sch.Rooms.name === "Outdoors")) {
              let day = moment(sch.date).weekday() + 1
                //console.log(day, sch.date)
                if (day === 7) day = 0
                items[day].push(sch)
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
                  {hour[0][0] ? <EventItemWithCancel hour={hour[0][0].start} seat={hour[0][0].seat} instructor={hour[0][0].Instructor.name} isPass={hour[0][0].isPass} onPress={() => { handleDelete(hour[0][0]) }} disabled={moment().diff(moment(hour[0][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[1][0] ? <EventItemWithCancel hour={hour[1][0].start} seat={hour[1][0].seat} instructor={hour[1][0].Instructor.name} isPass={hour[1][0].isPass} onPress={() => { handleDelete(hour[1][0]) }} disabled={moment().diff(moment(hour[1][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[2][0] ? <EventItemWithCancel hour={hour[2][0].start} seat={hour[2][0].seat} instructor={hour[2][0].Instructor.name} isPass={hour[2][0].isPass} onPress={() => { handleDelete(hour[2][0]) }} disabled={moment().diff(moment(hour[2][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[3][0] ? <EventItemWithCancel hour={hour[3][0].start} seat={hour[3][0].seat} instructor={hour[3][0].Instructor.name} isPass={hour[3][0].isPass} onPress={() => { handleDelete(hour[3][0]) }} disabled={moment().diff(moment(hour[3][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[4][0] ? <EventItemWithCancel hour={hour[4][0].start} seat={hour[4][0].seat} instructor={hour[4][0].Instructor.name} isPass={hour[4][0].isPass} onPress={() => { handleDelete(hour[4][0]) }} disabled={moment().diff(moment(hour[4][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[5][0] ? <EventItemWithCancel hour={hour[5][0].start} seat={hour[5][0].seat} instructor={hour[5][0].Instructor.name} isPass={hour[5][0].isPass} onPress={() => { handleDelete(hour[5][0]) }} disabled={moment().diff(moment(hour[5][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
                <td>
                  {hour[6][0] ? <EventItemWithCancel hour={hour[6][0].start} seat={hour[6][0].seat} instructor={hour[6][0].Instructor.name} isPass={hour[6][0].isPass} onPress={() => { handleDelete(hour[6][0]) }} disabled={moment().diff(moment(hour[6][0].date), 'days') > 0} /> : <EventItemEmpty />}
                </td>
              </tr>
            )
          }
        }
      }

      return rows
    }

    useEffect(() => {
      const loadEvents = async () => {
        const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
        //let response = await LocationsApi.schedules(1, `2021-02-14`, store.token)
        setState({
          events: response.schedules,
          days: getWeekDays(new Date(), response.schedules)
          //days: getWeekDays(`2021-02-14`, response.schedules)
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
          setShowCalendar(true)
          setShowList(false)
        }, 500);
      }
      const loadMyClasses = async () => {
        setShowCalendar(false)
        let response = await MeApi.classes(store.token)
        if (response.success) {
          console.log(response)
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
      }
      //loadEvents()
      if (!store.isAdmin) loadMyClasses()
    }, [])

    useEffect(() => {
      const loadEvents = async () => {
        const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`, store.token)
        setState({
          events: response.schedules,
          days: getWeekDays(moment().add(week - moment().week(), 'weeks').toDate(), response.schedules)
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
      //loadSchedules()
    }, [week]) 

    const [first, setFirst] = useState(0)
    const changePage = (e) => {
      //console.log(e)
      setFirst(e.first)
      loadSchedules(e.page + 1, false)
    }

    const loadSchedules = async (page, pagination) => {
      if(pagination) {
        setFirst(0)
      }

      let response = await Schedules.getAllSchedules(store.token, page)
      const sch = response.data.data
      const schCount = response.data.pages
      console.log(sch)
      setSchedules(sch)
      setSchedulesCount(schCount)
    }

    const [displayConfirmation, setDisplayConfirmation] = useState(false)

    const loadEvents = async () => {
      const date = moment()
        const day = `${date.date()}`.padStart(2, '0')
        let response = await LocationsApi.schedules(1, `${date.year()}-${date.month() + 1}-${day}`)
      setState({
        events: response.schedules,
        days: getWeekDays(new Date(), response.schedules)
      })
    }

    const loadMyClasses = async () => {
      setShowCalendar(false)
      let response = await MeApi.classes(store.token)
      if (response.success) {
        console.log(response)
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
    }
    const [deleting, setDeleting] = useState(false)
    const [currentSchedule, setCurrrentSchedule] = useState(null)
    const handleDelete = async (schedule) => {
      setCurrrentSchedule(schedule)
      console.log(schedule)
      setDisplayConfirmation(true)
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

              }
              setDeleting(false)
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

                  }
                  setDeleting(false)
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

                  }
                  setDeleting(false)
                }} autoFocus />
              </div>)}

        </div>
      );
    }

    const editable = (date, start) => {
      const h = new Date(`${date.substring(0, 10)} ${start}`)
      return h > new Date()
    }

    const idBodyTemplate = rowData => {
      return (
        <React.Fragment>
          {rowData.id}
        </React.Fragment>
      )
    }
    const dateTemplate = rowData => {
      return (
        <React.Fragment>
          {new Date(rowData.date).toISOString().substring(0, 10).replaceAll('-', '/')}
        </React.Fragment>
      )
    }
    const timeTemplate = rowData => {
      return (
        <React.Fragment>
          {rowData.start.substring(0, 5) + ' - ' + rowData.end.substring(0, 5)}
        </React.Fragment>
      )
    }
    const instructorTemplate = rowData => {
      return (
        <React.Fragment>
          {rowData.Instructor.name + ' ' + rowData.Instructor.lastname}
        </React.Fragment>
      )
    }
    const placesTemplate = rowData => {
      return (
        <React.Fragment>
          {rowData.available}
        </React.Fragment>
      )
    }
    const statusTemplate = rowData => {
      return (
        <React.Fragment>
          {'Programada'}
        </React.Fragment>
      )
    }
    const actionTemplate = rowData => {
      return (
        <React.Fragment>
          <Button icon="pi pi-eye" className='p-button-rounded p-button-sm' style={{borderRadius: '100%', backgroundColor:'#DDD', color:'black', border: 'none', margin: 10}} onClick={(e) => {
            openSeats(rowData)
          }} />
          <Button icon="pi pi-map-marker" className='p-button-rounded p-button-sm' style={{borderRadius: '100%', backgroundColor:'#DDD', color:'black', border: 'none', margin: 10}} onClick={(e) => {
            navigate('/frontdesk/reservaciones', {
              state: {
                id: rowData.id
              }
            })
          }} />
          {editable(rowData.date, rowData.start) && <Button icon="pi pi-pencil" className='p-button-rounded p-button-sm' style={{borderRadius: '100%', backgroundColor:'#DDD', color:'black', border: 'none', margin: 10}} onClick={(e) => {
            navigate('/frontdesk/editar-clase', {
              state: {
                schedule: rowData
              }
            })
          }} />}
        </React.Fragment>
      )
    }

    const searchOnAllSchedules = async query => {
      if(query) {
        clearTimeout(timer)
            timer = setTimeout(async () => {
              const search = await Schedules.searchOnAllSchedules(store.token, query)
              console.log(search.data)
              setSchedules(search.data)
              setSchedulesCount(10)
            }, 1000)
      } else {
        setFirst(0)
        const restore = await Schedules.getAllSchedules(store.token, 1)
        setSchedules(restore.data.data)
        setSchedulesCount(restore.data.pages)
      }
    }
    const header = (
      <div className="table-header p-grid p-justify-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={e => searchOnAllSchedules(e.target.value)}
            placeholder="Buscar..."
          />
        </span>
      </div>
    )

    if (!store.token) {
      navigate("/")
      return (
        <div className="loader-login">
          <Loader
            style={{ marginTop: "calc(40vh - 50px)" }}
            type="Grid"
            height={100}
            width={100}
            color="#3eb978"
          />
          <p>Cargando...</p>
        </div>
      )
    } else {
      return (
        <Layout page="lugares">
          <Toast ref={(el) => toast = el} />
          <Dialog header="Confirmación" visible={displayConfirmation} modal style={{ width: '400px' }} footer={renderFooter('displayConfirmation')} onHide={() => { setDisplayConfirmation(false) }}>
            <div className="confirmation-content">
              <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
              <span>¿Estas seguro que deseas continuar?</span>
            </div>
          </Dialog>
          <SEO title="Lugares" />
          <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
            <div className="p-col-12 p-md-9">
              <h1 className="title-page" style={{ paddingLeft: 0 }}>
                CLASES
              </h1>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
              </div>
            </div>
          </div>
          <div className="p-d-flex" style={{ marginTop: 30 }}>
            <div className="p-mr-2">
              <Button label="Lista" icon="pi pi-list" style={{ marginRight: 20, marginLeft: 20, backgroundColor: '#dddddd', color: '#333', borderRadius: 50, border: 'none' }} onClick={() => {loadSchedules(1, true); setShowCalendar(false); setShowList(true) }} />
              <Button label="Calendario" icon="pi pi-calendar" style={{ backgroundColor: '#dddddd', color: '#333', borderRadius: 50, border: 'none' }} onClick={() => { setShowCalendar(true); setShowList(false) }} />
            </div>
          </div>
          <div className="p-d-flex p-jc-end" style={{ marginTop: -35 }}>
            <div className="p-mr-2">
              <Button label="Nueva clase" icon="pi pi-plus" style={{ backgroundColor: '#3eb978', borderRadius: 50, border: 'none' }} onClick={()=>{navigate('/frontdesk/nueva-clase')}} />
            </div>
          </div>
          {showList &&
            <div>
              <DataTable
                value={schedules}
                className="p-datatable-responsive-demo"
                rows={10}
                header={header}
                style={{marginTop: 20}}
              >
                <Column
                  sortable
                  field="id"
                  header="ID"
                  body={idBodyTemplate}
                />
                <Column
                  sortable
                  field="date"
                  header="Fecha"
                  body={dateTemplate}
                />
                <Column
                  sortable
                  field="start"
                  header="Horario"
                  body={timeTemplate}
                />
                <Column
                  sortable
                  field="Instructor.name"
                  header="Instructor"
                  body={instructorTemplate}
                />
                <Column
                  sortable
                  field="places"
                  header="Lugares disponibles"
                  body={placesTemplate}
                />
                <Column
                  field="end"
                  header=""
                  body={actionTemplate}
                />
              </DataTable>
              <Paginator 
                rows={10} totalRecords={schedulesCount} first={first} onPageChange={changePage}
              />
            </div>
          }
          { state.days.length > 0 && showCalendar &&
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
          {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3}/>
          </div>}
        </Layout>
      )
    }
  })
)

export default IndexPage
