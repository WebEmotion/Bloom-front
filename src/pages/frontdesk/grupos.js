import React, { useRef, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import Layout from '../../components/layout'
import SEO from '../../components/seo'
import { Toast } from 'primereact/toast'
import ItemProfile from '../../components/item-profile'
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Checkbox } from "primereact/checkbox"
import { InputText } from "primereact/inputtext"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { navigate } from 'gatsby'

import * as ClientsAPI from '../../api/v0/clients'

const Paquetes = inject("RootStore")(observer(({ RootStore }) => {

    const store = RootStore.UserStore
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })
    //const [bundles, setBundles] = useState([])
    const [groups, setGroups] = useState([])

    let toast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
        toast && toast.current && toast.current.show({
            severity: severityValue,
            summary: summaryValue,
            detail: detailValue,
        })
    }

    const reload = async () => {
        const response = await ClientsAPI.getGroups(store.token)
        if (response.success) {
            setGroups(response.members.reverse())
        }
        setLoading({
            loading: false,
            animateIn: false
        })
    }

    useEffect(() => {
        const load = async () => {
            const response = await ClientsAPI.getGroups(store.token)
            if (response.success) {
                setGroups(response.members.reverse())
            }
            setLoading({
                loading: false,
                animateIn: false
            })
        }
        load()
    }, [])

    const groupNameBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Nombre Grupo</span>
                {rowData.groupName}
            </React.Fragment>
        )
    }

    const nameLiderBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Usuario Principal</span>
                {rowData.name}
            </React.Fragment>
        )
    }

    const statusBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Estatus</span>
                {rowData.status ? 'Activo' : 'Inactivo'}
            </React.Fragment>
        )
    }

    const classesBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Clases Disponibles</span>
                {rowData.pendingClasses}
            </React.Fragment>
        )
    }

    const actionsBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} onClick={(e) => {
                    navigate('/frontdesk/editar-grupo', {
                        state: {
                            group: rowData
                        }
                    })
                }} />
            </React.Fragment>
        )
    }

    const [globalFilter, setGlobalFilter] = useState(null)
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

            {/* <Button
                label="Nuevo"
                icon="pi pi-users"
                className="p-button menu-button"
                style={{ width: "auto" }}
                onClick={() => {
                    navigate('/frontdesk/nuevo-paquete')
                }}
            /> */}
        </div>
    )

    return (
        <Layout page="grupos">
            <Toast ref={(el) => toast = el} />
            <SEO title="Grupos" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Grupos
                    </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="datatable-responsive-demo">
                        <DataTable
                            value={groups}
                            className="p-datatable-responsive-demo"
                            paginator
                            rows={10}
                            globalFilter={globalFilter}
                            header={header}
                        >
                            <Column
                                sortable
                                field="id"
                                header="Nombre Grupo"
                                body={groupNameBodyTemplate}
                            />
                            <Column
                                sortable
                                field="name"
                                header="Usuario Principal"
                                body={nameLiderBodyTemplate}
                            />
                            {/* <Column
                                sortable
                                field="createdAt"
                                header="Creado"
                                body={createdAtBodyTemplate}
                            /> */}
                            <Column
                                field="type"
                                header="Estatus"
                                body={statusBodyTemplate}
                            />
                            <Column
                                field="status"
                                header="Clases Disponibles"
                                body={classesBodyTemplate}
                            />
                            <Column
                                header=""
                                body={actionsBodyTemplate}
                            />
                        </DataTable>
                    </div>
                </div>
            </div>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10000 !important' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} strokeWidth="3" />
            </div>}
        </Layout>
    )

}))

export default Paquetes