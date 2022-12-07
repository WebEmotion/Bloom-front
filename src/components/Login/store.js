import { decorate, observable, action } from "mobx"

import * as Auth from "../../api/v0/auth"

class Login {
  //Alerts
  show_alert = false
  alert_message = false

  // Login form
  email_login = ""
  email_login_invalid = false
  password_login = ""
  password_login_invalid = false

  // Signup form
  name = ""
  name_invalid = false
  lastname = ""
  lastname_invalid = false
  email_signup = ""
  email_signup_invalid = false
  email_signup_conf = ""
  email_signup_conf_invalid = false
  password_signup = ""
  password_signup_invalid = false
  password_signup_conf = ""
  password_signup_conf_invalid = false
  subscribed = false

  loading = false
  loading_message = ""

  showSignupSuccess = false
  signupFailed = false

  validateLogin = () => {
    this.resetValidations()
    let valid = true
    if (!this.email_login) {
      this.email_login_invalid = true
      valid = false
    }
    if (!this.password_login) {
      this.password_login_invalid = true
      valid = false
    }
    return valid
  }

  validateSignup = () => {
    let isValid = {
      valid: true,
      message: "",
    }
    this.resetValidations()
    if (!this.name) {
      isValid.valid = false
      this.name_invalid = true
    }
    if (!this.lastname) {
      isValid.valid = false
      this.lastname_invalid = true
    }
    if (!this.email_signup) {
      isValid.valid = false
      this.email_signup_invalid = true
    }
    if (!this.password_signup) {
      isValid.valid = false
      this.password_signup_invalid = true
    }
    !isValid.valid
      ? (isValid.message = "Por favor, completa todos los campos")
      : (isValid.message = "")
    if (this.email_signup !== this.email_signup_conf) {
      this.email_signup_conf_invalid = true
      isValid.valid = false
      isValid.message = "El correo que proporcionaste no coincide"
    }
    if (this.password_signup !== this.password_signup_conf) {
      this.password_signup_conf_invalid = true
      isValid.valid = false
      isValid.message = "La contraseña que proporcionaste no coincide"
    }
    return isValid
  }

  resetValidations = () => {
    this.email_login_invalid = false
    this.password_login_invalid = false
    this.name_invalid = false
    this.lastname_invalid = false
    this.email_signup_invalid = false
    this.email_signup_conf_invalid = false
    this.password_signup_invalid = false
    this.password_signup_conf_invalid = false
    this.signupFailed = false
  }

  login = async store => {
    this.loading_message = "Iniciando sesión..."
    this.loading = true
    const response = await Auth.login(this.email_login, this.password_login)
    if (response.success) {
      store.id = response.user.id
      store.name = response.user.name
      store.lastname = response.user.lastname
      store.email = response.user.email
      store.phoneNumber = response.user.phoneNumber
      store.pictureUrl = response.user.pictureUrl
      store.facebookId = response.user.facebookId
      store.googleId = response.user.facebookId
      store.birthDate = response.user.birthDate
      store.gender = response.user.gender
      store.status = response.user.status
      store.confirmationToken = response.user.confirmationToken
      store.isAdmin = response.user.isAdmin
      store.setUser = true
      return response
    } else {
      setTimeout(() => {
        this.loading = false
        this.alert_message = response.message
        this.show_alert = true
        setTimeout(() => {
          this.show_alert = false
        }, 3000)
      }, 2000)
      return response
    }
  }

  changePassword = async (store, tempToken, password) => {
    const response = await Auth.changePassword(tempToken, password)
    if (response.success) {
      store.id = response.user.id
      store.name = response.user.name
      store.lastname = response.user.lastname
      store.email = response.user.email
      store.phoneNumber = response.user.phoneNumber
      store.pictureUrl = response.user.pictureUrl
      store.facebookId = response.user.facebookId
      store.googleId = response.user.facebookId
      store.birthDate = response.user.birthDate
      store.gender = response.user.gender
      store.status = response.user.status
      store.confirmationToken = response.user.confirmationToken
      store.isAdmin = response.user.isAdmin
      store.token = response.token
      store.setUser = true
      return response
    } else {
      return response
    }
  }

  signUp = async store => {
    this.loading_message = "Registrándote..."
    this.loading = true
    const response = await Auth.signup(
      this.name,
      this.lastname,
      this.email_signup,
      this.password_signup,
      store.tempToken
    )
    console.log("response")
    console.log(response)
    if (response.success) {
      store.id = response.customer.id
      store.name = response.customer.name
      store.lastname = response.customer.lastname
      store.email = response.customer.email
      store.phoneNumber = response.customer.phoneNumber
      store.pictureUrl = response.customer.pictureUrl
      store.facebookId = response.customer.facebookId
      store.googleId = response.customer.facebookId
      store.birthDate = response.customer.birthDate
      store.gender = response.customer.gender
      store.status = response.customer.status
      store.confirmationToken = response.customer.confirmationToken
      this.signupFailed = false
      store.setUser = true
      return response.token
    } else {
      this.signupFailed = true
      this.alert_message = response.message
      setTimeout(() => {
        this.loading = false
        this.show_alert = true
        setTimeout(() => {
          this.show_alert = false
        }, 3000)
      }, 2000)
      return response.message
    }
  }

  loginGoogle = async (
    id,
    token,
    email,
    name,
    lastname,
    phoneNumber,
    birthDate,
    gender,
    picture,
    store
  ) => {
    this.loading_message = "Iniciando sesión..."
    this.loading = true
    const response = await Auth.loginGoogle(
      id,
      token,
      email,
      name,
      lastname,
      phoneNumber,
      birthDate,
      gender,
      picture
    )
    if (response.success) {
      store.id = response.customer.id
      store.name = response.customer.name
      store.lastname = response.customer.lastname
      store.email = response.customer.email
      store.phoneNumber = response.customer.phoneNumber
      store.pictureUrl = response.customer.pictureUrl
      store.facebookId = response.customer.facebookId
      store.googleId = response.customer.facebookId
      store.birthDate = response.customer.birthDate
      store.gender = response.customer.gender
      store.status = response.customer.status
      store.confirmationToken = response.customer.confirmationToken
      store.setUser = true
      return response.token
    } else {
      setTimeout(() => {
        this.loading = false
        this.alert_message = response.message
        this.show_alert = true
        setTimeout(() => {
          this.show_alert = false
        }, 3000)
      }, 2000)
      return ""
    }
  }

  loginFacebook = async (
    id,
    token,
    email,
    name,
    lastname,
    phoneNumber,
    birthDate,
    gender,
    picture,
    store
  ) => {
    this.loading_message = "Iniciando sesión..."
    this.loading = true
    const response = await Auth.loginFacebook(
      id,
      token,
      email,
      name,
      lastname,
      phoneNumber,
      birthDate,
      gender,
      picture
    )
    if (response.success) {
      store.id = response.customer.id
      store.name = response.customer.name
      store.lastname = response.customer.lastname
      store.email = response.customer.email
      store.phoneNumber = response.customer.phoneNumber
      store.pictureUrl = response.customer.pictureUrl
      store.facebookId = response.customer.facebookId
      store.googleId = response.customer.facebookId
      store.birthDate = response.customer.birthDate
      store.gender = response.customer.gender
      store.status = response.customer.status
      store.confirmationToken = response.customer.confirmationToken
      store.setUser = true
      return response.token
    } else {
      setTimeout(() => {
        this.loading = false
        this.alert_message = response.message
        this.show_alert = true
        setTimeout(() => {
          this.show_alert = false
        }, 3000)
      }, 2000)
      return ""
    }
  }
}

decorate(Login, {
  show_alert: observable,
  alert_message: observable,
  email_login: observable,
  email_login_invalid: observable,
  password_login: observable,
  password_login_invalid: observable,
  name: observable,
  name_invalid: observable,
  lastname: observable,
  lastname_invalid: observable,
  email_signup: observable,
  email_signup_invalid: observable,
  email_signup_conf: observable,
  email_signup_conf_invalid: observable,
  password_signup: observable,
  password_signup_invalid: observable,
  password_signup_conf: observable,
  password_signup_conf_invalid: observable,
  subscribed: observable,
  loading: observable,
  loading_message: observable,
  showSignupSuccess: observable,
  validateLogin: action,
  validateSignup: action,
  resetValidations: action,
  signUp: action,
  loginFacebook: action,
  loginGoogle: action,
})

const store = new Login()

export default store
