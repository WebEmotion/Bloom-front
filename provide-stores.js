import React, { useEffect } from "react"
import { Provider } from "mobx-react"
import RootStore from "./src/store/root"
import ClearCache from 'react-clear-cache'
import { Dialog } from 'primereact/dialog'
import { Button } from "primereact/button"
import { TieredMenu } from "primereact/tieredmenu"
import BackgroundSlider from "gatsby-image-background-slider"
import { useStaticQuery, graphql, navigate } from "gatsby"

import { Offline } from 'react-detect-offline'

const Init = ({ element }) => {
  async function load() {
    try {
      await RootStore.init()
    } catch (error) {
      console.log(error)
    }
  }
  load()

  const isSSR = typeof window === "undefined"
  return (
    <>
      {!isSSR && (
        <React.Suspense fallback={<div />}>
          {/* <Offline>
            <div style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, backgroundColor: '#fafafa', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 100000 }}>
              <img style={{ height: 100, width: '100%', objectFit: 'contain' }} src="https://digital-ignition.com.mx/logo.png" />
              <div style={{ marginTop: 100, padding: 20, textAlign: 'center' }}>
                Por el momento no tienes conexión, revisa tu dispositivo.
              </div>
            </div>
          </Offline> */}
          <ClearCache duration={30000}>
            {({ isLatestVersion, emptyCacheStorage }) => (
              !isLatestVersion && (<div className="p-d-flex p-jc-center p-ai-center p-flex-column" style={{ height: '100vh' }}>
                <div className='p-d-flex p-flex-column p-jc-center p-ai-center' style={{ width: '100vw', height: '100vh', position: 'fixed', left: 0, top: 0, backgroundColor: 'white', zIndex: 100000 }}>
                  <div>
                    <img style={{ height: 100, width: '100%', objectFit: 'contain' }} src="https://digital-ignition.com.mx/logo.png" />
                  </div>
                  <div style={{ marginTop: 100, padding: 20, textAlign: 'center' }}>
                    Constantemente estamos actualizando el sitio.<br />
                  Tenemos una nueva versión. Por favor, actualiza.
                  </div>
                  <div className="p-mt-3">
                    <Button className="p-button-rounded p-button-pink" label="Actualizar" onClick={async () => {
                      await emptyCacheStorage()
                    }} />
                  </div>
                </div>
              </div>)
            )}
          </ClearCache>
          <Provider RootStore={RootStore}>{element}</Provider>
        </React.Suspense>
      )}
    </>
  )
}

export default Init