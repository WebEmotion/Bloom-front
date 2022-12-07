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
import * as FoliosAPI from '../../api/v0/folios'
import "../../assets/scss/global.scss"

const moment = require('moment')

const ColaboradorDashboard = inject("RootStore")(observer(({ RootStore }) => {

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
    const [globalFilter, setGlobalFilter] = useState(null)
    const [folios, setFolios] = useState([])

    // Effects
    useEffect(() => {
        if (!store.token || !store.isCollaborator) navigate("/colaboradores")
        const load = async () => {
            const response = await FoliosAPI.getFolios(store.token)
            if (response.success) {
                // const folios = response.folios.sort((a, b) => {
                //     if (a.id > b.id) return -1
                //     if (b.id > a.id) return 1
                //     return 0
                // })
                setFolios(response.folios)
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
        store.token = null
        store.email = ''
        store.name = ''
        store.id = null
        store.isCollaborator = false
        navigate("/colaboradores")
    }

    const getFolioStatus = (folio) => {
        const expirationDate = moment(`${folio.expirationDate.substring(0, 10)}`)
        if (!folio.isAviable) return 'Redimido'
        if (moment().isAfter(expirationDate)) return 'Expirado'
        return 'Activo'
    }

    const redeemFolio = async (folio) => {
        setLoading({
            loading: true,
            animateIn: true
        })
        const response = await FoliosAPI.redeem(store.token, folio.id)
        if (response.success) {
            const response = await FoliosAPI.getFolios(store.token)
            if (response.success) {
                setFolios(response.folios)
            }
            toast.current.show({ severity: 'success', summary: 'Listo!', detail: 'Folio redimido correctamente' })
        } else {
            toast.current.show({ severity: 'error', summary: 'Atención!', detail: response.message })
        }
        setLoading({
            loading: false,
            animateIn: false
        })
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

    const idBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.id}
            </React.Fragment>
        )
    }
    const folioBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.folio}
            </React.Fragment>
        )
    }
    const fechaBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {moment(new Date(rowData.createdAt)).format('DD/MM/YYYY HH:mm')}
            </React.Fragment>
        )
    }
    const statusBodyTemplate = rowData => {
        const status = getFolioStatus(rowData)
        return (
            <React.Fragment>
                <div style={{color: status === 'Expirado' ? 'red' : status === 'Activo' ? 'black' : 'green'}}>
                    {status}
                </div>
            </React.Fragment>
        )
    }
    const clienteBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.clientName}
            </React.Fragment>
        )
    }
    const redimidoBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.redeemAt ? moment(new Date(rowData.redeemAt)).format('DD/MM/YYYY HH:mm') : ''}
            </React.Fragment>
        )
    }
    const accionesBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {getFolioStatus(rowData) === 'Activo' && <Button icon="pi pi-check-circle" className='p-button-rounded p-button-sm' style={{ borderRadius: 20, backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 10 }} label="Redimir" onClick={() => {
                    redeemFolio(rowData)
                }} />}
            </React.Fragment>
        )
    }

    // Layout
    return (
        <div>
            <SEO title="Dashboard | Colaboradores" />
            <Toast ref={toast} />
            <div className="p-grid" style={{ padding: 20 }}>
                <div className="p-col-12" style={{ width: '100%' }}>
                    <div className="p-grid p-justify-center">
                        <div className="p-col-12 p-md-6 p-lg-6">
                            <img style={{ width: 150, height: 100, objectFit: 'contain', alignSelf: 'center', marginLeft: "calc(50% - 75px)" }} src="https://digital-ignition.com.mx/BLOOM.png" alt="" />
                        </div>
                        <div className="p-col-12 p-md-6 p-lg-6">
                            <ProfilePicture img="" name={store.name} />
                        </div>
                    </div>
                </div>
                <div className="p-col-12">
                    <div style={{ width: '100%' }} className="p-d-flex p-flex-column p-ai-center p-jc-center">
                        <h3>Códigos promocionales</h3>
                        <DataTable
                            value={folios}
                            className="p-datatable-responsive-demo"
                            paginator
                            rows={10}
                            globalFilter={globalFilter}
                            header={header}
                            style={{ marginTop: 20 }}
                        >
                            <Column
                                sortable
                                field="id"
                                header="Id"
                                body={idBodyTemplate}
                            />
                            <Column
                                sortable
                                field="folio"
                                header="Folio"
                                body={folioBodyTemplate}
                            />
                            <Column
                                sortable
                                field="createdAt"
                                header="Fecha compra"
                                body={fechaBodyTemplate}
                            />
                            <Column
                                header="Estátus"
                                body={statusBodyTemplate}
                            />
                            <Column
                                sortable
                                field="clientName"
                                header="Cliente"
                                body={clienteBodyTemplate}
                            />
                            <Column
                                header="Fecha redimido"
                                body={redimidoBodyTemplate}
                            />
                            <Column
                                header="Acciones"
                                body={accionesBodyTemplate}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3} />
            </div>}
        </div>
    )
}))

export default ColaboradorDashboard