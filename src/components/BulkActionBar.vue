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

      <button @click="emailSelection.archive()" :disabled="!selectedEmailsCount">Archive</button>
    </span>
  </div>
</template>

<script>
import useEmailSelection from "../composables/use-email-selection";
import { computed } from "vue";

export default {
  props: {
    emails: {
      type: Array,
      required: true,
    },
  },

  setup({ emails }) {
    const emailSelection = useEmailSelection();

    const selectedEmailsCount = computed(() => emailSelection.emails.size);
    const totalEmailCount = computed(() => emails.length);

    const allEmailsSelected = computed(() => totalEmailCount.value == selectedEmailsCount.value);
    const someEmailsSelected = computed(
      () => selectedEmailsCount.value > 0 && selectedEmailsCount.value < totalEmailCount.value
    );

    const bulkSelect = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(emails);
      }
    };

    return {
      emailSelection,
      bulkSelect,
      selectedEmailsCount,
      allEmailsSelected,
      someEmailsSelected,
    };
  },
};
</script>

<style scoped></style>
