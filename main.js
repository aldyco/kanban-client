let app = new Vue({
  el: '#app',
  data: {
    page: 'home',
    section: 'login',
    user: {
      fullName: '',
      email: '',
      password: ''
    }
  },
  methods: {
    goToSection(section) {
      this.section = section
      this.user =  {
        fullName: '',
        email: '',
        password: ''
      }
    }
  }
})

function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;

}
