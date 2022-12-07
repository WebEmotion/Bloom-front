import { create } from 'mobx-persist'

import UserStore from './user'
import ClientsStore from './clients'

const hydrate = create()

class RootStore {
    UserStore = UserStore
    ClientsStore = ClientsStore
    init = async () => {
        await hydrate('user', this.UserStore)
        await hydrate('clients', this.ClientsStore)
        console.log('Hydrated')
        return true
    }
}

export default new RootStore()