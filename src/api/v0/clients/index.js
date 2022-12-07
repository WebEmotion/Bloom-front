import fetch from "node-fetch"
import * as Constants from "../../../environment"
import errorHandler from "../../errorHandler"

export const bundles = async (token) => {
  try {
    const headers = {
      "Content-Type": "application/json"
    }
    if (token) headers['Authorization'] = token
    const response = await fetch(`${Constants.API.BASE_URL}/bundles`, {
      method: "GET",
      headers
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

export const bundlesById = async (token, id) => {
  try {
    const headers = {
      "Content-Type": "application/json"
    }
    if (token) headers['Authorization'] = token
    const response = await fetch(`${Constants.API.BASE_URL}/bundles/${id}`, {
      method: "GET",
      headers
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

export const getDiscounts = async (token) => {
  try {
    const headers = {
      "Content-Type": "application/json"
    }
    if (token) headers['Authorization'] = token
    const response = await fetch(`${Constants.API.BASE_URL}/bundles/discount/all`, {
      method: "GET",
      headers
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

export const update = async (token, id, email, name, lastname) => {
  try {
    const body = {
      id,
      name,
      email,
      lastname
    }
    const response = await fetch(`${Constants.API.BASE_URL}/clients/update`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token,
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

export const getAllClients = async (token, page) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/clients/?page=${page}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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

export const searchClient = async (token, query) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/clients/search/${query}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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

export const createClient = async (token, state, bundles, currentClient, discounts, payment) => {
  console.log(discounts)
  try {
    if (currentClient === null) {
      const body = {
        name: state.name,
        lastname: state.lastname,
        email: state.email
      }
      const response = await fetch(`${Constants.API.BASE_URL}/clients`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      const jsonResponse = await response.json()
      if (jsonResponse.success) {
        const clientId = jsonResponse.client.id
        let arrayIds = []
        bundles.forEach(element => {
          arrayIds.push(element.id)
        })
        const body = {
          bundles: arrayIds,
          transactionId: state.transaction,
          discount: discounts.discount/100,
          paymentMethod: payment
        }
        if (discounts.comment && discounts.commentText) {
          body['comments'] = discounts.comment === 'Otro' ? discounts.commentText : discounts.comment
        }
        const responsePurchase = await fetch(
          `${Constants.API.BASE_URL}/purchase/client/${clientId}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        const jsonResponsePurchase = await responsePurchase.json()
        if (jsonResponsePurchase.success) {
          return {
            client: jsonResponse,
            purchase: jsonResponsePurchase,
            success: true,
          }
        } else {
          return errorHandler(jsonResponsePurchase.error.code)
        }
      } else {
        return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
      }
    } else if (!currentClient.id) {
      const body = {
        name: state.name,
        lastname: state.lastname,
        email: state.email,
      }
      const response = await fetch(`${Constants.API.BASE_URL}/clients`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
      const jsonResponse = await response.json()
      if (jsonResponse.success) {
        const clientId = jsonResponse.client.id
        let arrayIds = []
        bundles.forEach(element => {
          arrayIds.push(element.id)
        })
        const body = {
          bundles: arrayIds,
          transactionId: state.transaction,
          discount: discounts.discount/100,
          paymentMethod: payment
        }
        if (discounts.comment && discounts.commentText) {
          body['comments'] = discounts.comment === 'Otro' ? discounts.commentText : discounts.comment
        }
        const responsePurchase = await fetch(
          `${Constants.API.BASE_URL}/purchase/client/${clientId}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        )
        const jsonResponsePurchase = await responsePurchase.json()
        if (jsonResponsePurchase.success) {
          return {
            client: jsonResponse,
            purchase: jsonResponsePurchase,
            success: true,
          }
        } else {
          return errorHandler(jsonResponsePurchase.error.code)
        }
      } else {
        return errorHandler(jsonResponse.error.code, jsonResponse.error.message)
      }
    } else {
      const clientId = currentClient.id
      let arrayIds = []
      bundles.forEach(element => {
        arrayIds.push(element.id)
      })
      const body = {
        bundles: arrayIds,
        transactionId: state.transaction,
        discount: discounts.discount/100,
        paymentMethod: payment
      }
      if (discounts.comment && discounts.commentText) {
        body['comments'] = discounts.comment === 'Otro' ? discounts.commentText : discounts.comment
      }
      const responsePurchase = await fetch(
        `${Constants.API.BASE_URL}/purchase/client/${clientId}`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      )
      const jsonResponsePurchase = await responsePurchase.json()
      if (jsonResponsePurchase.success) {
        return {
          client: { client: currentClient, success: true },
          purchase: jsonResponsePurchase,
          success: true,
        }
      } else {
        return errorHandler(jsonResponsePurchase.error.code)
      }
    }
  } catch (error) {
    return errorHandler(500)
  }
}

export const getClients = async (token) => {
  try {
    const response = await fetch(
      `${Constants.API.BASE_URL}/clients`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
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

export const getClient = async (token, id) => {
  try {
    const response = await fetch(
      `${Constants.API.BASE_URL}/clients/${id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
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

export const deleteClient = async (token, id) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/clients/delete/${id}`, {
      method: "PATCH",
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

export const getGroups = async (token) => {
    try {
      const response = await fetch(
        `${Constants.API.BASE_URL}/clients/member/list`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token,
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


export const getGroupMembers = async (token, id) => {
    try {
      const response = await fetch(`${Constants.API.BASE_URL}/clients/member/client/${id}`, {
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

export const inviteGroupMember = async (token, email, id) => {
    try {
      const body = new FormData()
      body.append('client_id', id)
      const response = await fetch(`${Constants.API.BASE_URL}/clients/member/${email}`, {
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

export const removeGroupMember = async (token, user, id) => {
    try {
      const body = new FormData()
      body.append('user_id', id)
      const response = await fetch(`${Constants.API.BASE_URL}/clients/member/remove/${user}`, {
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

export const changeGroupName = async (token, name, id) => {
    try {
      const body = new FormData()
      body.append('groupName', name)
      const response = await fetch(`${Constants.API.BASE_URL}/clients/member/name/${id}`, {
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