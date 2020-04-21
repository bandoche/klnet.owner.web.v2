import { observable, action } from 'mobx';
import { create, persist } from 'mobx-persist';
class UserStore {
  @observable me;
  @observable user;
  @persist @observable token;
  @persist value;
  constructor() {
    // this.me = null;
    this.me = "mobx test";
    this.user = null;
    this.token = null;
  }
  @action setMe = (me) => {
    this.me = me;
  }
  @action setUser = (user) => {
    this.user = user;
  }
  @action setToken = (token) => {
    this.token = token;
  }
  @action setValue = (value) => {
    this.value = value;
  }
}

const userStore = new UserStore();

export default userStore;
export { UserStore };