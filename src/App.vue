<template>
  <login-form
    v-if="page === 'login'"
    :server="server"
    @userLogin="userLogin"
  ></login-form>

  <home
    v-else
    :user="user"
    :server="server"
    :tasks="tasks"
    :detailsTask="detailsTask"
    @goToTaskDetails="goToTaskDetails"
    @addTask="addTask"
    @editTask="editTask"
    @moveTask="moveTask"
    @deleteTask="deleteTask"
    @userLogout="userLogout"
  ></home>
</template>

<script>
 import axios from 'axios'

 import LoginForm from './components/LoginForm'
 import Home from './components/Home'

 export default {
   name: 'App',
   data() {
     return {
       server: 'https://salty-waters-87382.herokuapp.com',
       page: 'login',
       user: {

       },
       tasks: [],
       detailsTask: {
         title: '',
         description: '',
         status: '',
         User: {}
       }
     }
   },
   components: {
     LoginForm,
     Home
   },
   methods: {
     userLogin(user) {
       this.user = user
       this.page = 'home'
       this.fetchKanban()
     },
     userLogout() {
       this.user = {}
       this.page = 'login'
       this.tasks = []
     },
     fetchKanban() {
       axios({
         method: 'GET',
         url: `${this.server}/tasks`,
         headers: {
           access_token: localStorage.access_token
         }
       })
         .then(({ data }) => {
           this.tasks = data
         })
         .catch(err => {
           console.log(err)
         })
     },
     goToTaskDetails(id) {
       axios({
         method: 'GET',
         url: `${this.server}/tasks/${id}`,
         headers: {
           access_token: localStorage.access_token
         }
       })
         .then(({ data }) => {
           this.detailsTask = data

           var myModal = new bootstrap.Modal(document.getElementById('task-details'))
           myModal.toggle()
         })
         .catch(err => {
           console.log(err)
         })
     },
     addTask(task) {
       axios({
         method: 'POST',
         url: `${this.server}/tasks`,
         headers: {
           access_token: localStorage.access_token
         },
         data: task
       })
         .then(({ data }) => {
           var myModalEl = document.getElementById('add-task')
           var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance

           modal.toggle()
           this.fetchKanban()
           this.$socket.emit('updateKanban')
         })
         .catch(err => {
           err.response.data.errors.forEach(error => this.showErrorOnAdd(error))
           /* this.showErrorOnAdd(err.response.data.message) */
         })
     },
     editTask(task) {
       axios({
         method: 'PUT',
         url: `${this.server}/tasks/${task.id}`,
         headers: {
           access_token: localStorage.access_token
         },
         data: {
           title: task.title,
           description: task.description,
           status: task.status
         }
       })
         .then(({ data }) => {
           var myModalEl = document.getElementById('task-details')
           var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance

           modal.toggle()
           this.fetchKanban()
           this.$socket.emit('updateKanban')
         })
         .catch(err => {
           this.showErrorOnDetails(err.response.data.message)
         })
     },
     moveTask(task) {
       axios({
         method: 'PATCH',
         url: `${this.server}/tasks/${task.id}`,
         headers: {
           access_token: localStorage.access_token
         },
         data: {
           status: task.status
         }
       })
         .then(({ data }) => {
           var myModalEl = document.getElementById('task-details')
           var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance

           modal.toggle()
           this.fetchKanban()
           this.$socket.emit('updateKanban')
         })
         .catch(err => {
           this.showErrorOnDetails(err.response.data.message)
         })
     },
     deleteTask(id) {
       axios({
         method: 'DELETE',
         url: `${this.server}/tasks/${id}`,
         headers: {
           access_token: localStorage.access_token
         }
       })
         .then(({ data }) => {
           this.detailsTask = {
             title: '',
             description: '',
             status: ''
           }

           var myModalEl = document.getElementById('task-details')
           var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
           modal.toggle()

           this.fetchKanban()
           this.$socket.emit('updateKanban')
         })
         .catch(err => {
           this.showErrorOnDetails(err.response.data.message)
         })
     },
     htmlToElement(html) {
       var template = document.createElement('template');
       html = html.trim(); // Never return a text node of whitespace as the result
       template.innerHTML = html;
       return template.content.firstChild;
     },
     showErrorOnDetails(message) {
       let html = `<div id="errorAlert" class="alert alert-danger alert-dismissible fade show" role="alert">${message}<button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       let errorNode = this.htmlToElement(html)

       let parent = document.getElementById('task-details')
       /* let parent = document.getElementsByTagName("BODY")[0]; */
       parent.prepend(errorNode)
     },
     showErrorOnAdd(message) {
       let html = `<div id="errorAlert" class="alert alert-danger alert-dismissible fade show" role="alert">${message}<button class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
       let errorNode = this.htmlToElement(html)

       let parent = document.getElementById('add-task')
       /* let parent = document.getElementsByTagName("BODY")[0]; */
       parent.prepend(errorNode)
     },
   },
   created() {
     if(localStorage.access_token) {
       this.page = 'home'
       this.user.fullName = localStorage.fullName
       this.fetchKanban()
     }
   },
   sockets: {
     updateKanban: function () {
       /* console.log('updateKanban') */
       this.fetchKanban()
     },
   }
 }

</script>

<style>

</style>
