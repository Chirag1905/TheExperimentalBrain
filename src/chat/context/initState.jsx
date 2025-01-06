export const initState = {
  conversation: [],
  current: 0,
  search_text: "",
  selected_grade: "",
  selected_attachment: "",
  chat: [],
  chats: [
    {
      title: "Generate useLocalStorage",
      id: 321123123,
      ct: "2023-12-12",
      messages: [
        {
          content: "Hello, I'm The Experimental Brain! Ask me anything!",
          sentTime: "1682827639323",
          role: "user",
          id: 123,
        },
      ],
    },
    {
      title: "Generate a React hooks  useLocalStorage",
      ct: "2023-12-12",
      id: 92839,
      messages: [
        {
          id: 1682511616366,
          sentTime: "1682827639313",
          role: "user",
          content: "Write a Modal component in React\n",
        },
        {
          id: 1682511616366,
          sentTime: "1681827632313",
          role: "assistant",
          content:
            'Write a Modal component in React：\n\n```jsx\nimport React, { useState } from \'react\';\n\nconst Modal = ({ isOpen, onClose, children }) => {\n  const [isModalOpen, setIsModalOpen] = useState(isOpen);\n\n  const handleClose = () => {\n    setIsModalOpen(false);\n    onClose();\n  };\n\n  return (\n    <>\n      {isModalOpen && (\n        <div className="modal">\n          <div className="modal-content">\n            <span className="close" onClick={handleClose}>\n              &times;\n            </span>\n            {children}\n          </div>\n        </div>\n      )}\n    </>\n  );\n};\n\nexport default Modal;\n```\n\nIn this component, we use the useState hook to track whether the modal is open. When the isOpen prop changes, we update the state to reflect the new value. \n\nWe also define a function called handleClose, which will close the modal and call the onClose callback function (if there is one). \n\nFinally, we return a div element containing the content of the modal box, and decide whether to render the element based on the isModalOpen state.',
        },
      ],
    },
    {
      title: "ex",
      ct: "2032-12-23",
      id: 2381923,
      messages: [],
    },
  ],
  currentChat: 0,
  options: {
    account: {
      name: "CHAT——AI",
      avatar: "",
    },
    general: {
      language: "English",
      theme: "light",
      command: "ENTER",
      size: "normal",
    },
    openai: {
      baseUrl: "",
      organizationId: "",
      temperature: 1,
      model: "gpt-4-turbo",
      apiKey: "",
      max_tokens: 2048,
      n: 1,
      stream: true,
    },
  },
  is: {
    typeing: false,
    config: false,
    fullScreen: true,
    sidebar: true,
    inputing: false,
    thinking: false,
    apps: true,
    ChatRegister: false,
    ChatApi: false,
    ChatInstitution: false,
  },
  typeingMessage: {},
  version: "0.1.0",
  cotent: "",
};
