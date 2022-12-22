<template lang="">
  <div>
    <input
      type="checkbox"
      @click="bulkSelect"
      :checked="allEmailsSelected"
      :class="{
        'partial-check': someEmailsSelected,
      }"
    />
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

  setup({emails}) {
    const emailSelection = useEmailSelection();

    const selectedEmailsCount = computed(() => emailSelection.emails.size);
    const totalEmailCount = computed(() => emails.length);

    const allEmailsSelected = computed(() => totalEmailCount.value == selectedEmailsCount.value);
    const someEmailsSelected = computed(
      () => selectedEmailsCount.value > 0 && selectedEmailsCount.value < totalEmailCount.value
    );

    const bulkSelect = () => {
        console.log(allEmailsSelected.value);
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(emails)
      }
    };

    return {
      bulkSelect,
      allEmailsSelected,
      someEmailsSelected,
    };
  },
};
</script>

<style scoped></style>
