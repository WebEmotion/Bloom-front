import React from "react"
import BackgroundSlider from "gatsby-image-background-slider"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { Button } from "primereact/button"

import Login from "../components/Login/administracion"
import SEO from "../components/seo"

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css"
import "primeicons/primeicons.css"
import "primeflex/primeflex.css"
import "../assets/scss/global.scss"

const IndexPage = () => {
  return (
    <div>
      <Login open={true} toggle={() => {}} onLogin={() => {}} />
      <SEO title="Administración" />
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
        images={["images/a1.jpg", "images/d1.jpg", "images/a2.jpg", "images/d2.jpg", "images/web6.jpg" ]}
        // pass down standard element props
        style={{}}
        className="full-slider"
      >
        <div className="background"></div>
      </BackgroundSlider>

      <footer className="p-mt-auto footer-2">
        Bloom Cycling Studio - Derechos Reservados {new Date().getFullYear()}
        <br />
        <small>Terminos y Condiciones del Servicio</small>
      </footer>
    </div>
  )
}

export default IndexPage
