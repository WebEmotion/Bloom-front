import React from "react"
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
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
        <Layout page="compra">
          <SEO title="Compra" />
          <div className="p-grid p-align-center">
            <div className="p-col">
              <h1
                className="title-page"
                style={{ paddingLeft: store.token ? "100px" : 0 }}
              >
                COMPRA
              </h1>
            </div>
            {store.token && (
              <div className="p-col-fixed" style={{ width: "100px" }}>
                <Item color="#d78676" icon="pi pi-user" store={store} />
              </div>
            )}
          </div>
          <div className="p-grid p-align-center"></div>
        </Layout>
      )
    }
  })
)

export default IndexPage
