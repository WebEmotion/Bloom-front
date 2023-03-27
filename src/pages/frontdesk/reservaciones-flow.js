import React, { useEffect, useState } from 'react'
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"
import { inject, observer } from "mobx-react"
import { Planet } from "react-planet"
import { navigate } from "gatsby"
import { Button } from "primereact/button"

import Logo from "../../assets/images/flow-image-2.png"
import Tree from "../../assets/images/tree.png"
import * as SchedulesAPI from '../../api/v0/schedules'
import bici from "../../assets/images/icons8-camino-de-bicis-100.png"

const UserCircle = ({ image, name, lastname, seat }) => {
    if (name && image) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{margin: 0}}>{seat}</p>
                <img src={image} style={{ backgroundColor: '#00000055', width: 50, height: 50, borderRadius: '100%', objectFit: 'cover' }} />
                <p style={{ margin: 0, height: 20, whiteSpace: 'nowrap', maxWidth: 100, textOverflow: 'ellipsis', overflow: 'hidden' }}>{name}</p>
            </div>
        )
    } else if (name !== '') {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{margin: 0}}>{seat}</p>
                <img src='https://img.icons8.com/material-rounded/200/ffffff/user-male-circle.png' style={{ backgroundColor: '#E6CDB5', width: 50, height: 50, borderRadius: '100%' }} />
                <p style={{ margin: 0, height: 20, whiteSpace: 'nowrap', maxWidth: 100, textOverflow: 'ellipsis', overflow: 'hidden' }}>{name}</p>
            </div>
        )
    }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{margin: 0}}>{seat}</p>
            <img src={bici} style={{ backgroundColor: '#E6CDB5', width: 50, height: 50, borderRadius: '100%', padding: 5 }} />
            <p style={{ margin: 0 }}> </p>
        </div>
    )
}

const Reservaciones = inject("RootStore")(
    observer(({ RootStore }) => {
        const store = RootStore.UserStore
        const images = useStaticQuery(graphql`
        query {
          bloom: file(relativePath: { eq: "icons/logo-white.png" }) {
            childImageSharp {
              fluid(maxWidth: 800) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `)

        const [bookings, setBookings] = useState([])

        /*
            *Aqui se ejecuta 2 veces el servicio schedule
        */
        useEffect(() => {
            const load = async (id) => {
                const response = await SchedulesAPI.schedule(id)
                if (response.success) {
                    setBookings(response.data.Booking)
                }
            }
            const id = window.history.state?.id
            if (id) {
                load(id)
                const interval = setInterval(async () => {
                    load(id)
                }, 60000);
                return () => clearInterval(interval)
            } else {
            navigate("/frontdesk/lugares-flow")
            }
        }, [])

        const getUser = (id, seatNumber, seatLetter) => {
            let number = seatLetter + seatNumber.toString()

            for (var i in bookings) {
                const booking = bookings[i]
                //console.log(booking)
                if (booking.Seat.number === number) {
                    return booking.User
                }
            }
            return null
        }

        return (
            <div className="mapa-cycling-list">
                <div style={{position: 'fixed', top: 20, left: 20}}>
                    <Button icon="pi pi-times" className="p-button-rounded p-button-pink" onClick={() => {
                        navigate('/frontdesk/lugares-flow')
                    }} />
                </div>
                {/* marginTop normal (stage down), marginBottom for 180° (stage up) */}
                <div style={{ marginBottom: 500 }}>
                    <Planet
                        centerContent={
                            <div
                                style={{
                                    height: 50,
                                    width: 100,
                                    backgroundColor: "#E6CDB5",
                                    display: "none",
                                }}
                            />
                        }
                        open
                        autoClose={false}
                        orbitRadius={260}
                        //86 normal (stage down), 265 for 180° (stage up)
                        rotation={265}
                        orbitStyle={() => ({
                            border: "none",
                            zIndex: 0,
                            position: "absolute",
                            borderRadius: "100%",
                        })}
                    >
                        <h1 className="fila"></h1>
                        {
                            [9, 10, 11, 12, 13, 14, 15, 16].map(n => {
                                const user = getUser(n, n, "")
                                return <UserCircle seat={`${n}`} image={user ? user.pictureUrl : ''} name={user ? user.name : ''} />
                            })
                        }
                        <h1 className="fila"></h1>
                        {/* Number of divs is same userCircle number + 1 */}
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        
                    </Planet>
                    <Planet
                        centerContent={
                            <div>
                                <div
                                    style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: '100%',
                                    backgroundColor: "#E6CDB5",
                                    position: "absolute",
                                    transform: "translateX(-80px)",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#fff",
                                    textAlign: "center",
                                    justifyContent: "center",
                                    marginTop: "-80px",
                                    marginLeft: 20
                                    }}
                                >
                                    <div className="p-grid p-align-center p-justify-center">
                                    <div className="p-col-12">
                                        <p
                                        style={{
                                            marginBottom: 0,
                                            color: 'transparent'
                                        }}
                                        >
                                        Instructor
                                        </p>
                                    </div>
                                    <div className="p-col-8">
                                        <img
                                        style={{
                                            maxWidth: "100%",
                                            marginBottom: "0.5rem",
                                            marginTop: -30,
                                            marginRight: 30
                                        }}
                                        src={Logo}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: '100%',
                                    position: "absolute",
                                    transform: "translateX(-80px)",
                                    display: "flex",
                                    alignItems: "center",
                                    color: "#fff",
                                    textAlign: "center",
                                    justifyContent: "center",
                                    marginLeft: 20
                                    }}
                                >
                                    <div className="p-grid p-align-center p-justify-center">
                                        <div className="p-col-12">
                                            <p
                                            style={{
                                                marginBottom: 0,
                                                color: 'black'
                                            }}
                                            >
                                             Flow's Coach
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        open
                        autoClose={false}
                        orbitRadius={180}
                        //86 normal (stage down), 266 for 180° (stage up)
                        rotation={265}
                        orbitStyle={() => ({
                            border: "none",
                            zIndex: 0,
                            position: "absolute",
                            borderRadius: "100%",
                        })}
                    >
                        <h1 className="fila"></h1>
                        {
                            [1, 2, 3, 4, 5, 6, 7, 8].map(n => {
                                const user = getUser(n + 8, n)
                                return <UserCircle seat={`${n}`} image={user ? user.pictureUrl : ''} name={user ? user.name : ''} />
                            })
                        }
                        <h1 className="fila"></h1>
                        {/* Number of divs is same userCircle number + 1 */}
                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                                        <div></div>
                    </Planet>
                </div>
            </div>
        )
    })
)

export default Reservaciones