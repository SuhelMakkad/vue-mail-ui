<template>
  <table class="mail-table">
    <tr
      v-for="email in unArchivedEmails"
      :key="email.id"
      @click="openEmail(email)"
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

  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" />
  </ModalView>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

import MailView from "./MailView.vue";
import ModalView from "./ModalView.vue";

export default {
  components: { MailView, ModalView },

  async setup() {
    const res = await axios.get("/assets/dummy-data/dummy-data.json");
    const emails = ref(res.data);
    const openedEmail = ref(null);

    return { emails, openedEmail };
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
    openEmail(email) {
      email.read = true;
      this.openedEmail = email;
    },
    archiveEmail(email) {
      email.archived = true;
    },
  },
};
</script>

<style scoped></style>
