import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import { Dialog } from 'primereact/dialog';
import DatePicker from 'react-datepicker'
import { Checkbox } from 'primereact/checkbox';
import * as moment from 'moment'
import { setMinutes, setHours, getHours, addMinutes, setSeconds, format } from 'date-fns'

import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as InstructorsAPI from '../../api/v0/instructors'
import * as SchedulesAPI from '../../api/v0/schedules'
import * as LocationsAPI from '../../api/v0/locations'
import { FaClosedCaptioning } from "react-icons/fa"

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

const EditarClase = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    let toast = useRef(null)

    const [state, setState] = useState({
        date: window.history.state?.schedule ? moment(`${window.history.state?.schedule.date.substring(0, 10)}`).toDate() : new Date(),
        start: setHours(setMinutes(setSeconds(new Date(), 0), parseInt(window.history.state?.schedule.start.substring(3, 5))), parseInt(window.history.state?.schedule.start.substring(0, 2))),
        end: setHours(setMinutes(setSeconds(new Date(), 0), parseInt(window.history.state?.schedule.end.substring(3, 5))), parseInt(window.history.state?.schedule.end.substring(0, 2))),
        instructor: null,
        current: window.history.state?.schedule,
        displayCancel: false,
        displayUpdate: false,
        room: window.history.state?.schedule.Rooms,
        theme: window.history.state?.schedule.theme,
        isPrivate: window.history.state?.schedule.isPrivate
    })

    const [instructors, setInstructors] = useState([])
    const [rooms, setRooms] = useState([])
    const [freeSeats, setFreeSeats] = useState(false)

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

            var inst = {
                id: window.history.state?.schedule.Instructor.id,
                name: window.history.state?.schedule.Instructor.name,
                lastname: window.history.state?.schedule.Instructor.lastname,
                description: window.history.state?.schedule.Instructor.description,
                isVisible: window.history.state?.schedule.Instructor.isVisible
            }
            setState({
                ...state,
                instructor: inst
            })
        }
        if (!state.current) {
            navigate('/frontdesk/lugares')
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
            let response = await SchedulesAPI.createSchedule(store.token, cDate + ' 00:00:00', cDate + ' ' + format(state.start, 'HH:mm:ss'), cDate + ' ' + format(state.end, 'HH:mm:ss'), state.instructor.id)
            if (response.success) {
                toast && toast.show({
                    severity: "success",
                    summary: "Listo",
                    detail: "La clase ha sido creada con éxito",
                })
                navigate('/frontdesk/lugares')
            } else {
                toast && toast.show({
                    severity: "error",
                    summary: "Error",
                    detail: "No se pudo crear la clase",
                })
            }
        }
    }

    const deleteSchedule = async () => {
        const response = await SchedulesAPI.removeSchedule(state.current.id, store.token)
        if (response.success) {
            toast && toast.show({
                severity: "success",
                summary: "Listo",
                detail: "La clase ha sido eliminada",
            })
            navigate('/frontdesk/lugares')
        } else {
            toast && toast.show({
                severity: "error",
                summary: "Error",
                detail: "No se pudo eliminar la clase",
            })
        }
    }

    const checkUpdatable = () => {
        if (state.current) {
            const cDate = format(state.date, 'yyyy-MM-dd')
            let nDate = null
            let nStart = null
            let nEnd = null
            let nInstructor = null
            if (state.date.toISOString() != new Date(window.history.state?.schedule.date).toISOString()) {
                nDate = cDate + ' 00:00:00'
            }
            if (format(state.start, 'HH:mm:ss') != state.current.start) {
                nStart = cDate + ' ' + format(state.start, 'HH:mm:ss')
            }
            if (format(state.end, 'HH:mm:ss') != state.current.end) {
                nEnd = cDate + ' ' + format(state.end, 'HH:mm:ss')
            }
            if (state.instructor) {
                nInstructor = state.instructor.id
            }
            return (nDate || nStart || nEnd || nInstructor || state.theme || state.room)
        } else {
            return false
        }
    }

    const updateSchedule = async (sendEmail) => {
        const cDate = format(state.date, 'yyyy-MM-dd')
        let nDate = null
        let nStart = null
        let nEnd = null
        let nInstructor = null
        if (state.date.toISOString() != new Date(window.history.state?.schedule.date).toISOString()) {
            nDate = cDate + ' 00:00:00'
        }
        if (format(state.start, 'HH:mm:ss') != state.current.start) {
            nStart = cDate + ' ' + format(state.start, 'HH:mm:ss')
        }
        if (format(state.end, 'HH:mm:ss') != state.current.end) {
            nEnd = cDate + ' ' + format(state.end, 'HH:mm:ss')
        }
        if (state.instructor) {
            nInstructor = state.instructor.id
        }
        if (nDate || nStart || nEnd || nInstructor) {
            const response = await SchedulesAPI.updateSchedule(store.token, state.current.id, nDate, nStart, nEnd, nInstructor, state.theme, state.room.id, sendEmail, freeSeats, state.isPrivate)
            if (response.success) {
                toast && toast.show({
                    severity: "success",
                    summary: "Listo",
                    detail: "La clase ha sido actualizada",
                })
                navigate('/frontdesk/lugares')
            } else {
                toast && toast.show({
                    severity: "error",
                    summary: "Error",
                    detail: "No se pudo actualizar la clase",
                })
            }
        } else {
            toast && toast.show({
                severity: "warn",
                summary: "Atención",
                detail: "No hay nada qué actualizar",
            })
        }
        setState({
            ...state,
            displayUpdate: false
        })
    }

    const updateTheme = (e) => {
        setState({
            ...state,
            theme: e.target.value
        })
        // console.log(e.target.value)
    }

    const renderFooter = () => {
        return (
            <div>
                <Button disabled={false} style={{ color: '#333', fontWeight: 'bold' }} label="Cancelar" className="p-button-text" onClick={() => { setState({ ...state, displayCancel: false }) }} />
                <Button disabled={false} style={{ color: '#3eb978', fontWeight: 'bold' }} label="Continuar" className="p-button-text" onClick={deleteSchedule} />
            </div>
        );
    }

    const renderFooter2 = () => {
        return (
            <div>
                <Button disabled={false} style={{ color: '#333', fontWeight: 'bold' }} label="Cancelar" className="p-button-text" onClick={() => { setState({ ...state, displayUpdate: false }) }} />
                <Button disabled={false} style={{ color: '#333', fontWeight: 'bold' }} label="Actualizar" className="p-button-text" onClick={() => {
                    updateSchedule(false)
                }} />
                <Button disabled={false} style={{ color: '#3eb978', fontWeight: 'bold' }} label="Actualizar y enviar correo" className="p-button-text" onClick={() => {
                    updateSchedule(true)
                }} />
            </div>
        );
    }

    return (
        <Layout page="lugares">
            <Dialog header="Confirmar cancelación" visible={state.displayCancel} modal style={{ width: '400px' }} footer={renderFooter()} onHide={() => { setState({ ...state, displayCancel: false }) }}>
                <div className="confirmation-content">
                    <span>¿Estas seguro que deseas cancelar la clase? <b>Los lugares serán desocupados en su totalidad</b> y un correo de notificación le será enviado a los usuarios que hayan reservado.</span>
                </div>
            </Dialog>
            <Dialog header="Confirmar actualización" visible={state.displayUpdate} modal style={{ width: '400px' }} footer={renderFooter2()} onHide={() => { setState({ ...state, displayUpdate: false }) }}>
                <div className="confirmation-content">
                    <span>¿Estas seguro que deseas actualizar la clase? Si lo deseas, puedes eliminar las reservaciones generadas hasta ahora. Además, un correo de notificación le será enviado a los usuarios que hayan reservado.</span>
                    <div className="p-field-checkbox" style={{ marginTop: 20 }}>
                        <Checkbox inputId="binary" checked={freeSeats} onChange={e => setFreeSeats(e.checked)} />
                        <label htmlFor="binary">Liberar reservaciones</label>
                    </div>
                </div>
            </Dialog>
            <Toast ref={(el) => toast = el} />
            <SEO title="Lugares" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Modificar Clase
                  </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <div className="p-grid p-align-end">
                <div className="p-col-12 p-md-6">
                    <div className="p-d-flex p-jc-center p-ai-center" style={{ marginTop: 50 }}>
                        <h3>Programación original</h3>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center'>
                        <div className="p-mr-2 p-ml-6">Fecha:</div>
                        {/* new Date(state.current.date).toISOString().substring(0, 10) */}
                        <div className="p-mr-2" style={{ fontWeight: 'bold' }}>{state.current && state.current.date.substring(0, 10)}</div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center'>
                        <div className="p-mr-2 p-ml-6">Hora inicio:</div>
                        <div className="p-mr-2" style={{ fontWeight: 'bold' }}>{state.current && state.current.start}</div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center'>
                        <div className="p-mr-2 p-ml-6">Hora fin:</div>
                        <div className="p-mr-2" style={{ fontWeight: 'bold' }}>{state.current && state.current.end}</div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center'>
                        <div className="p-mr-2 p-ml-6">Instructor:</div>
                        <div className="p-mr-2" style={{ fontWeight: 'bold' }}>{state.current && state.current.Instructor.name} {state.current && state.current.Instructor.lastname}</div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center'>
                        <div className="p-mr-2 p-ml-6">¿Es privada?:</div>
                        <div className="p-mr-2" style={{ fontWeight: 'bold' }}>{state.current && state.current.isPrivate ? 'Si' : 'No'}</div>
                    </div>
                    <div className='p-d-flex p-jc-center p-ai-center' style={{ marginTop: 30 }}>
                        <div className="p-mr-2">Lugares reservados:</div>
                        <div className="p-mr-2">{state.current && state.current.available}</div>
                        <a style={{ color: '#3eb978', cursor: 'pointer', marginLeft: 20 }} onClick={() => {
                            navigate("/frontdesk/asientos", {
                                state: {
                                    id: state.current.id,
                                    schedule: state.current
                                }
                            })
                        }}>Ver lugares</a>
                    </div>
                    <div className='p-d-flex p-jc-center p-ai-center p-mt-2' style={{ marginBottom: 50 }}>
                        <div className="p-mr-2 p-mt-3">
                            <Button className="p-button-rounded p-button-pink" label='Cancelar clase' onClick={() => { setState({ ...state, displayCancel: true }) }} />
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-6">
                    <div className="p-d-flex p-jc-center p-ai-center" style={{ marginTop: 50, marginBottom: 0 }}>
                        <h3>Programación nueva</h3>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center'>
                        <div className="p-mr-2" style={{ width: 100, textAlign: 'right' }}>Fecha:</div>
                        <div className="p-mr-2">
                            <DatePicker selected={state.date} minDate={new Date()} onChange={date => {
                                setState({
                                    ...state,
                                    date: date
                                })
                            }} customInput={<InputText style={{ width: 250, fontWeight: 'bold' }} />} />
                        </div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                        <div className="p-mr-2" style={{ width: 100, textAlign: 'right' }}>Hora inicio:</div>
                        <div className="p-mr-2">
                            <DatePicker selected={state.start} onChange={date => {
                                setState({
                                    ...state,
                                    start: date,
                                    end: addMinutes(date, 45)
                                })
                            }} customInput={<InputText style={{ width: 250, fontWeight: 'bold' }} />} dateFormat="HH:mm" timeFormat="HH:mm" showTimeSelect showTimeSelectOnly timeIntervals={5} timeCaption="Inicio:" />
                        </div>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mt-2">
                        <div className="p-mr-2" style={{ width: 100, textAlign: 'right' }}>Hora fin:</div>
                        <div className="p-mr-2">
                            <DatePicker selected={state.end} onChange={date => {
                                setState({
                                    ...state,
                                    end: date
                                })
                            }} customInput={<InputText style={{ width: 250, fontWeight: 'bold' }} />} dateFormat="HH:mm" timeFormat="HH:mm" showTimeSelect showTimeSelectOnly timeIntervals={5} timeCaption="Fin:" includeTimes={getEndTimes(state.start)} />
                        </div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                        <div className="p-mr-2" style={{ width: 100, textAlign: 'right' }}>Instructor:</div>
                        <div className="p-mr-2">
                            <Dropdown
                                value={state.instructor}
                                options={instructors}
                                onChange={e =>{ setState({
                                    ...state,
                                    instructor: e.value
                                })
                                console.log(e.value)    
                            }}
                                optionLabel="name"
                                filter
                                filterBy="name,lastname"
                                placeholder="Seleccione un instructor..."
                                itemTemplate={optionTemplate}
                                style={{ width: 250, fontWeight: 'bold' }}
                            />
                        </div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                        <div className="p-mr-2" style={{ width: 100, textAlign: 'right' }}>Tipo:</div>
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
                                filterBy="name,lastname"
                                placeholder="Seleccione un tipo..."
                                itemTemplate={optionTemplate}
                                style={{ width: 250, fontWeight: 'bold' }}
                            />
                        </div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                        <div className="p-mr-2" style={{ width: 100, textAlign: 'right' }}>Tema:</div>
                        <div className="p-mr-2">
                            <InputText value={state.theme} onChange={updateTheme.bind(this)} />
                        </div>
                    </div>
                    <div className='p-d-flex p-jc-start p-ai-center p-mt-2'>
                        <div className="p-mr-2" style={{ width: 150, textAlign: 'right' }}>¿Es privada?</div>
                        <div className="p-mr-2">
                            <Checkbox name="isPrivate" onChange={e => setState({ ...state, isPrivate: e.checked })} inputId="ip1" checked={state.isPrivate}></Checkbox>
                        </div>
                    </div>
                    <div className='p-d-flex p-jc-center p-ai-center p-mt-2' style={{ marginBottom: 50 }}>
                        <div className="p-mr-2 p-mt-3">
                            <Button disabled={!checkUpdatable()} className="p-button-rounded p-button-pink" label='Actualizar' onClick={() => {
                                setState({ ...state, displayUpdate: true })
                            }} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}))

export default EditarClase