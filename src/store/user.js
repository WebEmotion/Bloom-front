import { persist } from 'mobx-persist'
import { observable, decorate } from 'mobx'

class UserStore {
    token = ''
    id = ''
    name = ''
    lastname = ''
    email = ''
    facebookId = ''
    googleId = ''
    phoneNumber = ''
    birthDate = ''
    gender = ''
    pictureUrl = ''
    status = ''
    confirmationToken = ''
    adminToken = ''
    isAdmin = ''
    isCollaborator = ''
    isInstructor = ''
    currentClient = ''

    tempToken = ''

    successIndicator = null
    buyed = null
    voucher = null

    signingup = false
    alertDisplayed = false
    showAlertAgain = true
    showAlert = false
    setUser = ''
}

decorate(UserStore, {
    token: [observable, persist],
    id: [observable, persist],
    name: [observable, persist],
    lastname: [observable, persist],
    email: [observable, persist],
    facebookId: [observable, persist],
    googleId: [observable, persist],
    phoneNumber: [observable, persist],
    birthDate: [observable, persist],
    gender: [observable, persist],
    status: [observable, persist],
    confirmationToken: [observable, persist],
    pictureUrl: [observable, persist],
    adminToken: [observable, persist],
    isAdmin: [observable, persist],
    successIndicator: [observable, persist],
    buyed: [observable, persist('object')],
    voucher: [observable, persist],
    isCollaborator: [observable, persist],
    isInstructor: [observable, persist],
    signingup: [observable],
    alertDisplayed: [observable],
    showAlert: [observable],
    showAlertAgain: [observable, persist],
    tempToken: [observable, persist],
    setUser: [observable, persist]
})

export default new UserStore()