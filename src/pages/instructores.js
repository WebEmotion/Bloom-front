import React, {useEffect, useState} from "react"
import { inject, observer } from "mobx-react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item"
import ItemProfile from "../components/item-profile"

import * as Instructors from "../api/v0/instructors"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const [instructors, setInstructores] = useState([])
    useEffect(() => {
      async function fetchData() {
        const data = await Instructors.getInstructors()
        if (data.success) {
          console.log(data)
          let newList = []
          data.data.forEach((element) => {
            if(!element.isDeleted) {
              let temp = element
              temp.selected = false
              temp.color= "#3eb978"
              temp.icon= "pi pi-user"
              newList.push(temp)
            }
          })
          setInstructores(newList)
        }
      }
      fetchData()
    }, [])

    // const items = [
    //   {
    //     name: "Diana",
    //     color: "#3eb978",
    //     icon: "pi pi-user",
    //   },
    //   {
    //     name: "Jorge",
    //     color: "#3eb978",
    //     icon: "pi pi-user",
    //   },
    //   {
    //     name: "Sandra",
    //     color: "#3eb978",
    //     icon: "pi pi-user",
    //   },
    //   {
    //     name: "Alejandro",
    //     color: "#3eb978",
    //     icon: "pi pi-user",
    //   },
    //   {
    //     name: "Paula",
    //     color: "#3eb978",
    //     icon: "pi pi-user",
    //   },
    //   {
    //     name: "Marco",
    //     color: "#3eb978",
    //     icon: "pi pi-user",
    //   },
    // ]
    return (
      <Layout page="instructores">
        <SEO title="Instructores" />
        <div className="p-grid p-align-center">
          <div className="p-col">
            <h1
              className="title-page"
              style={{ paddingLeft: store.token ? "100px" : 0 }}
            >
              EQUIPO BCS
            </h1>
          </div>
          {store.token && (
            <div className="p-col-fixed" style={{ width: "100px" }}>
              <ItemProfile color="#3eb978" icon="pi pi-user" store={store} />
            </div>
          )}
        </div>
        <div className="p-grid p-align-center fade-in">
          {instructors.map((item, index) => {
            return (
              <div className="p-col-4" key={index}>
                <Item
                  name={item.name}
                  size={item.size}
                  color={item.color}
                  icon="pi pi-user"
                  fontSize={item.fontSize}
                  iconSize={item.iconSize}
                  instructor={item}
                />
              </div>
            )
          })}
        </div>
      </Layout>
    )
  })
)

export default IndexPage
