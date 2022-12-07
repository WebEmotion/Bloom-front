import React, { useEffect, useState, useRef } from "react"
import { inject, observer } from "mobx-react"

import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"
import { navigate } from 'gatsby'

import Layout from "../../components/layout"
import SEO from "../../components/seo"
import ItemProfile from "../../components/item-profile"
import { ProgressSpinner } from 'primereact/progressspinner';

import * as Instructors from "../../api/v0/instructors"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    const [instructors, setInstructores] = useState([])
    const [loading, setLoading] = useState({
      loading: true,
      animateIn: true
    })

    useEffect(() => {
      async function fetchData() {
        const data = await Instructors.getInstructors()
        if (data.success) {
          console.log(data)
          let newList = []
          data.data.forEach(element => {
            let temp = element
            temp.selected = false
            temp.color = "#788ba5"
            temp.icon = "pi pi-user"
            newList.push(temp)
          })
          setInstructores(newList)
        }
        setLoading({
          loading: true,
          animateIn: false
        })
        setTimeout(() => {
          setLoading({
            animateIn: false,
            loading: false
          })
        }, 500);
      }
      fetchData()
    }, [])

    const idBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">ID</span>
          {rowData.id}
        </React.Fragment>
      )
    }

    ///Handle errors
    let myToast = useRef(null)
    const showToast = (severityValue, summaryValue, detailValue) => {
      myToast && myToast.current && myToast.current.show({
        severity: severityValue,
        summary: summaryValue,
        detail: detailValue,
      })
    }

    const nameBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Nombre</span>
          {rowData.name}
        </React.Fragment>
      )
    }

    const lastnameBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Apellido</span>
          {rowData.lastname}
        </React.Fragment>
      )
    }

    const createdAtBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Fecha de Ingreso</span>
          {new Date(rowData.createdAt).toLocaleDateString()}
        </React.Fragment>
      )
    }

    const statusBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <span className="p-column-title">Estatus</span>
          {rowData.isDeleted ? "Inactivo" : "Activo"}
        </React.Fragment>
      )
    }

    const actionsBodyTemplate = rowData => {
      return (
        <React.Fragment>
          <Button icon="pi pi-pencil" className='p-button-rounded p-button-sm' style={{ borderRadius: '100%', backgroundColor: '#DDD', color: 'black', border: 'none', marginRight: 20 }} onClick={(e) => {
            navigate('/frontdesk/nuevo-instructor', {
              state: {
                instructorId: rowData.id
              }
            })
          }} />
        </React.Fragment>
      )
    }

    const [globalFilter, setGlobalFilter] = useState(null)
    const header = (
      <div className="table-header p-grid p-justify-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            type="search"
            onInput={e => setGlobalFilter(e.target.value)}
            placeholder="Buscar..."
          />
        </span>

        <Button
          label="Nuevo"
          icon="pi pi-user-plus"
          className="p-button menu-button"
          style={{ width: "auto" }}
          onClick={() => navigate('/frontdesk/nuevo-instructor')}
        />
      </div>
    )

    return (
      <>
        <Layout page="instructores">
          <SEO title="Instructores" />
          <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
            <div className="p-col-12 p-md-9">
              <h1 className="title-page" style={{ paddingLeft: 0 }}>
                INSTRUCTORES
              </h1>
            </div>
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <ItemProfile color="#d78676" icon="pi pi-user" store={store} />
              </div>
            </div>
          </div>
          <div className="p-grid p-align-center fade-in">
            <div className="p-col-12">
              <div className="datatable-responsive-demo">
                <DataTable
                  value={instructors}
                  className="p-datatable-responsive-demo"
                  paginator
                  rows={10}
                  globalFilter={globalFilter}
                  header={header}
                >
                  <Column
                    sortable
                    field="id"
                    header="ID"
                    body={idBodyTemplate}
                  />
                  <Column
                    sortable
                    field="name"
                    header="Nombre"
                    body={nameBodyTemplate}
                  />
                  <Column
                    sortable
                    field="lastname"
                    header="Apellido"
                    body={lastnameBodyTemplate}
                  />
                  <Column
                    sortable
                    field="createdAt"
                    header="Fecha de Ingreso"
                    body={createdAtBodyTemplate}
                  />
                  <Column
                    sortable
                    field="isDeleted"
                    header="Estatus"
                    body={statusBodyTemplate}
                  />
                  <Column
                    header=""
                    body={actionsBodyTemplate}
                  />
                </DataTable>
              </div>
            </div>
          </div>
          {/* 
            *Animacion de realizacion de una accion
          */}
          {loading.loading && <div className={loading.animateIn ? 'opacity-in' : 'opacity-out'} style={{position: 'fixed', width: '100vw', height: '100vh', top: 0, left: 0, backgroundColor: '#FFFFFF99', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ProgressSpinner className={loading.animateIn ? 'scale-in' : 'scale-out'} animationDuration={5000} strokeWidth={3}/>
          </div>}
        </Layout>
      </>
    )
  })
)

export default IndexPage
