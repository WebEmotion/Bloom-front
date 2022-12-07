import fetch from "node-fetch"
import * as Constants from "../../../environment"
import errorHandler from "../../errorHandler"

export const classes = async (token) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me/classes`, {
      method: "GET",
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

export const me = async (token) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me`, {
      method: "GET",
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

export const allItems = async (token) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me/all/items`, {
      method: "GET",
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

export const items = async (token) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me/items`, {
      method: "GET",
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

export const updateItems = async (token, items) => {
  try {
    const body = {
      categories: items
    }
    const response = await fetch(`${Constants.API.BASE_URL}/me/items`, {
      method: "PATCH",
      headers: {
        'Authorization': token,
        "Content-Type": "application/json"
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

export const changeProfilePicture = async (token, file) => {
  try {
    const body = new FormData()
    body.append('file', file)
    const response = await fetch(`${Constants.API.BASE_URL}/me/changeProfilePicture`, {
      method: "PATCH",
      headers: {
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

export const getGroupMembers = async (token) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me/member/list`, {
      method: "GET",
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

export const inviteGroupMember = async (token, email) => {
  try {
    const body = new FormData()
    body.append('email', email)
    const response = await fetch(`${Constants.API.BASE_URL}/me/member/invite`, {
      method: "PATCH",
      headers: {
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

export const removeGroupMember = async (token, user) => {
  try {
    const body = new FormData()
    body.append('user_id', user)
    const response = await fetch(`${Constants.API.BASE_URL}/me/member/remove`, {
      method: "PATCH",
      headers: {
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

export const changeGroupName = async (token, name) => {
  try {
    const body = new FormData()
    body.append('groupName', name)
    const response = await fetch(`${Constants.API.BASE_URL}/me/member/name`, {
      method: "PATCH",
      headers: {
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