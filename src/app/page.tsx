"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");
  const [url, seturl] = useState("");
  const [method, setMethod] = useState("get_request");
  const [input, setInput] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center space-y-10 py-14">
      <div className="flex w-[97vw] space-x-5 mx-5">
        <select
          className="border border-white px-1 py-2 text-black rounded-none bg-black"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          <option value={"get_request"}>GET</option>
          <option value={"post_request"}>POST</option>
          <option value={"put_request"}>PUT</option>
          <option value={"delete_request"}>DELETE</option>
        </select>
        <input
          type="text"
          value={url}
          className="text-black w-[90vw] px-2 py-1"
          onChange={(e) => seturl(e.target.value)}
          onKeyDown={(e) =>
            pressedCtrlEnter(e) && callCURL(url, method, input, setResponse)}
          placeholder="URL"
        />
        <button
          onClick={() => callCURL(url, method, input, setResponse)}
          className="border border-white px-4 py-2"
        >
          Send
        </button>
      </div>
      <input
        type="text"
        className="h-[30vh] w-[97vw] px-3 py-2 border border-white scroll-m-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-corner-black scrollbar-track-grey-700 text-black "
        placeholder="INPUT"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <pre className="h-[31vh] w-[97vw] px-3 py-2 border border-white scroll-m-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-corner-black scrollbar-track-grey-700 ">
        {response}
      </pre>
      <button onClick={() => setResponse("")}>Clear</button>
    </main>
  );
}
async function callCURL(
  url: string,
  method: string,
  input: string,
  setResponse: Function,
) {
  let res: string = await invoke(method, {
    url,
    data: input,
  });
  let formatedHTML = formatHTML(res);
  setResponse(formatedHTML);
}
//Formats and returns HTML string.Ignores if anything else
function formatHTML(html: string) {
  var tab = "\t";
  var result = "";
  var indent = "";

  html.split(/>\s*</).forEach(function(element) {
    if (element.match(/^\/\w/)) {
      indent = indent.substring(tab.length);
    }

    result += indent + "<" + element + ">\r\n";

    if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith("input")) {
      indent += tab;
    }
  });

  return result.substring(1, result.length - 3);
}
function pressedCtrlEnter(e: any) {
  if (e.keyCode === 13 && e.ctrlKey) {
    return true;
  }
  return false;
}
