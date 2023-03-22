import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import DatePicker from 'react-datepicker'
import { Checkbox } from "primereact/checkbox"
import { setMinutes, setHours, getHours, addMinutes, setSeconds, format } from 'date-fns'

import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as InstructorsAPI from '../../api/v0/instructors'
import * as SchedulesAPI from '../../api/v0/schedules'
import * as LocationsAPI from '../../api/v0/locations'

const getEndTimes = (date) => {
    let startHour = getHours(date)
    let times = []
    let startTime = date
    for (var i = startHour; i <= 24; i++) {
        startTime = addMinutes(startTime, 45)
        times.push(startTime)
    }
    return times
}

const optionTemplate = option => {
    return (
        <div className="country-item">
            <div>
                {option.name} {option.lastname}
            </div>
        </div>
    )
}

const optionTemplate2 = option => {
    return (
        <div className="country-item">
            <div>
                {option.name}
            </div>
        </div>
    )
}

const NuevaClase = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    let toast = useRef(null)

    const [state, setState] = useState({
        date: new Date(),
        start: setHours(setMinutes(setSeconds(new Date(), 0), 0), 15),
        end: setHours(setMinutes(setSeconds(new Date(), 0), 45), 15),
        instructor: null,
        theme: "",
        room: null,
        isPrivate: false
    })
    const [instructors, setInstructors] = useState([])
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        const loadInstructors = async () => {
            const response = await InstructorsAPI.getAllInstructors()
            if (response.success) {
                setInstructors(response.data)
            }
            const rooms = await LocationsAPI.rooms()
            if (rooms.success) {
                setRooms(rooms.data)
            }
        }
        loadInstructors()
    }, [])

    const saveSchedule = async () => {
        if (!state.instructor) {
            toast && toast.show({
                severity: "warn",
                summary: "Advertencia",
                detail: "No has seleccionado ningún instructor",
            })
        } else {
            const cDate = format(state.date, 'yyyy-MM-dd')
            let response = await SchedulesAPI.createSchedule(store.token, cDate + ' 00:00:00', cDate + ' ' + format(state.start, 'HH:mm:ss'), cDate + ' ' + format(state.end, 'HH:mm:ss'), state.instructor.id, state.room.id, state.theme, state.isPrivate)
            if (response.success) {
                toast && toast.show({
                    severity: "success",
                    summary: "Listo",
                    detail: "La clase ha sido creada con éxito",
                })
                navigate('/frontdesk/lugares')
            } else {
                toast && toast.show({
                    severity: "success",
                    summary: "Listo",
                    detail: "La clase ha sido creada con éxito",
                })
                navigate('/frontdesk/lugares')
            }
        }
    }

    const changeTheme = (e) => {
        setState({
            ...state,
            theme: e.target.value
        })
        // console.log(e.target.value)
    }

    return (
        <Layout page="lugares">
            <Toast ref={(el) => toast = el} />
            <SEO title="Lugares" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Nueva Clase
                  </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <div className='p-d-flex p-jc-start p-ai-center' style={{ marginTop: 50 }}>
                <div className="p-mr-2" style={{ width: 150, textAlign: 'right' }}>Fecha:</div>
                <div className="p-mr-2">
                    <DatePicker selected={state.date} minDate={new Date()} onChange={date => {
                        setState({
                            ...state,
                            date: date
                        })
                    }} customInput={<InputText />} />
                </div>
            </div>
            <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                <div className="p-mr-2" style={{ width: 150, textAlign: 'right' }}>Hora de inicio:</div>
                <div className="p-mr-2">
                    <DatePicker selected={state.start} onChange={date => {
                        setState({
                            ...state,
                            start: date,
                            end: addMinutes(date, 45)
                        })
                    }} customInput={<InputText />} dateFormat="h:mm aa" showTimeSelect showTimeSelectOnly timeIntervals={5} timeCaption="Inicio:" />
                </div>
                <div className="p-mr-2">Hora de fin:</div>
                <div className="p-mr-2">
                    <DatePicker selected={state.end} onChange={date => {
                        setState({
                            ...state,
                            end: date
                        })
                    }} customInput={<InputText />} dateFormat="h:mm aa" showTimeSelect showTimeSelectOnly timeIntervals={5} timeCaption="Fin:" includeTimes={getEndTimes(state.start)} />
                </div>
            </div>
            <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                <div className="p-mr-2" style={{ width: 150, textAlign: 'right' }}>Instructor:</div>
                <div className="p-mr-2">
                    <Dropdown
                        value={state.instructor}
                        options={instructors}
                        onChange={e => setState({
                            ...state,
                            instructor: e.value
                        })}
                        optionLabel="name"
                        filter
                        filterBy="name,lastname"
                        placeholder="Seleccione un instructor..."
                        itemTemplate={optionTemplate}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                <div className="p-mr-2" style={{ width: 150, textAlign: 'right' }}>Tema:</div>
                <div className="p-mr-2">
                    <InputText value={state.theme} onChange={changeTheme.bind(this)} />
                </div>
                <div className="p-mr-2">Tipo:</div>
                <div className="p-mr-2">
                    <Dropdown
                        value={state.room}
                        options={rooms}
                        onChange={e => setState({
                            ...state,
                            room: e.value
                        })}
                        optionLabel="name"
                        filter
                        filterBy="name"
                        placeholder="Seleccione un tipo..."
                        itemTemplate={optionTemplate2}
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
            <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                <div className="p-mr-2" style={{ width: 150, textAlign: 'right' }}>¿Es privada?</div>
                <div className="p-mr-2">
                    <Checkbox name="isPrivate" onChange={e => setState({ ...state, isPrivate: e.checked })} inputId="ip1" checked={state.isPrivate}></Checkbox>
                </div>
            </div>
            {state.isPrivate && <div className="p-d-flex p-jc-start p-ai-center p-mt-2">
                <div className="p-mr-2" style={{paddingLeft: 50, paddingRight: 50}}>
                    <p>Las clases privadas no aparecen listadas en las pantallas del cliente, por lo que solo podrán ser reservadas a través de un administrador.</p>
                </div>
            </div>}
            <div className='p-d-flex p-jc-center p-ai-center p-mt-2' style={{ marginBottom: 50 }}>
                <div className="p-mr-2 p-mt-3">
                    <Button className="p-button-rounded p-button-pink" label='Programar' onClick={saveSchedule} />
                </div>
            </div>
        </Layout>
    )
}))

export default NuevaClase