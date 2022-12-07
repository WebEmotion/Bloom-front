import React, { useEffect, useState } from "react"
import { navigate } from "gatsby"
import PrimeReact from "primereact/utils"
import { Ripple } from "primereact/ripple"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"

const Item = ({ name, color, icon, instructor }) => {
  useEffect(() => {
    PrimeReact.ripple = true
  }, [])
  const [state, setState] = useState({ displayMaximizable: false })
  function onClick(name, position) {
    let state = {
      [`${name}`]: true,
    }

    if (position) {
      state = {
        ...state,
        position,
      }
    }

    setState(state)
  }
  function onHide(name) {
    setState({
      [`${name}`]: false,
    })
  }

  function renderFooter(name) {
    return (
      <div>
        <Button
          label="Horarios"
          icon="pi pi-calendar"
          onClick={() => navigate("/mis-clases")}
          className="simple-button"
        />
      </div>
    )
  }
  return (
    <>
      <div className="p-d-flex p-flex-column p-jc-center">
        <div className="p-mb-1 p-as-center">
          <Button
            className="card primary-box p-ripple"
            style={{
              background: instructor.profilePicture
                ? `url(${instructor.profilePicture})`
                : color,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
            onClick={() => {
              if (instructor) {
                onClick("displayMaximizable")
              }
            }}
            label=""
          >
            {!instructor.profilePicture && <i className={icon}></i>}
            <Ripple />
          </Button>
        </div>
        <div className="p-as-center item-text" style={{ color: color }}>
          {name}
        </div>
      </div>
      <Dialog
        header=""
        visible={state.displayMaximizable}
        maximizable
        modal
        className="dialog"
        footer={renderFooter("displayMaximizable")}
        onHide={() => onHide("displayMaximizable")}
      >
        <div className="p-grid">
          <div className="p-col-12 p-col-align-start">
            {instructor.largePicture ? (
              <img
                src={instructor.largePicture}
                alt={instructor.name}
                style={{
                  width: "100%",
                  marginTop: "1rem",
                  marginBottom: "0",
                }}
              />
            ) : (
              <Button
                className="card primary-box p-ripple"
                style={{
                  background: instructor.profilePicture
                    ? `url(${instructor.profilePicture})`
                    : color,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  width: "100%",
                  borderRadius: 0
                }}
                onClick={() => {
                }}
                label=""
              >
                {!instructor.profilePicture && <i className={icon}></i>}
                <Ripple />
              </Button>
            )}
          </div>
          <div className="p-col-12">
            <h3 style={{ marginTop: "0"}}>
              {instructor.name} {instructor?.lastname}
            </h3>
            <h5>Instructor</h5>
            <p className="p-m-0" style={{whiteSpace: 'break-spaces'}}>{(instructor.description).replace('.', '.\n')}</p>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Item
