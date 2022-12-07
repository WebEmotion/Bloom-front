import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const sendEmail = async (name, lastname, email, motive, message) => {
    try {
        const body = {
            name,
            lastname,
            email,
            motive,
            message
        }
        const response = await fetch(`${Constants.API.BASE_URL}/contact`, {
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

export const sendEncuesta = async (token, data) => {
    try {
        const body = new FormData()
        for (var i in Object.keys(data)) {
            const key = Object.keys(data)[i]
            if (data[key]) body.append(key, data[key])
        }
        const response = await fetch(`${Constants.API.BASE_URL}/survey1/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            },
            body: body
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