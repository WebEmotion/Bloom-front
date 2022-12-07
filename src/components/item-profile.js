import React, { useRef, useState } from "react"
import { navigate } from "gatsby"
import { Ripple } from "primereact/ripple"
import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { TieredMenu } from "primereact/tieredmenu"
import ProfilePicture from '../components/uploadProfilePicture'
import { Toast } from 'primereact/toast';

const Item = ({ color, icon, store }) => {

  const [showPP, setShowPP] = useState(false)

  const menu = [
    {
      label: "Perfil",
      icon: "pi pi-fw pi-user",
      command: () => {
        console.log(store)
        navigate("/perfil")
      },
    },
    {
      label: "Cambiar foto",
      icon: "pi pi-camera",
      command: () => {
        setShowPP(true)
      }
    },
    {
      separator: true,
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-fw pi-power-off",
      command: event => {
        // event.originalEvent: Browser event
        // event.item: MenuItem instance
        store.token = ""
        store.name = ""
        store.name_invalid = false
        store.lastname = ""
        store.lastname_invalid = false
        store.email_signup = ""
        store.email_signup_invalid = false
        store.email_signup_conf = ""
        store.email_signup_conf_invalid = false
        store.password_signup = ""
        store.password_signup_invalid = false
        store.password_signup_conf = ""
        store.password_signup_conf_invalid = false
        store.subscribed = false
        store.isAdmin = false
        store.alertDisplayed = false
        navigate("/")
      },
    },
  ]
  const menuAdmin = [
    {
      label: "Cambiar foto",
      icon: "pi pi-camera",
      command: () => {
        setShowPP(true)
      }
    },
    {
      separator: true
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-fw pi-power-off",
      command: event => {
        // event.originalEvent: Browser event
        // event.item: MenuItem instance
        store.token = ""
        store.name = ""
        store.name_invalid = false
        store.lastname = ""
        store.lastname_invalid = false
        store.email_signup = ""
        store.email_signup_invalid = false
        store.email_signup_conf = ""
        store.email_signup_conf_invalid = false
        store.password_signup = ""
        store.password_signup_invalid = false
        store.password_signup_conf = ""
        store.password_signup_conf_invalid = false
        store.subscribed = false
        store.isAdmin = false
        store.alertDisplayed = false
        navigate("/")
      },
    },
  ]
  const myToast = useRef(null)
  let toast = useRef(null)
  
  return (
    <>
      <TieredMenu
        model={store.isAdmin ? menuAdmin : menu}
        popup
        ref={myToast}
        id="overlay_tmenu"
      />
      <Toast ref={(el) => toast = el} />
      <div className="p-d-flex p-flex-column p-jc-center">
        <div className="p-mb-1 p-as-center">
          <Button
            className="card-profile primary-box p-ripple"
            style={{
              background: store.pictureUrl ? `url(${store.pictureUrl})` : color,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)'
            }}
            onClick={event => {
              myToast.current.toggle(event)
            }}
            label=""
          >
            {!store.pictureUrl && <i className={icon}></i>}
            <Ripple />
          </Button>
        </div>
        <div className="p-as-center item-text-profile" style={{ color: color }}>
          {store.name}
        </div>
      </div>
      <Dialog header="Cambiar foto de perfil" visible={showPP} style={{ width: '50vw' }} onHide={() => {
        setShowPP(false)
      }} >
        <ProfilePicture token={store.token} onDone={(data) => {
          store.pictureUrl = data.profile.pictureUrl
          setShowPP(false)
          toast && toast.show({severity: 'success', summary: '¡Listo!', detail: 'Tu imagen de perfil ha sido actualizada'});
          window.location.reload()
        }} onError={(error) => {
          toast && toast.show({severity: 'error', summary: 'Upss!!', detail: error});
        }}/>
      </Dialog>
    </>
  )
}

export default Item
