<template>
  <div class="col-3 border pb-4 px-0">
    <div class="category-header mb-3">
      <h3 class="p-1"
        :class="{
          'bg-secondary': category === 'Backlog',
          'bg-warning': category === 'Todo',
          'bg-primary': category === 'In Progress',
          'bg-success': category === 'Done'
        }"
      >{{ category }}</h3>
    </div>
    <div class="category-content"
      v-for="task in tasks"
      :key="task.id">
      <task-card
        @goToTaskDetails="goToTaskDetails"
        :task="task"
      ></task-card>
    </div>
  </div>
</template>

<script>
 import TaskCard from './TaskCard'

 export default {
   name: 'TaskCategory',
   data() {
     return {

     }
   },
   methods: {
     goToTaskDetails(id) {
       this.$emit('goToTaskDetails', id)
     }
   },
   components: {
     TaskCard
   },
   props: ['category', 'tasks']
 }

</script>

<style>

</style>
