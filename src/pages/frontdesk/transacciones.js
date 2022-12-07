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
import { Dialog } from 'primereact/dialog';
import { Paginator } from 'primereact/paginator'

import * as PurchasesAPI from '../../api/v0/purchases'

const Paquetes = inject("RootStore")(observer(({ RootStore }) => {

    const store = RootStore.UserStore
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })

    var timer = null
    
    //const [bundles, setBundles] = useState([])
    const [transactions, setTransactions] = useState([])
    const [current, setCurrentTransaction] = useState(null)
    const [showComplete, setShowCompleteTransaction] = useState(false)
    const [showCancel, setShowCancelTransaction] = useState(false)

    let toast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
        toast && toast.current && toast.current.show({
            severity: severityValue,
            summary: summaryValue,
            detail: detailValue,
        })
    }

    const [first, setFirst] = useState(0)
    const [transaccionesCount, setTransaccionesCount] = useState(0)
    const [lastPage, setLastPage] = useState(1)
    const changePage = (e) => {
      //console.log(e)
      setFirst(e.first)
      reload(e.page + 1)
    }

    const reload = async (pages) => {
        setLoading({
            loading: true,
            animateIn: true
        })

        setLastPage(pages)
        const response = await PurchasesAPI.getAll(store.token, pages)
        if (response.success) {
            //console.log(response);
            setTransactions(response.data.purchases)
            setTransaccionesCount(response.data.pages)
        }
        setLoading({
            loading: false,
            animateIn: false
        })
    }

    useEffect(() => {
        const load = async () => {
            const response = await PurchasesAPI.getAll(store.token, 1)
            if (response.success) {
                console.log(response);
                setTransactions(response.data.purchases)
                setTransaccionesCount(response.data.pages)
            }
            setLoading({
                loading: false,
                animateIn: false
            })
        }
        load()
    }, [])

    const renderFooterCancel = (
        <div>
            <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
                setShowCancelTransaction(false)
            }} />
            <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} className="p-button-text p-button-pink" autoFocus onClick={() => {
                cancelTransaction()
            }} />
        </div>
    )

    const renderFooterComplete = (
        <div>
            <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
                setShowCompleteTransaction(false)
            }} />
            <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} className="p-button-text p-button-pink" autoFocus onClick={() => {
                completeTransaction()
            }} />
        </div>
    )

    const completeTransaction = async () => {
        setShowCompleteTransaction(false)
        setLoading({
            loading: true,
            animateIn: true
        })
        const response = await PurchasesAPI.completePurchase(store.token, current.id)
        if (response.success) {
            toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: `La transacción ${current.operationIds} se ha cancelado correctamente` });
            reload(lastPage)
        } else {
            toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: response.message });
        }
        setCurrentTransaction(null)
        setTimeout(() => {
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
        }, 2000);
    }

    const cancelTransaction = async () => {
        setShowCancelTransaction(false)
        setLoading({
            loading: true,
            animateIn: true
        })
        const response = await PurchasesAPI.cancelPurchase(store.token, current.id)
        if (response.success) {
            toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: `La transacción ${current.operationIds} se ha cancelado correctamente` });
            reload(lastPage)
        } else {
            toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: response.message });
        }
        setCurrentTransaction(null)
        setTimeout(() => {
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
        }, 3000);
    }

    const transcDateTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Fecha y Hora</span>
                {rowData.date.substring(0,10)} {rowData.date.substring(11,19)}
            </React.Fragment>
        )
    }

    const transcHourTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Hora</span>
                {rowData.date.substring(11,19)}
            </React.Fragment>
        )
    }

    const transcClientTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Cliente</span>
                {rowData.User.name} {rowData.User.lastname}
            </React.Fragment>
        )
    }

    const transcEmailTemplate = rowData => {
        return (
            <React.Fragment >
                <span className="p-column-title">Email</span>
                <div style={{ wordBreak: "break-all" }}>
                    {rowData.User.email}
                </div>
            </React.Fragment>
        )
    }

    const transcMontoTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title" style={{ textAlign: 'center' }}>Monto</span>
                {/* <div style={{ textAlign: 'left' }}> */}
                    ${rowData.pendingAmount}
                {/* </div> */}
            </React.Fragment>
        )
    }

    const transcPaqueteTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Paquete</span>
                {rowData.Bundle.name}
            </React.Fragment>
        )
    }

    const transcPedidoTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">ID Pedido</span>
                <div style={{ wordBreak: "break-all" }}>
                    {rowData.operationIds}
                </div>
            </React.Fragment>
        )
    }

    const transcEstatusTemplate = rowData => {
        if (rowData.status == null) {
            rowData.status = "Completada"
        }
        return (
            <React.Fragment>
                <span className="p-column-title">Estatus</span>
                {rowData.status}
            </React.Fragment>
        )
    }

    const actionsBodyTemplate = rowData => {
        if (rowData.status == "Pendiente") {
            return (
                <React.Fragment>
                    <Button icon="pi pi-check" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'green', border: 'none', margin: 2, width: 30, height: 30, transform: "scale(0.8)" }} onClick={(e) => {
                        setCurrentTransaction(rowData)
                        setShowCompleteTransaction(true)
                    }} />
                    <Button icon="pi pi-times" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'red', border: 'none', margin: 2, width: 30, height: 30, transform: "scale(0.8)" }} onClick={(e) => {
                        setCurrentTransaction(rowData)
                        setShowCancelTransaction(true)
                    }} />
                </React.Fragment>
            )
        }
    }

    const searchTransactions = async query => {
        if(query) {
            clearTimeout(timer)
            timer = setTimeout(async () => {
                let response = await PurchasesAPI.searchPurchases(store.token, query)
                const searchResult = response.purchases
                setTransactions(searchResult)
                setTransaccionesCount(10)
            }, 1000)
        } else {
            setFirst(0)
            setLastPage(0)
            let response = await PurchasesAPI.getAll(store.token, 1)
            setTransactions(response.data.purchases)
            setTransaccionesCount(response.data.pages)
        }
    }

    const header = (
        <div className="table-header p-grid p-justify-between">
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                type="search"
                onInput={e => searchTransactions(e.target.value)}
                placeholder="Buscar..."
            />
            </span>
        </div>
    )

    return (
        <Layout page="transacciones">
            <Toast ref={(el) => toast = el} />
            <SEO title="Transacciones" />
            <Dialog header="Cancelar Transacción" className="spDialog" visible={showCancel} footer={renderFooterCancel} onHide={() => {
                setShowCancelTransaction(false)
            }}>
                <p style={{ fontSize: 14 }}>¿Estas seguro de cancelar la transacción {showCancel && `${current.operationIds}`}?</p>
            </Dialog>
            <Dialog header="Completar Transacción" className="spDialog" visible={showComplete} footer={renderFooterComplete} onHide={() => {
                setShowCompleteTransaction(false)
            }}>
                <p style={{ fontSize: 14 }}>¿Estas seguro de completar la transacción {showComplete && `${current.operationIds}`}?</p>
            </Dialog>
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Transacciones
                    </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#d78676" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="datatable-responsive-demo">
                        <DataTable
                            value={transactions}
                            className="p-datatable-responsive-demo"
                            rows={10}
                            header={header}
                            style={{fontSize: 10}}
                        >
                            {/* Cambiar nombre a ID Transaccion/Medio de pago */}
                            <Column
                                field="operationIds"
                                header="ID de la operación"
                                body={transcPedidoTemplate}
                            />
                            <Column
                                sortable
                                field="date"
                                header="Fecha y Hora"
                                body={transcDateTemplate}
                            />
                            {/* <Column
                                sortable
                                field="hour"
                                header="Hora"
                                body={transcHourTemplate}
                            /> */}
                            <Column
                                field="client"
                                header="Cliente"
                                body={transcClientTemplate}
                                style={{width: '15%'}}
                            />
                            <Column
                                field="email"
                                header="Email"
                                body={transcEmailTemplate}
                                style={{width: '25%'}}
                            />
                            <Column
                                field="amount"
                                header="Monto"
                                body={transcMontoTemplate}
                            />
                            <Column
                                field="package"
                                header="Paquete"
                                body={transcPaqueteTemplate}
                            />
                            <Column
                                field="status"
                                header="Estatus"
                                body={transcEstatusTemplate}
                            />
                            <Column
                                header=""
                                body={actionsBodyTemplate}
                            />
                        </DataTable>
                        <Paginator 
                            rows={10} totalRecords={transaccionesCount} first={first} onPageChange={changePage}
                        />
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