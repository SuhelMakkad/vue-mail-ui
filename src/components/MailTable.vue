<template>
  <button @click="selectScreen('inbox')" :disabled="selectedScreen === 'inbox'">Inbox</button>
  <button @click="selectScreen('archive')" :disabled="selectedScreen === 'archive'">
    Archived
  </button>

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
import { ref, computed } from "vue";
import axios from "axios";

import useEmailSelection from "../composables/use-email-selection";

import BulkActionBar from "./BulkActionBar.vue";
import MailView from "./MailView.vue";
import ModalView from "./ModalView.vue";

export default {
  components: { BulkActionBar, MailView, ModalView },

  async setup() {
    const emailSelection = useEmailSelection();

    const res = await axios.get("/assets/dummy-data/dummy-data.json");
    const emails = ref(res.data);
    const openedEmail = ref(null);
    const selectedScreen = ref("inbox");

    const sortedEmail = computed(() =>
      emails.value.sort((e1, e2) => (e1.sentAt < e2.sentAt ? 1 : -1))
    );

    const filteredEmails = computed(() =>
      emails.value.filter((email) =>
        selectedScreen.value === "archive" ? email.archived : !email.archived
      )
    );

    const selectScreen = (screen) => {
      selectedScreen.value = screen;
      emailSelection.clear();
    };

    const openEmail = (email) => {
      openedEmail.value = email;

      if (email) {
        email.read = true;
      }
    };

    const archiveEmail = (email) => {
      email.archived = true;
    };

    const changeEmail = ({ toggleRead, toggleArchive, changeIndex, closeModal }) => {
      const emails = filteredEmails.value;
      const email = openedEmail.value;

      if (toggleRead) {
        email.read = !email.read;
      }

      if (toggleArchive) {
        email.archive = !email.archive;
      }

      if (closeModal) {
        openedEmail.value = null;
      }

      if (changeIndex) {
        const currIndex = emails.findIndex((e) => e.id === email.id);
        const nextIndex = currIndex + changeIndex;

        openEmail(emails[nextIndex]);
      }
    };

    return {
      emailSelection,
      sortedEmail,
      filteredEmails,
      emails,
      openedEmail,
      selectedScreen,
      selectScreen,
      openEmail,
      archiveEmail,
      changeEmail,
    };
  },
};
</script>

<style scoped></style>
