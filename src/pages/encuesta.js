import React, { useRef, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import Layout from '../components/layout'
import { navigate } from 'gatsby'
import SEO from '../components/seo'
import { Toast } from 'primereact/toast'
import ItemProfile from '../components/item-profile'
import { ProgressSpinner } from "primereact/progressspinner"
import { Checkbox } from "primereact/checkbox"
import { InputText } from "primereact/inputtext"
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from "primereact/inputtextarea"
import { Button } from "primereact/button"
import { RadioButton } from 'primereact/radiobutton'

import * as Other from '../api/v0/other'

const Encuesta = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState({
        loading: false,
        animateIn: false
    })

    const [data, setData] = useState({
        device: '',
        browser_mobile: '',
        browser_mobile_otro: '',
        browser_desktop: '',
        browser_desktop_otro: '',
        conexion: '',
        description: '',
        image: null
    })

    const updateField = e => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })

        /* if(e.target.name === "browser_mobile") {
            setData({
                ...data,
                ["browser_desktop"]: '',
                ["browser_desktop_otro"]: ''
            })
        } else if(e.target.name === "browser_desktop") {
            setData({
                ...data,
                ["browser_mobile"]: '',
                ["browser_mobile_otro"]: ''
            })
        } */

        /* if(e.target.name === "browser_mobile" && e.target.name !== "otro") {
            setData({
                ...data,
                ["browser_mobile_otro"]: ''
            })
        } else if(e.target.name === "browser_desktop" && e.target.name !== "otro") {
            setData({
                ...data,
                ["browser_desktop_otro"]: ''
            })
        } */
    }

    const fileHandler = e => {
        setData({
            ...data,
            image: e.target.files[0]
        })
    }

    const canCreate = () => {
        if(data.device && (data.browser_mobile || data.browser_desktop) && data.conexion && data.description) {
            return true
        } 

        return false
    }

    const sendEncuesta = async () => {
        setLoading({
            loading: true,
            animateIn: true
        })

        let dataToSend = {
            device: data.device,
            browser: data.browser_mobile 
                        ? data.databrowser_mobile !== 'otro' 
                            ? data.browser_mobile 
                            : data.browser_mobile_otro
                        : data.databrowser_desktop !== 'otro' 
                            ? data.browser_desktop : 
                            data.browser_desktop_otro,
            conection: data.conexion,
            description: data.description,
            file: data.image ? data.image : null
        }
        console.log(dataToSend)

        const response = await Other.sendEncuesta(store.token, dataToSend)
        setLoading({
            loading: false,
            animateIn: false
        })
        if (response.success) {
            showToast("success", "Gracias!!", 'Con tu participación estamos mejorando, gracias por enviar tu información')
            
            setTimeout(() => {
                navigate('/')
            }, 3000)
        } else {
            showToast("error", "Algo salió mal", 'La información no pudo ser enviada de manera correcta.')
        }
    }

    const myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    return (
        <Layout page="encuesta">
            <Toast ref={myToast} />
            <SEO title="Encuesta" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>Encuesta de satisfacción para clientes Bloom</h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#d78676" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>

            <div className="p-grid" style={{ marginTop: 40, marginLeft: "10vh" }}>
                <div className="p-col-12 p-md-12">
                    <div className="p-d-flex p-jc-left p-ai-left p-mb-3">
                        <h4>¿En que dispositivo usas Bloom?</h4>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <RadioButton
                            inputId='rb1'
                            name='device'
                            value='Mobile'
                            onChange={updateField.bind(this)}
                            checked={data.device === 'Mobile'}
                        />
                        <label htmlFor='rb1' className='p-radiobutton-label'>Smartphone</label>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <RadioButton
                            inputId='rb2'
                            name='device'
                            value='Desktop'
                            onChange={updateField.bind(this)}
                            checked={data.device === 'Desktop'}
                        />
                        <label htmlFor='rb2' className='p-radiobutton-label'>Computadora</label>
                    </div>
                    {data.device !== '' ? 
                        <div className="p-d-flex p-jc-left p-ai-left p-mb-3">
                            <h4>¿En que navegador usas Bloom?</h4>
                        </div>
                            : <div></div>
                    }
                    {data.device === 'Mobile' ?
                        <div>
                            <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                <RadioButton
                                    inputId='rbm1'
                                    name='browser_mobile'
                                    value='safari_iphone'
                                    onChange={updateField.bind(this)}
                                    checked={data.browser_mobile === 'safari_iphone'}
                                />
                                <label htmlFor='rbm1' className='p-radiobutton-label'>Safari (IPhone)</label>
                            </div>
                            <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                <RadioButton
                                    inputId='rbm2'
                                    name='browser_mobile'
                                    value='chrome_iphone'
                                    onChange={updateField.bind(this)}
                                    checked={data.browser_mobile === 'chrome_iphone'}
                                />
                                <label htmlFor='rbm2' className='p-radiobutton-label'>Chrome (IPhone)</label>
                            </div>
                            <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                <RadioButton
                                    inputId='rbm3'
                                    name='browser_mobile'
                                    value='chrome_android'
                                    onChange={updateField.bind(this)}
                                    checked={data.browser_mobile === 'chrome_android'}
                                />
                                <label htmlFor='rbm3' className='p-radiobutton-label'>Chrome (Android)</label>
                            </div>
                            <div className="p-d-flex p-jc-start p-ai-center">
                                <RadioButton
                                    inputId='rbm4'
                                    name='browser_mobile'
                                    value='otro'
                                    onChange={updateField.bind(this)}
                                    checked={data.browser_mobile === 'otro'}
                                />
                                <label htmlFor='rbm4' className='p-radiobutton-label'>Otro</label>
                            </div>
                            <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                <InputText 
                                    type="text" 
                                    name='browser_mobile_otro' 
                                    value={data.browser_mobile_otro} 
                                    style={{ width: 'calc(65% - 20px)' }} 
                                    onChange={updateField.bind(this)} 
                                />
                            </div>
                        </div>
                            : data.device === 'Desktop' ? 
                                <div>
                                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                        <RadioButton
                                            inputId='rbd1'
                                            name='browser_desktop'
                                            value='safari_mac'
                                            onChange={updateField.bind(this)}
                                            checked={data.browser_desktop === 'safari_mac'}
                                        />
                                        <label htmlFor='rbd1' className='p-radiobutton-label'>Safari (Mac)</label>
                                    </div>
                                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                        <RadioButton
                                            inputId='rbd2'
                                            name='browser_desktop'
                                            value='chrome_mac'
                                            onChange={updateField.bind(this)}
                                            checked={data.browser_desktop === 'chrome_mac'}
                                        />
                                        <label htmlFor='rbd2' className='p-radiobutton-label'>Chrome (Mac)</label>
                                    </div>
                                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                        <RadioButton
                                            inputId='rbd3'
                                            name='browser_desktop'
                                            value='chrome_windows'
                                            onChange={updateField.bind(this)}
                                            checked={data.browser_desktop === 'chrome_windows'}
                                        />
                                        <label htmlFor='rbd3' className='p-radiobutton-label'>Chrome (Windows)</label>
                                    </div>
                                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                        <RadioButton
                                            inputId='rbd4'
                                            name='browser_desktop'
                                            value='edge_windows'
                                            onChange={updateField.bind(this)}
                                            checked={data.browser_desktop === 'edge_windows'}
                                        />
                                        <label htmlFor='rbd4' className='p-radiobutton-label'>Edge (Windows)</label>
                                    </div>
                                    <div className="p-d-flex p-jc-start p-ai-center">
                                        <RadioButton
                                            inputId='rbd5'
                                            name='browser_desktop'
                                            value='otro'
                                            onChange={updateField.bind(this)}
                                            checked={data.browser_desktop === 'otro'}
                                        />
                                        <label htmlFor='rbd5' className='p-radiobutton-label'>Otro</label>
                                    </div>
                                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                                        <InputText 
                                            type="text" 
                                            name='browser_desktop_otro' 
                                            value={data.browser_desktop_otro} 
                                            style={{ width: 'calc(65% - 20px)' }} 
                                            onChange={updateField.bind(this)} 
                                        />
                                    </div>
                                </div>
                                    : <div></div>
                    }
                    <div className="p-d-flex p-jc-left p-ai-left p-mb-3">
                        <h4>¿Qué tipo de conexión estabas usando al momento de la falla?</h4>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <RadioButton
                            inputId='rbc1'
                            name='conexion'
                            value='WiFi'
                            onChange={updateField.bind(this)}
                            checked={data.conexion === 'WiFi'}
                        />
                        <label htmlFor='rbc1' className='p-radiobutton-label'>WiFi</label>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-center p-mb-3">
                        <RadioButton
                            inputId='rbc2'
                            name='conexion'
                            value='Mobile'
                            onChange={updateField.bind(this)}
                            checked={data.conexion === 'Mobile'}
                        />
                        <label htmlFor='rbc2' className='p-radiobutton-label'>Datos Celulares</label>
                    </div>
                    <div className="p-d-flex p-jc-left p-ai-left p-mb-3">
                        <h4>Describe el proceso que seguiste para hacer tu compra</h4>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-left p-mb-3">
                        <InputTextarea 
                            name='description' 
                            onChange={updateField.bind(this)} 
                            value={data.description} 
                            style={{ width: 'calc(65% - 20px)' }} 
                            rows={5} cols={30} 
                            autoResize 
                        />
                    </div>
                    <div className="p-d-flex p-jc-left p-ai-left p-mb-3">
                        <h4 style={{ marginBottom: '0px'}}>Si tienes alguna captura de pantalla, por favor adjúntala</h4>
                    </div>
                    <div className="p-d-flex p-jc-left p-ai-left">
                        <h6 style={{ margin: '0px'}}>Sube la captrua de pantalla que hayas tomado</h6>
                    </div>
                    <div className="p-d-flex p-jc-start p-ai-left p-mb-3">
                        <label className="custom-file-upload">
                            <input type="file" accept="image/png,image/jpg,image/jpeg,video/mov,video/mp4" onChange={fileHandler.bind(this)} style={{ display: 'none' }} />
                            {data.image ? data.image.name.substring(0, 18) + '...' : 'Seleccionar archivo'}
                        </label>
                    </div>
                </div>

            </div>

            <div className="p-d-flex p-jc-center" style={{ width: '100%', paddingTop: 20, paddingBottom: 20 }}>
                <Button 
                    disabled={!canCreate()} 
                    onClick={sendEncuesta} 
                    className="p-button-rounded p-button-pink" 
                    label={"Enviar respuestas"} 
                />
                <Button 
                    className="p-button-rounded p-button-pink" 
                    label={"Cancelar"} 
                    onClick={() => {
                        navigate('/')
                    }} 
                />
            </div>
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '10000 !important' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} strokeWidth="3" />
            </div>}
        </Layout>
    )
}))

export default Encuesta