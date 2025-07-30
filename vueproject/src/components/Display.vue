<template>
  <div>
    <h2>Display Page</h2>
    <p><strong>Name:</strong> {{ $route.query.name }}</p>
    <p><strong>Email:</strong> {{ $route.query.email }}</p>
    <p><strong>Phone:</strong> {{ $route.query.phonenum }}</p>
  </div>
</template>

<script>
export default {
  name: 'display'
}
</script>
