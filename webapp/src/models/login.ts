import { Model } from 'dva'

export interface LoginState {
  loggedIn : boolean,
  user? : any,
}

interface LoginModel extends Model{
  state: LoginState,
}

const model : LoginModel = {
  namespace: 'login',
  state: {
    loggedIn: false,
  },
  reducers: {
    loggedOut(state) {
      return {
        loggedIn: false,
        user: undefined
      }
    },
    loggedIn(state, { payload }) {
      console.log(payload)
      return {
        loggedIn: true,
        user: payload,
      }
    }
  },
};

export default model;
