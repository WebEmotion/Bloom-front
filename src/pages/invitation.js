import React, { useEffect, useState } from "react"
import { useLocation } from '@reach/router'
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import queryString from 'query-string'

import Layout from "../components/layout"
import SEO from "../components/seo"
import Login from "../components/Login"

const IndexPage = inject("RootStore")(
    observer(({ RootStore }) => {
        const location = useLocation()
        const store = RootStore.UserStore
        useEffect(() => {
            const queries = queryString.parse(location.search)
            if (store.token) {
                navigate('/')
            } else if (queries.token) {
                store.tempToken = queries.token
            } else {
                navigate('/')
            }
        }, [])
        return (
            <Layout page='Invitados'>
                <SEO title="Mi grupo" />
                <Login
                    open={true}
                    toggle={() => {
                        navigate('/')
                    }}
                />
            </Layout>
        )
    })
)

export default IndexPage
