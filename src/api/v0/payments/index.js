import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const paypal = async ( orderId, eventId, authorizationId, tickets, invoice, authToken ) => {
    try {
        const body = {
            orderId,
            eventId,
            authorizationId,
            tickets,
            invoice
        }
        const response = await fetch(`${Constants.API.BASE_URL}/payment/paypal`, {
            body: JSON.stringify(body),
            method: 'POST',
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

export const stripe = async ( eventId, tickets, invoice, authToken ) => {
    try {
        const body = {
            eventId,
            tickets,
            invoice
        }
        const response = await fetch(`${Constants.API.BASE_URL}/payment/stripe/intent`, {
            body: JSON.stringify(body),
            method: 'POST',
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