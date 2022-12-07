import fetch from 'node-fetch'
import * as Constants from '../../../environment'
import errorHandler from '../../errorHandler'

export const getImages = async () => {
    try {
      const response = await fetch(`${Constants.API.BASE_URL}/images`, {
        method: "GET",
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

export const getAllImages = async () => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/images/all`, {
      method: "GET",
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

export const updateImagesHome = async (token, data) => {
    try {
        const body = {
            images: data
        }
        
        const response = await fetch(`${Constants.API.BASE_URL}/images`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                "Content-Type": "application/json",
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

export const uploadeImageHome = async (token, file) => {
    try {
      const body = new FormData()
      body.append('file', file)
  
      const response = await fetch(`${Constants.API.BASE_URL}/images`, {
        method: 'POST',
        body: body,
        headers: {
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