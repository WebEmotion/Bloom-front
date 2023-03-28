import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Página no encontrada" />
    <h1 style={{textAlign: "center", color: "#000000"}}>404: Upps! Parece que te quedaste sin energía.</h1>
  </Layout>
)

export default NotFoundPage
