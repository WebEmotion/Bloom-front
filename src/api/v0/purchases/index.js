import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const getList = async (token) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchases`, {
            method: 'GET',
            headers: {
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

export const getAll = async (token, page) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/all/?page=${page}`, {
            method: 'GET',
            headers: {
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

export const searchPurchases = async (token, query) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/search/${query}`, {
            method: 'GET',
            headers: {
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

export const searchPurchasesClient = async (token, id, query) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/search/${id}/${query}`, {
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

export const getPurchasesClient = async (token, id, page) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/client/${id}?page=${page}`, {
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

export const getOne = async (id, token) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchases/${id}`, {
            method: 'GET',
            headers: {
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

export const updateBundle = async (token, purchase, bundle, comment) => {
    try {
        const body = {
            invoice: false
        }
        if (comment) {
            body['comment'] = comment
        }
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/update/${purchase}/bundle/${bundle}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
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

export const addOrRemoveClass = async (token, clientId, purchaseId, isClass, number) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/client/${clientId}/purchase/${purchaseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                addedClasses: isClass ? number : 0,
                addedPasses: isClass ? 0 : number
            })
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
        return errorHandler(500)
    } catch (error) {
        return errorHandler(500)
    }
}

export const deletePurchase = async (token, purchaseId, comments) => {
    try {
        const body = {}
        if (comments) {
            body['comment'] = comments
        }
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/${purchaseId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(body)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
        return errorHandler(500)
    } catch (error) {
        return errorHandler(500)
    }
}

export const completePurchase = async (token, purchaseId) => {
    try {
        const body = {}
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/complete/${purchaseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(body)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
        return errorHandler(500)
    } catch (error) {
        return errorHandler(500)
    }
}

export const cancelPurchase = async (token, purchaseId) => {
    try {
        const body = {}
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/cancel/${purchaseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(body)
        })
        const jsonResponse = await response.json()
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
        return errorHandler(500)
    } catch (error) {
        return errorHandler(500)
    }
}

export const purchaseClient = async (token, voucher) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/buy/${voucher}`, {
            method: 'PATCH',
            headers: {
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

export const initPurchase = async (token, bundle, voucher) => {
    try {
        const body = {
            operationIds: voucher,
            bundleId: bundle
        }
        const response = await fetch(`${Constants.API.BASE_URL}/purchase/init`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
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