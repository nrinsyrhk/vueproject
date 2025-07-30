<template>
  <div>
    <h2>Form Page</h2>
    <form @submit.prevent="submitForm">
      <label>Name: <input v-model="user.name" /></label><br />
      <label>Email: <input type="email" v-model="user.email" /></label><br />
      <label>Phone: <input v-model="user.phonenum" /></label><br />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '',
        email: '',
        phonenum: ''
      }
    }
  },
  methods: {
    submitForm() {
      this.$router.push({
        name: 'display',
        query: {
          name: this.user.name,
          email: this.user.email,
          phonenum: this.user.phonenum
        }
      })
    }
  }
}
</script>
