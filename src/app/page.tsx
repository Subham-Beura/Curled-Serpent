"use client";

import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Response = {
  headers: any;
  status: string;
  body: string;
  error?: string;
};
const blankResponse: Response = {
  headers: "",
  status: "",
  body: "",
};

export default function Home() {
  const [response, setResponse] = useState<Response>(blankResponse);
  const [url, seturl] = useState("");
  const [method, setMethod] = useState("get_request");
  const [body, setBody] = useState("{\n\t\n\t\n}");
  return (
    <main
      onKeyDown={(e) =>
        pressedCtrlEnter(e) && callCURL(url, method, body, setResponse)}
      className="flex min-h-screen flex-col items-center justify-between "
    >
      <div className="pt-4">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
          CURLED SERPENT
        </h1>
        <p className="text-l text-muted-foreground text-center">
          A light-weight REST client.
        </p>
      </div>
      <div className="flex w-[97vw] space-x-5 mx-5">
        <Select
          value={method}
          onValueChange={(value) => setMethod(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="GET" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>HTTP Requests</SelectLabel>
              <SelectItem value={"get_request"}>GET</SelectItem>
              <SelectItem value={"post_request"}>POST</SelectItem>
              <SelectItem value={"put_request"}>PUT</SelectItem>
              <SelectItem value={"delete_request"}>DELETE</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          type="text"
          value={url}
          className="text-black w-[90vw] px-2 py-1"
          onChange={(e) => seturl(e.target.value)}
          onKeyDown={(e) =>
            pressedCtrlEnter(e) && callCURL(url, method, body, setResponse)}
          placeholder="URL"
        />
        <Button
          onClick={() => callCURL(url, method, body, setResponse)}
          className="border border-white px-4 py-2"
        >
          Send
        </Button>
      </div>
      <div>
        <Label htmlFor="body">Body</Label>
        <Textarea
          className="h-[30vh] w-[97vw] px-3 py-2 border border-white scroll-m-1 overflow-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-corner-black scrollbar-track-grey-700 text-black "
          placeholder=""
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Tab") e.preventDefault();
          }}
        >
        </Textarea>
      </div>
      <div>
        <Label htmlFor="response">Response</Label>

        <Tabs defaultValue="body" className="">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
            </TabsList>
            <h3>{response.status}</h3>
          </div>
          <TabsContent value="body">
            <pre className="h-[31vh] w-[97vw]  py-2 overflow-auto ">
              <ScrollArea className="h-full w-full py-2 shadow-md">
                {response.body}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </pre>
          </TabsContent>
          <TabsContent value="headers">
            <pre className="h-[31vh] w-[97vw]  py-2 overflow-auto ">
              <ScrollArea className="h-full w-full py-2 shadow-md">
                {response.headers && JSON.stringify(response.headers, null, 3)}
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </pre>
          </TabsContent>
        </Tabs>
        <Button
          variant="outline"
          className="px-0 w-full text-left  "
          onClick={() => setResponse(blankResponse)}
        >
          Clear Response
        </Button>
      </div>
      <footer>
        {
          //There is heart imoji in samll tag. Might not be visible
        }
        <small className="text-sm font-medium leading-none">
          Made With ❤️ by Subham Beura
        </small>
      </footer>
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
  let response = JSON.parse(res);
  console.log(response);
  if (!response.body) {
    setResponse(response);
    return;
  }
  let formatedHTML = formatHTML(response.body);
  setResponse({ ...response, body: formatedHTML });
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
