import { onBeforeUnmount } from "vue";

const useKeyDown = (keyCombos) => {
  const onKeydown = (event) => {
    const keyCombo = keyCombos.find((kc) => kc.key === event.key);

    if (keyCombo) keyCombo.fn();
  };

  window.addEventListener("keydown", onKeydown);

  onBeforeUnmount(() => {
    window.removeEventListener("keydown", onKeydown);
  });
};

export default useKeyDown;
