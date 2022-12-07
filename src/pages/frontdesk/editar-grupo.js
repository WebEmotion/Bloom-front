import React, { useState, useEffect, useRef } from "react"
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"
import { navigate } from "gatsby"
import { Dialog } from "primereact/dialog"
import Layout from "../../components/layout"
import SEO from "../../components/seo"
import Item from "../../components/item-profile"
import { Toast } from "primereact/toast"
import { Button } from 'primereact/button'
import { ProgressSpinner } from "primereact/progressspinner"
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import QRCode from 'react-qr-code'

import * as ClientsAPI from '../../api/v0/clients'
import * as MeAPI from '../../api/v0/me'
import * as Env from '../../environment'

const FamilyPage = inject("RootStore")(
    observer(({ RootStore }) => {

        let toast = useRef(null)

        const store = RootStore.UserStore

        const [mainUser, setMainUser] = useState(null)
        const [title, setTitle] = useState('')
        const [edited, setEdited] = useState(false)
        const [originalTitle, setOriginalTitle] = useState('')
        const [members, setMembers] = useState([])
        const [addMember, setAddMember] = useState(false)
        const [showRemoveMember, setShowRemoveMember] = useState(false)
        const [copied, setCopied] = useState(false)
        const [invitation, setInvitation] = useState({
            url: null,
            display: false
        })
        const [email, setEmail] = useState('')
        const [deleteId, setDeleteId] = useState(null)
        const [loading, setLoading] = useState({
            loading: false,
            animateIn: false
        })

        const reload = async () => {
            const response = await ClientsAPI.getGroupMembers(store.token, mainUser)
            if (response.success) {
                setMembers(response.members[0])
                setOriginalTitle(response.members[1].toUpperCase())
                setTitle(response.members[1].toUpperCase())
            }
        }

        const inviteMember = async () => {
            setLoading({
                loading: true,
                animateIn: true
            })
            const response = await ClientsAPI.inviteGroupMember(store.token, email, mainUser)
            if (response.success && response.data) {
                setInvitation({
                    url: response.data,
                    display: true
                })
            } else if (response.success) {
                await reload()
            } else {
                toast && toast.current && toast.current.show({ severity: 'error', summary: 'Lo sentimos', detail: response.message });
            }
            setEmail('')
            setLoading({
                animateIn: false,
                loading: false
            })
        }

        const removeMember = async () => {
            setShowRemoveMember(false)
            setLoading({
                loading: true,
                animateIn: true
            })
            const response = await ClientsAPI.removeGroupMember(store.token, deleteId, mainUser)
            if (response.success) {
                await reload()
            } else {
                toast && toast.current && toast.current.show({ severity: 'error', summary: 'Lo sentimos', detail: response.message });
            }
            setEmail('')
            setLoading({
                animateIn: false,
                loading: false
            })
        }

        const changeEmail = (e) => {
            setEmail(e.target.value)
            //console.log(e.target.value)
        }

        const changeTitle = (e) => {
            setTitle(e.target.value.toUpperCase())
            setEdited(originalTitle !== e.target.value.toUpperCase())
            //console.log(e.target.value)
        }

        useEffect(() => {
            const load = async () => {
                if (window.history.state?.group) {
                    const g = window.history.state?.group
                    setMainUser(g.id)
                    setLoading({
                        loading: true,
                        animateIn: true
                    })
                    const response = await ClientsAPI.getGroupMembers(store.token, g.id)
                    if (response.success) {
                        setMembers(response.members[0])
                        setOriginalTitle(response.members[1].toUpperCase())
                        setTitle(response.members[1].toUpperCase())
                    }
                    setLoading({
                        animateIn: false,
                        loading: false
                    })
                }
                else {
                    navigate('/frontdesk/grupos')
                }
            }
            load()
        }, [])

        const updateName = async () => {
            setLoading({
                loading: true,
                animateIn: true
            })
            const rename = await ClientsAPI.changeGroupName(store.token, title, mainUser)
            if (rename.success) {
                setEdited(false)
                await reload()
            }
            setLoading({
                animateIn: false,
                loading: false
            })
        }

        const idBodyTemplate = rowData => {
            return (
                <React.Fragment>
                    <span className="p-column-title">Nombre</span>
                    <div className="p-d-flex p-jc-start p-ai-center">
                        {rowData.pictureUrl ? <img style={{ width: 40, height: 40, borderRadius: '100%', marginRight: 10 }} src={rowData.pictureUrl} /> : <div className="p-d-flex p-flex-column p-jc-center p-ai-center" style={{ width: 40, height: 40, borderRadius: '100%', backgroundColor: '#f6b3a3', marginRight: 10 }}><span style={{ color: 'black', opacity: 0.75, fontFamily: 'Poppins-Bold' }}>{rowData.name.substring(0, 1).toUpperCase()}{rowData.lastname ? rowData.lastname.substring(0, 1).toUpperCase() : ''}</span></div>}
                        {rowData.name} {rowData.lastname}
                    </div>
                </React.Fragment>
            )
        }

        const nameBodyTemplate = rowData => {
            return (
                <React.Fragment>
                    <span className="p-column-title">Fecha de ingreso</span>
                    {new Date(rowData.createdAt).toISOString().substring(0, 10)}
                </React.Fragment>
            )
        }

        const typeBodyTemplate = rowData => {
            return (
                <React.Fragment>
                    <span className="p-column-title">Próxima clase</span>
                    {rowData.nextClass ? `${rowData.nextClass.Schedule.date.substring(0, 10)} ${rowData.nextClass.Schedule.start.substring(0, 5)}` : ''}
                </React.Fragment>
            )
        }

        const actionsBodyTemplate = rowData => {
            if (rowData.isLeader) {
                return(<React.Fragment></React.Fragment>)
            } else {
                return (
                    <React.Fragment>
                        <Button icon="pi pi-trash" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} onClick={(e) => {
                            setDeleteId(rowData.id)
                            setShowRemoveMember(true)
                        }} />
                    </React.Fragment>
                )
            }
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
                        setAddMember(true)
                    }}
                />
            </div>
        )

        if (!store.token) {
            navigate("/")
            return (
                <div className="loader-login">
                    <Loader
                        style={{ marginTop: "calc(40vh - 50px)" }}
                        type="Grid"
                        height={100}
                        width={100}
                        color="#d78676"
                    />
                    <p>Cargando...</p>
                </div>
            )
        } else {
            return (
                <Layout page="grupos">
                    <Toast ref={(el) => toast.current = el} />
                    <SEO title="Grupo" />
                    <Dialog header="Añadir nuevo miembro al grupo" className="spDialog" visible={addMember} onHide={() => { setAddMember(false); setEmail('') }}>
                        <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
                            <p>Al añadir un nuevo miembro al grupo, le darás acceso a todas las reservaciones grupales disponibles. No añadas a extraños y asegúrate de introducir el correo electrónico correcto.</p>
                            <InputText value={email} type='email' placeholder="Correo electrónico" style={{ width: '100%', marginBottom: 10 }} onChange={changeEmail.bind(this)} />
                            <Button className="p-button-rounded p-button-pink" label="Añadir" onClick={() => {
                                setAddMember(false)
                                inviteMember()
                            }} />
                        </div>
                    </Dialog>
                    <Dialog header="Eliminar miembro" className="spDialog" visible={showRemoveMember} onHide={() => { setShowRemoveMember(false); setDeleteId(null) }}>
                        <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
                            <p>¿Estás seguro de eliminar a este miembro del grupo? Perderá acceso a todas las reservaciones grupales disponibles</p>
                            <div className="p-d-flex p-jc-between">
                                <Button className="p-button-rounded p-button-pink" label="Eliminar" onClick={() => {
                                    removeMember()
                                }} />
                                <Button className="p-button-rounded p-button-pink" label="Cancelar" onClick={() => {
                                    setShowRemoveMember(false)
                                    setDeleteId(null)
                                }} />
                            </div>
                        </div>
                    </Dialog>
                    <Dialog header="Invitar a un nuevo miembro" className="spDialog" visible={invitation.display} onHide={() => {
                        setInvitation({
                            url: null,
                            display: false
                        })
                        setCopied(false)
                    }}>
                        <div className="p-d-flex p-flex-column p-jc-center p-ai-center">
                            <p>¡Perfecto! Para completar el registro es necesario que él/ella ingrese a la liga temporal que hemos creado</p>
                            <div className="p-d-flex p-jc-evenly">
                                {navigator.share && <img src="https://img.icons8.com/fluent/200/000000/share.png" style={{
                                    width: 40,
                                    height: 40,
                                    margin: 10,
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: 'Compartir invitación',
                                            text: 'Registrate en Bloom!',
                                            url: `${Env.URLS.official_site}/invitation?token=${invitation.url}`,
                                        })
                                            .then(() => console.log('Successful share'))
                                            .catch((error) => console.log('Error sharing', error));
                                    }
                                }} />}
                                <CopyToClipboard text={`${Env.URLS.official_site}/invitation?token=${invitation.url}`}
                                    onCopy={() => {
                                        setCopied(true)
                                        setTimeout(() => {
                                            setCopied(false)
                                        }, 3000);
                                    }}>
                                    <img src="https://img.icons8.com/fluent/200/000000/copy.png" style={{
                                        width: 40,
                                        height: 40,
                                        margin: 10,
                                        cursor: 'pointer'
                                    }} />
                                </CopyToClipboard>
                                <img src="https://img.icons8.com/fluent/200/000000/whatsapp.png" style={{
                                    width: 40,
                                    height: 40,
                                    margin: 10,
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    window.open(`https://api.whatsapp.com/send?text=${Env.URLS.official_site}/invitation/token=${invitation.url}`, '_blank', 'share/whatsapp/share')
                                }} />
                                <img src="https://img.icons8.com/fluent/200/000000/email-sign.png" style={{
                                    width: 40,
                                    height: 40,
                                    margin: 10,
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    window.open(`mailto:pon-el-correo-aqui@mail.com?subject=Registrate en Bloom!&body=Te estoy invitando a que te unas a mi grupo! ${Env.URLS.official_site}/invitation?token=${invitation.url}`, '_blank', 'share/whatsapp/share')
                                }} />
                            </div>
                            {copied && <p>¡Enlace copiado al portapapeles!</p>}
                            <p>O si estás con él/ella pide que escanee este QR:</p>
                            <QRCode size={200} value={invitation.url ? `${Env.URLS.official_site}/invitation?token=${invitation.url}` : ''} />
                        </div>
                    </Dialog>
                    <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
                        <div className="p-col-12">
                            <div className="p-grid p-justify-center">
                                <Item color="#d78676" icon="pi pi-user" store={store} />
                            </div>
                        </div>
                    </div>
                    <div className="p-grid p-align-center">
                        <div className="p-col-12" style={{ position: 'relative' }}>
                            <Button
                                label="Guardar"
                                icon="pi pi-save"
                                className="p-button"
                                disabled={!edited}
                                style={{ width: "auto", position: 'fixed', right: 30, top: 20, color: 'white', borderRadius: 10, backgroundColor: '#788ba5', border: 'none', opacity: edited ? 1 : 0, transition: '300ms linear all' }}
                                onClick={() => {
                                    updateName()
                                }}
                            />
                            <p style={{ textAlign: 'center', marginBottom: 0, fontWeight: 'bold' }}>GRUPO</p>
                            <InputText value={title} placeholder="Nombre del grupo" style={{
                                marginLeft: "25%",
                                fontSize: 30,
                                fontWeight: 'bold',
                                fontFamily: 'Poppins-Bold',
                                textAlign: 'center',
                                width: '50%',
                                color: '#788ba5',
                                textTransform: 'uppercase'
                            }} onChange={changeTitle.bind(this)}/>
                        </div>
                    </div>
                    <div className="p-grid">
                        <div className="p-col-12">
                            <div className="datatable-responsive-demo">
                                <DataTable
                                    value={members}
                                    className="p-datatable-responsive-demo"
                                    paginator
                                    rows={10}
                                    globalFilter={globalFilter}
                                    header={header}
                                >
                                    <Column
                                        field="id"
                                        header="Nombre"
                                        body={idBodyTemplate}
                                    />
                                    <Column
                                        field="name"
                                        header="Fecha ingreso"
                                        body={nameBodyTemplate}
                                    />
                                    <Column
                                        field="type"
                                        header="Próxima clase"
                                        body={typeBodyTemplate}
                                    />
                                    <Column
                                        header=""
                                        body={actionsBodyTemplate}
                                    />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                    {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
                        <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3} />
                    </div>}
                </Layout>
            )
        }
    })
)

export default FamilyPage