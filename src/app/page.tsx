"use client";

import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function Home() {
  const [msg, setmsg] = useState("");
  const [url, seturl] = useState("");
  const [count, setCount] = useState<number>(0);
  return (
    <main className="flex min-h-screen flex-col items-center space-y-10 p-24">
      This is Curled Serpent
      <div className="flex w-[90vw] space-x-5 mx-5" >
        <input
          type="text"
          value={url}
          className="text-black w-[90vw] px-2 py-1"
          onChange={(e) => seturl(e.target.value)}
          placeholder="URL"
        >
        </input>
        <button
          onClick={async () => {
            setCount(count + 1);
            let res: string = await invoke("get_request", {
              url,
            });
            setmsg(res);
          }}
          className="border border-white px-4 py-2"
        >
          Send
        </button>
      </div>
      <pre className="h-[30vh] w-[90vw] px-5 py-2 border border-white scroll-m-1 overflow-scroll  ">
        {msg}
      </pre>

      <button onClick={() => setmsg("")}>Clear</button>
    </main>
  );
}
