import fetch from "node-fetch"
import * as Constants from "../../../environment"
import errorHandler from "../../errorHandler"

export const getInstructors = async () => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/instructors`, {
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

export const getInstructor = async (id) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/instructors/${id}`, {
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

export const getAllInstructors = async () => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/instructors/list/all`, {
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

export const createInstructor = async (token, instructor) => {
  try {
    const body = new FormData()
    body.append('name', instructor.name)
    body.append('lastname', instructor.lastname)
    body.append('description', instructor.description)
    body.append('file', instructor.picture)
    body.append('file2', instructor.banner)
    const response = await fetch(`${Constants.API.BASE_URL}/instructors/create`, {
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

export const updateInstructor = async (token, instructor) => {
  function isFile(input) {
    if ('File' in window && input instanceof File)
      return true;
    else return false;
  }

  try {

    console.log(isFile(instructor.picture), instructor)
    const body = new FormData()
    body.append('id', instructor.id)
    body.append('name', instructor.name)
    body.append('lastname', instructor.lastname)
    body.append('description', instructor.description)

    if(isFile(instructor.picture)) body.append('file', instructor.picture)
    if(isFile(instructor.banner)) body.append('file2', instructor.banner)

    const response = await fetch(`${Constants.API.BASE_URL}/instructors/update`, {
      method: 'PATCH',
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

export const setNewInstructor = async (token, oldInstructorId, newInstructor) => {
  try {
    const body = new FormData()
    body.append('id', newInstructor.id)

    const response = await fetch(`${Constants.API.BASE_URL}/instructors/reassign/${oldInstructorId}`, {
      method: 'PATCH',
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

export const deleteInstructor = async (token, instructorId) => {
  try {
    const response = await fetch(`${Constants.API.BASE_URL}/instructors/delete/${instructorId}`, {
      method: 'PATCH',
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