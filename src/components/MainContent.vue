<template>
  <button @click="selectScreen('inbox')" :disabled="selectedScreen === 'inbox'">Inbox</button>
  <button @click="selectScreen('archive')" :disabled="selectedScreen === 'archive'">
    Archived
  </button>

  <BulkActionBar :emails="filteredEmails" />

  <MailTable :emails="filteredEmails" @openEmail="openEmail" @archiveEmail="archiveEmail" />

  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
import { ref, computed } from "vue";
import axios from "axios";

import useEmailSelection from "../composables/use-email-selection";

import MailTable from "./MailTable.vue";
import BulkActionBar from "./BulkActionBar.vue";
import ModalView from "./ModalView.vue";
import MailView from "./MailView.vue";

export default {
  components: { BulkActionBar, MailView, ModalView, MailTable },

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
