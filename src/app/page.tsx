"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function Home() {
  const [response, setResponse] = useState("");
  const [url, seturl] = useState("");
  return (
    <main className="flex min-h-screen flex-col items-center space-y-10 p-24">
      This is Curled Serpent
      <div className="flex w-[90vw] space-x-5 mx-5">
        <input
          type="text"
          value={url}
          className="text-black w-[90vw] px-2 py-1"
          onChange={(e) => seturl(e.target.value)}
          onKeyDown={(e) => pressedCtrlEnter(e) && callCURL(url, setResponse)}
          placeholder="URL"
        >
        </input>
        <button
          onClick={() => callCURL(url, setResponse)}
          className="border border-white px-4 py-2"
        >
          Send
        </button>
      </div>
      <pre className="h-[30vh] w-[90vw] px-5 py-2 border border-white scroll-m-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-corner-black  scrollbar-track-grey-700 ">
        {response}
      </pre>

      <button onClick={() => setResponse("")}>Clear</button>
    </main>
  );
}
async function callCURL(url: string, setResponse: Function) {
  let res: string = await invoke("get_request", {
    url,
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
