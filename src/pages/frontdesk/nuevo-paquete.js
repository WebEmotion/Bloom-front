import React, { useRef, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import Layout from '../../components/layout'
import { navigate } from 'gatsby'
import SEO from '../../components/seo'
import { Toast } from 'primereact/toast'
import ItemProfile from '../../components/item-profile'
import { Button } from "primereact/button"
import { ProgressSpinner } from "primereact/progressspinner"
import { Checkbox } from "primereact/checkbox"
import { InputText } from "primereact/inputtext"
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from "primereact/inputtextarea"

import * as BundlesAPI from '../../api/v0/bundles'

const NuevoPaquete = inject("RootStore")(observer(({ RootStore }) => {

    const store = RootStore.UserStore
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState({
        loading: false,
        animateIn: false
    })
    const [collaborators, setCollaborators] = useState([])
    const [data, setData] = useState({
        name: '',
        price: 0,
        priceOffer: 0,
        isUnlimited: false,
        isLimited: false,
        classes: 0,
        expiresIn: 0,
        hasPasses: false,
        passes: 0,
        description: '',
        isGroup: false,
        memberLimit: 0,
        isSpecial: false,
        collaborator: '',
        during: 0,
        promotion: '',
        image: null,
        user: '',
        password: '',
        contact: '',
        selectedCollaborator: null
    })

    let toast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
        toast && toast.current && toast.current.show({
            severity: severityValue,
            summary: summaryValue,
            detail: detailValue,
        })
    }

    useEffect(() => {
        const load = async () => {
            const response = await BundlesAPI.getCollaborators(store.token)
            if (response.success) {
                let data = [{
                    id: -1,
                    name: '- Crear nuevo'
                }]
                data = data.concat(response.data)
                setCollaborators(data)
                if (window.history.state?.bundle) {
                    setEditing(true)
                    const b = window.history.state?.bundle
                    let collaborator = null
                    for (var i in data) {
                        const collab = data[i]
                        if ("" + collab.id == "" + b.altermateUserId) {
                            collaborator = collab
                            break
                        }
                    }
                    console.log(b);
                    setData({
                        name: b.name,
                        price: b.price,
                        priceOffer: b.offer,
                        isUnlimited: b.isUnlimited,
                        isLimited: b.isLimited,
                        classes: b.classNumber,
                        description: b.description,
                        expiresIn: b.expirationDays,
                        isGroup: b.isGroup,
                        memberLimit: b.memberLimit,
                        isSpecial: b.isEspecial,
                        passes: b.passes,
                        hasPasses: b.passes > 0,
                        promotion: b.especialDescription,
                        during: b.promotionExpirationDays,
                        selectedCollaborator: collaborator
                    })
                }
            }
        }
        load()
    }, [])

    const updateField = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const updateCheckbox = e => {
        setData({
            ...data,
            [e.target.name]: e.checked
        })
    }

    const fileHandler = e => {
        setData({
            ...data,
            image: e.target.files[0]
        })
    }

    const createBundle = async () => {
        setLoading({
            loading: true,
            animateIn: true
        })
        let info = {
            name: data.name,
            price: data.price,
            offer: data.offer,
            description: data.description,
            classNumber: data.classes,
            expirationDays: data.expiresIn,
            passes: data.hasPasses ? data.passes : 0,
            isUnlimited: data.isUnlimited,
            isLimited: data.isLimited,
            isGroup: data.isGroup,
            memberLimit: data.isGroup ? parseInt(data.memberLimit) : 0,
            isSpecial: data.isSpecial,
            especialDescription: data.isSpecial ? data.promotion : '',
            promotionExpirationDays: data.isSpecial ? data.during : 0,
            file: data.isSpecial ? data.image : null,
            email: data.isSpecial ? data.user : '',
            password: data.isSpecial ? data.password : '',
            collaboratorName: data.isSpecial ? data.collaborator : '',
            contact: data.isSpecial ? data.contact : ''
        }
        
        if (data.selectedCollaborator && data.selectedCollaborator.name !== '- Crear nuevo') {
            info['alternateUserId'] = parseInt(data.selectedCollaborator.id)
        }
        
        const response = editing ? await BundlesAPI.update(store.token, info, window.history.state?.bundle.id) : await BundlesAPI.create(store.token, info)
        setLoading({
            loading: false,
            animateIn: false
        })
        if (response.success) {
            showToast("success", "Operación exitosa!", 'El paquete ha sido creado')
            navigate('/frontdesk/paquetes')
        } else {
            showToast("error", "Algo salió mal", 'El paquete no pudo ser creado. Revisa los datos.')
        }
    }

    const bundleIsDisabled = (bundle) => {
        if (bundle) {
            if (bundle.isUnlimited) return true
        }
        return false
    }

    const canCreate = () => {
        if (data.name && data.price > 0 && data.expiresIn > 0 && data.description) {
            if (data.isSpecial) {
                if (data.selectedCollaborator && data.selectedCollaborator.id !== -1 && data.during) {
                    if (data.isGroup) {
                        if (data.memberLimit != 0) {
                            return true
                        }
                        return false
                    }
                    return true
                } else if (data.selectedCollaborator && data.collaborator && data.during && data.contact && data.promotion && data.user && data.password) {
                    if (data.isGroup) {
                        if (data.memberLimit != 0) {
                            return true
                        }
                        return false
                    }
                    return true
                }
                return false
            }
            if (data.isGroup) {
                if (data.memberLimit != 0) {
                    return true
                }
                return false
            }
            return true
        }
        return false
    }

    return (
        <Layout page="paquetes">
            <Toast ref={(el) => toast = el} />
            <SEO title="Paquetes" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        {editing ? 'Editar paquete' : 'Nuevo paquete'}
                    </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <div className="p-grid" style={{ marginTop: 40 }}>
                <div className="p-col-12 p-md-6">
                    <div className="p-d-flex p-jc-center p-ai-center p-mb-3">
                        <h4>Datos generales</h4>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Nombre:</div>
                        <InputText name='name' value={data.name} style={{ width: 'calc(65% - 20px)' }} onChange={updateField.bind(this)} />
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Precio:</div>
                        <InputText type="number" min={0} name='price' value={data.price} style={{ width: 'calc(65% - 20px)' }} onChange={updateField.bind(this)} />
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Precio de oferta:</div>
                        <InputText type="number" min={0} name='priceOffer' value={data.priceOffer} style={{ width: 'calc(65% - 20px)' }} onChange={updateField.bind(this)} />
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}><b>Clases limitadas:</b></div>
                        <Checkbox name="isLimited" onChange={updateCheckbox.bind(this)} inputId="cb1" checked={data.isLimited}></Checkbox>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Clases ilimitadas:</div>
                        <Checkbox name="isUnlimited" onChange={updateCheckbox.bind(this)} inputId="cb1" checked={data.isUnlimited}></Checkbox>
                    </div>
                    {!data.isUnlimited && <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Clases:</div>
                        <InputText type="number" min={0} name='classes' onChange={updateField.bind(this)} value={data.classes} style={{ width: 'calc(65% - 20px)' }} />
                    </div>}
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Vigencia:</div>
                        <InputText type="number" min={0} name='expiresIn' onChange={updateField.bind(this)} value={data.expiresIn} />
                        <div style={{ marginLeft: 10 }}> días</div>
                    </div>
                    {!data.isGroup && <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Incluye pases:</div>
                        <Checkbox name="hasPasses" onChange={updateCheckbox.bind(this)} inputId="cb1" checked={data.hasPasses}></Checkbox>
                    </div>}
                    {data.hasPasses && <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Pases:</div>
                        <InputText type="number" min={0} name='passes' onChange={updateField.bind(this)} value={data.passes} style={{ width: 'calc(65% - 20px)' }} />
                    </div>}
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Descripción:</div>
                        <InputTextarea name='description' onChange={updateField.bind(this)} value={data.description} style={{ width: 'calc(65% - 20px)' }} rows={5} cols={30} autoResize />
                    </div>
                </div>
                <div className="p-col-12 p-md-6">
                    <div className="p-d-flex p-jc-center p-ai-center p-mb-3">
                        <h4>Datos especiales</h4>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Paquete especial:</div>
                        <Checkbox name="isSpecial" disabled={data.selectedCollaborator ? bundleIsDisabled(window.history.state?.bundle) : false} onChange={updateCheckbox.bind(this)} inputId="cb1" checked={data.isSpecial}></Checkbox>
                    </div>
                    {data.isSpecial && <div>
                        <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Colaborador:</div>
                            <Dropdown style={{ width: 'calc(65% - 20px)' }} optionLabel="name" value={data.selectedCollaborator} options={collaborators} onChange={e => {
                                setData({
                                    ...data,
                                    selectedCollaborator: e.value
                                })
                            }} placeholder="Selecciona uno" />
                        </div>
                        {data.selectedCollaborator && data.selectedCollaborator.name === '- Crear nuevo' && <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <InputText name='collaborator' placeholder="Nuevo colaborador" onChange={updateField.bind(this)} value={data.collaborator} style={{ width: '100%' }} />
                        </div>}
                        <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Vigencia:</div>
                            <InputText type="number" min={0} name='during' onChange={updateField.bind(this)} value={data.during} />
                            <div style={{ marginLeft: 10 }}> días</div>
                        </div>
                        <div style={{ paddingTop: 20, paddingBottom: 20, backgroundColor: '#FAFAFA', borderRadius: 20 }} className="p-d-flex p-flex-column p-jc-center p-ai-center p-mb-3">
                            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{data.selectedCollaborator && data.selectedCollaborator.name !== '- Crear nuevo' ? data.selectedCollaborator.name.substring(0, 3).toUpperCase() : data.collaborator ? data.collaborator.substring(0, 3).toUpperCase() : 'ABC'}-XXXXXX</div>
                            <div style={{ fontSize: 14 }}>Ejemplo de folio</div>
                        </div>
                        <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Datos de contacto:</div>
                            <InputTextarea name='contact' onChange={updateField.bind(this)} value={data.selectedCollaborator ? data.selectedCollaborator.contact : data.contact} style={{ width: 'calc(65% - 20px)' }} rows={5} cols={30} autoResize />
                        </div>
                        <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Promoción:</div>
                            <InputTextarea name='promotion' onChange={updateField.bind(this)} value={data.promotion} style={{ width: 'calc(65% - 20px)' }} rows={5} cols={30} autoResize />
                        </div>
                        <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Imagen:</div>
                            <label className="custom-file-upload">
                                <input type="file" accept="image/png" onChange={fileHandler.bind(this)} style={{ display: 'none' }} />
                                {data.image ? data.image.name.substring(0, 18) + '...' : 'Seleccionar archivo'}
                            </label>
                        </div>
                        {data.selectedCollaborator && data.selectedCollaborator.name === '- Crear nuevo' && <div>
                            <div className="p-d-flex p-jc-center p-ai-center p-mb-3">
                                <h4>Acceso de colaboradores</h4>
                            </div>
                            <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Usuario:</div>
                                <InputText name='user' onChange={updateField.bind(this)} value={data.user} style={{ width: 'calc(65% - 20px)' }} />
                            </div>
                            <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Contraseña:</div>
                                <InputText name='password' onChange={updateField.bind(this)} value={data.password} style={{ width: 'calc(65% - 20px)' }} />
                            </div>
                        </div>}
                    </div>}
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Paquete Grupal:</div>
                        <Checkbox name="isGroup" onChange={updateCheckbox.bind(this)} inputId="cb1" checked={data.isGroup}></Checkbox>
                    </div>
                    {data.isGroup && <div>
                        <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                            <div style={{ width: '35%', textAlign: 'right', marginRight: 20 }}>Cantidad de miembros:</div>
                            <InputText style={{ width: '15%' }} type="number" min={0} name='memberLimit' onChange={updateField.bind(this)} value={data.memberLimit} />
                            <div style={{ marginLeft: 10 }}> miembros</div>
                        </div>
                    </div>}
                </div>
                <div className="p-d-flex p-jc-center" style={{ width: '100%', paddingTop: 20, paddingBottom: 20 }}>
                    <Button disabled={!canCreate()} onClick={createBundle} className="p-button-rounded p-button-pink" label={editing ? 'Actualizar' : "Crear paquete"} />
                </div>
            </div>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10000 !important' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} strokeWidth="3" />
            </div>}
        </Layout>
    )

}))

export default NuevoPaquete