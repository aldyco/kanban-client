<template>
  <div class="kanban-page" id="page">
    <header>
      <nav class="navbar navbar-expand-lg navbar-light bg-light justify-content-between px-3">
        <a class="navbar-brand" href="#">Kanban Board</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="no-p form-inline" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">{{ user.fullName }}</a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="" @click.prevent="userLogout">Logout</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>
    </header>

    <main class="mt-5">
      <div class="container d-flex flex-column">
        <button class="btn btn-primary mb-4 align-self-end" data-bs-toggle="modal" data-bs-target="#add-task">Add Task</button>
        <div class="row">
          <task-category
            :category="'Backlog'"
            :tasks="backlogTasks"
            @goToTaskDetails="goToTaskDetails"
          ></task-category>
          <task-category
            :category="'Todo'"
            :tasks="todoTasks"
            @goToTaskDetails="goToTaskDetails"
          ></task-category>
          <task-category
            :category="'In Progress'"
            :tasks="progressTasks"
            @goToTaskDetails="goToTaskDetails"
          ></task-category>
          <task-category
            :category="'Done'"
            :tasks="doneTasks"
            @goToTaskDetails="goToTaskDetails"
          ></task-category>
        </div>
      </div>

      <!-- modal add task -->
      <div class="modal fade" id="add-task" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel">Add Task</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="clearInput"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label class="form-label" for="">Title</label>
                  <input v-model="newTask.title" class="form-control" placeholder="Title" type="text" value=""/>
                </div>
                <div class="form-group">
                  <label class="form-label" for="">Description</label>
                  <textarea v-model="newTask.description" class="form-control" cols="30" id="description" name="description" rows="3" placeholder="Description"></textarea>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button class="btn" data-bs-dismiss="modal" @click="clearInput">Cancel</button>
              <button class="btn btn-primary"  @click.prevent="addTask">Add</button>
            </div>
          </div>
        </div>
      </div>

      <!-- modal task details -->
      <div class="modal fade" id="task-details" tabindex="-1" aria-labelledby="modalLabelDetails" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabelDetails">Task Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form>
                <div class="form-group">
                  <label class="form-label" for="">Title</label>
                  <input v-model="detailsTask.title" class="form-control" placeholder="Title" type="text" value=""/>
                </div>
                <div class="form-group">
                  <label class="form-label" for="">Description</label>
                  <textarea v-model="detailsTask.description" class="form-control" cols="30" id="description" name="description" rows="3" placeholder="Description"></textarea>
                </div>
                <div class="form-group">
                  <label class="form-label" for="">Owner</label>
                  <span class="form-control">{{ detailsTask.User.fullName }} ({{ detailsTask.User.email }})</span><br/>
                </div>
              </form>
            </div>
            <div class="modal-footer d-flex justify-content-between">
              <button class="btn flex-fill"
                v-if="detailsTask.status != 'backlog'"
                @click.prevent="moveTaskBackward">Previous</button>
              <button class="btn btn-danger flex-fill"  @click.prevent="deleteTask">Delete</button>
              <button class="btn btn-primary flex-fill"  @click.prevent="editTask">Edit</button>
              <button class="btn flex-fill"
                v-if="detailsTask.status != 'done'"
                @click.prevent="moveTaskForward">Next</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
 import axios from 'axios'

 import TaskCategory from './TaskCategory'

 export default {
   name: 'Home',
   data() {
     return {
       newTask: {
         title: '',
         description: ''
       }
     }
   },
   components: {
     TaskCategory
   },
   methods: {
     userLogout() {
       var auth2 = gapi.auth2.getAuthInstance();
       auth2.signOut().then(function () {

       });
       localStorage.clear()
       this.$emit('userLogout')
     },
     clearInput() {
       this.newTask = {
         title: '',
         description: ''
       }
     },
     addTask() {
       this.$emit('addTask', this.newTask)
       this.clearInput()
     },
     editTask() {
       this.$emit('editTask', this.detailsTask)
     },
     moveTaskBackward() {
       let status = ['backlog', 'todo', 'progress', 'done']
       let currentStatusIdx = status.findIndex( el => el === this.detailsTask.status)
       let newStatus = status[currentStatusIdx - 1]
       let task = {
         id: this.detailsTask.id,
         status: newStatus
       }

       this.$emit('moveTask', task)
     },
     moveTaskForward() {
       let status = ['backlog', 'todo', 'progress', 'done']
       let currentStatusIdx = status.findIndex( el => el === this.detailsTask.status)
       let newStatus = status[currentStatusIdx + 1]
       let task = {
         id: this.detailsTask.id,
         status: newStatus
       }

       this.$emit('moveTask', task)
     },
     goToTaskDetails(id) {
       this.$emit('goToTaskDetails', id)
     },
     deleteTask() {
       this.$emit('deleteTask', this.detailsTask.id)
     }
   },
   props: ['user', 'server', 'tasks', 'detailsTask'],
   computed: {
     backlogTasks: function() {
       return this.tasks.filter(task => task.status === 'backlog')
     },
     todoTasks: function() {
       return this.tasks.filter(task => task.status === 'todo')
     },
     progressTasks: function() {
       return this.tasks.filter(task => task.status === 'progress')
     },
     doneTasks: function() {
       return this.tasks.filter(task => task.status === 'done')
     },
   }
 }

</script>

<style>

</style>
