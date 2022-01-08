<template>
  <div class="register-form">
    <div class="nickname-input">
      <label>Nickname</label>
      <input type="text" />
    </div>
    <div class="password-input">
      <label>Password</label>
      <input type="password" />
    </div>
    <div class="confirm-password--input">
      <label>Confirm Password</label>
      <input type="password" />
    </div>
    <button class="btn-primary">Sign Up</button>
  </div>
</template>

<script>
export default {
  name: "RegisterForm",
};
</script>
