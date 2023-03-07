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
import * as BundlesAPI from '../../api/v0/bundles'

const Paquetes = inject("RootStore")(observer(({ RootStore }) => {

    const store = RootStore.UserStore
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })
    const [bundles, setBundles] = useState([])

    let toast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
        toast && toast.current && toast.current.show({
            severity: severityValue,
            summary: summaryValue,
            detail: detailValue,
        })
    }

    const reload = async () => {
        const response = await ClientsAPI.bundles(store.token)
        if (response.success) {
            setBundles(response.data.reverse())
        }
        setLoading({
            loading: false,
            animateIn: false
        })
    }

    useEffect(() => {
        const load = async () => {
            const response = await ClientsAPI.bundles(store.token)
            if (response.success) {
                setBundles(response.data.reverse())
            }
            setLoading({
                loading: false,
                animateIn: false
            })
        }
        load()
    }, [])

    const idBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </React.Fragment>
        )
    }

    const nameBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Nombre</span>
                {rowData.name}
            </React.Fragment>
        )
    }

    const typeBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Tipo</span>
                {rowData.isGroup ? 'Grupal' : 'Individual'}
            </React.Fragment>
        )
    }

    const categoryBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Tipo</span>
                {rowData.isEspecial ? 'Especial' : 'Clásico'}
            </React.Fragment>
        )
    }

    const createdAtBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Creado</span>
            </React.Fragment>
        )
    }

    const statusBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Estatus</span>
                <div className="p-d-flex p-ai-center p-jc-start">
                    <span style={{marginRight: 20}}>{!rowData.isDeleted ? 'Activo' : 'Desactivado'}</span>
                    <Checkbox checked={!rowData.isDeleted} onChange={async e => {
                        setLoading({
                            loading: true,
                            animateIn: true
                        })
                        await BundlesAPI.toggle(store.token, rowData.id)
                        reload()
                    }}/>
                </div>
            </React.Fragment>
        )
    }

    const actionsBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} onClick={(e) => {
                    navigate('/frontdesk/nuevo-paquete', {
                        state: {
                            bundle: rowData
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

            <Button
                label="Nuevo"
                icon="pi pi-user-plus"
                className="p-button menu-button"
                style={{ width: "auto" }}
                onClick={() => {
                    navigate('/frontdesk/nuevo-paquete')
                }}
            />
        </div>
    )

    return (
        <Layout page="paquetes">
            <Toast ref={(el) => toast = el} />
            <SEO title="Paquetes" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Paquetes
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
                            value={bundles}
                            className="p-datatable-responsive-demo"
                            paginator
                            rows={10}
                            globalFilter={globalFilter}
                            header={header}
                        >
                            <Column
                                sortable
                                field="id"
                                header="Id"
                                body={idBodyTemplate}
                            />
                            <Column
                                sortable
                                field="name"
                                header="Nombre"
                                body={nameBodyTemplate}
                            />
                            {/* <Column
                                sortable
                                field="createdAt"
                                header="Creado"
                                body={createdAtBodyTemplate}
                            /> */}
                            <Column
                                field="type"
                                header="Categoría"
                                body={categoryBodyTemplate}
                            />
                            <Column
                                field="type"
                                header="Tipo"
                                body={typeBodyTemplate}
                            />
                            <Column
                                field="status"
                                header="Estatus"
                                body={statusBodyTemplate}
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