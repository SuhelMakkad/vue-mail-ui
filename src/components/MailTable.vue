<template>
  <table class="mail-table">
    <tr
      v-for="email in emails"
      :key="email.id"
      @click="openEmail(email)"
      class="clickable"
      :class="{
        read: email.read,
      }"
    >
      <td>
        <input
          type="checkbox"
          @click.stop="emailSelection.toggle(email)"
          :checked="emailSelection.emails.has(email)"
        />
      </td>
      <td>
        <p>{{ email.from }}</p>
      </td>
      <td>
        <p>
          <strong>{{ email.subject }}</strong>
          - {{ email.body }}
        </p>
      </td>
      <td class="date">
        {{ new Intl.DateTimeFormat("en-US").format(new Date(email.sentAt)) }}
      </td>
      <td>
        <button @click.stop="archiveEmail(email)">Archive</button>
      </td>
    </tr>
  </table>
</template>

<script>
import useEmailSelection from "../composables/use-email-selection";
export default {
  props: {
    emails: {
      type: Array,
      required: true,
    },
  },

  setup(props, { emit }) {
    const emailSelection = useEmailSelection();

    const openEmail = (email) => {
      emit("openEmail", email);
    };

    const archiveEmail = (email) => {
      emit("archiveEmail", email);
    };

    return {
      emailSelection,
      openEmail,
      archiveEmail,
    };
  },
};
</script>

<style scoped></style>
