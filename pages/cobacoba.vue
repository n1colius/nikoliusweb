<template>
  <div>
        <v-dialog />
        
        <button class="btn" @click="showButtonsDialog">Dialog: buttons</button>
  </div>
</template>

<script>
export default {
  methods: {
    showButtonsDialog() {
      this.$modal.show('dialog', {
        text: 'I am a tiny dialog box.<br/>And I render <b>HTML!</b>'
      });

    }
  }
};
</script>