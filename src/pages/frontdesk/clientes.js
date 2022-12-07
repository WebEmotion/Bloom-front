import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { ProgressSpinner } from "primereact/progressspinner"
import { Paginator } from 'primereact/paginator'
import { Dialog } from 'primereact/dialog'

import { format, addDays } from 'date-fns'
import * as moment from 'moment'

import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as ClientsAPI from '../../api/v0/clients'

const NuevaClase = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const clientStore = RootStore.ClientsStore
    let myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast && myToast.current && myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    var timer = null

    const [isSearch, setIsSearch] = useState(false)
    const [deleteModalUser, setDeleteModalUser] = useState(false)
    const [selectedUserDelete, setSelectedUserDelete] = useState([])

    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState({
        loading: false,
        animateIn: false
    })

    const [first, setFirst] = useState(0)
    const [clientsCount, setClientsCount] = useState(0)
    const changePage = (e) => {
      //console.log(e)
      setFirst(e.first)
      loadSchedules(e.page + 1, false)
    }

    useEffect(() => {
        const getClients = async () => {
            setLoading({
                loading: true,
                animateIn: true,
            })

            setFirst(0)
            const response = await ClientsAPI.getAllClients(store.token, 1)
            //console.log(response)
            if (response.success) {
                //console.log(response.data.data, response.data.pages)
                setClients(response.data.data)
                setClientsCount(response.data.pages)
            }

            //console.log(clients, clientsCount)

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
        getClients()
    }, [])

    const loadSchedules = async page => {
        let response = await ClientsAPI.getAllClients(store.token, page)
        const client = response.data.data
        const clientCount = response.data.pages
        setClients(client)
        setClientsCount(clientCount)
    }

    const getNextClass = bookings => {
        // let closest = Number.MAX_SAFE_INTEGER
        // let closestSchedule = null
        // for (var i in bookings) {
        //     const schedule = bookings[i].Schedule
        //     const date = moment(`${schedule.date.substring(0, 10)} ${schedule.start}`)
        //     const diff = date.diff(moment())
        //     if (diff >= 0 && diff < closest) {
        //         closest = diff
        //         closestSchedule = schedule
        //     }
        // }
        // return closestSchedule ? closestSchedule.date.substring(0, 10) + ' - ' + closestSchedule.start.substring(0, 5) : ''
        return ''
    }

    const searchClients = async query => {
        if(query) {
            clearTimeout(timer)
            timer = setTimeout(async () => {
                let response = await ClientsAPI.searchClient(store.token, query)
                let tmpClient = []
                await response.clients.forEach(element => {
                    tmpClient.push({
                        client: element,
                        nextClass: element.nextClass
                    })
                });
                setClients(tmpClient)
                setClientsCount(10)
                setIsSearch(true)
            }, 1000);
        } else {
            setFirst(0)
            let response = await ClientsAPI.getAllClients(store.token, 1)
            const client = response.data.data
            const clientCount = response.data.pages
            setClients(client)
            setClientsCount(clientCount)
            setIsSearch(false)
        }
    }
    const header = (
        <div className="table-header p-grid p-justify-between">
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                id="search"
                type="search"
                onInput={e => searchClients(e.target.value)}
                placeholder="Buscar..."
            />
            </span>
        </div>
    )

    const idBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.client.id.substring(0, 6)}
            </React.Fragment>
        )
    }
    const nameBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {`${rowData.client.name} ${rowData.client.lastname}`}
            </React.Fragment>
        )
    }
    const dateBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {format(new Date(rowData.client.createdAt), 'yyyy/MM/dd')}
            </React.Fragment>
        )
    }
    const nextBodyTemplate = rowData => {
        return (
            <React.Fragment>
                { rowData.nextClass ? format(new Date(rowData.nextClass.Schedule.date), 'yyyy/MM/dd') : '' }
            </React.Fragment>
        )
    }
    const statusBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.client.isDeleted ? 'Cancelado' : 'Activo'}
            </React.Fragment>
        )
    }

    const actionsBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <Button 
                    icon="pi pi-pencil" 
                    className='p-button-rounded p-button-sm' 
                    style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} 
                    onClick={(e) => {
                        clientStore.selected = rowData.client
                        openEdition()
                    }} 
                />
                <Button 
                    icon="pi pi-trash" 
                    className='p-button-rounded p-button-sm' 
                    style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} 
                    onClick={(e) => {
                        setDeleteModalUser(true)
                        setSelectedUserDelete(rowData.client)
                    }} 
                />
            </React.Fragment>
        )
    }

    const openEdition = () => {
        navigate('/frontdesk/editar-cliente')
    }

    const renderFooterUser = (
        <div>
            <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
                setSelectedUserDelete([])
                setDeleteModalUser(false)
            }} />
            <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} className="p-button-text p-button-pink" autoFocus onClick={async () => {
                await deleteUser()
                setDeleteModalUser(false)
            }} />
        </div>
    )

    const deleteUser = async () => {
        const response = await ClientsAPI.deleteClient(store.token, selectedUserDelete.id)
        if(response.success) {
            showToast("success", "¡Listo!", "Usuario eliminado con éxito")
            searchClients('')
            let search = document.getElementById("search")
            search.value = ''
        } else {
            showToast("error", "Upps!", "Ocurrio un error al eliminar")
        }
    }

    return (
        <Layout page="clientes">
            <Dialog 
                header="Eliminar usuario" 
                className="spDialog" 
                visible={deleteModalUser} 
                footer={renderFooterUser} 
                onHide={() => {
                    setSelectedUserDelete([])
                    setDeleteModalUser(false)
                }}
            >
                <p style={{fontWeight: 'bold'}}>¿Estás seguro de eliminar al usuario con correo {selectedUserDelete.email}?</p>
            </Dialog>

            
            <Toast ref={myToast} />
            <SEO title="Clientes" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Clientes
                  </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#d78676" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <DataTable
                value={clients}
                className="p-datatable-responsive-demo"
                paginator={isSearch}
                rows={10}
                header={header}
                style={{ marginTop: 20 }}
            >
                <Column
                    field="client.id"
                    header="ID"
                    body={idBodyTemplate}
                />
                <Column
                    field="client.name"
                    header="Nombre"
                    body={nameBodyTemplate}
                />
                <Column
                    field="client.createdAt"
                    header="Fecha Ingreso"
                    body={dateBodyTemplate}
                />
                <Column
                    field="next"
                    header="Próxima Clase"
                    body={nextBodyTemplate}
                />{/* 
                <Column
                    sortable
                    field="status"
                    header="Estátus"
                    body={statusBodyTemplate}
                /> */}
                <Column
                    field="actions"
                    header=""
                    body={actionsBodyTemplate}
                />
            </DataTable>
            {!isSearch && <Paginator 
                rows={10} totalRecords={clientsCount} first={first} onPageChange={changePage}
              />}
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration="5000" strokeWidth="3" />
            </div>}
        </Layout>
    )
}))

export default NuevaClase