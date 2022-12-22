<template>
  <button @click="selectScreen('inbox')" :disabled="selectedScreen === 'inbox'">Inbox</button>
  <button @click="selectScreen('archive')" :disabled="selectedScreen === 'archive'">Archived</button>

  <BulkActionBar :emails="filteredEmails" />

  <table class="mail-table">
    <tr
      v-for="email in filteredEmails"
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

  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
import { ref } from "vue";
import axios from "axios";

import useEmailSelection from "../composables/use-email-selection";

import BulkActionBar from "./BulkActionBar.vue";
import MailView from "./MailView.vue";
import ModalView from "./ModalView.vue";

export default {
  components: { BulkActionBar, MailView, ModalView },

  async setup() {
    const res = await axios.get("/assets/dummy-data/dummy-data.json");

    const emails = ref(res.data);
    const openedEmail = ref(null);
    const selectedScreen = ref("inbox");

    return {
      emailSelection: useEmailSelection(),
      emails,
      openedEmail,
      selectedScreen,
    };
  },

  computed: {
    sortedEmail() {
      return this.emails?.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1));
    },

    filteredEmails() {
      if (this.selectedScreen === "archive") {
        return this.emails?.filter((email) => email.archived);
      }

      return this.emails?.filter((email) => !email.archived);
    },
  },

  methods: {
    selectScreen(screen) {
      this.selectedScreen = screen
      this.emailSelection.clear()
    },

    openEmail(email) {
      this.openedEmail = email;

      if (email) {
        email.read = true;
      }
    },

    archiveEmail(email) {
      email.archived = true;
    },

    changeEmail({ toggleRead, toggleArchive, changeIndex, closeModal }) {
      const emails = this.filteredEmails;
      const email = this.openedEmail;

      if (toggleRead) {
        email.read = !email.read;
      }

      if (toggleArchive) {
        email.archive = !email.archive;
      }

      if (closeModal) {
        this.openedEmail = null;
      }

      if (changeIndex) {
        const currIndex = emails.findIndex((e) => e.id === email.id);
        const nextIndex = currIndex + changeIndex;

        this.openEmail(emails[nextIndex]);
      }
    },
  },
};
</script>

<style scoped></style>
