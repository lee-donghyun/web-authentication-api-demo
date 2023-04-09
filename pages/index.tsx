import { getBuffer } from "@/service/util";
import Head from "next/head";
import { useState } from "react";
import { decode } from "cbor";

const c = {
  button:
    "active:opacity-50 duration-200 rounded-l-full rounded-r-full p-4 text-xl",
  divider: "bg-black h-px my-8",
};

const STATES = [
  { name: "READY", c: "bg-zinc-200" },
  { name: "LOADING", c: "bg-blue-200 text-blue-700" },
  { name: "CREATED", c: "bg-green-200 text-green-700" },
  { name: "GOT", c: "bg-cyan-200 text-cyan-700" },
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
  const [credential, setCredential] = useState<null | PublicKeyCredential>(
    null
  );

  if (credential) {
    const attestationObject = decode(
      (credential.response as AuthenticatorAttestationResponse)
        .attestationObject
    );
    const publicKeyBytes = attestationObject.authData.slice(33, 65);
    const publicKey = crypto.subtle
      .importKey(
        "raw",
        publicKeyBytes,
        { name: "ECDSA", namedCurve: "P-256" },
        true,
        ["verify"]
      )
      .then(console.log)
      .catch((...args) => console.error(args));
  }

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
        <div className="flex gap-5">
          <button
            className={`bg-black text-white ${c.button}`}
            onClick={() => {
              if (navigator.credentials) {
                setState("LOADING");
                navigator.credentials
                  .create({
                    publicKey: {
                      challenge: getBuffer(),
                      pubKeyCredParams: [
                        {
                          alg: -7, // "ES256" as registered in the IANA COSE Algorithms registry
                          type: "public-key",
                        },
                      ],
                      rp: {
                        name: "RP_NAME",
                      },
                      user: {
                        displayName: "USER_DISPLAY_NAME",
                        id: getBuffer(),
                        name: "USER_NAME",
                      },
                    },
                  })
                  .then((c) => {
                    setCredential(c as PublicKeyCredential);
                    setState("CREATED");
                  })
                  .catch((err) => {
                    console.error(err);
                    setState("ERROR");
                  });
              } else {
                setState("NOT_SUPPORTED");
              }
            }}
          >
            CREATE
          </button>
          <button
            className={`bg-zinc-200 ${c.button}`}
            onClick={() => {
              if (navigator.credentials) {
                setState("LOADING");
                navigator.credentials
                  .get({
                    publicKey: { challenge: getBuffer() },
                  })
                  .then((c) => {
                    setCredential(c as PublicKeyCredential);
                    setState("GOT");
                  })
                  .catch((err) => {
                    console.error(err);
                    setState("ERROR");
                  });
              } else {
                setState("NOT_SUPPORTED");
              }
            }}
          >
            GET
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
        {credential && (
          <div className="bg-black font-mono text-white mt-8 p-3 text-sm">
            <p className="break-words whitespace-pre-line">
              {[
                `user credential\n`,
                `credential.id="${credential.id}"`,
                `credentail.type="${credential.type}"`,
                `credential.response.clientDataJSON="${new TextDecoder().decode(
                  credential.response.clientDataJSON
                )}`,
              ].join(`\n`)}
            </p>
          </div>
        )}
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
