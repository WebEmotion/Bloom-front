import React, { useState, useEffect } from "react"
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"
import { navigate } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

import * as MeAPI from '../api/v0/me'

import Mancuernas from "../assets/images/dumbbell.png"
import Sneakers from "../assets/images/sneakers.png"
import { Button } from "primereact/button"
import { element } from "prop-types"

const IndexPage = inject("RootStore")(
    observer(({ RootStore }) => {

        const store = RootStore.UserStore
        const [state, setState] = useState({
            name: '',
            lastname: '',
            email: '',
            items: []
        })
        const [itemsToUpdate, setItemsToUpdate] = useState([])
        const [allItems, setAllItems] = useState([])
        const [updated, setUpdated] = useState(false)

        useEffect(() => {
            const load = async () => {
                const response = await MeAPI.me(store.token)
                if (response.success) {
                    const profile = response.data.profile
                    setState({
                        name: profile.name,
                        lastname: profile.lastname,
                        email: profile.email,
                        items: profile.User_categories
                    })
                }
                const allItems = await MeAPI.allItems(store.token)
                if (allItems.success) {
                    setAllItems(allItems.data)
                }
            }
            load()
        }, [])

        const save = async () => {
            let items = []
            for (var i in state.items) {
                const item = state.items[i].Categories
                items.push(item.id)
            }
            const response = await MeAPI.updateItems(store.token, items)
            if (response.success) {
                setUpdated(false)
            } else {
                alert('No se pudieron guardar los cambios')
            }
        }

        const updateItem = (elem, cat) => {
            // add or update selected category
            let el = elem
            let items = state.items
            let updated = false
            for (var i in items) {
                const item = items[i]
                if (item.Categories.User_items.id === elem.id) {
                    for (var j in elem.Categories) {
                        const category = elem.Categories[j]
                        if (category.name === cat) {
                            updated = true
                            // delete el.Categories
                            items[i] = {
                                ...items[i],
                                Categories: {
                                    ...category,
                                    User_items: el
                                }
                            }
                            break
                        }
                    }
                    break
                }
            }
            if (!updated) {
                for (var j in elem.Categories) {
                    const category = elem.Categories[j]
                    if (category.name === cat) {
                        // delete el.Categories
                        updated = true
                        items.push({
                            id: 0,
                            Categories: {
                                ...category,
                                User_items: el
                            }
                        })
                        break
                    }
                }
            }
            setState({
                ...state,
                items: items
            })
            setUpdated(true)
            console.log(state)
        }

        const getValue = (elem) => {
            for (var i in state.items) {
                const item = state.items[i]
                if (item.Categories.User_items.id === elem.id) {
                    return item.Categories.name
                }
            }
            return null
        }

        //templates
        const UserItem = ({ item, name, icon, options }) => {
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
                        <Dropdown placeholder={label} style={{ width: 150 }} value={getValue(item)} options={opt} onChange={e => {
                            updateItem(item, e.value)
                        }} />
                    </div>
                </div>
            )
        }

        if (!store.token) {
            navigate("/")
            return (
                <div className="loader-login">
                    <Loader
                        style={{ marginTop: "calc(40vh - 50px)" }}
                        type="Grid"
                        height={100}
                        width={100}
                        color="#3eb978"
                    />
                    <p>Cargando...</p>
                </div>
            )
        } else {
            return (
                <Layout page="perfil">
                    <SEO title="Configuración" />
                    <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
                        <div className="p-col-12 p-md-9">
                            <h1 className="title-page" style={{ paddingLeft: 0 }}>
                                CONFIGURACIÓN
                            </h1>
                        </div>
                        <div className="p-col-12 p-md-3">
                            <div className="p-grid p-justify-center">
                                <Item color="#3eb978" icon="pi pi-user" store={store} />
                            </div>
                        </div>
                    </div>
                    <div className="p-d-flex p-flex-column" style={{ marginTop: 0, padding: 30 }}>
                        <div className="p-d-flex p-flex-column">
                            <h3>Mis datos</h3>
                            <div className="p-d-flex p-ai-center" style={{ marginBottom: 20 }}>
                                <span style={{ marginRight: 20, width: 100, textAlign: 'right' }}>Nombre:</span>
                                <InputText disabled={true} style={{ width: 300 }} value={state.name} />
                            </div>
                            <div className="p-d-flex p-ai-center" style={{ marginBottom: 20 }}>
                                <span style={{ marginRight: 20, width: 100, textAlign: 'right' }}>Apellido:</span>
                                <InputText disabled={true} style={{ width: 300 }} value={state.lastname} />
                            </div>
                            <div className="p-d-flex p-ai-center" style={{ marginBottom: 20 }}>
                                <span style={{ marginRight: 20, width: 100, textAlign: 'right' }}>Email:</span>
                                <InputText disabled={true} style={{ width: 300 }} value={state.email} />
                            </div>
                            {/* <div className="p-d-flex p-ai-center" style={{ marginBottom: 20 }}>
                                <span style={{ marginRight: 20, width: 100, textAlign: 'right' }}>Contraseña:</span>
                                <InputText value={state.password}/>
                            </div> */}
                        </div>
                        <div className="p-d-flex p-flex-column">
                            <h3>Mis items</h3>
                            {state.items.length !== allItems.length && <div>
                                <p style={{ fontWeight: 'bold', color: '#a83e32', textAlign: 'center' }}>No has configurado todos tus items</p>
                                <p style={{ textAlign: 'center', fontSize: 14 }}>Selecciona el elemento de tu preferencia para cada item, da click en "Guardar cambios" y todo quedará listo</p>
                            </div>}
                            <div className="p-grid">
                                {allItems.map((value, index) => {
                                    return <UserItem key={index} item={value} name={value.name} options={value.Categories} icon={value.pictureUrl} />
                                })}
                            </div>
                        </div>
                        <div style={{ marginTop: 40 }} className="p-d-flex p-ai-center p-jc-center">
                            <Button className="p-button-rounded p-button-pink" label="Guardar cambios" disabled={!updated} onClick={save} />
                        </div>
                    </div>
                </Layout>
            )
        }
    })
)

export default IndexPage
