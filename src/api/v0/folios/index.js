import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const getFolios = async (token) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/folios`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
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

export const redeem = async (token, id) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/folios/${id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
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