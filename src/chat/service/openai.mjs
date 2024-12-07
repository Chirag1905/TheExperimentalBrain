import { createParser } from "eventsource-parser";
import { setAbortController } from "./abortController.mjs";

export async function* streamAsyncIterable(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export const fetchBaseUrl = (baseUrl, modelType) => {
  let url = baseUrl || "https://api.openai.com/v1/chat/completions";
  if (modelType === "image") {
    url = "https://api.openai.com/v1/images/generations";
  }
  return url;
};

export const fetchHeaders = (options = {}) => {
  const { organizationId, apiKey } = options;
  return {
    Authorization: "Bearer " + apiKey,
    "Content-Type": "application/json",
    ...(organizationId && { "OpenAI-Organization": organizationId }),
  };
};

export const throwError = async (response) => {
  if (!response.ok) {
    let errorPayload = null;
    try {
      errorPayload = await response.json();
      // console.log(errorPayload);
    } catch (e) {
      // ignore
    }
  }
};

export const fetchBody = ({ options = {}, messages = [] }) => {
  const {
    top_p,
    n,
    max_tokens,
    temperature,
    model,
    stream,
    modelType,
    searchContent,
  } = options;
  let body = {
    n: 1,
    ...(model && { model }),
    ...(n && { n }),
  };
  if (modelType === "image") {
    body = {
      ...body,
      size: "1024x1024",
      prompt: searchContent,
      model: "dall-e-3",
    };
  } else {
    body = {
      ...body,
      messages,
      stream,
      ...(temperature && { temperature }),
      ...(max_tokens && { max_tokens }),
      ...(top_p && { top_p }),
    };
  }
  return body;
};

export const fetchAction = async ({
  method = "POST",
  messages = [],
  options = {},
  signal,
}) => {
  const { baseUrl, ...rest } = options;
  const lastMsg = messages[messages.length - 1];
  let prompt = "";
  if (lastMsg && lastMsg.content) {
    prompt = lastMsg.content.replace(rest.modelType, "").trim();
    options.searchContent = prompt;
  }
  let url = fetchBaseUrl(baseUrl, rest.modelType);
  const headers = fetchHeaders({ ...rest });
  const excludeImages = messages.filter((x) => x.type !== "image");
  const body = JSON.stringify(fetchBody({ messages: excludeImages, options }));
  const response = await fetch(url, {
    method,
    headers,
    body,
    signal,
  });
  return response;
};

export const fetchStream = async ({
  options,
  messages,
  onMessage,
  onProcessImageMessage,
  onEnd,
  onError,
  onStar,
}) => {
  let answer = "";
  const { controller, signal } = setAbortController();

  const { modelType } = options;
  const result = await fetchAction({ options, messages, signal }).catch(
    (error) => {
      onError && onError(error, controller);
    }
  );
  if (!result) return;
  if (!result.ok) {
    const error = await result.json();
    onError && onError(error);
    return;
  }

  const parser = createParser((event) => {
    if (event.type === "event") {
      if (event.data === "[DONE]") {
        return;
      }
      let data;
      try {
        data = JSON.parse(event.data);
      } catch (error) {
        return;
      }
      if ("content" in data.choices[0].delta) {
        answer += data.choices[0].delta.content;
        onMessage && onMessage(answer, controller);
      }
    }
  });
  let hasStarted = false;
  for await (const chunk of streamAsyncIterable(result.body)) {
    const str = new TextDecoder().decode(chunk);
    // console.log(localStorage.getItem("stop"),"SESSIONS")

    if (localStorage.getItem("stop") === "true") {
      parser.feed(str);
    }
    if (!hasStarted) {
      hasStarted = true;
      onStar && onStar(str, controller);
    }

    if (str && modelType && modelType === "image") {
      const response = JSON.parse(str);
      if (
        onProcessImageMessage &&
        response &&
        response.data &&
        response.data.length
      ) {
        response.data.forEach((item) => {
          onProcessImageMessage(item.url);
        });
      }
    }
  }
  await onEnd();
};
