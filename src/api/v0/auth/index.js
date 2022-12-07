import fetch from "node-fetch"
import * as Constants from "../../../environment"
import errorHandler from "../../errorHandler"

export const login = async (email, password) => {
  try {
    const body = {
      email,
      password,
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}login`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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

export const signup = async (name, lastname, email, password, tempToken = null) => {
  try {
    let body = {
      name: name,
      lastname: lastname,
      email: email,
      password: password,
    }
    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
    if (tempToken) headers['Authorization'] = tempToken
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}signup`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
      }
    )
    const jsonResponse = await response.json()
    console.log(response)
    if (jsonResponse.success) {
      return jsonResponse
    } else {
      return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
    }
  } catch (error) {
    return errorHandler(500)
  }
}

export const loginColaborador = async (email, password) => {
  try {
    const body = {
      email,
      password,
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}colaborador`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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

export const loginInstructor = async (email, password) => {
  try {
    const body = {
      email,
      password,
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}instructor`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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

export const loginGoogle = async (
  googleId,
  googleToken,
  email,
  name,
  lastname,
  phoneNumber,
  birthDate,
  gender,
  picture
) => {
  try {
    const body = {
      googleId,
      googleToken,
      email,
      name,
      lastname,
      // phoneNumber,
      // birthDate,
      // gender,
      pictureUrl: picture,
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}google`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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
//id, token, email, name, lastname, phoneNumber, birthDate, gender, picture
export const loginFacebook = async (
  facebookId,
  facebookToken,
  email,
  name,
  lastname,
  phoneNumber,
  birthDate,
  gender,
  picture
) => {
  try {
    const body = {
      facebookId: facebookId,
      facebookToken: facebookToken,
      email: email,
      name: name,
      lastname: lastname,
      // phoneNumber,
      // birthDate,
      // gender,
      pictureUrl: picture,
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}facebook`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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

export const me = async token => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
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

export const classes = async token => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me/classes`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
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

export const history = async (token, page = 1) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/me/history?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: token,
      },
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

export const recoveryPassword = async email => {
  try {
    const body = {
      email,
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}recovery-password`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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

export const changePasswordManually = async (token, user, password) => {
  try {
    const body = {
      clientId: user,
      password
    }
    const response = await fetch(`${Constants.API.BASE_URL}/auth/change-password-manual`, {
      method: "PATCH",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
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

export const changePassword = async (tempToken, password) => {
  try {
    const body = {
      password,
      tempToken
    }
    const response = await fetch(
      `${Constants.API.BASE_URL}${Constants.API.AUTH}change-password`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
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

export const validateEmail = async (email) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/auth/verify/${email}`, {
      method: "GET"
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