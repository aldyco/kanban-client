<template>
  <!-- login/register page -->
  <div class="login-form" id="login-form">
    <div class="home-card mx-auto bg-light border rounded">
      <ul class="nav nav-tabs nav-fill">
        <li class="nav-item"><a class="nav-link" :class="{ active: section === 'login' }" href="" v-on:click.prevent="goToSection('login')">Login</a></li>
        <li class="nav-item"><a class="nav-link" :class="{ active: section === 'register' }" href="" v-on:click.prevent="goToSection('register')">Register</a></li>
      </ul>

      <div class="login-section p-4" v-if="section === 'login'">
        <form @submit.prevent="userLogin">
          <div class="form-group">
            <input v-model="email" class="form-control" placeholder="Email" type="email" value=""/>
          </div>
          <div class="form-group">
            <input v-model="password" class="form-control" placeholder="Password" type="password" value=""/>
          </div>
          <button class="btn btn-primary btn-block">Sign In</button>
          <p class="text-center mt-3">or sign in with Google Account</p>
          <hr/>
          <div id="google-signin-button" class="g-signin2 d-flex" data-longtitle="true" data-theme="dark"></div>
        </form>
      </div>

      <div class="register-section p-4" v-else>
        <form @submit.prevent="userRegister">
          <div class="form-group">
            <input v-model="fullName" class="form-control" placeholder="Name" type="text" value=""/>
          </div>
          <div class="form-group">
            <input v-model="email" class="form-control" placeholder="Email" type="email" value=""/>
          </div>
          <div class="form-group">
            <input v-model="password" class="form-control" placeholder="Password" type="password" value=""/>
          </div>
          <button class="btn btn-success btn-block">Register</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
 import axios from 'axios'

 export default {
   name: 'LoginForm',
   data() {
     return {
       section: 'login',
       email: '',
       fullName: '',
       password: ''
     }
   },
   methods: {
     goToSection(section) {
       this.section = section
       this.fullName = ''
       this.email =  ''
       this.password = ''

       if(section === 'register') {
         document.getElementsByClassName('abcRioButton')[0].style.display = 'none';
       } else {
         document.getElementsByClassName('abcRioButton')[0].style.display = null;
       }
     },
     userLogin() {
       axios({
         method: 'POST',
         url: `${this.server}/login`,
         data: {
           email: this.email,
           password: this.password
         }
       })
         .then(({ data }) => {
           localStorage.access_token = data.accessToken
           localStorage.fullName = data.fullName
           this.$emit('userLogin', { fullName: data.fullName })
         })
         .catch(err => {
           console.log(err.response)
           this.showError(err.response.data.message)
         })
     },
     userRegister() {
       axios({
         method: 'POST',
         url: `${this.server}/register`,
         data: {
           fullName: this.fullName,
           email: this.email,
           password: this.password
         }
       })
         .then(({ data }) => {
           localStorage.access_token = data.accessToken
           localStorage.fullName = data.fullName
           this.$emit('userLogin', { fullName: data.fullName })
         })
         .catch(err => {
           console.log(err.response)
           err.response.data.errors.forEach(error => this.showError(error))
           /* this.showError(err.response.data.message) */
         })
     },
     onSignIn(googleUser) {
       var id_token = googleUser.getAuthResponse().id_token;

       axios({
         method: 'POST',
         url: `${this.server}/login/google`,
         data: {
           id_token
         }
       })
         .then(({ data }) => {
           localStorage.access_token = data.accessToken
           localStorage.fullName = data.fullName
           this.$emit('userLogin', { fullName: data.fullName })
         })
         .catch(err => {
           console.log(err.response)
           this.showError(err.response.data.message)
         })
     },
     htmlToElement(html) {
       var template = document.createElement('template');
       html = html.trim(); // Never return a text node of whitespace as the result
       template.innerHTML = html;
       return template.content.firstChild;
     },
     showError(message) {
       let html = `<div id="errorAlert" class="alert alert-danger alert-dismissible fade show" role="alert">${message}<button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       let errorNode = this.htmlToElement(html)

       let parent = document.getElementById('login-form')
       /* let parent = document.getElementsByTagName("BODY")[0]; */
       parent.prepend(errorNode)
     },
   },
   props: ['server'],
   mounted() {
     gapi.signin2.render('google-signin-button', {
       onsuccess: this.onSignIn
     })
   }
 }
</script>

<style>

</style>
