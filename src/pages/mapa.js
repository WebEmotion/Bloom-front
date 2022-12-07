import React, { useEffect, useState } from "react"
import { GMap } from "primereact/gmap"
import { ProgressSpinner } from "primereact/progressspinner"
import { inject, observer } from "mobx-react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    useEffect(() => {
      loadGoogleMaps(() => {
        // Work to do after the library loads.
        setState({ googleMapsReady: true })
      })
    }, [])
    const loadGoogleMaps = callback => {
      const existingScript = document.getElementById("googleMaps")

      if (!existingScript) {
        const script = document.createElement("script")
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=AIzaSyCjvuXP_oRfAYdyGOf17p_sNkj3nWIZTZI&libraries=places"
        script.id = "googleMaps"
        document.body.appendChild(script)

        script.onload = () => {
          if (callback) callback()
        }
      }

      if (existingScript && callback) callback()
    }
    const [state, setState] = useState({
      googleMapsReady: false,
      dialogVisible: false,
      markerTitle: "",
      draggableMarker: false,
      overlays: null,
      selectedPosition: null,
    })
    const options = {
      center: { lat: 19.5764446, lng: -99.2849948 },
      zoom: 16,
    }

    return (
      <Layout page="mapa">
        <SEO title="Mapa" />
        <div className="p-grid p-align-center">
          <div className="p-col">
            <h1
              className="title-page"
              style={{ paddingLeft: store.token ? "100px" : 0 }}
            >
              MAPA
            </h1>
          </div>
          {store.token && (
            <div className="p-col-fixed" style={{ width: "100px" }}>
              <Item color="#d78676" icon="pi pi-user" store={store} />
            </div>
          )}
        </div>
        <div className="p-grid p-align-center p-justify-center">
          <div className="p-col-12">
          <p>Cortijo Santa María de los Alamares,<br/>
          Camino a los Azulejos #1 Rancho Los Azulejos Valle Escondido Ciudad López Mateos,<br/>
          Estado de México CP 52970</p>
          </div>
          <div className="p-col-12">
          <div class="mapouter"><div class="gmap_canvas"><iframe width="100%" height="300" id="gmap_canvas" src="https://maps.google.com/maps?q=bloom%20cycling&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div></div>
          </div>
        </div>
      </Layout>
    )
  })
)

export default IndexPage
