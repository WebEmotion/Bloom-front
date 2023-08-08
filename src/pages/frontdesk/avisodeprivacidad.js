import React from "react"
import { navigate } from "gatsby"
import { inject, observer } from "mobx-react"
import { Button } from "primereact/button"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Item from "../components/item-profile"

const IndexPage = inject("RootStore")(
  observer(({ RootStore }) => {
    const store = RootStore.UserStore
    return (
      <Layout page="Aviso de Privacidad">
        <SEO title="Aviso de Privacidad" />
        <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
          <div className="p-col-12 p-md-9">
            <h1 className="title-page" style={{ paddingLeft: 0 }}>
              Aviso de Privacidad
            </h1>
          </div>

          {store.token && (
            <div className="p-col-12 p-md-3">
              <div className="p-grid p-justify-center">
                <Item color="#3eb978" icon="pi pi-user" store={store} />
              </div>
            </div>
          )}
        </div>
        <div className="p-grid p-align-center p-justify-center">
          <div className="p-col-12 p-md-10" style={{textAlign: "justify"}}>
            <h2 className="subtitle">Casa Bloom</h2>
            <h3>
              LE ROGAMOS LEA LAS PRESENTES CONDICIONES DEL USUARIO ATENTAMENTE
              ANTES DE USAR NUESTROS SERVICIOS BLM CYCLING STUDIO.
            </h3>
            El responsable de la protección de sus datos personales es BLM Cycling Studio según el Estudio de que se trate, con domicilio común ubicado enJorge Jimenez Cantu SN L8 complejo La Antigua 2, Bosque Esmeralda, 52938 Cd López Mateos, Méx. y puede contactarnos a través del número telefónico +52 55 8051 0715.
Sus datos personales serán utilizados para las siguientes finalidades: Proveer los servicios y productos requeridos por usted; Informar sobre cambios o nuevos productos o servicios que estén relacionados con el contratado o adquirido por el cliente; Dar cumplimiento a obligaciones contraídas con nuestros clientes; Evaluar la calidad del servicio, y Realizar estudios internos sobre hábitos de consumo.
Para las finalidades señaladas en el presente aviso de privacidad, podemos recabar sus datos personales de distintas formas, ya sea cuando usted nos los proporciona directamente; cuando visita nuestro sitio de Internet o utiliza nuestros servicios en línea, y cuando obtenemos información a través de otras fuentes que están permitidas por la ley. Son datos personales que recabamos de forma directa cuando usted mismo nos los proporciona por diversos medios, como cuando participa en nuestras promociones o nos da información con objeto de que le prestemos un servicio. Los datos que obtenemos por este medio pueden ser, entre otros: Nombre, domicilio, teléfono, género, y correo electrónico. Asimismo, en el caso de que el cliente opte por pagar los servicios que le presta el Estudio, a través de cargos recurrentes o pagos domiciliados se recabarán algunos datos financieros y bancarios. Le informamos que para cumplir con las finalidades previstas en este aviso de privacidad, serán recabados y tratados datos personales sensibles, como aquéllos que refieren a resultado de pruebas de rendimiento físico, peso, estatura, porcentaje de grasa corporal y masa muscular, alergias, posibles cardiopatías, padecimientos crónico degenerativos, padecimientos contagiosos, padecimientos neurológicos, padecimientos osteo-musculares, los derivados de investigaciones de entendimiento de la etiología de la obesidad en México y posibles factores de reversión, y en caso de aplicar, las limitantes fisiológicas que pudieran condicionar las actividades de acondicionamiento físico, así como la manifestación de consumo de cualquier suplemento alimenticio, multivitamínico, o cualquier otro medicamento que actúe en su rendimiento físico.
Nos comprometemos a que, dichos datos serán tratados bajo las más estrictas medidas de seguridad que garanticen su confidencialidad y su privacidad. De conformidad con lo que establece el artículo 9 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, en virtud de ello requerimos de su consentimiento expreso para el tratamiento de sus datos personales sensibles, por lo que le solicitamos indique si acepta o no el tratamiento de los mismos. Cabe mencionar que todos los datos personales generales antes reseñados son indispensables para que el Estudio pueda brindarle a sus clientes los servicios contratados, por lo que en caso de revocación del consentimiento o el ejercicio del derecho de cancelación
(Derechos ARCO) para el tratamiento de dichos datos dará lugar a la rescisión del contrato que haya celebrado con el Estudio, sin responsabilidad para este último.
Usted puede ejercer ante el Estudio, en cualquier momento, sus derechos de acceso, rectificación, cancelación y oposición al tratamiento de sus datos personales mediante solicitud por escrito que deberá ser enviada directamente al correo de contacto, donde recibirá el formato correspondiente.
Podemos transferir sus datos personales con sus empresas subsidiarias o filiales del mismo grupo empresarial para finalidades comerciales y de promoción sin incluir datos sensibles.</div>
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
