import React from "react"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import Img from "gatsby-image"
import { Button } from "primereact/button"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const images = useStaticQuery(graphql`
      query {
        instructor: file(relativePath: { eq: "images/carla.jpg" }) {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `)
    return (
      <Layout page="quienes-somos">
        <SEO title="Quiénes Somos" />
        <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
          <div className="p-col">
            <h1
              className="title-page"
              style={{ paddingLeft: store.token ? "100px" : 0 }}
            >
              QUIÉNES SOMOS
            </h1>
          </div>
          {store.token && (
            <div className="p-col-fixed" style={{ width: "100px" }}>
              <Item color="#d78676" icon="pi pi-user" store={store} />
            </div>
          )}
        </div>
        <div className="p-grid p-align-center p-justify-center">
          <div className="p-col-6 p-md-3">
            <Img
              style={{
                maxWidth: "100%",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
              }}
              fluid={images.instructor.childImageSharp.fluid}
              imgStyle={{ objectFit: "contain" }}
              className="fade-in photo"
            />
          </div>
          <div className="p-col-12 p-md-9">
            <h2 className="subtitle">BLOOM CYCLING STUDIO</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
            </p>
          </div>
          <div className="p-col-12 p-md-11" style={{ marginBottom: "1.5rem" }}>
            <div className="p-grid p-align-center p-justify-end">
              <Button
                label="Contáctanos"
                onClick={() => navigate("/contacto")}
                className="simple-button"
              />
            </div>
          </div>
        </div>
      </Layout>
    )
  })
)

export default IndexPage
