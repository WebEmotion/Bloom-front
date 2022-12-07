import React, { useEffect, useState, useRef } from 'react'
import SEO from '../../components/seo'
import { ProgressSpinner } from "primereact/progressspinner"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import * as SchedulesAPI from '../../api/v0/schedules'
import "../../assets/scss/global.scss"

const moment = require('moment')

const CoachDashboard = inject("RootStore")(observer(({ RootStore }) => {

    // States
    let toast = useRef(null)
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
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })
    const [week, setWeek] = useState(moment().week())
    const [schedules, setSchedules] = useState([])
    const [state, setState] = useState({
        events: [],
        days: []
    })

    // Effects
    useEffect(() => {
        if (!store.token || !store.isInstructor) navigate("/coaches")
        const load = async () => {
            const date = moment().format('YYYY-MM-DD')
            const response = await SchedulesAPI.getAllSchedulesInstructor(store.token, `${date} 00:00:00`)
            if (response.success) {
                setState({
                    events: response.data,
                    days: getWeekDays(moment().add(week - moment().week(), 'weeks').toDate())
                })
            } else {
                const message = response.message
                toast.current && toast.current.show({ severity: 'error', summary: 'Atención!', detail: message })
            }
            setLoading({
                loading: false,
                animateIn: false
            })
        }
        load()
    }, [])

    // Events
    const logout = () => {
        store.isInstructor = false
        store.token = null
        store.email = ''
        store.name = ''
        store.id = null
        store.profilePicture = ''
        navigate("/coaches")
    }
    const openMap = (schedule) => {
        navigate("/coaches/lugares", {
            state: {
                id: schedule.id,
                schedule
            }
        })
    }
    const getWeekDays = (date) => {
        let current = moment(date)
        const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        const data = []
        for (var i = 0; i < 7; i++) {
            const dayName = days[current.isoWeekday() - 1]
            const dayNumber = current.date()
            data.push({
                name: dayName,
                number: dayNumber
            })
            current = current.add(1, 'days')
        }
        return data
    }
    const getWeekDaysDate = (date) => {
        let current = moment(date)
        const data = []
        for (var i = 0; i < 7; i++) {
            data.push(current.toDate())
            current = current.add(1, 'days')
        }
        return data
    }
    const getCurrentMonth = (date) => {
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return months[date.getMonth()]
    }

    // Templates
    const ProfilePicture = ({ img, name }) => {
        if (img) return (
            <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ width: '100%' }}>
                <img src={img} style={{ backgroundColor: '#aaa', borderRadius: '100%', height: 80, width: 80, objectFit: 'cover' }} />
                <p style={{ margin: 0 }}>{name}</p>
                <a onClick={logout} style={{ cursor: 'pointer', color: '#d78676' }}>Cerrar sesión</a>
            </div>
        )
        return (
            <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ width: '100%' }}>
                <img src="https://img.icons8.com/material-rounded/200/ffffff/user-male-circle.png" style={{ backgroundColor: '#d78676', borderRadius: '100%', height: 80, width: 80, objectFit: 'cover' }} />
                <p style={{ margin: 0 }}>{name}</p>
                <a onClick={logout} style={{ cursor: 'pointer', color: '#d78676' }}>Cerrar sesión</a>
            </div>
        )
    }
    const EventItemEmpty = () => {
        return (
            <div style={{ backgroundColor: '#AAA', width: '100%' }}>
                <div className="eventItemEmpty">
                </div>
            </div>
        )
    }
    const EventItem = ({ item, hour, instructor, onPress, disabled, isReserved, onAlreadyBooked, onSeeMap }) => {
        return (
            <div style={{ marginBottom: 0 }}>
                <div className={`eventItem2 ${isReserved ? 'reserved' : ''}`} style={{ backgroundColor: disabled ? '#00000020' : isReserved ? '#b2493410' : '#eecbc4', cursor: disabled ? 'not-allowed' : 'pointer' }} onClick={() => {
                    onPress()
                }}>
                    <p style={{ color: disabled ? '#00000050' : '#b24934', margin: 2 }}>{hour}</p>
                    <p style={{ color: disabled ? '#00000030' : '#b24934', margin: 2 }}>{item.Rooms.name}</p>
                </div>
            </div>
        )
    }
    const loadEventItems = () => {
        let rows = [[], [], [], [], [], [], []]
        const days = getWeekDaysDate(new Date())
        for (var i in days) {
            const day = days[i]
            for (var j in state.events) {
                const event = state.events[j]
                if (event.date.substring(0, 10) === moment(day).format('YYYY-MM-DD')) {
                    rows[i].push(event)
                }
            }
        }
        for (var i in rows) {
            const row = rows[i]
            rows[i] = row.sort((a, b) => {
                if (a.start > b.start) return -1
                if (a.start < b.start) return 1
                return 0
            })
        }
        let schedules = []
        let hours = []
        for (let i = 0; i < 24; i++) {
            const items = [[], [], [], [], [], [], []]
            const h = "" + i
            const hour = `${h.padStart(2, '0')}:00:00`
            for (let j = 0; j < 7; j++) {
                const day = rows[j]
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
        let c = 0
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
                c = c + 1
                schedules.push(
                    <tr style={{ backgroundColor: c % 2 === 0 ? '#F0F0F0' : '#FAFAFA' }} key={i}>
                        <td>
                            {hour[0][0] ? <EventItem isFull={hour[0][0].Booking.length === 25} item={hour[0][0]} hour={hour[0][0].start} instructor={hour[0][0].Instructor.name} onPress={() => { openMap(hour[0][0]) }}  /> : <EventItemEmpty />}
                        </td>
                        <td>
                            {hour[1][0] ? <EventItem isFull={hour[1][0].Booking.length === 25} item={hour[1][0]} hour={hour[1][0].start} instructor={hour[1][0].Instructor.name} onPress={() => { openMap(hour[1][0]) }} /> : <EventItemEmpty />}
                        </td>
                        <td>
                            {hour[2][0] ? <EventItem isFull={hour[2][0].Booking.length === 25} item={hour[2][0]} hour={hour[2][0].start} instructor={hour[2][0].Instructor.name} onPress={() => { openMap(hour[2][0]) }} /> : <EventItemEmpty />}
                        </td>
                        <td>
                            {hour[3][0] ? <EventItem isFull={hour[3][0].Booking.length === 25} item={hour[3][0]} hour={hour[3][0].start} instructor={hour[3][0].Instructor.name} onPress={() => { openMap(hour[3][0]) }} /> : <EventItemEmpty />}
                        </td>
                        <td>
                            {hour[4][0] ? <EventItem isFull={hour[4][0].Booking.length === 25} item={hour[4][0]} hour={hour[4][0].start} instructor={hour[4][0].Instructor.name} onPress={() => { openMap(hour[4][0]) }} /> : <EventItemEmpty />}
                        </td>
                        <td>
                            {hour[5][0] ? <EventItem isFull={hour[5][0].Booking.length === 25} item={hour[5][0]} hour={hour[5][0].start} instructor={hour[5][0].Instructor.name} onPress={() => { openMap(hour[5][0]) }} /> : <EventItemEmpty />}
                        </td>
                        <td>
                            {hour[6][0] ? <EventItem isFull={hour[6][0].Booking.length === 25} item={hour[6][0]} hour={hour[6][0].start} instructor={hour[6][0].Instructor.name} onPress={() => { openMap(hour[6][0]) }} /> : <EventItemEmpty />}
                        </td>
                    </tr>
                )
            }
        }
        return schedules
    }

    // Layout
    return (
        <div>
            <SEO title="Dashboard | Instructores" />
            <Toast ref={toast} />
            <div className="p-grid" style={{ padding: 20 }}>
                <div className="p-col-12" style={{ width: '100%' }}>
                    <div className="p-grid p-justify-center">
                        <div className="p-col-12 p-md-6 p-lg-6">
                            <img style={{ width: 150, height: 100, objectFit: 'contain', alignSelf: 'center', marginLeft: "calc(50% - 75px)" }} src="https://digital-ignition.com.mx/BLOOM.png" alt="" />
                        </div>
                        <div className="p-col-12 p-md-6 p-lg-6">
                            <ProfilePicture img={store.pictureUrl} name={store.name} />
                        </div>
                    </div>
                </div>
            </div>
            {state.days.length > 0 && <div style={{ overflow: 'scroll', marginLeft: '10%', marginRight: '10%', backgroundColor: '#FAFAFA', borderRadius: 20, padding: 20 }}>
            <h2 style={{ marginBottom: 10, marginLeft: 10, textAlign: 'center', width: '100%' }}>{getCurrentMonth(new Date())}</h2>
                <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 100, marginTop: 20, tableLayout: 'fixed', minWidth: 800 }}>
                    <thead>
                        <tr>
                            <th style={{ color: '#d78676' }}>
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
                        </tr>
                    </thead>
                    <tbody>
                        {loadEventItems()}
                    </tbody>
                </table>
            </div>}
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3} />
            </div>}
        </div>
    )
}))

export default CoachDashboard