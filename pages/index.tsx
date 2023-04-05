import Head from "next/head";
import { useState } from "react";

const c = {
  button:
    "bg-black active:opacity-50 duration-200 text-white rounded-l-full rounded-r-full p-4 text-xl",
  divider: "bg-black h-px my-8",
};

const STATES = [
  { name: "READY", c: "bg-zinc-200" },
  { name: "LOADING", c: "bg-blue-200 text-blue-700" },
  { name: "CREATED", c: "bg-green-200 text-green-700" },
  { name: "ERROR", c: "bg-red-200 text-red-700" },
  { name: "NOT_SUPPORTED", c: "bg-zinc-200" },
] as const;

const getStateTagOffset = (state: typeof STATES[number]["name"]) => {
  const index = STATES.findIndex(({ name }) => name === state);
  const ch = STATES.slice(0, index).reduce((acc, v) => acc + v.name.length, 0);
  const rem = index * 2 * 0.25 + index * 1.25;
  return `calc(-${ch}ch - ${rem}rem)`;
};

export default function Home() {
  const [state, setState] = useState<typeof STATES[number]["name"]>("READY");
  const [credential, setCredential] = useState<null | Credential>(null);
  return (
    <>
      <Head>
        <title>Web Authentication API Demo</title>
        <meta name="description" content="Web Authentication API Demo" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="p-5 overflow-hidden">
        <h1 className="font-serif text-6xl break-words font-extrabold pr-10">
          Web
          <br />
          Authentication
          <br />
          API
          <br />
          Demo
        </h1>
        <div className={c.divider}></div>
        <div>
          <button
            className={c.button}
            onClick={() => {
              if (navigator.credentials) {
                setState("LOADING");
                navigator.credentials
                  .create({
                    publicKey: {
                      challenge: new ArrayBuffer(12),
                      pubKeyCredParams: [],
                      rp: {
                        name: "RP_NAME",
                      },
                      user: {
                        displayName: "USER_DISPLAY_NAME",
                        id: new ArrayBuffer(12),
                        name: "USER_NAME",
                      },
                    },
                  })
                  .then((c) => {
                    setCredential(c);
                    setState("CREATED");
                  })
                  .catch((err) => {
                    console.log(err);
                    setState("ERROR");
                  });
              } else {
                setState("NOT_SUPPORTED");
              }
            }}
          >
            CREATE
          </button>
        </div>
        <div className={c.divider}></div>
        <div className="px-3">
          <div
            className="space-x-5 w-max duration-200"
            style={{ transform: `translateX(${getStateTagOffset(state)})` }}
          >
            {STATES.map((STATE) => {
              const selected = STATE.name === state;
              return (
                <p
                  className={`inline-block font-mono p-1 rounded duration-200 ${
                    STATE.c
                  } ${selected ? "scale-125" : "opacity-30"}`}
                  key={STATE.name}
                >
                  {STATE.name}
                </p>
              );
            })}
          </div>
        </div>
      </main>
      <footer className="pt-48 pb-24">
        <a
          className="block text-zinc-400 text-sm text-center"
          href="https://github.com/lee-donghyun"
        >
          github@lee-donghyun
        </a>
      </footer>
    </>
  );
}
