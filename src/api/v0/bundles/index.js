import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const create = async (token, data) => {
    try {
        const body = new FormData()
        for (var i in Object.keys(data)) {
            const key = Object.keys(data)[i]
            if (data[key] || (key === 'alternateUserId')) body.append(key, data[key])
        }
        const response = await fetch(`${Constants.API.BASE_URL}/bundles/create`, {
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

export const update = async (token, data, id) => {
    try {
        const body = new FormData()
        for (var i in Object.keys(data)) {
            const key = Object.keys(data)[i]
            if (data[key] || key === "isGroup" || key === 'isUnlimited') body.append(key, data[key])
        }
        const response = await fetch(`${Constants.API.BASE_URL}/bundles/edit/${id}`, {
            method: 'PATCH',
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

export const toggle = async (token, id) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/bundles/activate/${id}`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
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

export const getCollaborators = async token => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/collaborators`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
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