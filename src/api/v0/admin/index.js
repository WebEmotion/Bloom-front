import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const login = async ( user, password ) => {
    try {
        const body = {
            user,
            password
        }
        const response = await fetch(`${Constants.API.BASE_URL}/internal/login`, {
            method: 'POST',
            body: JSON.stringify(body),
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

export const getAllEvents = async (authToken) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/internal/events`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
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

export const getTransactions = async (id, authToken) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/internal/events/${id}/transactions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
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

export const addToGroup = async (authToken, idEvent, idTransaction) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/internal/events/${idEvent}/transactions/${idTransaction}/mark`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken
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