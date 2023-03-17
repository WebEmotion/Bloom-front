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
      <Layout page="Terminos y Condiciones">
        <SEO title="Terminos y Condiciones" />
        <div className="p-grid p-align-center" style={{ marginTop: "2rem" }}>
          <div className="p-col-12 p-md-9">
            <h1 className="title-page" style={{ paddingLeft: 0 }}>
              TERMINOS Y CONDICIONES DE USO
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
            <p>
              Estos Términos y Condiciones de Uso constituyen un Contrato de
              Adhesión entre usted y BML Cycling Studio (Casa Bloom),
              la cual es representada por Carla G Camarillo Santillán que es una
              persona física conforme a las leyes aplicables en México. Con
              domicilio para todo lo relativo a este contrato en Camino Rancho
              San Juan s/n Zona Esmeralda, Atizapán de Zaragoza, Estado de
              México, CP 52970.
            </p>
            <h3>¿QUÉ SERVICIOS PRESTA BML Cycling Studio?</h3>
            <p>
              BLM Cycling Studio ofrece a los Usuarios servicios que consisten
              en la realización por éstos de ejercicios de alto rendimiento,
              entre los cuales se encuentran, a manera de ejemplificar pero sin
              limitar: clases de yoga integral, barre fit, hiit, kentro, vinyasa
              flow, functional muscle, respira, cardio barre; así como
              ejercicios físicos mediante el uso de bicicletas fijas en las
              clases, horarios y locales de BLM Cycling Studio abiertos o que se
              abran en el Estado de México, y en servicios relacionados a dichas
              clases, incluyendo de asesoría en materia de acondicionamiento
              físico (“Servicio”).
            </p>
            <h3>SUSCRIPCIÓN DEL CONTRATO ENTRE PARTES</h3>
            <p>
              Para poder utilizar los Servicios, usted deberá de ingresar al
              “Sitio web” y/o directamente en el mostrador del correspondiente
              local y solicitar en el mismo el alta de su cuenta de usuario
              personal, siguiendo las instrucciones y proporcionando la
              información en el Sitio web requerido.
            </p>
            <p>
              Para hacer uso del Sitio web o cualquier otro producto o servicio
              vinculado a estos Términos y Condiciones, el usuario de nuestro
              servicio deberá haber aceptado estos Términos y Condiciones, así
              como nuestro Aviso de Privacidad que se presentará la primera vez
              se abra en el Sitio Web en la parte inferior.
            </p>
            <p>
              Le suplicamos que si no acepta los Términos y Condiciones del
              Servicio y/o el Aviso de Privacidad, no utilice los Servicios; al
              momento de crear una cuenta con nosotros y de hacer uso del Sitio
              web y de cualquier otro Servicio de BLM Cycling Studio usted
              expresamente consiente los Términos y Condiciones del Servicio,
              así como muestra su conformidad con el Aviso de Privacidad que
              hemos puesto a su consideración.
            </p>
            <p>
              Como cliente se debe aceptar las Condiciones de Cliente y conocer
              el presente documento. Dicha aceptación y firma se entenderá como
              el pleno consentimiento entre el cliente y BLM Cycling Studio para
              la celebración del presente contrato y por consiguiente la
              autorización de su cuenta personal con contraseña.
            </p>
            <p>
              El cliente se obliga a proporcionar la información bancaria y
              personal que BLM Cycling Studio considere relevante para la
              prestación correcta de nuestros servicios, mismos que estarán
              tratados bajo las disposiciones de la Ley Federal de Protección de
              Datos Personales en Posesión de los Particulares y de nuestro
              Aviso de Privacidad descrito posteriormente.
            </p>
            <p>
              Después de completar el registro, cada cliente tendrá una cuenta
              personal con contraseña a la cual se podrá acceder a través de la
              página Web. Cada cliente es responsable de la confidencialidad de
              su cuenta. El cliente acepta y tiene pleno consentimiento que las
              autorizaciones y contrataciones de servicios que se realicen bajo
              dicho nombre y contraseña se entenderán hechas por parte del
              mismo.
            </p>
            <p>
              Usted es el único responsable del manejo de su contraseña y de
              mantenerla confidencial. Usted acepta y reconoce que las
              autorizaciones, contrataciones de Servicios y consentimientos que
              se realicen utilizando su nombre de usuario y contraseña se
              entenderán hechas por usted en lo personal y como consentimiento
              expreso de su parte. Por lo anterior le recomendamos no revelar a
              persona alguna su nombre de usuario y/o contraseña. BLM Cycling
              Studio no será responsable por el uso inadecuado, o los cargos que
              se realicen en su tarjeta de crédito u otro medio de pago que haya
              proporcionado a través del uso de su nombre de usuario y
              contraseña.
            </p>
            <h3>¿CÓMO INSCRIBIRME A LAS CLASES?</h3>
            <p>
              Al ingresar al Sitio Web con su cuenta de usuario y contraseña,
              BLM Cycling Studio le permitirá apartar un cupo dentro de las
              clases que se encuentren disponibles en el sistema, al momento en
              que usted indique qué clase desee tomar, usted estará en la lista
              de asistentes a dicha clase.
            </p>
            <p>
              En el momento en que usted indique y solicite se le aparte un cupo
              dentro de dicha clase usted estará confirmando su asistencia a la
              misma y por lo tanto, usted autoriza a BLM Cycling Studio para que
              realice el cargo automático a la tarjeta de crédito o medio de
              pago electrónico que usted proporcionó a BLM Cycling Studio al
              momento de crear su cuenta de usuario, por concepto de la clase a
              la que usted asista.
            </p>
            <h3>USO DEL SITIO WEB O EL SERVICIO</h3>
            <p>
              Usted deberá garantizar que la información proporcionada a BLM
              Cycling Studio es completa y veraz. BLM Cycling Studio tendrá
              derecho, en todo momento, a comprobar la veracidad de la
              información facilitada.
            </p>
            <p>
              Es su responsabilidad asegurarse de ingresar al “Sitio Web”
              correcto. BLM Cycling Studio no será responsable si no ingresa al
              “Sitio Web” correcto. BLM Cycling Studio se reserva el derecho a
              limitar, restringir o incluso prohibir su ingreso al sistema del
              Sitio Web con su nombre de usuario y contraseña al “Sitio Web”.
              Asimismo, BLM Cycling Studio se reserva el derecho de limitar,
              restringir o prohibir en cualquier momento que usted utilice sus
              Servicios, por cualquier causa y sin necesidad de justificarlo. Al
              utilizar los Servicios, usted acuerda y consiente que:
            </p>
            <ol>
              <li>
                Sólo utilizará los Servicios exclusivamente de manera personal,
                por lo que no podrá ceder sus espacios en clases u otros
                Servicios en favor de terceros;
              </li>
              <li>No autorizará a otros a usar su cuenta;</li>
              <li>
                No utilizará una cuenta que esté sujeta a cualquier derecho de
                una persona que no sea usted sin la autorización adecuada;
              </li>
              <li>
                No utilizará los Servicios con fines ilícitos, incluyendo, sin
                limitación, para enviar o almacenar ningún material ilegal o con
                fines fraudulentos;
              </li>
              <li>
                No utilizará los Servicios para causar molestias, trastornos o
                inconvenientes;
              </li>
              <li>No perjudicará el funcionamiento adecuado de la red;</li>
              <li>No tratará de dañar los Servicios de ningún modo;</li>
              <li>
                No copiará ni distribuirá ningún contenido o Servicios de BLM
                Cycling Studio sin el permiso escrito de BLM Cycling Studio;
              </li>
              <li>
                Guardará de forma segura y confidencial la contraseña de su
                cuenta y cualquier identificación facilitada para permitirle
                acceder al Servicio”;
              </li>
              <li>
                Nos facilitará toda las pruebas de identidad que le solicitamos
                razonablemente de tiempo en tiempo;
              </li>
              <li>
                Cumplirá con toda la legislación y normas aplicables al usar los
                Servicios.
              </li>
              <li>
                Mantendrá una buena conducta y será respetuoso con las demás
                personas que utilicen los Servicios.
              </li>
              <li>
                Se obliga a respetar y cumplir los reglamentos que BLM Cycling
                Studio emita en relación con los Servicios.
              </li>
            </ol>
            <p>
              BLM Cycling Studio se reserva el derecho a terminar en cualquier
              momento y de manera inmediata sin necesidad de declaración
              judicial los Servicios objeto de las presentes Condiciones del
              Usuario, en caso de que el Usuario incumpla con cualquiera de las
              normas anteriores.
            </p>
            <h3>PAGO</h3>
            <p>
              El uso de la página web será gratuito; sin embargo, una vez
              suscrito a nuestro Servicio podrá encontrar información sobre las
              tarifas aplicables para los Servicios.
            </p>
            <p>
              BLM Cycling Studio podrá modificar o actualizar las mismas
              ocasionalmente, sin necesidad de previo aviso. Será su
              responsabilidad mantenerse informado sobre las tarifas actuales
              para disfrutar y contratar los Servicios, por su parte BLM Cycling
              Studio le cobrará por los Servicios que usted elija.
            </p>
            <p>
              Usted acuerda pagar todos los Servicios que solicite (con
              independencia de si los utiliza o asiste a las clases), mediante
              cargo automático a tarjeta de crédito o medio de pago electrónico
              que usted haya proporcionado a través de la página web. El costo
              de los Servicios causa Impuesto al Valor Agregado. En todo caso,
              usted será responsable del pago puntual de todos los Servicios que
              solicite.
            </p>
            <p>
              Los pagos y cargos realizados no son reembolsables. BLM Cycling
              Studio podrá utilizar procesadores de pagos de terceros
              (“Procesador de Pago”) para vincular su tarjeta de crédito o el
              medio de pago electrónico que nos proporcione a su nombre de
              usuario y contraseña. El procesamiento de pagos, con respecto al
              uso que haga de los Servicios estará sujeto a las condiciones y
              políticas de privacidad del Procesador del Pago y el emisor de su
              tarjeta de crédito además de a estos Términos y Condiciones del
              Servicio. BLM Cycling Studio no será responsable de ningún error
              del Procesador de Pago. En relación con el uso de los Servicios,
              BLM Cycling Studio obtendrá determinados datos de la transacción,
              que BLM Cycling Studio utilizará únicamente de conformidad al
              Aviso de Privacidad de BLM Cycling Studio.
            </p>

            <h3>INDEMNIZACIÓN</h3>
            <p>
              Al aceptar estos Términos y Condiciones, el cliente acuerda y
              libera a BLM Cycling Studio de toda y cualquier responsabilidad.
              Se obliga a indemnizar y mantener indemne a BLM Cycling Studio,
              así como todos sus representantes, instructores, directivos,
              trabajadores y asesores independientes de cualquier reclamación,
              pérdida de cualquier tipo, responsabilidad, gasto o trámite legal
              y/o juicio.
            </p>
            <p>
              Este mismo rubro aplica para eventos dentro y fuera de nuestras
              instalaciones, liberando a la empresa BLM Cycling Studio y a la
              empresa encargada de la ubicación de cualquier responsabilidad,
              aceptando los riesgos naturales que esta actividad con lleve.
            </p>
            <h3>RESPONSABILIDAD</h3>
            <p>
              BLM Cycling Studio buscará mantener la página de internet lo más
              actualizada posible y de manera correcta, aunque no puede
              garantizar que la página o servidor carezca de errores, defectos o
              algún problema en el servidor. El uso correcto de los servicios
              prestados por BLM Cycling Studio y de la página Web depende del
              cliente en su totalidad.
            </p>
            <p>
              La información, recomendaciones u otros servicios prestados a
              través del “Sitio web” y o por el uso de los Servicios, son sólo
              información general y no constituyen un aviso. BLM Cycling Studio
              no será responsable por los daños derivados del uso de (o
              incapacidad de usar) los medios de comunicación electrónicos con
              la “página web”, incluyendo sin limitación daños derivados del
              fallo o retraso en la entrega de comunicaciones electrónicas,
              intercepción o manipulación de comunicaciones electrónicas por
              terceros o por programas informáticos usados para comunicaciones
              electrónicas y transmisión de virus.
            </p>
            <h3>VIGENCIA Y FINALIZACIÓN DEL CONTRATO.</h3>
            <p>
              Se suscribe el presente Contrato entre BLM Cycling Studio y usted
              por un periodo indefinido y durante el tiempo que usted utilice y
              acceda a la página web. Usted y BLM Cycling Studio tendrán derecho
              a finalizar el Contrato en todo momento, siempre y cuando usted
              mediante escrito libre solicite a BLM Cycling Studio deshabilite
              su nombre de usuario de la página web. BLM Cycling Studio tendrá
              derecho a terminar el Contrato en todo momento y con efecto
              inmediato (deshabilitando el uso del Servicio) si usted: • Viola o
              incumple cualquier condición de las presentes Condiciones del
              Usuario, o • A consideración de BLM Cycling Studio, hace un uso
              indebido de la página web o los Servicios. BLM Cycling Studio no
              estará obligado a dar un aviso previo de la terminación del
              Contrato. Después de su terminación BLM Cycling Studio avisará de
              ello con arreglo a las presentes Condiciones del Usuario.
            </p>
            <h3>MODIFICACIÓN DE LOS SERVICIOS Y LAS CONDICIONES DEL USUARIO</h3>
            <p>
              BLM Cycling Studio se reserva el derecho de modificar de manera
              discrecional cualquiera de los presentes términos y condiciones,
              así como cambiar, suspender o interrumpir la prestación de
              servicios a los clientes mediante un correo electrónico y/o la
              interrupción de su ingreso a la página de internet.
            </p>
            <p>
              Es obligación del cliente proporcionar una cuenta de correo
              electrónico activa para recibir notificaciones, avisos y cambios
              así como reservaciones o bajas dentro del sistema.
            </p>
            <h3>NOTIFICACIONES</h3>
            <p>
              BLM Cycling Studio podrá emitir notificaciones o avisos a usted a
              través de un aviso general por correo electrónico a la dirección
              registrada en la información de la cuenta de BLM Cycling Studio, o
              mediante una comunicación escrita enviada por correo ordinario a
              la dirección registrada en la información de la cuenta de BLM
              Cycling Studio.
            </p>
            <p>
              Asimismo, podrá recibir notificaciones constantes sobre
              actualizaciones de los servicios contratados siempre y cuando
              usted acepte lo anterior cuando la página le sugiere la
              posibilidad.
            </p>
            <h3>JURISDICCIÓN Y LEY APLICABLE</h3>
            <p>
              Las partes están de acuerdo en que el presente Contrato se regirá
              por las leyes aplicables vigentes en el Estado de México. Para la
              interpretación y cumplimiento del Contrato, las partes se someten
              a la jurisdicción de los tribunales competentes en el Estado de
              México, Ciudad de México, renunciando expresamente a cualquier
              otro fuero que pudiera corresponderles por razón de sus domicilios
              presentes o futuros o por cualquier otra causa.
            </p>
            <h3>
              ACEPTACIÓN DE RIESGO, RENUNCIA Y LIBERACIÓN DE RESPONSABILIDAD
            </h3>
            <p>
              Mediante la inscripción a BLM Cycling Studio y/o asistiendo a
              clases, eventos, actividades y otros programas y el uso de las
              instalaciones y el equipo (“Clases” y/o “Instalaciones”) de BLM
              Cycling Studio, por la presente reconozco que existen ciertos
              riesgos y peligros inherentes al uso y práctica de cualquier
              ejercicio físico y en específico pero sin limita; a la práctica y
              uso de bicicletas fijas, durante las Clases que se imparten en BLM
              Cycling Studio. También reconozco que los riesgos específicos
              varían de una actividad a otra, mismos que podrían ser (a)
              lesiones menores como: (1) rasguños; y (2) golpes y torceduras;
              (b) lesiones mayores como (1) lesiones en las articulaciones o la
              espalda; (2) ataques cardíacos; y (3) contusiones; y (c) lesiones
              graves, incluyendo parálisis, y muerte por lo que expresamente
              reconozco y acepto que dichos riesgos no pueden ser eliminados por
              BLM Cycling Studio y que dependen de usted al realizarlos, por lo
              cual recomendamos ampliamente que cuando realice actividad física
              sea conforme a su capacidad para llevarla a cabo, y estando en
              perfectas condiciones físicas para practicar las actividades que
              BLM Cycling Studio pone a su alcance. He leído y entendido
              completamente el reglamento interno de BLM Cycling Studio, mismos
              que se publican en el Sitio Web de BLM Cycling Studio
              (www.bloomcycling.com.mx) y el cual se encuentra a disposición de
              todos los usuarios en cada sucursal BLM Cycling Studio al pedirlo
              en recepción.
            </p>
            <p>
              Me comprometo a cumplir con todos los Términos y Condiciones
              establecidos en dichos documentos, así como las instrucciones que
              de tiempo en tiempo el personal de BLM Cycling Studio me
              proporcione durante el desarrollo de las Clases, o en su caso, con
              las instrucciones que BLM Cycling Studio ponga en el
              establecimiento donde se lleven a cabo las Clases. Si en cualquier
              momento, el personal de BLM Cycling Studio me sugiere y me indica
              que no podré llevar a cabo cualesquiera de las Clases que BLM
              Cycling Studio imparte acataré dicha instrucción. Lo anterior,
              basado en la opinión del personal de BLM Cycling Studio quienes
              reconozco están debidamente capacitados para emitir dicha opinión,
              por lo que entiendo y acepto que dicha opinión siempre será en mi
              beneficio y en cuidado de mi salud. En relación con lo anterior,
              en caso que BLM Cycling Studio me permita tomar las Clases (i)
              asumo plena responsabilidad por cualquier y todas las lesiones o
              daños que sufra (incluso muerte) durante o derivado de las Clases,
              (ii) libero a BLM Cycling Studio y sus subsidiarias, y cada uno de
              sus socios, accionistas, consejeros, funcionarios, directores,
              empleados, representantes y agentes, y cada uno de sus respectivos
              sucesores y cesionarios de cualquier y toda responsabilidad,
              reclamaciones, acciones, demandas, procedimientos, costos, gastos,
              daños y pasivos; y (iii) manifiesto que al día de la presente (a)
              no tengo ningún impedimento médico o condición física que me
              impida tomar las clases o usar correctamente los aparatos mediante
              los cual se llevan a cabo las Clases; (b) no tengo una condición
              física o mental que me ponga peligro médico y físico; y (c) no
              tengo instrucciones médicas que me limiten o restrinjan realizar
              cualquier tipo de actividad física.
            </p>
            <p>
              Reconozco que si tengo alguna discapacidad o enfermedad crónica,
              estoy en riesgo al hacer uso de las instalaciones y acudir a las
              Clases, y que no debería de participar en cualquiera de las
              Clases.
            </p>
            <p>
              He leído esta declaratoria de aceptación de riesgo, renuncia y
              liberación de responsabilidad, y deslindo de toda responsabilidad,
              obligándome a sacar en paz y a salvo a BLM Cycling Studio y/o a
              todas sus subsidiaras, y a cada uno de sus socios, accionistas,
              consejeros, funcionarios, directores, empleados representantes y
              agentes respecto de toda acción, demanda, responsabilidad de
              carácter civil o penal derivado de cualquier contingencia,
              accidente, daño, o cualquier tipo de lesión, enfermedad,
              fracturas, incapacidad parcial o permanente y/o la muerte que
              pudiera sufrir el que suscribe por el uso de las Instalaciones BLM
              Cycling Studio y/o por las Clases que tome. Reconozco que estoy
              firmando el presente de manera libre y voluntariamente y que la
              vigencia de esta renuncia es indefinida por lo que continuará
              válida y vigente durante el tiempo que acuda a las Instalaciones
              y/o toma clases de BLM Cycling Studio.
            </p>
            <h3>
              ACEPTACIÓN Y CONSENTIMIENTO DE USO DE IMAGEN BLM Cycling Studio
              CLASES EN VIVO
            </h3>
            <ol>
              <li>
                1. Usted reconoce y autoriza que BLM Cycling Studio pueda hacer
                uso de cualquier medio donde aparezca su imagen y/o voz, que
                haya sido creada o tomada durante cualquiera de las clases de
                BLM Cycling Studio, incluyendo, la fijación, incorporación y/o
                sincronización de los videos o sus medios de promoción, por
                cualquier medio y bajo cualquier forma, y la explotación de
                manera no independiente y en consonancia con el Proyecto, en
                todo el mundo, hasta el paso de los derechos a dominio público,
                a través de cualquier formato y modalidad de explotación.
              </li>
              <li>
                2. Usted renuncia a cualquier derecho que pudiera corresponder
                en relación con inspección o aprobación de la versión final de
                las imágenes, copias para publicidad, textos, o cualquier otro
                elemento impreso o electrónico que pudiera usarse o las imágenes
                que pudieran ser incluidas.
              </li>
              <li>
                3. Al momento de comprar la clase y asistir a la misma usted
                libera a BLM Cycling Studio, así como a sus representantes,
                empleados, o cualquier persona, empresa o empresas que estén
                actuando en su nombre, incluyendo cualquier firma, despacho, o
                empresa encargada de la publicidad o distribución del producto
                final, todo o en parte, de cualquier responsabilidad que resulte
                de cualquier distorsión, imagen borrosa, o alteración, ilusiones
                ópticas o cualquier otra que pudiera resultar del proceso de
                reproducción del producto final, su publicación o distribución,
                aun cuando dicha situación pudiera representar una disociación,
                escándalo, reprobación, engaño o indignación.
              </li>
            </ol>
            <h3>VALORES Y BIENES PERSONALES:</h3>
            <p>
              BLM Cycling Studio no será responsable por la pérdida, robo, o
              daños a cualquier objeto, incluyendo artículos dejados en
              casilleros, baños, estudios, o cualquier otro lugar en las
              instalaciones. Asimismo, acepto y reconozco que BLM Cycling Studio
              se reserva el derecho a denegar el acceso a cualquier persona que
              BLM Cycling Studio considere que esté actuando de manera
              inadecuada o que pongan en riesgo su salud o la salud de los
              clientes.
            </p>
            <p>
              <strong>
                ¿Para qué fines utilizaremos sus datos personales?
              </strong>
            </p>
            <p>
              Los datos personales que BLM Cycling Studio recaba y solicita de
              usted, serán utilizados para las siguientes finalidades, las
              cuales son necesarias para el servicio que ofrece BLM Cycling
              Studio y el correcto funcionamiento de la página web.
            </p>
            <ol>
              <li>
                Acceder a la plataforma y servicios que ofrece BLM Cycling
                Studio.
              </li>
              <li>Poder navegar y utilizar la plataforma.</li>
              <li>
                Agendar y pagar por las clases que ofrece BLM Cycling Studio.
              </li>
              <li>
                Prestar el servicio de la clase seleccionada conforme a su
                solicitud y pago.
              </li>
              <li>
                Poner a su disposición la opción de compartir con sus amigos la
                ubicación de las clases agendadas y en tiempo real.
              </li>
              <li>Video-grabar las clases en vivo.</li>
            </ol>
            <p>1.- Datos Personales tratados y transparencia.</p>
            <p>
              Los datos personales generales que recopilamos de nuestros
              clientes son: nombre completo, teléfono, género y correo
              electrónico.
            </p>
            <p>
              Asimismo, para garantizar que las actividades de acondicionamiento
              físico que realice en las instalaciones de BLM Cycling Studio sean
              las adecuadas a su estado de salud, BLM Cycling Studio podrá
              recabar los siguientes datos personales sensibles: resultado de
              pruebas de rendimiento físico, peso, estatura, porcentaje de grasa
              corporal y masa muscular, alergias, posibles cardiopatías,
              padecimientos crónico degenerativos, padecimientos contagiosos,
              padecimientos neurológicos, padecimientos osteo-musculares, los
              derivados de investigaciones de entendimiento de la etiología de
              la obesidad en México y posibles factores de reversión, y en caso
              de aplicar, las limitantes fisiológicas que pudieran condicionar
              las actividades de acondicionamiento físico. Cabe mencionar que
              todos los datos personales generales antes reseñados son
              indispensables para que BLM Cycling Studio pueda brindarle a sus
              clientes los servicios contratados, por lo que en caso de
              revocación del consentimiento o el ejercicio del derecho de
              cancelación para el tratamiento de dichos datos personales
              sensibles dará lugar a la rescisión del contrato que tenga
              celebrado con BLM Cycling Studio sin responsabilidad para este
              último, lo anterior derivado de la importancia que BLM Cycling
              Studio da a prestar un servicio adecuado y personalizado para cada
              uno de los usuarios, siendo fundamental velar por la salud de las
              personas que realizan actividades de acondicionamiento físico en
              nuestras instalaciones.
            </p>
            <p>
              Imagen. Podemos capturar su imagen visual, semejanza y grabación
              de voz (por ejemplo, a través de fotografías y/o videos) si visita
              nuestros estudios que video-graben las clases usted acepta que
              participará en las clases en vivo BLM Cycling Studio.
            </p>
            <p>
              2.- Finalidades del tratamiento: Sus datos personales son
              utilizados (tratados) para las siguientes finalidades:
            </p>
            <p>
              (i) suscripción del contrato, (ii) identificación y verificación;
              (iii) contacto; (iv) identificación al momento de acceso a las
              instalaciones; y (v) conocimiento de su estudio general de salud.
              Para el caso de los datos personales sensibles, estos serán
              utilizados únicamente para las siguientes finalidades: (i) para
              hacer recomendaciones del acondicionamiento físico apropiado para
              usted; (ii) para el correcto manejo de alguna situación de
              emergencia que requiera de la información con que cuenta BLM
              Cycling Studio sobre su estado de salud. Asimismo, sus datos
              personales serán utilizados las siguientes finalidades comerciales
              y de promoción: (i) para enviarle información relativa a nuestros
              productos o servicios, (ii) realizar encuestas sobre la calidad de
              nuestros servicios; (iii) para enviarle ofertas y promociones de
              BLM Cycling Studio como de las empresas filiales; y/o (iv)
              promoción de sorteos, eventos y trivias organizadas por BLM
              Cycling Studio o sus empresas subsidiarias y afiliadas.
            </p>
            <p>
              La negativa para el uso de sus datos personales para estas
              finalidades no podrá ser un motivo para que le neguemos los
              servicios que ofrece BLM Cycling Studio, y de conformidad con la
              Ley, contará con un plazo de cinco días hábiles para manifestarla.
            </p>
            <p>
              Existirá la posibilidad de acudir a clases de BLM Cycling Studio
              donde se le avise que dicha clase será video-grabada para
              reproducirse en BLM Cycling Studio clases en vivo, en el entendido
              de que podremos captar su imagen propia y/o voz durante la sesión
              impartida.
            </p>
            <p>
              En caso de comprar clases que sean video grabadas usted acepta,
              autoriza y renuncia a los derechos que pudiera tener sobre dichas
              grabaciones. En caso de que usted no desee ser video-grabado le
              sugerimos que no compre clases en el estudio que tenga la
              modalidad de video-grabación para BLM Cycling Studio clases en
              vivo.
            </p>
            <p>
              Su imagen podrá ser captada como parte de un cuadro general, nunca
              será grabado de forma protagónica.
            </p>
            <p>
              Usted tendrá conocimiento de las clases que se video-graben para
              BLM Cycling Studio clases en vivo.
            </p>
            <p>
              3.- Mecanismos de Seguridad para garantizar el correcto resguardo
              de sus datos personales y para dar pleno cumplimiento a las
              obligaciones que la LFPDPPP (Ley Federal de Protección de Datos
              Personales en Posesión de Particulares) establece en la materia,
              se le informa que BLM Cycling Studio tiene implementadas las
              medidas de seguridad administrativas, técnicas y físicas
              necesarias y suficientes para la correcta protección de los datos.
            </p>
            <p>
              4.- Revocación del Consentimiento Usted podrá revocar en cualquier
              momento su consentimiento para el tratamiento que BLM Cycling
              Studio hace de sus datos personales por medio de un documento que
              deberá presentar por escrito directamente en nuestras
              instalaciones de BLM Cycling Studio o en hola@bloomcycling.com.mx
              misma que deberá contener por lo menos : (a) nombre u otro medio
              para comunicarle la respuesta a su solicitud; (b) los documentos
              que acrediten su identidad; (c) la descripción clara y precisa de
              los datos personales respecto de los que revoca su consentimiento
              para el tratamiento, (d) la manifestación expresa para revocar su
              consentimiento al tratamiento de sus datos personales y por tanto,
              para que no se suspenda su uso; y (e) cualquier otro elemento que
              facilite la localización de los datos personales.
            </p>
            <p>
              5.- Aviso de Privacidad, BLM Cycling Studio no realizará ningún
              tipo de transferencia con sus empresas subsidiarias o filiales ni
              con cualquier otro tercero. En ningún caso BLM Cycling Studio
              transferirá los datos personales de sus clientes a un tercero,
              diferente a las empresas subsidiarias o filiales descritas en el
              punto anterior, sin el consentimiento previo de los titulares.
            </p>
            <p>
              6.- Cambios al Aviso de Privacidad BLM Cycling Studio se reserva
              el derecho de cambiar el contenido del presente Aviso de
              Privacidad en cualquier momento. En caso de que exista algún
              cambio en este Aviso de Privacidad, se le comunicará a través de
              nuestro portal de internet www.bloomcycling.com.mx, y/o por correo
              electrónico.
            </p>
            <p>
              Tenga en cuenta que cualquier información que otorgue a BLM
              Cycling Studio en chat rooms, foros, recuadros de mensajes de
              opinión, comentarios y noticias, así como los datos personales que
              Usted revele en estas áreas públicas se volverán información
              pública y Usted debe tener cuidado cuando decida revelar cualquier
              información en dichas situaciones.
            </p>

            <h3>¿Cómo mantenemos sus datos seguros?</h3>
            <p>
              BLM Cycling Studio tiene medidas de seguridad en el lugar para
              proteger contra la pérdida, mal uso y alteración de la información
              bajo el control de BLM Cycling Studio. Solamente empleados
              autorizados, agentes y contratistas (que han acordado mantener la
              información segura y confidencial) tienen acceso a esta
              información.
            </p>
            <p>
              Todos los boletines de noticias que envía BLM Cycling Studio le
              otorgan la opción de no recibir más correos electrónicos, a
              excepción de los mensajes de correo electrónico de servicios, que
              son una parte integral de nuestro servicio, tales como las
              confirmaciones de órdenes de contratación del servicio, correos
              electrónicos de facturas y avisos a los clientes, tales como las
              relativas a la gestión de datos y propósitos similares. Utilizamos
              las medidas de seguridad física, electrónica y de gestión para
              tratar de evitar que a los datos personales no tengan acceso
              personas no autorizadas, y para asegurarnos de que los datos
              personales que proporciona, se gestionen de forma segura. Esto
              significa que a veces podemos solicitar una prueba de identidad
              antes de revelar datos personales a Usted. Sólo las estadísticas
              globales sobre el número de usuarios y sus patrones de tráfico se
              darán a los anunciantes.
            </p>
            <p>
              A pesar de estos esfuerzos, BLM Cycling Studio no puede garantizar
              que un tercero (hacker) no obtenga acceso a las comunicaciones
              entre los clientes, de BLM Cycling Studioo entre los usuarios y
              BLM Cycling Studio, en dado caso, y conforme al artículo 20 de la
              Ley Federal de Protección de Datos Personales en Posesión de
              Particulares, BLM Cycling Studio le avisará de forma inmediata, en
              la medida de lo posible, sobre esta violación a la seguridad.
            </p>
            <p>
              Si usted considera que su derecho a la protección de sus datos
              personales ha sido lesionado por alguna conducta u omisión de
              nuestra parte, o presume alguna violación a las disposiciones
              previstas en la Ley Federal de Protección de Datos Personales en
              Posesión de los Particulares, su Reglamento y demás ordenamientos
              aplicables, podrá interponer su inconformidad o denuncia ante el
              Instituto Federal de Acceso a la Información y Protección de Datos
              (IFAI). Para mayor información, le sugerimos visitar su página
              oficial de Internet www.ifai.org.mx.
            </p>
            <h3 style={{ textAlign: "center" }}>Reglamento</h3>
            <ul>
              <li>Llegar 15 minutos antes de tu clase.</li>
              <li>
                Se tiene 10 minutos de tolerancia desde que comienza la clase,
                una vez transcurrido ese tiempo no podrás entrar.
              </li>
              <li>
                Si llegas después de que se coloque el letrero de clase cerrada
                alguien más puede tomar tu lugar.
              </li>
              <li>
                No usar flash ni luz al momento de tomar una foto o video
                durante la clase esto solo si la clase es indoor.
              </li>
              <li>
                Puedes cancelar tu clase 12 horas antes para no perderla. Lo
                puedes hacer en la página web, Front Desk o mandando DM a
                nuestro instagram @bloom.cycling con 14 horas de anticipación.
              </li>
              <li>Nos reservamos el derecho de admisión</li>
              <li>
                Se cotejará por medio de una identificación oficial, el nombre
                de la persona que reservó vía página web contra la persona que
                asiste a la clase.
              </li>
              <li>
                No nos hacemos responsables del robo, daño o extravío de
                pertenencias personales de ninguna clase.
              </li>
              <li>
                Blm Cycling Studio está dentro de propiedad privada por lo que
                si usted viola con el reglamento o el personal considera que
                está interrumpiendo la clase se le podrá expulsar de las
                instalaciones de Los Alamares.
              </li>
              <li>
                El uso de cubrebocas es obligatorio en todo momento, exceptuando
                al estar tomando la clase.
              </li>
              <li>
                Se le tomara la temperatura al llegar y se le aplicará gel
                antibacterial
              </li>
            </ul>

            <p>
              *Cualquier persona que no acate el reglamento podrá ser expulsada
              de las instalaciones*{" "}
            </p>
            <h3 style={{ textAlign: "center" }}>Preguntas Frecuentes</h3>
            <h4>Pagos</h4>
            <ul>
              <li>
                <strong>¿Cómo puedo pagar las clases?</strong>
                <p>
                  - Estamos trabajando en nuestro sistema de cobro en línea por
                  lo que será necesario pagar en front desk con tarjeta de
                  crédito, débito o efectivo y ahí mismo daremos de alta tu
                  cuenta para que puedas utilizarla.
                </p>
              </li>
              <li>
                <strong> ¿Expiran las clases pagadas?</strong>
                <p>- Si, dependiendo del paquete de clases que adquieras.</p>
              </li>
            </ul>
            <h4>Reservaciones</h4>
            <ul>
              <li>
                <strong> ¿Cómo puedo reservar una bicicleta? </strong>
                <p>
                  - A través de nuestra página web y en las instalaciones de BLM
                  Cycling Studio.{" "}
                </p>
              </li>
              <li>
                <strong> ¿Cuál es la política de cancelación? </strong>
                <p>
                  - Contamos con una política de cancelación de 12 horas previas
                  a la clase, sin ninguna penalidad. Las clases reservadas se
                  podrán volver a usar para reservar posteriormente, siempre y
                  cuando no esté vencido tu paquete; una vez pasando las 12
                  horas no se podrá cancelar la clase.{" "}
                </p>
              </li>
              <li>
                <strong> ¿Si llego tarde? </strong>
                <p>
                  - Tenemos una política de no dejar ingresar al usuario a la
                  clase después de 10 minutos de haber iniciado la sesión ya que
                  para nosotros el tiempo de todos se tiene que respetar.{" "}
                </p>
              </li>
            </ul>
            <h4>En Clase</h4>
            <ul>
              <li>
                <strong>¿Puedo usar cualquier tipo de tenis? </strong>
                <p>
                  Nuestras bicicletas pueden usarse con tenis normales pero no
                  es lo más recomendable, entendemos la situación de pandemia y
                  sabemos que muchos usuarios prefieren usar sus tenis por lo
                  que lo permitimos sólo si el usuario lo pide.
                </p>
                <p>
                  Por otro lado contamos con tenis en front desk y están sujetos
                  a disponibilidad
                </p>
              </li>
              <li>
                <strong>¿Puedo tomar clases si estoy embarazada?</strong>
                <p>
                  Recomendamos preguntar a tu médico antes de venir a rodar.{" "}
                </p>
              </li>
              <li>
                <strong>¿Existen restricciones de estatura?</strong>
                <p>
                  Sí, 1.30 mts de altura ya que es la estatura mínima que
                  nuestras bicis se pueden ajustar.
                </p>
              </li>
              <li>
                <strong>¿Puedo salir antes de que termine la clase?</strong>
                <p>
                  Si, ya que sabemos que pueden surgir imprevistos durante la
                  clase; si ya sabes que saldrás antes de la clase te pedimos
                  que te acerques a tu coach y le menciones antes de comenzar la
                  clase que tienes que salir con anticipación.
                </p>
              </li>
              <li>
                <strong>¿Qué tengo que llevar a la clase?</strong>
                <p>
                  Cubrebocas, tenis (si es que cuentas con ellos), toalla, agua
                  y mucha actitud.
                </p>
              </li>
              <li>
                <strong>¿Tienen algún control de limpieza?</strong>
                <p>
                  Si, al llegar se te pide que pases por nuestro tapete
                  sanitizante, se te aplicará gel antibacterial, las bicicletas
                  son limpiadas por nuestro personal después de cada clase así
                  como las mancuernas y los tenis.
                </p>
              </li>
            </ul>
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
