export const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
export const shortcutKey = isMac ? "Command+Enter" : "Ctrl+Enter";
export const keyborad = {
  Command: "Window",
  Option: "Alt",
  Control: "Ctrl",
  Shift: "Shift",
};

export const keyboradArray = isMac
  ? Object.keys(keyborad)
  : Object.values(keyborad);
  
export const themeOptions = [
  {
    label: "Auto",
    value: "auto",
  },
  {
    label: "Light",
    value: "light",
  },
  {
    label: "Dark",
    value: "dark",
  },
];

export const sendCommandOptions = [
  {
    label: "ENTER",
    value: "ENTER",
  },  
  {
    label: "CTRL_ENTER",
    value: "COMMAND_ENTER",
  },
  {
    label: "ALT_ENTER",
    value: "ALT_ENTER",
  },
];

export const modelOptions = [
  {
    label: "gpt-4",
    value: "gpt-4",
  },
];

export const languageOptions = [
  {
    label: "English",
    value: "en",
  },  
];

export const sizeOptions = [
  {
    label: "Small",
    value: "small",
  },
  {
    label: "Default",
    value: "default",
  },
  {
    label: "Middle",
    value: "middle",
  },
  {
    label: "Large",
    value: "large",
  },
];
