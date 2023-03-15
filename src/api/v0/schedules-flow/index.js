import fetch from 'node-fetch'
import { FaGalacticSenate } from 'react-icons/fa'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const schedule = async (id) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const deleteScheduleAdmin = async (id, token, free) => {
    try {
        const body = {
            discountClass: !free
        }
        const response = await fetch(`${Constants.API.BASE_URL}/bookings-flow/admin/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify(body)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const assistance = async (token, id) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/assistance/${id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const deleteSchedule = async (id, token) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/bookings-flow/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const searchBookingClient = async (token, id, query) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/bookings-flow/search/${id}/${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const getBookingClient = async (token, id, page) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/bookings-flow/client/${id}?page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const createBooking = async (token, schedule, seat, client, isPass) => {
    try {
        const body = {
            isPass
        }
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/${schedule}/seat/${seat}/client/${client}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const createBookingClient = async (token, schedule, seat, isPass) => {
    try {
        const body = {
            isPass
        }
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/${schedule}/seat/${seat}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const createBookingGroup = async (token, schedule, seat, client) => {
    try {
        const body = {
            isPass: false
        }
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/${schedule}/seat/${seat}/client/${client}/member`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const createBookingGroupAdmin = async (token, schedule, seat, client) => {
    try {
        const body = {
            isPass: false,
            client_id: client
        }
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/${schedule}/seat/${seat}/member`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const getBookingListAdmin = async (token, id) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/bookings-flow/list/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const getAllSchedules = async (token, page) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/locations/schedules-flow/all/?page=${page}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const searchOnAllSchedules = async (token, query) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/search/${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const getAllSchedulesInstructor = async (token, date) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/locations/instructor/all`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            },
            body: JSON.stringify({ start: date })
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const createSchedule = async (token, date, start, end, instructor, room, theme, isPrivate) => {
    try {
        let body = {
            date,
            start,
            end,
            instructor_id: instructor,
            roomsId: room,
            isPrivate
        }
        if (theme) body.theme = theme
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/create`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

// HECHO POR ANDRES
export const removeSchedule = async (id, token) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token,
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}

export const updateSchedule = async (token, id, date, start, end, instructor, theme, room, sendEmail, freeSeats, isPrivate) => {
    try {
        const body = {
            id,
            sendEmail,
            deleteBookings: freeSeats,
            isPrivate
        }
        if (date) body['date'] = date
        if (start) body['start'] = start
        if (end) body['end'] = end
        if (room) body['roomsId'] = room
        if (theme) body['theme'] = theme
        if (instructor) body['instructor_id'] = instructor
        const response = await fetch(`${Constants.API.BASE_URL}/schedules-flow/update`, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}