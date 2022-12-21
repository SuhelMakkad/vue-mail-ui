<template>
  <table class="mail-table">
    <tr
      v-for="email in unArchivedEmails"
      :key="email.id"
      @click="readEmail(email)"
      class="clickable"
      :class="{
        read: email.read,
      }"
    >
      <td>
        <input type="checkbox" />
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
        <button @click="archiveEmail(email)">Archive</button>
      </td>
    </tr>
  </table>
</template>

<script>
import axios from "axios";
import { ref } from "vue";

export default {
  async setup() {
    const { data: emails } = await axios.get("/assets/dummy-data/dummy-data.json");

    return { emails: ref(emails) };
  },

  computed: {
    sortedEmail() {
      return this.emails?.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1));
    },

    unArchivedEmails() {
      return this.emails?.filter((email) => !email.archived);
    },
  },

  methods: {
    readEmail(email) {
      email.read = true;
    },

    archiveEmail(email) {
      email.archived = true;
    },
  },
};
</script>

<style scoped></style>
