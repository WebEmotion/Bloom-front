import React, { useState, useEffect, useRef } from "react"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { inject, observer } from "mobx-react"
import { navigate } from "gatsby"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from "primereact/progressspinner"
import { Dialog } from "primereact/dialog"
import { Dropdown } from 'primereact/dropdown'

import "react-datepicker/dist/react-datepicker.css";

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"

import * as InstructorsAPI from '../../api/v0/instructors'

const NuevoInstructor = inject("RootStore")(observer(({ RootStore }) => {
    const store = RootStore.UserStore
    let myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast && myToast.current && myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }
    
    const [isUpdate, setIsUpdate] = useState(false)
    const [instructor, setInstructor] = useState({
        id: 0,
        name: '',
        lastname: '',
        description: '',
        picture: null,
        banner: null,
        isDeleted: false,
        scheduleExists: false
    })

    const [newInstructor, setNewInstructor] = useState([])
    const [selectedInstructor, setSelectedInstructor] = useState(true)
    const [newInstructors, setNewInstructors] = useState([])
    const [deleteModalInstructor, setDeleteModalInstructor] = useState(false)

    const [reactivateModalInstructor, setReactivateModalInstructor] = useState(false)
    
    const [loading, setLoading] = useState({
        loading: true,
        animateIn: true
    })

    const reload = async () => {
        setLoading({
            loading: true,
            animateIn: false
        })

        const response = await InstructorsAPI.getInstructor(instructor.id)

        if(response.success) {
            setInstructor({
                id: response.data.id,
                name: response.data.name,
                lastname: response.data.lastname,
                description: response.data.description,
                picture: response.data.profilePicture,
                banner: response.data.largePicture
            })

        } else {
            showToast("error", "Upps!", "Ocurrio un error al consultar instructor")
        }

        setIsUpdate(true)

        setLoading({
            animateIn: false,
            loading: false
        })
    }

    useEffect(() => {
        const load = async () => {
            if(window.history.state?.instructorId) {
                setLoading({
                    loading: true,
                    animateIn: false
                })

                const idInstructor = window.history.state?.instructorId

                const response = await InstructorsAPI.getInstructor(idInstructor)

                if(response.success) {
                    setInstructor({
                        id: response.data.id,
                        name: response.data.name,
                        lastname: response.data.lastname,
                        description: response.data.description,
                        picture: response.data.profilePicture,
                        banner: response.data.largePicture,
                        isDeleted: response.data.isDeleted,
                        scheduleExists: response.data.scheduleExists
                    })

                } else {
                    showToast("error", "Upps!", "Ocurrio un error al consultar instructor")
                }

                setIsUpdate(true)
    
                setLoading({
                    animateIn: false,
                    loading: false
                })                
            } else {
                setLoading({
                    animateIn: false,
                    loading: false
                })
            }
        }
        
        load()
    }, [])

    const saveInstructor = async () => {
        if (
            instructor.name !== "" &&
            instructor.lastname !== "" &&
            instructor.description !== "" &&
            instructor.picture !== null &&
            instructor.banner !== null &&
            !isUpdate
        ) {
            setLoading({
                loading: true,
                animateIn: false
            })

            const data = await InstructorsAPI.createInstructor(
                store.token,
                instructor,
            )

            setLoading({
                animateIn: false,
                loading: false
            })

            if (!data.success) {
                showToast("error", "Upps!", data.message)
            } else {
                showToast("success", "¡Listo!", "Instructor creado con éxito")
                navigate("/frontdesk/instructores")
            }
        } else if (
            instructor.name !== "" &&
            instructor.lastname !== "" &&
            instructor.description !== "" &&
            instructor.picture !== null &&
            instructor.banner !== null &&
            isUpdate
        ) {
            setLoading({
                loading: true,
                animateIn: false
            })

            const data = await InstructorsAPI.updateInstructor(
                store.token,
                instructor
            )
            setLoading({
                animateIn: false,
                loading: false
            })

            if (!data.success) {
                showToast("error", "Upps!", data.message)
            } else {
                showToast("success", "¡Listo!", "Instructor actualizado con éxito")
                navigate("/frontdesk/instructores")
            }
        } else {
            showToast("error", "Upps!", "Completa todos los campos.")
        }
    }

    const deleteInstructor = async () => {
        const response = await InstructorsAPI.getInstructors()
        if(response.success) {
            var inst = []
            for(var i in response.data) {
                const data = response.data[i]

                if(instructor.id !== data.id && !data.isDeleted) {
                    inst.push({
                        id: data.id,
                        name: data.name,
                        lastname: data.lastname,
                        description: data.description,
                        picture: data.profilePicture,
                        banner: data.largePicture
                    })
                }
            }

            setNewInstructors(inst)
        } else {
            showToast("error", "Upps!", "Ocurrio un error al consultar instructores activos")
        }

        setDeleteModalInstructor(true)
    }

    const deleteInstructorRequest = async () => {
        if(instructor.scheduleExists) {
            const response = await InstructorsAPI.setNewInstructor(store.token, instructor.id, newInstructor)
            if(response.success) {
                const response2 = await InstructorsAPI.deleteInstructor(store.token, instructor.id)
                if(response2.success) {
                    showToast("success", "¡Listo!", "Instructor desactivado con éxito")
                    navigate("/frontdesk/instructores")
                } else {
                    showToast("error", "Upps!", "Ocurrio un error al desactivar instructor")
                }
            } else {
                showToast("error", "Upps!", "No haz seleccionado ningun instructor")
            }

        } else {
            const response = await InstructorsAPI.deleteInstructor(store.token, instructor.id)
            if(response.success) {
                showToast("success", "¡Listo!", "Instructor desactivado con éxito")
                navigate("/frontdesk/instructores")
            } else {
                showToast("error", "Upps!", "Ocurrio un error al desactivar instructor")
            }
        }
    }

    const reactivateInstructor = async () => {
        const response = await InstructorsAPI.deleteInstructor(store.token, instructor.id)
        if(response.success) {
            showToast("success", "¡Listo!", "Instructor reactivado con éxito")
            navigate("/frontdesk/instructores")
        } else {
            showToast("error", "Upps!", "Ocurrio un error al reactivar instructor")
        }
    }

    function isFile(input) {
        if ('File' in window && input instanceof File)
           return true;
        else return false;
    }

    const fileHandler = files => {
        return URL.createObjectURL(files)
    }

    const optionTemplate = option => {
        return (
          <div className="country-item">
            <div>
              {option.name} {option.lastname}
            </div>
          </div>
        )
    }

    const valueTemplate = option => {
        console.log(option)
        if(option) {
            return (
                <div className="country-item">
                    <div>
                        {option.name} {option.lastname}
                    </div>
                </div>
            )
        }

        return (
            <span>
                {'Selecciona un instructor'}
            </span>
        )
    }

    const renderFooterComplete = (
        <div>
            <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
                setNewInstructor([])
                setDeleteModalInstructor(false)
                setSelectedInstructor(true)
            }} />
            <Button label="Aceptar" disabled={(instructor && instructor.scheduleExists) ? selectedInstructor : false} style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} className="p-button-text p-button-pink" autoFocus onClick={async () => {
                await deleteInstructorRequest()
                setDeleteModalInstructor(false)
                setSelectedInstructor(true)
            }} />
        </div>
    )

    const renderFooterReactivate = (
        <div>
            <Button label="Cancelar" className="p-button-text" style={{ color: 'black', fontWeight: 'bold' }} onClick={() => {
                setReactivateModalInstructor(false)
            }} />
            <Button label="Aceptar" style={{ color: 'white', backgroundColor: '#d78676', fontWeight: 'bold' }} className="p-button-text p-button-pink" autoFocus onClick={async () => {
                await reactivateInstructor()
                setReactivateModalInstructor(false)
            }} />
        </div>
    )

    const changePicture = (e) => {
        const imagePicture = e.target.files[0]
        console.log(e.target.files, imagePicture)

        setInstructor({
            ...instructor,
            picture: imagePicture
        })
    }

    const changeBanner = (e) => {
        const imageBanner = e.target.files[0]
        console.log(e.target.files, imageBanner)

        setInstructor({
            ...instructor,
            banner: imageBanner
        })
    }

    return (
        <Layout page="instructores">
            <Toast ref={myToast} />
            <SEO title="Instructores" />
            <Dialog 
                header="Desactivar Instructor" 
                className="spDialog" 
                visible={deleteModalInstructor} 
                footer={renderFooterComplete} 
                onHide={() => {
                    setNewInstructor([])
                    setDeleteModalInstructor(false)
                }}
            >
                <p style={{fontWeight: 'bold'}}>¿Estás seguro de desactivar al instructor?</p>
                {instructor && instructor.scheduleExists && <div>
                    <div className="p-d-flex p-jc-start p-ai-center">
                        <p>El Instructor tiene clases asignadas. Selecciona un instructor para reasignaran las clases</p>
                    </div>
                    <Dropdown 
                        style={{ marginRight: 20, width: "100%"}}
                        value={newInstructor} 
                        options={newInstructors} 
                        optionLabel="name"
                        valueTemplate={valueTemplate}
                        onChange={(e) => {
                            setNewInstructor(e.value)

                            if(e.value && e.value.id) {
                                setSelectedInstructor(false)
                            }
                        }}
                        itemTemplate={optionTemplate}
                    />
                </div>}
            </Dialog>
            <Dialog 
                header="Reactivar Instructor" 
                className="spDialog" 
                visible={reactivateModalInstructor} 
                footer={renderFooterReactivate} 
                onHide={() => {
                    setReactivateModalInstructor(false)
                }}
            >
                <p style={{fontWeight: 'bold'}}>¿Estás seguro de reactivar al instructor?</p>
            </Dialog>

            <div className="p-grid p-align-end" style={{ marginTop: "2rem" }}>
                <div className="p-col-12 p-md-9">
                    <h1 className="title-page" style={{ paddingLeft: 0 }}>
                        Instructor
                  </h1>
                </div>
                <div className="p-col-12 p-md-3">
                    <div className="p-grid p-justify-center">
                        <ItemProfile color="#d78676" icon="pi pi-user" store={store} />
                    </div>
                </div>
            </div>
            <div className="p-col-12">
                    <Button icon="pi pi-arrow-left" className="p-button-rounded p-button-pink" label="Regresar" onClick={() => navigate('/frontdesk/instructores')} />
                </div>
            <div className="p-grid" style={{ marginTop: 40 }}>
                <div className="p-col-12 p-md-7 p-align-center p-justify-center">
                    <div className="p-grid">
                        <div className="p-col-3" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Nombre:</span>
                        </div>
                        <div className="p-col-9">
                            <InputText 
                                style={{ width: '100%' }}
                                value={instructor.name} 
                                onChange={(e) => {
                                    setInstructor({
                                        ...instructor,
                                        name: e.target.value
                                    })
                                }} 
                            />
                        </div>
                        <div className="p-col-3" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Apellidos:</span>
                        </div>
                        <div className="p-col-9">
                            <InputText 
                                style={{ width: '100%' }}
                                value={instructor.lastname} 
                                onChange={(e) => {
                                    setInstructor({
                                        ...instructor,
                                        lastname: e.target.value
                                    })
                                }} 
                            />
                        </div>
                        <div className="p-col-3" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Acerca de:</span>
                        </div>
                        <div className="p-col-9">
                            <InputTextarea
                                style={{ 'max-width': '100%', 'min-width': '100%' }}
                                value={instructor.description}
                                onChange={(e) => {
                                    setInstructor({
                                        ...instructor,
                                        description: e.target.value
                                    })
                                }}
                                rows={15}
                                cols={30}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-col-12 p-md-5">
                    <div className="p-grid">
                        <div className="p-col-3" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Foto:</span>
                        </div>
                        <div className="p-col-9">
                            <label 
                                htmlFor="myInput" 
                                style={{ backgroundColor: '#d78676', border: '1px solid #d78676 !important', margin: '2px', borderRadius: 20, color: '#ffffff', padding: 5, cursor: 'pointer' }}
                            >
                                <i 
                                    className="pi pi-file" 
                                    style={{ marginRight: 10 }}
                                />
                                    {
                                        instructor.picture 
                                            ? instructor.picture.name 
                                                ? instructor.picture.name.substring(0, 15) + '...' 
                                                : 'Actualizar foto' 
                                            : 'Seleccionar archivo'
                                    }
                            </label>
                            
                            <input
                                accept="image/*"
                                id="myInput"
                                style={{ display: 'none' }}
                                type={"file"}
                                onChange={changePicture.bind(this)}
                            />
                        </div>
                        <div className="p-col-12" style={{ textAlign: 'center', marginTop: 5 }}>
                            <img src={ isFile(instructor.picture) ? fileHandler(instructor.picture) : instructor.picture } style={{ width: '65%' }}></img>
                        </div>

                        <div className="p-col-3" style={{ textAlign: 'right', marginTop: 5 }}>
                            <span>Banner:</span>
                        </div>
                        <div className="p-col-9">
                            <label 
                                htmlFor="myInput2" 
                                style={{ backgroundColor: '#d78676', border: '1px solid #d78676 !important', margin: '2px', borderRadius: 20, color: '#ffffff', padding: 5, cursor: 'pointer' }}
                            >
                                <i 
                                    className="pi pi-file" 
                                    style={{ marginRight: 10 }}
                                />
                                    {
                                        instructor.banner
                                            ? instructor.banner.name 
                                                ? instructor.banner.name.substring(0, 15) + '...' 
                                                : 'Actualizar foto' 
                                            : 'Seleccionar archivo'
                                    }
                            </label>

                            <input
                                accept="image/*"
                                id="myInput2"
                                style={{ display: 'none' }}
                                type={"file"}
                                onChange={changeBanner.bind(this)}
                            />
                        </div>
                        <div className="p-col-12" style={{ textAlign: 'center', marginTop: 5 }}>
                            <img src={ isFile(instructor.banner) ? fileHandler(instructor.banner) : instructor.banner } style={{ width: '65%' }}></img>
                        </div>
                    </div>
                </div>
                <div className="p-col-12" style={{ textAlign: 'center' }}>
                    <Button
                        onClick={() => {
                            saveInstructor()
                        }}
                        className="login-btn2"
                        label={isUpdate ? "Actualizar" : "Registrar"}
                    />
                    <Button
                        onClick={() => {
                            instructor.isDeleted ? setReactivateModalInstructor(true) : deleteInstructor()
                        }}
                        className="login-btn2"
                        label={instructor.isDeleted ? "Reactivar Instructor" : "Desactivar instructor"}
                        style={{ width: "auto" }}
                    />
                </div>
            </div>

            {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{ position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3} />
            </div>}
        </Layout>
    )
}))

export default NuevoInstructor