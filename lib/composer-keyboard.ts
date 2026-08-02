export type ComposerKeyState = {
  key: string;
  shiftKey: boolean;
  compositionActive: boolean;
  nativeIsComposing: boolean;
  keyCode: number;
};

export function shouldSubmitComposerKey(state: ComposerKeyState) {
  return (
    state.key === "Enter" &&
    !state.shiftKey &&
    !state.compositionActive &&
    !state.nativeIsComposing &&
    state.keyCode !== 229
  );
}
