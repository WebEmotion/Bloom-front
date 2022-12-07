import React, { useState } from "react"
import BackgroundSlider from "gatsby-image-background-slider"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { InputText } from "primereact/inputtext"
import { InputTextarea } from "primereact/inputtextarea"
import { InputMask } from "primereact/inputmask"
import { Button } from "primereact/button"
import { ScrollPanel } from "primereact/scrollpanel"

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = () => {
  const [state, setState] = useState({
    comments: "",
    name: "",
    email: "",
    whatsapp: "",
  })
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
      <ScrollPanel
        style={{ width: "100%", height: "85vh" }}
        className="custombar-transparent"
      >
        <div className="p-grid p-align-center p-justify-center">
          <div className="p-col-12 p-md-10 card-transparent-contact fade-in">
            <div
              className="p-grid p-align-center p-justify-center"
              style={{ height: "100%", alignContent: "center" }}
            >
              <div className="p-col-12 p-mt-2 p-mb-2">
                <h1 className="welcome">CONTACTO</h1>
              </div>
              <div className="p-col-10 p-md-8 p-d-inline-flex p-jc-center p-ai-center">
                <div className="form-label">Nombre:</div>
                <InputText
                  id="name"
                  className="p-inputtext-sm form-input"
                  value={state.name}
                  onChange={e => setState({ name: e.target.value })}
                />
              </div>
              <div className="p-col-10 p-md-8 p-d-inline-flex p-jc-center p-ai-center">
                <div className="form-label">Email:</div>
                <InputText
                  id="email"
                  className="p-inputtext-sm form-input"
                  value={state.email}
                  onChange={e => setState({ email: e.target.value })}
                />
              </div>
              <div className="p-col-10 p-md-8 p-d-inline-flex p-jc-center p-ai-center">
                <div className="form-label">Whatsapp:</div>
                <InputMask
                  className="p-inputtext-sm form-input"
                  id="whatsapp"
                  mask="(999) 999-9999"
                  value={state.whatsapp}
                  placeholder=""
                  onChange={e => setState({ whatsapp: e.value })}
                ></InputMask>
              </div>
              <div className="p-col-12">
                <hr></hr>
              </div>
              <div className="p-col-10">
                <p className="form-text">Compartenos tus dudas y comentarios</p>
                <InputTextarea
                  className="form-area"
                  value={state.comments}
                  onChange={e => setState({ comments: e.target.value })}
                  rows={5}
                  cols={30}
                  autoResize
                />
              </div>
              <div className="p-col-12">
                <div className="p-grid p-align-center p-justify-center p-mt-2">
                  <Button
                    label="Enviar"
                    onClick={() => navigate("/contacto-confirmacion")}
                    className="rounded-button"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollPanel>
    </Layout>
  )
}

export default IndexPage
