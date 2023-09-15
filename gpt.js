import dotenv from 'dotenv';
import fetch, {
  Blob,
  blobFrom,
  blobFromSync,
  File,
  fileFrom,
  fileFromSync,
  FormData,
  Headers,
  Request,
  Response,
} from 'node-fetch'

if (!globalThis.fetch) {
  globalThis.fetch = fetch
  globalThis.Headers = Headers
  globalThis.Request = Request
  globalThis.Response = Response
}

import { ChatGPTUnofficialProxyAPI } from 'chatgpt';
import { oraPromise } from 'ora';

dotenv.config()

export const main = async (prompt, token) => {
  const api = new ChatGPTUnofficialProxyAPI({
    // optionally override the default reverse proxy URL (or use one of your own...)
    apiReverseProxyUrl: 'https://ai.fakeopen.com/api/conversation',
    accessToken: token,
    debug: false,
    fetch,
  })
  let res = await oraPromise(api.sendMessage(prompt));
  return res.text;
}

