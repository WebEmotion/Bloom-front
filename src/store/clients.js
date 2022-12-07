import { persist } from 'mobx-persist'
import { observable, decorate } from 'mobx'

class ClientsStore {

    allClients = []
    selected = null
    search = null

}

decorate(ClientsStore, {
    allClients: [observable, persist('list')],
    selected: [observable, persist('object')],
    search: [observable, persist]
})

export default new ClientsStore()