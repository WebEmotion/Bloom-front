import React, { useRef, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { navigate } from 'gatsby'

import Layout from '../../components/layout'
import SEO from '../../components/seo'
import ItemProfile from '../../components/item-profile'

import { Toast } from 'primereact/toast'
import { ProgressSpinner } from "primereact/progressspinner"
import { Button } from 'primereact/button'
import { RadioButton } from 'primereact/radiobutton'

import * as Images from '../../api/v0/images'

const Imagenes = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const [loading, setLoading] = useState({
        loading: false,
        animateIn: false
    })

    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef(null)

    const [images, setImages] = useState([])
    const [original, setOriginal] = useState(null)
    const [imagesDimensions, setImagesDimensions] = useState([])

    useEffect(() => {
        const load = async () => {
            setLoading({
                loading: true,
                animateIn: true,
            })

            const response = await Images.getAllImages()

            if(response.success) {
                var img = []
                var imgOrig = []
                for(var i in response.data) {
                    const data = response.data[i]

                    if(data.section === "Home") {
                        img.push(data)
                        imgOrig.push(data)
                    }
                }

                setImages(img)  
                setOriginal(imgOrig)              
            } else {
                showToast("error", "Upps!", "Ocurrio un error al consultar imagenes")
            }

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
        
        load()
    }, [])

    const reloadImg = async () => {
        const response = await Images.getAllImages()

        if(response.success) {
            var img = []
            var imgOrig = []
            for(var i in response.data) {
                const data = response.data[i]

                if(data.section === "Home") {
                    img.push(data)
                    imgOrig.push(data)
                }
            }
            setImages(img)  
            setOriginal(imgOrig)              
        } else {
            showToast("error", "Upps!", "Ocurrio un error al consultar imagenes")
        }
    }

    const saveImage = async (e) => {
        console.log("sube imagen")
        setLoading({
            loading: true,
            animateIn: true,
        })

        const file = e.target.files[0]

        const response = await Images.uploadeImageHome(store.token, file)
        if(response.success) {
            showToast("success", "Operación exitosa!", 'Imagen agregada con exito.')
            reloadImg()
        } else {
            showToast("error", "Upps!", "Ocurrio un error al subir imagenen")
        }

        e.target.value = null
        
        setLoading({
            loading: false,
            animateIn: false
        })
        setTimeout(() => {
            setLoading({
                animateIn: false,
                loading: false
            })
        }, 500);
    }

    const updateImagesStatus = async () => {
        setLoading({
            loading: true,
            animateIn: true,
        })

        var imagesUpdate = []
        for(var i in images) {
            if(images[i].id === original[i].id && ""+images[i].status !== ""+original[i].status) {
                imagesUpdate.push(images[i].id)
            }
        }

        const response = await Images.updateImagesHome(store.token, imagesUpdate)
        if(response.success) {
            showToast("success", "Operación exitosa!", 'Imagenes actualizadas con exito.')
            reloadImg()
        } else {
            showToast("error", "Upps!", "Ocurrio un error al actualizar imagenenes")
        }

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

    const updateField = (e, index) => {
        var newImg = []
        var image = {...images[index]}
        switch(e.target.name) {
            case "activa":
                image.status = true
                break
            case "inactiva":
                image.status = false
                break
            default:
                break
        }

        for(var i in images) {
            const img = images[i]
            if(img.id === image.id) {
                newImg.push(image)
                continue
            }

            newImg.push(img)
        }

        setImages(newImg)
    }

    // Programatically click the hidden file input element
    // when the Button component is clicked
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    const validateSession = () => {
        //console.log("redirige si fuera de sesion")
        if(!store.token) {
            navigate("/")
        }
    }
    
    return (
        <Layout page="imagenes">
            {validateSession()}
            <Toast ref={myToast} />
            <SEO title="Imagenes" />
            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>Imágenes</h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>

            <div 
                className="p-col-12"
                style={{ textAlign: 'end' }}
            >
                <input
                    accept="image/*"
                    ref={hiddenFileInput}
                    style={{ display: 'none' }}
                    type={"file"}
                    onChange={saveImage}
                />

                <Button 
                    className="p-button-rounded p-button-pink" 
                    label="Actualizar"
                    onClick={() => 
                        updateImagesStatus()
                    } 
                />
                <Button 
                    className="p-button-rounded p-button-pink" 
                    label="Nuevo" 
                    onClick={handleClick} 
                />
            </div>

            <div className="p-grid" style={{ marginTop: 40 }}>
                {images.map((item, index) => {
                    return (
                        <div className="p-col-12 p-md-4" key={index}>
                            <div className="p-grid">
                                <div 
                                    className="p-col-12" 
                                    style={{ textAlign: 'center', marginTop: 5 }}
                                >
                                    <img 
                                        src={item.url} 
                                        style={{ width: '95%' }} 
                                    />

                                    <div 
                                        style={{ textAlign: 'center' }}
                                    >
                                        <div style={{ marginBottom: 10 }}>
                                            <span>{item.name}</span>
                                            {/* <br/>
                                            <span>{item.height} x {item.width} px</span> */}
                                        </div>

                                        <div className="p-field-radiobutton" style={{ justifyContent: 'center'}}>
                                            <RadioButton 
                                                inputId={"activa" + index}
                                                name="activa" 
                                                value={true}
                                                onChange={(e) => updateField(e, index)} 
                                                checked={""+item.status === "true"} 
                                            />
                                            <label htmlFor={"activa" + index}>Activa</label>
                                        </div>

                                        <div className="p-field-radiobutton" style={{ justifyContent: 'center'}}>
                                            <RadioButton 
                                                inputId={"inactiva" + index}
                                                name="inactiva" 
                                                value={false}
                                                onChange={(e) => updateField(e, index)} 
                                                checked={""+item.status === "false"} 
                                            />
                                            <label htmlFor={"inactiva" + index}>Inactiva</label>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })

                }
            </div>
            
            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration="5000" strokeWidth="3" />
            </div>}
        </Layout>
    )
}))

export default Imagenes