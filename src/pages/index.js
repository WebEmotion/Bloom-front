import React, { useRef, useState, useEffect } from "react"
import { Ripple } from "primereact/ripple"
import Img from "gatsby-image"
import { Button } from "primereact/button"
import { TieredMenu } from "primereact/tieredmenu"
import { useStaticQuery, graphql, navigate } from "gatsby"
import { Dialog } from "primereact/dialog"
import ProfilePicture from '../components/uploadProfilePicture'
//import { Button } from "primereact/button"
import { inject, observer } from "mobx-react"
import { Toast } from 'primereact/toast';
import Item from "../components/item-profile"

//import BackgroundSlider from "gatsby-image-background-slider"
import BackgroundSlider from 'react-background-slider'

import * as MeAPI from '../api/v0/me'
import * as Images from '../api/v0/images'

import { useClearCache } from 'react-clear-cache'

import Layout from "../components/layout"
import SEO from "../components/seo"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore

    const [showPP, setShowPP] = useState(false)
    const [images, setImages] = useState([])

    useEffect(() => {
      if (store.isCollaborator) { navigate('/colaboradores/dashboard') }
      else if (store.isInstructor) { navigate('/coaches/dashboard') }
      const load = async () => {
        const response = await Images.getImages()
        if(response.success) {
          var img = []
          for(var i in response.data) {
            const data = response.data[i]
  
            if(data.section === "Home") {
              img.push(data.url)
            }
          }
  
          //console.log(img)
          setImages(img)             
        } /* else {
          showToast("error", "Upps!", "Error al cargar imagenes")
        } */
      }
      load() 
    }, [])

    const loadImages = async () => {
      const response = await Images.getImages()
      if(response.success) {
        var img = []
        for(var i in response.data) {
          const data = response.data[i]

          if(data.section === "Home") {
            img.push(data.url)
          }
        }

        //console.log(img)
        setImages(img)             
      } /* else {
        showToast("error", "Upps!", "Error al cargar imagenes")
      } */
    }

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
          store.alertDisplayed = false
          store.isAdmin = false
          navigate("/")
        },
      },
    ]

    const myToast = useRef(null)
    let toast = useRef(null)

    return (
      <div>
        <Toast ref={(el) => toast = el} />
        {store.token && (
          <div>
            <TieredMenu
              model={store.isAdmin ? menuAdmin : menu}
              popup
              ref={myToast}
              id="overlay_tmenu"
              className="home-item-profile"
              style={{ position: "fixed", display: "flex !important" }}
            />
            <div
              className="p-d-flex p-flex-column p-jc-center home-item-profile"
              style={{ position: "fixed" }}
            >
              <div className="p-mb-1 p-as-center">
                <Button
                  className="card-profile primary-box p-ripple"
                  style={{
                    background: store.pictureUrl
                      ? `url(${store.pictureUrl})`
                      : "#d78676",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                  onClick={event => {
                    myToast.current.toggle(event)
                  }}
                  label=""
                >
                  {!store.pictureUrl && <i className="pi pi-user"></i>}
                  <Ripple />
                </Button>
              </div>
              <div
                className="p-as-center item-text-profile"
                style={{ color: "#d78676" }}
              >
                {store.name}
              </div>
            </div>
          </div>
        )}
        <Layout page="home">
          <SEO title="Home" />

          {images.length !== 0  && <BackgroundSlider
            images={images}
            duration={8}
            transition={4}
          >
          </BackgroundSlider>}

          

          {/* <BackgroundSlider
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
            images={["images/1.jpg","images/2.jpg","images/3.jpg","images/4.jpg","images/6.jpg"]}
            // pass down standard element props
            style={{height: '100%'}}
            className="slider"
          >
            <div className="background"></div>
          </BackgroundSlider> */}

          <div className="home">
            {/* <div style={{ width: '100%', height: '100%', backgroundColor: 'black', opacity: 0.25, position: 'absolute', top: 0, left: 0 }}></div> */}
              <h1 style={{textShadow: '2px 1px 7px rgba(0,0,0,0.46)'}}>LA DECISIÓN ES TUYA</h1>
              {/* <Button className="p-button light-button" label="Clases" onClick={() => navigate("/clases")} />
            {/* <br /> 
            <Button className="p-button light-button" label="Compra" onClick={() => navigate("/compra")} /> */}
          </div>
        </Layout>
        <Dialog header="Cambiar foto de perfil" visible={showPP} style={{ width: '50vw' }} onHide={() => {
          setShowPP(false)
        }} >
          <ProfilePicture token={store.token} onDone={(data) => {
            store.pictureUrl = data.profile.pictureUrl
            setShowPP(false)
            toast && toast.show({ severity: 'success', summary: '¡Listo!', detail: 'Tu imagen de perfil ha sido actualizada' });
            window.location.reload()
          }} onError={(error) => {
            toast && toast.show({ severity: 'error', summary: 'Upss!!', detail: error });
          }} />
        </Dialog>
      </div>
    )
  })
)

export default IndexPage
