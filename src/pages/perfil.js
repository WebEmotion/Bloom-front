import React, { useEffect, useState } from "react"
import { Button } from "primereact/button"
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

import Historial from "../assets/images/web4.jpg"
import MisClases from "../assets/images/historial.png"
import Configuracion from "../assets/images/config.jpg"

import * as Constants from '../environment/index'
import * as moment from 'moment'
import { getHoursAndMinutes } from '../utils'
import * as Auth from "../api/v0/auth"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {

    const store = RootStore.UserStore
    const [state, setState] = useState({ favorite: "", minutesDone: 0 })
    const [classes, setClasses] = useState([])

    useEffect(() => {
      const load = async () => {
        const data = await Auth.me(store.token)
        setState({
          favorite: data.data && typeof data.data.favorite !== 'undefined' && data.data.favorite ? data.data.favorite : '',
          minutesDone: data.data && typeof data.data.minutesDone !== 'undefined' && data.data.minutesDone ? parseInt(data.data.minutesDone) : 0
        })

        const d = await Auth.history(store.token)
        setClasses(d.data ? d.data.purchases : [])
      }

      load()
    }, [])

    const showGroup = () => {
      for (var i in classes) {
        const c = classes[i]
        if (c.Bundle.isGroup && !c.isCanceled) {
          const m = moment(`${c.expirationDate.substring(0, 10)} 23:59`)
          if (moment().isBefore(m)) {
            return true
          }
        }
      }
      return false
    }

    const checkToken = () => {
      if(!store.token) {
        navigate("/")
      }
    }

    return (
      <Layout page="perfil">
        {checkToken()}
        <SEO title="Perfil" />
        <div className="p-d-flex p-flex-column p-align-center p-justify-center">
          <Item color="#3eb978" icon="pi pi-user" store={store} />
          <span style={{ fontSize: 12, color: '#3eb978' }}>{store.email}</span>
        </div>

        <div
          className="p-grid p-align-center p-justify-even fade-in"
          style={{ marginTop: "1rem" }}
        >
          <div className="p-d-flex p-flex-column p-jc-center">
            <div className="p-mb-1 p-as-center">
              <Button
                className="card primary-box p-ripple items-profile"
                style={{
                  background: `url(${MisClases})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                label=""
                onClick={() => navigate("/mis-clases")}
              ></Button>
            </div>
            <div
              className="p-as-center item-text"
              style={{ color: "#3eb978" }}
            >
              Mis clases
            </div>
          </div>
          <div className="p-d-flex p-flex-column p-jc-center">
            <div className="p-mb-1 p-as-center">
              <Button
                className="card primary-box p-ripple items-profile"
                style={{
                  background: `url(${Historial})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
                label=""
                onClick={() => navigate("/historial")}
              ></Button>
            </div>
            <div
              className="p-as-center item-text"
              style={{ color: "#3eb978" }}
            >
              Historial
            </div>
          </div>
          <div className="p-d-flex p-flex-column p-jc-center">
            <div className="p-mb-1 p-as-center">
              <Button
                className="card primary-box p-ripple items-profile"
                style={{
                  background: `url(${Configuracion})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover"
                }}
                label=""
                onClick={() => navigate("/configuracion")}
              ></Button>
            </div>
            <div
              className="p-as-center item-text"
              style={{ color: "#3eb978" }}
            >
              Configuración
            </div>
          </div>
        </div>
        {showGroup() && <div
          className="p-grid p-align-center p-justify-even fade-in"
          style={{ marginTop: "1rem" }}
        >
          <div className="p-d-flex p-flex-column p-jc-center">
            <div className="p-mb-1 p-as-center">
              <Button
                className="card primary-box p-ripple items-profile"
                style={{
                  background: `url(https://static3.abc.es/media/familia/2019/10/26/Familianumerosa-kqNH--620x349@abc.jpg)`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  opacity: 0.75
                }}
                label=""
                onClick={() => navigate("/mi-grupo")}
              ></Button>
            </div>
            <div
              className="p-as-center item-text"
              style={{ color: "#3eb978" }}
            >
              Mi grupo
            </div>
          </div>
        </div>}
        {state && <div className="p-grid p-align-center p-justify-center">
          <p
            style={{
              color: "#3eb978",
              marginTop: "4rem",
              textAlign: "center",
            }}
          >
            Éste mes has pedaleado: {getHoursAndMinutes(state.minutesDone && typeof state.minutesDone !== 'undefined' ? parseInt(state.minutesDone) : 0)}.
            <br />
            Tu instructor favorito: {state.favorite && typeof state.minutesDone !== 'undefined' ? state.favorite : ''}.
          </p>
        </div>}
      </Layout>
    )
  })
)

export default IndexPage
