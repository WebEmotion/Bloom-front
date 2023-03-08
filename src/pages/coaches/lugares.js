import React, { useEffect, useState, useRef } from 'react'
import SEO from '../../components/seo'
import { ProgressSpinner } from "primereact/progressspinner"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { Planet } from "react-planet"
import Img from "gatsby-image"
import { Toast } from "primereact/toast"
import "../../assets/scss/global.scss"
import Logo from "../../assets/images/cicle_white.png"
import * as SchedulesAPI from '../../api/v0/schedules'

const moment = require('moment')

const CoachesLugares = inject("RootStore")(observer(({ RootStore }) => {

    // States
    let toast = useRef(null)
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
    const [globalFilter, setGlobalFilter] = useState(null)
    const [state, setState] = useState([])
    const [showMap, setShowMap] = useState(false)
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })

    // Effects
    useEffect(() => {
        if (!store.token || !store.isInstructor) navigate("/coaches")
        const load = async (id) => {
            const response = await SchedulesAPI.schedule(id)
            if (response.success) {
                setState(response.data.Booking)
            } else {
                toast.current.show({ severity: 'error', summary: 'Atención!', detail: response.message })
            }
            setLoading({
                loading: false,
                animateIn: false
            })
        }
        const id = window.history.state?.id
        console.log(window.history.state)
        if (id) load(id)
        else navigate('/coaches/dashboard')
    }, [])

    // Events
    const logout = () => {
        store.token = null
        store.email = ''
        store.name = ''
        store.id = null
        store.isInstructor = false
        navigate("/coaches")
    }
    const getUser = (id) => {
        for (var i in state) {
            const booking = state[i]
            console.log(booking)
            if (booking.Seat.id === id) {
                return booking.User
            }
        }
        return null
    }

    // Templates
    const UserCircle = ({ image, name, lastname, seat }) => {
        if (name && image) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ margin: 0 }}>{seat}</p>
                    <img src={image} style={{ backgroundColor: '#00000055', width: 50, height: 50, borderRadius: '100%', objectFit: 'cover' }} />
                    <p style={{ margin: 0, height: 20, whiteSpace: 'nowrap', maxWidth: 100, textOverflow: 'ellipsis', overflow: 'hidden' }}>{name}</p>
                </div>
            )
        } else if (name !== '') {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ margin: 0 }}>{seat}</p>
                    <img src='https://img.icons8.com/material-rounded/200/ffffff/user-male-circle.png' style={{ backgroundColor: '#3eb978', width: 50, height: 50, borderRadius: '100%' }} />
                    <p style={{ margin: 0, height: 20, whiteSpace: 'nowrap', maxWidth: 100, textOverflow: 'ellipsis', overflow: 'hidden' }}>{name}</p>
                </div>
            )
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ margin: 0 }}>{seat}</p>
                <img src='https://www.wheelybikerental.com/newsite/wp-content/uploads/2017/01/bici-icon-white-400x400.png' style={{ backgroundColor: '#3eb978', width: 50, height: 50, borderRadius: '100%', padding: 5 }} />
                <p style={{ margin: 0 }}> </p>
            </div>
        )
    }
    const ProfilePicture = ({ img, name }) => {
        if (img) return (
            <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ width: '100%' }}>
                <img src={img} style={{ backgroundColor: '#aaa', borderRadius: '100%', height: 80, width: 80, objectFit: 'cover' }} />
                <p style={{ margin: 0 }}>{name}</p>
                <a onClick={logout} style={{ cursor: 'pointer', color: '#3eb978' }}>Cerrar sesión</a>
            </div>
        )
        return (
            <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ width: '100%' }}>
                <img src="https://img.icons8.com/material-rounded/200/ffffff/user-male-circle.png" style={{ backgroundColor: '#3eb978', borderRadius: '100%', height: 80, width: 80, objectFit: 'cover' }} />
                <p style={{ margin: 0 }}>{name}</p>
                <a onClick={logout} style={{ cursor: 'pointer', color: '#3eb978' }}>Cerrar sesión</a>
            </div>
        )
    }

    const header = (
        <div className="table-header p-grid p-justify-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={e => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                />
            </span>
        </div>
    )

    const nameBodyTemplate = rowData => {
        return (
            <React.Fragment className="p-column-title">
                {rowData.User.name}
            </React.Fragment>
        )
    }
    const lastnameBodyTemplate = rowData => {
        return (
            <React.Fragment className="p-column-title">
                {rowData.User.lastname}
            </React.Fragment>
        )
    }
    const statusEndTemplate = rowData => {
        return (
            <React.Fragment className="p-column-title">
                {rowData.isPass ? 'Pase' : 'Clase'}
            </React.Fragment>
        )
    }
    const statusBodyTemplate = rowData => {
        return (
            <React.Fragment className="p-column-title">
                {rowData.Seat.number}
            </React.Fragment>
        )
    }


    // Layout
    return (
        <div>
            <SEO title="Lugares | Coaches" />
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
                <div className="p-col-12">
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-pink" label="Regresar" onClick={() => navigate('/coaches/dashboard')} />
                </div>
                <div className="p-col-12">
                    <div style={{ width: '100%' }} className="p-d-flex p-flex-column p-ai-center p-jc-center datatable-responsive-demo" >
                        <h3>Lugares reservados</h3>
                        <div className="p-col-12">
                            <p style={{ fontWeight: 'normal' }}>Total reservados: <span style={{ fontWeight: 'bold', marginRight: 20 }}>{state.length}</span> Fecha: <span style={{ fontWeight: 'bold', marginRight: 20 }}>{window.history.state?.schedule.date.substring(0, 10)}</span> Hora de inicio: <span style={{ fontWeight: 'bold', marginRight: 20 }}>{window.history.state?.schedule.start.substring(0, 5)}</span></p>
                        </div>
                        <div className="p-col-12">
                            <Button label="Tabla" icon="pi pi-table" style={{ backgroundColor: '#F0F0F0', borderRadius: 50, border: 'none', marginRight: 20, color: 'black' }} onClick={() => setShowMap(false)} />
                            <Button label="Mapa" icon="pi pi-th-large" style={{ backgroundColor: '#F0F0F0', borderRadius: 50, border: 'none', marginRight: 20, color: 'black' }} onClick={() => setShowMap(true)} />
                        </div>
                        {!showMap && <DataTable
                            value={state}
                            className="p-datatable-responsive-demo"
                            paginator
                            rows={10}
                            globalFilter={globalFilter}
                            header={header}
                            style={{ marginTop: 20 }}
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
                            {/* <Column
                                sortable
                                field="date"
                                header="Fecha"
                                body={createdAtBodyTemplate}
                            />
                            <Column
                                sortable
                                field="start"
                                header="Inicia"
                                body={statusStartTemplate}
                            /> */}
                            <Column
                                sortable
                                field="end"
                                header="Tipo"
                                body={statusEndTemplate}
                            />
                            <Column
                                sortable
                                field="seat"
                                header="Lugar"
                                body={statusBodyTemplate}
                            />
                        </DataTable>}
                        {showMap &&
                            <div style={{ marginTop: 500 }}>
                                <Planet
                                    centerContent={
                                        <div
                                            style={{
                                                height: 50,
                                                width: 100,
                                                backgroundColor: "#3eb978",
                                                display: "none",
                                            }}
                                        />
                                    }
                                    open
                                    autoClose={false}
                                    orbitRadius={480}
                                    rotation={86}
                                    orbitStyle={() => ({
                                        border: "none",
                                        zIndex: 0,
                                        position: "absolute",
                                        borderRadius: "100%",
                                    })}
                                >
                                    <h1 className="fila">C</h1>
                                    {
                                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => {
                                            const user = getUser(n)
                                            return <UserCircle seat={`C${n}`} image={user ? user.pictureUrl : ''} name={user ? user.name : ''} />
                                        })
                                    }
                                    <h1 className="fila">C</h1>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </Planet>
                                <Planet
                                    centerContent={
                                        <div
                                            style={{
                                                height: 50,
                                                width: 100,
                                                backgroundColor: "#3eb978",
                                                display: "none",
                                            }}
                                        />
                                    }
                                    open
                                    autoClose={false}
                                    orbitRadius={370}
                                    rotation={85}
                                    orbitStyle={() => ({
                                        border: "none",
                                        zIndex: 0,
                                        position: "absolute",
                                        borderRadius: "100%",
                                    })}
                                >
                                    <h1 className="fila">B</h1>
                                    {
                                        [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                            const user = getUser(n + 10)
                                            return <UserCircle seat={`B${n}`} image={user ? user.pictureUrl : ''} name={user ? user.name : ''} />
                                        })
                                    }
                                    <h1 className="fila">B</h1>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </Planet>
                                <Planet
                                    centerContent={
                                        <div
                                            style={{
                                                width: 130,
                                                height: 130,
                                                borderRadius: '100%',
                                                backgroundColor: "#3eb978",
                                                position: "absolute",
                                                transform: "translateX(-80px)",
                                                display: "flex",
                                                alignItems: "center",
                                                color: "#fff",
                                                textAlign: "center",
                                                justifyContent: "center",
                                                marginTop: "-80px",
                                                marginLeft: 20
                                            }}
                                        >
                                            <div className="p-grid p-align-center p-justify-center">
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
                                    }
                                    open
                                    autoClose={false}
                                    orbitRadius={250}
                                    rotation={85}
                                    orbitStyle={() => ({
                                        border: "none",
                                        zIndex: 0,
                                        position: "absolute",
                                        borderRadius: "100%",
                                    })}
                                >
                                    <h1 className="fila">A</h1>
                                    {
                                        [1, 2, 3, 4, 5, 6, 7].map(n => {
                                            const user = getUser(n + 18)
                                            return <UserCircle seat={`A${n}`} image={user ? user.pictureUrl : ''} name={user ? user.name : ''} />
                                        })
                                    }
                                    <h1 className="fila">A</h1>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </Planet>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3} />
            </div>}
        </div>
    )
}))

export default CoachesLugares