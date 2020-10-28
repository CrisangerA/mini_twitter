class Auth {
  authenticate;
  constructor() {
    let token = localStorage.getItem('token');
    if (token !== null) {
      if (token !== '') {
        this.authenticate = true;
      } else {
        this.authenticate = false;
      }
    } else {
      this.authenticate = false;
    }
  }
  singin(cb, token) {
    localStorage.setItem('token', token);
    this.authenticate = true;
    cb();
  }
  logout(cb) {
    this.authenticate = false;
    localStorage.clear();
    cb();
  }
  isAuthenticated = () => this.authenticate;
}

export default new Auth();