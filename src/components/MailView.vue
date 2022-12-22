<template>
  <div class="email-display">
    <div>
      <button @click="toggleArchive">
        {{ email.archive ? "Move to Inbox (e)" : "Archive (e)" }}
      </button>

      <button @click="toggleRead">
        {{ email.read ? "Mark Unread (r)" : "Mark Read (r)" }}
      </button>
      <button @click="goOlder">Older (j)</button>
      <button @click="goNewer">Newer (k)</button>
    </div>

    <h2 class="mb-0">
      Subject: <strong>{{ email.subject }}</strong>
    </h2>

    <div>
      <em>
        From {{ email.from }} on
        {{ new Intl.DateTimeFormat("en-US").format(new Date(email.sentAt)) }}
      </em>
    </div>

    <div class="mt-4">{{ email.body }}</div>
  </div>
</template>

<script>
import useKeyDown from "../composables/use-keydown";

export default {
  props: {
    email: {
      type: Object,
      required: true,
    },
  },

  setup(props, { emit }) {
    const { email } = props;

    const toggleRead = () => {
      emit("changeEmail", {
        id: email.id,
        toggleRead: true,
      });
    };

    const toggleArchive = () => {
      emit("changeEmail", {
        id: email.id,
        toggleArchive: true,
        closeModal: true,
      });
    };

    const goNewer = () => {
      emit("changeEmail", {
        id: email.id,
        changeIndex: 1,
      });
    };

    const goOlder = () => {
      emit("changeEmail", {
        id: email.id,
        changeIndex: -1,
      });
    };

    const goNewerAndArchive = () => {
      emit("changeEmail", {
        id: email.id,
        changeIndex: 1,
        toggleArchive: true,
      });
    };

    const goOlderAndArchive = () => {
      emit("changeEmail", {
        id: email.id,
        changeIndex: -1,
        toggleArchive: true,
      });
    };

    useKeyDown([
      { key: "r", fn: toggleRead },
      { key: "e", fn: toggleArchive },
      { key: "k", fn: goNewer },
      { key: "j", fn: goOlder },
      { key: "[", fn: goNewerAndArchive },
      { key: "]", fn: goOlderAndArchive },
    ]);

    return { toggleRead, toggleArchive, goNewer, goOlder };
  },
};
</script>

<style scoped></style>
