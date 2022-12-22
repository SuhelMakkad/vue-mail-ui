<template lang="">
  <div class="bulk-action-bar">
    <span class="checkbox">
      <input
        type="checkbox"
        @click="bulkSelect"
        :checked="allEmailsSelected"
        :class="{
          'partial-check': someEmailsSelected,
        }"
      />
    </span>

    <span class="buttons">
      <button
        @click="emailSelection.markRead()"
        :disabled="[...emailSelection.emails].every((e) => e.read)"
      >
        Mark Read
      </button>

      <button
        @click="emailSelection.markUnread()"
        :disabled="[...emailSelection.emails].every((e) => !e.read)"
      >
        Mark Unread
      </button>

      <button @click="handleArchive(screen)" :disabled="!selectedEmailsCount">
        {{ screen === "archive" ? "Unarchive" : "Archive" }}
      </button>
    </span>
  </div>
</template>

<script>
import { computed } from "vue";
import useEmailSelection from "../composables/use-email-selection";

export default {
  props: {
    screen: {
      type: String,
      required: true,
    },

    emails: {
      type: Array,
      required: true,
    },
  },

  setup(props) {
    const emailSelection = useEmailSelection();

    const selectedEmailsCount = computed(() => emailSelection.emails.size);
    const totalEmailCount = computed(() => props.emails.length);

    const allEmailsSelected = computed(() => selectedEmailsCount.value === totalEmailCount.value);
    const someEmailsSelected = computed(
      () => selectedEmailsCount.value > 0 && selectedEmailsCount.value < totalEmailCount.value
    );

    const bulkSelect = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
        return;
      }

      emailSelection.addMultiple(props.emails);
    };

    const handleArchive = (screen) => {
      if (screen === "archive") {
        emailSelection.unarchive();
        return;
      }

      emailSelection.archive();
    };

    return {
      emailSelection,
      selectedEmailsCount,
      allEmailsSelected,
      someEmailsSelected,
      bulkSelect,
      handleArchive,
    };
  },
};
</script>

<style scoped></style>
