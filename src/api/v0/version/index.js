import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const checkVersion = async (version) => {
    try {
        const response = await fetch(`${Constants.API.BASE_URL}/versions/${version}`, {
            method: 'GET'
        })
        const jsonResponse = await response.json()
        console.log(jsonResponse)
        if (jsonResponse.success) {
            return jsonResponse
        } else {
            return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
        }
    } catch (error) {
        return errorHandler(500)
    }
}