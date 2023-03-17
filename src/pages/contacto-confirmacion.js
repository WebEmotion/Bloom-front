import React from "react"
import BackgroundSlider from "gatsby-image-background-slider"
import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  return (
    <Layout page="contacto">
      <SEO title="Contacto" />
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
          <div className="p-col-12 p-md-10 card-transparent-contact fade-in" style={{height: "70vh"}}>
            <div
              className="p-grid p-align-center p-justify-center"
              style={{ height: "100%", alignContent: "center" }}
            >
              <div className="p-md-8 p-col-12 p-mt-4 p-mb-2">
                <h1 className="confirmation">¡GRACIAS POR CONTACTARNOS!</h1>
                <p className="confirmation">Pronto responderemos a tu mensaje</p>
              </div>
              <div className="p-md-10 p-col-11">
                <hr></hr>
              </div>
              <div className="p-md-8 p-col-11">
              <p className="form-text">
                  Te invitamos a conocer un poco más de Casa Bloom
                  creando tu perfil
                </p>
                <div className="p-grid p-align-center p-justify-center">
                  <Link to="/terminos&condiciones" className="welcome-content-link">
                    <p>Registrarme</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
     
    </Layout>
  )
}

export default IndexPage
