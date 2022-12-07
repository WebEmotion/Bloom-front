import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { InputNumber } from "primereact/inputnumber"
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from "primereact/dropdown"
import { ProgressSpinner } from "primereact/progressspinner"
import { ScrollPanel } from "primereact/scrollpanel"
import { RadioButton } from 'primereact/radiobutton';
import { Password } from 'primereact/password';
import { Paginator } from 'primereact/paginator'

import * as moment from 'moment'
import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as AuthAPI from '../../api/v0/auth'
import * as ClientAPI from '../../api/v0/clients'
import * as PurchaseAPI from '../../api/v0/purchases'
import * as SchedulesAPI from '../../api/v0/schedules'

const NuevaClase = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const clientStore = RootStore.ClientsStore
    let toast = useRef(null)
    
    var timer = null
    var timer2 = null
   
    const [client, setClient] = useState({
        id: '',
        name: '',
        lastname: '',
        email: '',
        createdAt: '',
        facebookId: null,
        profilePicture: null,
        allPurchases: [],
        purchases: [],
        bookings: [],
        taken: 0,
        takenPasses: 0,
        pending: 0,
        pendingPasses: 0,
        pendingGroup: 0,
        takenGroup: 0
    })

    const [bookings, setBookings] = useState([])
    const [firstBookings, setFirstBookings] = useState(0)
    const [bookingsCount, setBookingsCount] = useState(0)
    const changePageBooking = (e) => {
      //console.log(e)
      setFirstBookings(e.first)
      loadBookings(e.page + 1)
    }

    const [purchases, setPurchases] = useState([])
    const [firstPurchases, setFirstPurchases] = useState(0)
    const [purchasesCount, setPurchasesCount] = useState(0)
    const changePagePurchases = (e) => {
      //console.log(e)
      setFirstPurchases(e.first)
      loadPurchases(e.page + 1)
    }

    const [bundles, setBundles] = useState([])
    const [selectedBundle, setSelectedBundle] = useState(null)
    const [currentBundle, setCurrentBundle] = useState(null)
    const [currentPurchase, setCurrentPurchase] = useState(null)
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })

    const [showBundleChange, setShowBundleChange] = useState(false)
    const [upgradeComments, setUpgradeComments] = useState('')

    const [showClassChange, setShowClassChange] = useState(false)
    const [isGrupalClass, setIsGrupalClass] = useState(false)
    const [updatedClasses, setUpdatedClasses] = useState({
        isClass: true,
        number: 0
    })

    const [showCancelPurchase, setShowCancelPurchase] = useState(false)
    const [cancelComments, setCancelComments] = useState('')

    const [resp, setResp] = useState({})
    const [comments, setComments] = useState({
        display: false,
        message: ''
    })

    const [recovery, setRecovery] = useState({
        showRecovery: false,
        changeManually: true,
        newPassword: '',
        confirmPassword: ''
    })

    const [items, setItems] = useState([])

    const loadBookings = async (page) => {
        const responseB = await SchedulesAPI.getBookingClient(store.token, clientStore.selected.id, page)
        if(responseB.success) {
            setBookings(responseB.bookings.bookings)
            setBookingsCount(responseB.bookings.pageNumber)
        }
    }

    const loadPurchases = async (page) => {
        const responseP = await PurchaseAPI.getPurchasesClient(store.token, clientStore.selected.id, page)
        if(responseP.success) {
            let transactions = []
            for (var i in responseP.purchases.purchases) {
                const p = responseP.purchases.purchases[i]
                for (var j in p.Transaction) {
                    const t = p.Transaction[j]
                    transactions.push({
                        ...p,
                        txs: p.Transaction,
                        Transaction: [{
                            ...t
                        }]
                    })
                }
            }
            setPurchases(transactions)
            setPurchasesCount(responseP.purchases.pagesNumber)
        }
    }

    const reload = async () => {
        const response = await ClientAPI.getClient(store.token, clientStore.selected.id)
        if (response.success) {
            const responseB = await SchedulesAPI.getBookingClient(store.token, clientStore.selected.id, 1)
            if(responseB.success) {
                setBookings(responseB.bookings.bookings)
                setBookingsCount(responseB.bookings.pageNumber)
            }

            const responseP = await PurchaseAPI.getPurchasesClient(store.token, clientStore.selected.id, 1)
            if(responseP.success) {
                let transactions = []
                for (var i in responseP.purchases.purchases) {
                    const p = responseP.purchases.purchases[i]
                    for (var j in p.Transaction) {
                        const t = p.Transaction[j]
                        transactions.push({
                            ...p,
                            txs: p.Transaction,
                            Transaction: [{
                                ...t
                            }]
                        })
                    }
                }
                setPurchases(transactions)
                setPurchasesCount(responseP.purchases.pagesNumber)
            }

            setClient({
                name: response.data.name,
                lastname: response.data.lastname,
                email: response.data.email,
                createdAt: response.data.createdAt,
                facebookId: response.data.facebookId,
                profilePicture: response.data.pictureUrl,
                allPurchases: response.data.Purchase,
                taken: response.data.taken,
                isUnlimitedGroup: response.data.isUnlimitedGroup,
                takenPasses: response.data.takenPasses,
                pending: response.data.pending,
                pendingPasses: response.data.pendingPasses,
                takenGroup: response.data.takenGroup,
                pendingGroup: response.data.pendingGroup
            })
            setResp(response.data)
            setShowBundleChange(false)
            setSelectedBundle(null)
            setCurrentBundle(null)
            setCurrentPurchase(null)
        }
    }

    useEffect(() => {
        const load = async () => {
            const response = await ClientAPI.getClient(store.token, clientStore.selected.id)
            if (response.success) {
                setItems(response.data.User_categories)

                const responseB = await SchedulesAPI.getBookingClient(store.token, clientStore.selected.id, 1)
                if(responseB.success) {
                    setBookings(responseB.bookings.bookings)
                    setBookingsCount(responseB.bookings.pageNumber)
                }

                const responseP = await PurchaseAPI.getPurchasesClient(store.token, clientStore.selected.id, 1)
                if(responseP.success) {
                    let transactions = []
                    for (var i in responseP.purchases.purchases) {
                        const p = responseP.purchases.purchases[i]
                        for (var j in p.Transaction) {
                            const t = p.Transaction[j]
                            transactions.push({
                                ...p,
                                txs: p.Transaction,
                                Transaction: [{
                                    ...t
                                }]
                            })
                        }
                    }
                    setPurchases(transactions)
                    setPurchasesCount(responseP.purchases.pagesNumber)
                }

                setClient({
                    id: response.data.id,
                    name: response.data.name,
                    lastname: response.data.lastname,
                    email: response.data.email,
                    createdAt: response.data.createdAt,
                    facebookId: response.data.facebookId,
                    profilePicture: response.data.pictureUrl,
                    allPurchases: [],
                    taken: response.data.taken,
                    isUnlimitedGroup: response.data.isUnlimitedGroup,
                    takenPasses: response.data.takenPasses,
                    pending: response.data.pending,
                    pendingPasses: response.data.pendingPasses,
                    takenGroup: response.data.takenGroup,
                    pendingGroup: response.data.pendingGroup
                })
                setResp(response.data)
                
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
        }
        console.log(window.history.state)
        if (!clientStore.selected) {
            navigate('/frontdesk/clientes')
        } else {
            load()
        }
    }, [])

    const callBundles = async () => {
        // Esta consulta al back end debe realizarce hasta hacer upgrade o downgrade del paquete
        const bundles = await ClientAPI.bundles()
        if (bundles.success) {
            setBundles(bundles.data)
        }
        
    }

    const isUpgradable = (bundle) => {
        return bundles.filter(b => {
            return b.price > bundle.price
        }).length > 0
    }

    const hasChanged = () => {
        if (client.name !== resp.name || client.lastname !== resp.lastname || client.email !== resp.email) {
            return false
        }
        return true
    }

    const resetPassword = async () => {
        setRecovery({
            ...recovery,
            showRecovery: true
        })
        // const response = await AuthAPI.recoveryPassword(resp.email)
        // if (response.success) {
        //     toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: 'Se ha enviado el correo de recuperación correctamente' });
        // } else {
        //     toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: 'No se pudo enviar el correo de recuperación' });
        // }
    }

    const updateClient = async () => {
        const response = await ClientAPI.update(store.token, clientStore.selected.id, client.email, client.name, client.lastname)
        if (response.success) {
            toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: 'Cliente actualizado con éxito' });
            reload()
        } else {
            toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: response.message });
        }
    }

    const updateBundle = async () => {
        const response = await PurchaseAPI.updateBundle(store.token, currentPurchase.id, selectedBundle.id, upgradeComments)
        if (response.success) {
            toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: 'Paquete actualizado con éxito' });
            reload()
        } else {
            toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: response.message });
        }
        setUpgradeComments('')
    }

    const updateClassNumber = async () => {
        setShowClassChange(false)
        setLoading({
            loading: true,
            animateIn: true
        })
        const response = await PurchaseAPI.addOrRemoveClass(store.token, clientStore.selected.id, currentPurchase.id, updatedClasses.isClass, updatedClasses.number)
        if (response.success) {
            toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: `Número de ${updatedClasses.isClass ? 'clases' : 'pases'} actualizado correctamente` });
            reload()
        } else {
            toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: response.message });
        }
        setCurrentPurchase(null)
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
            setUpdatedClasses({
                isClass: true,
                number: 0
            })
        }, 3000);
    }

    const cancelPurchase = async () => {
        setShowCancelPurchase(false)
        setLoading({
            loading: true,
            animateIn: true
        })
        const response = await PurchaseAPI.deletePurchase(store.token, currentPurchase.id, cancelComments)
        if (response.success) {
            toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: `Compra eliminada correctamente` });
            reload()
        } else {
            toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: response.message });
        }
        setCurrentPurchase(null)
        setCancelComments('')
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
            setUpdatedClasses({
                isClass: true,
                number: 0
            })
        }, 3000);
    }

    const optionTemplate = option => {
        return (
            <div className="country-item">
                <div>
                    {option.name}
                </div>
                <div style={{ opacity: 0.5 }}>$ {option.price}</div>
            </div>
        )
    }

    const dateBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Fecha Transacción</span>
                {rowData.Transaction[0].date.substring(0, 10)}
            </React.Fragment>
        )
    }
    const idBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Transacción</span>
                {rowData.Transaction[0].voucher}
            </React.Fragment>
        )
    }
    const methodBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Método de pago</span>
                {rowData.Payment_method.name}
            </React.Fragment>
        )
    }
    const amountBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Monto</span>
                {rowData.Transaction[0].total < 0 ? <span style={{ color: 'red' }}>$ {rowData.Transaction[0].total}</span> : <span>$ {rowData.Transaction[0].total}</span>}
            </React.Fragment>
        )
    }
    const bundleBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Paquete</span>
                {rowData.Bundle.name}
            </React.Fragment>
        )
    }
    const expirationBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Fecha de vencimiento</span>
                { !rowData.isCanceled ? rowData.expirationDate.substring(0, 10) : <span style={{ color: 'red' }}>Cancelada</span>}
            </React.Fragment>
        )
    }    
    const actionsBodyTemplate = rowData => {
        return (
            <React.Fragment>
                {rowData.Transaction[0].comments && <Button icon="pi pi-comment" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 10 }} onClick={(e) => {
                    setComments({
                        display: true,
                        message: rowData.Transaction[0].comments
                    })
                }} />}
                {rowData.Transaction[0].total > -1000 && !rowData.isCanceled && <Button icon="pi pi-refresh" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 10 }} onClick={(e) => {
                    callBundles()
                    setCurrentPurchase(rowData)
                    setCurrentBundle(rowData.Bundle)
                    setShowBundleChange(true)
                }} />}
                {!rowData.isCanceled && <Button icon="pi pi-sort-alt" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginTop: 10, marginRight: 10 }} onClick={(e) => {
                    setCurrentPurchase(rowData)
                    setIsGrupalClass(rowData.Bundle.isGroup)
                    setShowClassChange(true)
                }} />}
                {!rowData.isCanceled && <Button icon="pi pi-trash" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginTop: 10 }} onClick={(e) => {
                    setCurrentPurchase(rowData)
                    setShowCancelPurchase(true)
                }} />}
            </React.Fragment>
        )
    }

    const dateBodyTemplate2 = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Fecha</span>
                {rowData.Schedule.date.substring(0, 10)}
            </React.Fragment>
        )
    }
    const startBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Hora inicio</span>
                {rowData.Schedule.start.substring(0, 5)}
            </React.Fragment>
        )
    }
    const endBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Hora fin</span>
                {rowData.Schedule.end.substring(0, 5)}
            </React.Fragment>
        )
    }
    const instructorBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Instructor</span>
                {`${rowData.Schedule.Instructor.name} ${rowData.Schedule.Instructor.lastname}`}
            </React.Fragment>
        )
    }
    const typeBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Tipo</span>
                {rowData.isPass ? 'Pase' : 'Cliente'}
            </React.Fragment>
        )
    }
    const placeBodyTemplate = rowData => {
        return (
            <React.Fragment>
                <span className="p-column-title">Lugar</span>
                {rowData.Seat.number}
            </React.Fragment>
        )
    }

    const UserItem = ({ item, name, icon, options, value }) => {
        const opt = []
        let label = ""
        for (var i in options) {
            const option = options[i]
            opt.push(option.name)
            label = option.type
        }
        return (
            <div className="p-col-6 p-md-6 p-lg-4">
                <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
                    <img style={{ maxWidth: 75, maxHeight: 75, objectFit: 'contain' }} src={icon} />
                    <span style={{ margin: 10 }}>{name}</span>
                    <span style={{fontWeight: 'bold'}}>{value}</span>
                </div>
            </div>
        )
    }

    const searchBookings = async query => {
        if(query) {
            clearTimeout(timer)
            timer = setTimeout(async () => {
                let response = await SchedulesAPI.searchBookingClient(store.token, client.id, query)
                setBookings(response.bookings)
                setBookingsCount(10)
            }, 1000)
        } else {
            setFirstBookings(0)
            const responseB = await SchedulesAPI.getBookingClient(store.token, clientStore.selected.id, 1)
            setBookings(responseB.bookings.bookings)
            setBookingsCount(responseB.bookings.pageNumber)
        }
    }

    const headerBooking = (
        <div className="table-header p-grid p-justify-between">
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                type="search"
                onInput={e => searchBookings(e.target.value)}
                placeholder="Buscar..."
            />
            </span>
        </div>
    )

    const searchPurchases = async query => {
        if(query) {            
            clearTimeout(timer2)
            timer2 = setTimeout(async () => {
                let response = await PurchaseAPI.searchPurchasesClient(store.token, client.id, query)
                let transactions = []
                for (var i in response.purchases) {
                    const p = response.purchases[i]
                    for (var j in p.Transaction) {
                        const t = p.Transaction[j]
                        transactions.push({
                            ...p,
                            txs: p.Transaction,
                            Transaction: [{
                                ...t
                            }]
                        })
                    }
                }
                setPurchases(transactions)
                setPurchasesCount(10)
            }, 1000)
        } else {
            setFirstPurchases(0)
            const response = await PurchaseAPI.getPurchasesClient(store.token, clientStore.selected.id, 1)
            let transactions = []
            for (var i in response.purchases.purchases) {
                const p = response.purchases.purchases[i]
                for (var j in p.Transaction) {
                    const t = p.Transaction[j]
                    transactions.push({
                        ...p,
                        txs: p.Transaction,
                        Transaction: [{
                            ...t
                        }]
                    })
                }
            }
            setPurchases(transactions)
            setPurchasesCount(response.purchases.pagesNumber)
        }
    }

    const headerPurchases = (
        <div className="table-header p-grid p-justify-between">
            <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
                type="search"
                onInput={e => searchPurchases(e.target.value)}
                placeholder="Buscar..."
            />
            </span>
        </div>
    )

    const renderFooter = (
        <div>
            <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
                setShowClassChange(false)
                setUpdatedClasses({
                    isClass: true,
                    number: 0
                })
            }} />
            <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} disabled={updatedClasses.number === 0} className="p-button-text p-button-pink" autoFocus onClick={() => {
                updateClassNumber()
            }} />
        </div>
    )

    const renderFooterCancel = (
        <div>
            <Button label="No" onClick={() => {
                setShowCancelPurchase(false)
            }} className="p-button-text" />
            <Button label="Si" onClick={() => {
                cancelPurchase()
            }} autoFocus />
        </div>
    )

    const renderFooterResetPasswrd = (
        <div>
            <Button label="Cancelar" onClick={() => {
                setRecovery({
                    ...recovery,
                    showRecovery: false,
                    newPassword: '',
                    confirmPassword: '',
                    changeManually: true
                })
            }} className="p-button-text" />
            <Button label="Actualizar" disabled={(recovery.changeManually && recovery.newPassword !== recovery.confirmPassword) || (recovery.changeManually && !recovery.newPassword)} onClick={async () => {
                if (!recovery.changeManually) {
                    const response = await AuthAPI.recoveryPassword(resp.email)
                    if (response.success) {
                        toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: 'Se ha enviado el correo de recuperación correctamente' });
                    } else {
                        toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: 'No se pudo enviar el correo de recuperación' });
                    }
                    setRecovery({
                        ...recovery,
                        showRecovery: false,
                        newPassword: '',
                        confirmPassword: '',
                        changeManually: true
                    })
                } else {
                    const response = await AuthAPI.changePasswordManually(store.token, resp.id, recovery.newPassword)
                    if (response.success) {
                        toast && toast && toast.show({ severity: 'success', summary: 'Listo', detail: 'Se ha cambiado la contraseña correctamente' });
                    } else {
                        toast && toast && toast.show({ severity: 'error', summary: 'Atención', detail: 'No se pudo cambiar la contraseña' });
                    }
                    setRecovery({
                        ...recovery,
                        showRecovery: false,
                        newPassword: '',
                        confirmPassword: '',
                        changeManually: true
                    })
                }
            }} autoFocus />
        </div>
    )

    const changeCancelComments = (e) => {
        setCancelComments(e.target.value)
        //console.log(e.targett.value)
    }

    const changeUpgradeComments = (e) => {
        setUpgradeComments(e.target.value)
        //console.log(e.targett.value)
    }

    const changeNewPassword = (e) => {
        setRecovery({
            ...recovery,
            newPassword: e.target.value
        })
        //console.log(e.targett.value)
    }

    const changeConfirmPassword = (e) => {
        setRecovery({
            ...recovery,
            confirmPassword: e.target.value
        })
        //console.log(e.targett.value)
    }

    return (
        <Layout page="clientes">
            <Toast ref={(el) => toast = el} />
            <SEO title="Clientes" />
            <Dialog header="Reestablecer contraseña" className="spDialog" visible={recovery.showRecovery} footer={renderFooterResetPasswrd} onHide={() => {
                setRecovery({
                    ...recovery,
                    showRecovery: false,
                    confirmPassword: '',
                    newPassword: false,
                    changeManually: true
                })
            }}>
                <p>Puede elegir entre asignar una nueva contraseña manualmente o enviar el correo de recuperación a la dirección del cliente.</p>
                <div className="p-formgroup-inline">
                    <div className="p-field-checkbox">
                        <RadioButton inputId="class" name="isClass" value={true} checked={recovery.changeManually} onChange={(e) => {
                            setRecovery({
                                ...recovery,
                                changeManually: e.value
                            })
                        }} />
                        <label htmlFor="class">Cambiar manualmente</label>
                    </div>
                    <div className="p-field-checkbox">
                        <RadioButton inputId="pass" name="isClass" value={false} checked={!recovery.changeManually} onChange={(e) => {
                            setRecovery({
                                ...recovery,
                                changeManually: e.value
                            })
                        }} />
                        <label htmlFor="pass">Enviar correo de recuperación</label>
                    </div>
                </div>
                {recovery.changeManually && <div>
                    <h5 style={{ marginBottom: 10 }}>Nueva contraseña:</h5>
                    <Password weakLabel="Debil" mediumLabel="Regular" strongLabel="Fuerte" style={{ width: '100%' }} value={recovery.newPassword} onChange={changeNewPassword.bind(this)} />
                    <h5 style={{ marginBottom: 10 }}>Confirmar contraseña:</h5>
                    <Password className={recovery.confirmPassword && recovery.confirmPassword !== recovery.newPassword ? 'p-invalid' : ''} feedback={false} value={recovery.confirmPassword} onChange={changeConfirmPassword.bind(this)} style={{ width: '100%' }} />
                    {recovery.confirmPassword && recovery.confirmPassword !== recovery.newPassword && <small className="p-invalid p-d-block">Las contraseñas no coinciden</small>}
                </div>}
            </Dialog>
            <Dialog header="Actualizar paquete" visible={showBundleChange} modal className="spDialog" onHide={() => {
                setShowBundleChange(false)
                setSelectedBundle(null)
                setCurrentBundle(null)
                setCurrentPurchase(null)
            }}>
                <ScrollPanel>
                    <h4>Elige el paquete al que deseas actualizar:</h4>
                    <span style={{ fontSize: 14 }}><strong>Upgrade:</strong> <br />
                        <ul>
                            <li>Se puede hacer el upgrade de paquetes a cualquier paquete mayor.</li>
                            <li>Se generará una transacción complementaria.</li>
                        </ul></span>
                    <br />
                    <span style={{ fontSize: 14 }}><strong>Downgrade:</strong><br /><ul>
                        <li>Solo se podrá hacer el downgrade a cualquier paquete inferior, si y solo si, el cliente NO ha utilizado un número de clases superior al del paquete inferior seleccionado.</li>
                        <li>Se generará una transacción de “Devolución” indicando el monto devuelto.</li>
                    </ul></span>
                    <Dropdown
                        value={selectedBundle}
                        options={bundles.filter(b => {
                            return currentBundle && b.price !== currentBundle.price
                        })}
                        onChange={e => {
                            setSelectedBundle(e.value)
                        }}
                        optionLabel="name"
                        filter
                        filterBy="name,price"
                        placeholder="Paquetes"
                        itemTemplate={optionTemplate}
                        style={{ width: "100%", marginTop: 20, marginBottom: 10 }}
                    />
                    <div style={{ marginTop: 0, marginBottom: 20, height: 100 }} className="p-d-flex p-justify-center p-align-center">
                        {selectedBundle && currentBundle && <div>
                            <span className="blue-bloom" style={{ color: 'white', padding: 10, borderRadius: 20, fontWeight: 'bold' }}>{`$ ${currentBundle.price}`}</span>
                            <span style={{ marginLeft: 20, marginRight: 20 }}>{'>'}</span>
                            <span className="blue-bloom" style={{ color: 'white', padding: 10, borderRadius: 20, fontWeight: 'bold' }}>{`$ ${selectedBundle.price}`}</span>
                        </div>}
                    </div>
                    <span style={{ fontSize: 14 }}>Se generará una nueva transacción con el monto de diferencia entre los dos paquetes (${selectedBundle && `${selectedBundle.price - currentBundle.price}`}) y la compra principal se actualizará al paquete nuevo.</span>
                    <h4>Comentarios</h4>
                    <InputTextarea style={{ width: '100%' }} value={upgradeComments} onChange={changeUpgradeComments.bind(this)} rows={3} cols={30} autoResize />
                    <div className="p-d-flex p-justify-center p-align-center" style={{ marginTop: 10 }}>
                        <div className="p-mt-2">
                            <Button disabled={!selectedBundle} className="p-button-rounded p-button-pink" label="Actualizar" onClick={() => {
                                updateBundle()
                            }} />
                        </div>
                    </div>
                </ScrollPanel>
            </Dialog>
            <Dialog header={!isGrupalClass ? "Cambiar número de clases/pases" :  "Cambiar el número de clases grupales"} className="spDialog" visible={showClassChange} footer={renderFooter} onHide={() => {
                setShowClassChange(false)
                setUpdatedClasses({
                    isClass: true,
                    number: 0
                })
            }}>
                <h4>Tipo:</h4>
                <div className="p-formgroup-inline">
                    <div className="p-field-checkbox">
                        <RadioButton inputId="class" name="isClass" value={true} checked={updatedClasses.isClass} onChange={(e) => {
                            setUpdatedClasses({
                                ...updatedClasses,
                                isClass: e.value
                            })
                        }} />
                        <label htmlFor="class">{!isGrupalClass ? "Clase" : "Clase grupal"}</label>
                    </div>
                    {!isGrupalClass && <div className="p-field-checkbox">
                        <RadioButton inputId="pass" name="isClass" value={false} checked={!updatedClasses.isClass} onChange={(e) => {
                            setUpdatedClasses({
                                ...updatedClasses,
                                isClass: e.value
                            })
                        }} />
                        <label htmlFor="pass">Pase</label>
                    </div>}
                </div>
                <h4>Cantidad:</h4>
                <p>Para sumar {!isGrupalClass ? "clases/pases" : "clases grupales"} presiona el botón + y para restar {!isGrupalClass ? "clases/pases" : "clases grupales"} presiona el botón -</p>
                <InputNumber value={updatedClasses.number} onValueChange={(e) => setUpdatedClasses({ ...updatedClasses, number: e.value })} inputStyle={{ textAlign: 'center' }} showButtons buttonLayout="horizontal" step={1}
                    style={{ textAlign: 'center', width: '100%' }}
                    min={isGrupalClass ? client.pendingGroup * -1 : updatedClasses.isClass ? client.pending * -1 : client.pendingPasses * -1}
                    decrementButtonClassName="p-button-rounded p-button-pink" incrementButtonClassName="p-button-rounded p-button-pink" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus" mode="decimal" />
                <p style={{ textAlign: 'center', height: 30 }}>{updatedClasses.number > 0 ? (isGrupalClass ? 'Agregar clases grupales' : 'Agregar clases/pases') : updatedClasses.number < 0 ? (isGrupalClass ? 'Restar clases grupales' : 'Restar clases/pases') : ''}</p>
            </Dialog>
            <Dialog header="Cancelar compra" className="spDialog" visible={showCancelPurchase} footer={renderFooterCancel} onHide={() => setShowCancelPurchase(false)}>
                <p>¿Estás seguro de cancelar esta compra? Todas las reservaciones generadas a través de esta compra serán <strong>permanentemente</strong> eliminadas.</p>
                <h4>Comentarios</h4>
                <InputTextarea style={{ width: '100%' }} value={cancelComments} onChange={changeCancelComments.bind(this)} rows={3} cols={30} autoResize />
            </Dialog>
            <Dialog header="Comentarios" className="spDialog" visible={comments.display} onHide={() => setComments({ display: false, message: '' })}>
                <p>{comments.message}</p>
            </Dialog>
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
            <div className="p-col-12">
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-pink" label="Regresar" onClick={() => navigate('/frontdesk/clientes')} />
                </div>
            <div className="p-grid" style={{ marginTop: 40 }}>
                <div className="p-col-12 p-md-6 p-align-center p-justify-center">
                    <div className="p-grid">
                        <div className="p-col-6" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Nombre:</span>
                        </div>
                        <div className="p-col-6">
                            <InputText value={client.name} onChange={(e) => {
                                setClient({
                                    ...client,
                                    name: e.target.value
                                })
                            }} />
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Apellidos:</span>
                        </div>
                        <div className="p-col-6">
                            <InputText value={client.lastname} onChange={(e) => {
                                setClient({
                                    ...client,
                                    lastname: e.target.value
                                })
                            }} />
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Correo:</span>
                        </div>
                        <div className="p-col-6">
                            <InputText value={client.email} onChange={(e) => {
                                setClient({
                                    ...client,
                                    email: e.target.value
                                })
                            }} />
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Fecha de registro:</span>
                        </div>
                        <div className="p-col-6" style={{ marginTop: 5 }}>
                            <span>{client.createdAt.replace('T', ' ').substring(0, 16)}</span>
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'right' }}>
                            <label htmlFor="fb" className="p-checkbox-label">Facebook</label>
                        </div>
                        <div className="p-col-6" style={{ marginTop: -2 }}>
                            <Checkbox inputId="fb" value="Facebook" checked={client.facebookId}></Checkbox>
                        </div>
                        <div className="p-col-12" style={{ marginTop: 32 }}>
                            <div className="p-d-flex p-jc-center">
                                <Button className="p-button-rounded p-button-pink" label="Reset Password" onClick={() => {
                                    resetPassword()
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-6">
                    <div className="p-grid">
                        <div className="p-col-12" style={{ textAlign: 'center' }}>
                            <img className="blue-bloom" style={{ height: 100, width: 100, borderRadius: '100%', objectFit: 'cover' }} src={client.profilePicture ? client.profilePicture : 'https://img.icons8.com/material/200/ffffff/user-male-circle--v1.png'} />
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'center' }}>
                            Clases disponibles: {client.pending}
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'center' }}>
                            Clases usadas: {client.taken}
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'center' }}>
                            Pases disponibles: {client.pendingPasses}
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'center' }}>
                            Pases usados: {client.takenPasses}
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'center' }}>
                            Clases grupales disponibles: {client.isUnlimitedGroup ?  "Ilimitado" : client.pendingGroup}
                        </div>
                        <div className="p-col-6" style={{ textAlign: 'center' }}>
                            Clases grupales usadas: {client.takenGroup}
                        </div>
                        <div className="p-col-12" style={{ marginTop: 32 }}>
                            <div className="p-d-flex p-jc-center">
                                <Button disabled={hasChanged()} className="p-button-rounded p-button-pink" label="Actualizar" onClick={() => {
                                    updateClient()
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3>Items</h3>
            <div className="p-grid">
                {items.map((value, index) => {
                    return <UserItem item={value} name={value.Categories.User_items.name} icon={value.Categories.User_items.pictureUrl} value={value.Categories.name} />
                })}
                {items.length === 0 && <p style={{width: '100%', color: '#a83e32', marginLeft: 10}}>El usuario no ha configurado sus items</p> }
            </div>
            <h3>Transacciones</h3>

            <div className="p-grid">
                <div className="p-col-12">
                    <div className="datatable-responsive-demo">
                        <DataTable
                            value={purchases}
                            className="p-datatable-responsive-demo"
                            rows={10}
                            header={headerPurchases}
                            style={{ marginTop: 20 }}
                        >
                            <Column
                                sortable
                                field="rowData.Transaction[0].date"
                                header="Fecha Transacción"
                                body={dateBodyTemplate}
                            />
                            <Column
                                sortable
                                field="voucher"
                                header="Transacción"
                                body={idBodyTemplate}
                            />
                            <Column
                                sortable
                                field="method"
                                header="Método de pago"
                                body={methodBodyTemplate}
                            />
                            <Column
                                sortable
                                field="amount"
                                header="Monto"
                                body={amountBodyTemplate}
                            />
                            <Column
                                sortable
                                field="bundle"
                                header="Paquete"
                                body={bundleBodyTemplate}
                            />
                            <Column
                                sortable
                                field="expirationDate"
                                header="Fecha de Vencimiento"
                                body={expirationBodyTemplate}
                            />
                            <Column
                                header=""
                                style={{ width: 200 }}
                                body={actionsBodyTemplate}
                            />
                        </DataTable>
                        <Paginator 
                            rows={10} totalRecords={purchasesCount} first={firstPurchases} onPageChange={changePagePurchases}
                        />
                    </div>
                </div>
            </div>
            

            <h3>Reservaciones</h3>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="datatable-responsive-demo">
                        <DataTable
                            value={bookings}
                            className="p-datatable-responsive-demo"
                            rows={10}
                            header={headerBooking}
                            style={{ marginTop: 20 }}
                        >
                            <Column
                                sortable
                                field="date"
                                header="Fecha"
                                body={dateBodyTemplate2}
                            />
                            <Column
                                sortable
                                field="start"
                                header="Hora inicio"
                                body={startBodyTemplate}
                            />
                            <Column
                                sortable
                                field="end"
                                header="Hora fin"
                                body={endBodyTemplate}
                            />
                            <Column
                                sortable
                                field="instructor"
                                header="Instructor"
                                body={instructorBodyTemplate}
                            />
                            <Column
                                sortable
                                field="type"
                                header="Tipo"
                                body={typeBodyTemplate}
                            />
                            <Column
                                sortable
                                field="seat"
                                header="Lugar"
                                body={placeBodyTemplate}
                            />
                        </DataTable>
                        <Paginator 
                            rows={10} totalRecords={bookingsCount} first={firstBookings} onPageChange={changePageBooking}
                        />
                    </div>
                </div>
            </div>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={'5000'} strokeWidth={'3'} />
            </div>}
        </Layout>
    )
}))

export default NuevaClase