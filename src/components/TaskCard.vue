<template>
  <div class="card mx-3 mb-3">
    <div class="card-header">
      {{ task.title }}
    </div>
    <div class="card-body">
      <span>By: {{ task.User.fullName }}</span><br/>
      <button class="btn btn-primary mt-3 mx-auto" @click.prevent="goToTaskDetails(task.id)">Details</button>
    </div>
  </div>
</template>

<script>
 export default {
   name: 'TaskCard',
   data() {
     return {

     }
   },
   methods: {
     goToTaskDetails(id) {
       this.$emit('goToTaskDetails', id)
     }
   },
   props: ['task']
 }

</script>

<style scoped>
 span {
   font-size: 0.8em;
 }

 button {
   font-size: 0.8em;
 }
</style>
