import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const schedules = async (roomId, start, token = null) => {
    try {
        //start = '2021-12-26'
        const data = {
            start
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        if (token) headers['Authorization'] = token
        const response = await fetch(`${Constants.API.BASE_URL}/locations-flow/room/${roomId}/schedules`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        console.log(error)
        return errorHandler(500)
    }
}

export const schedulesClient = async (roomId, start, token = null) => {
    try {
        const data = {
            start
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
        if (token) headers['Authorization'] = token
        const response = await fetch(`${Constants.API.BASE_URL}/locations-flow/client/room/${roomId}/schedules`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        console.log(error)
        return errorHandler(500)
    }
}

export const schedulesAdmin = async (roomId, start, token, clientId) => {
    try {
        const data = {
            start,
            clientId
        }
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        }
        const response = await fetch(`${Constants.API.BASE_URL}/locations-flow/admin/room/${roomId}/schedules`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        console.log(error)
        return errorHandler(500)
    }
}

export const rooms = async () => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/rooms-flow`, {
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
        console.log(error)
        return errorHandler(500)
    }
}