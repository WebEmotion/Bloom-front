import React from "react"
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import Loader from "react-loader-spinner"
import BackgroundSlider from "gatsby-image-background-slider"
import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

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
            color="#000000"
          />
          <p>Cargando...</p>
        </div>
      )
    } else {
      return (
        <Layout page="terminos&condiciones">
          <SEO title="Bienvenida(o)" />
          <BackgroundSlider
            query={useStaticQuery(graphql`
              query {
                backgrounds: allFile(
                  filter: { sourceInstanceName: { eq: "assets" } }
                ) {
                  nodes {
                    relativePath
                    childImageSharp {
                      fluid(maxWidth: 4000, quality: 100) {
                        ...GatsbyImageSharpFluid
                      }
                    }
                  }
                }
              }
            `)}
            initDelay={2} // delay before the first transition (if left at 0, the first image will be skipped initially)
            transition={4} // transition duration between images
            duration={8} // how long an image is shown
            // specify images to include (and their order) according to `relativePath`
            images={["images/web7.jpg"]}
            // pass down standard element props
            style={{}}
            className="slider"
          ></BackgroundSlider>
          <div className="p-grid p-align-center p-justify-center">
            <div className="p-col-12 p-md-10 card-transparent-welcome fade-in">
              <div
                className="p-grid p-align-center p-justify-center"
                style={{ height: "100%", alignContent: "center" }}
              >
                <div className="p-col-12">
                  <h1 className="welcome">BIENVENIDA (O)</h1>
            <h1 className="welcome">{store.name} {store.lastname}</h1>
                  <h2 className="welcome">¡Estás a un paso de rodar!</h2>
                </div>
                <div className="p-col-12">
                  <h4 className="welcome-content">
                    En tu perfil, ve al menu "Mis clases" y compra el paquete
                    que mejor se adapte a tu ritmo de ejercicio.
                  </h4>
                </div>
                <div className="p-col-12">
                  <Link to="/perfil" className="welcome-content-link">
                    <p>Ir a mi perfil</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Layout>
      )
    }
  })
)

export default IndexPage
