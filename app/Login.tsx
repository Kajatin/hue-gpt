"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/helpers/firebaseHandler";
import { AnimatePresence, motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingUp, setSigningUp] = useState(false);

  const router = useRouter();

  const signUpWithEmailAndPasswordHandler = (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/");
      })
      .catch((error) => {
        setAuthError(error.message);
      });
  };

  const signInWithEmailAndPasswordHandler = (event: React.FormEvent<HTMLFormElement>, email: string, password: string) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push("/");
      })
      .catch((error) => {
        setAuthError(error.message);
      });
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    if (name === "userEmail") {
      setEmail(value);
    } else if (name === "userPassword") {
      setPassword(value);
    }
  };

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        setAuthError(null);
      }, 10000);
    }
  }, [authError]);

  return (
    <div className="flex flex-col gap-6 justify-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="flex flex-row gap-1">
        <h1 className="text-2xl text-center font-bold">HueGPT</h1>
        <Image src="/light-bulb.png" width={40} height={40} alt={""} className="-mt-2" />
      </div>
      <AnimatePresence>
        <div className="flex flex-col gap-3">
          {authError && (
            <motion.div
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-red-500 text-sm font-medium bg-zinc-800 p-1.5 rounded-lg"
            >
              {authError}
            </motion.div>
          )}

          <form className="flex flex-col gap-2">
            <label htmlFor="userEmail" className="block">
              Email:
            </label>
            <input
              id="userEmail"
              type="email"
              name="userEmail"
              className="block rounded-lg px-3 py-2 bg-zinc-700 outline-none"
              value={email}
              placeholder="user@example.com"
              onChange={(event) => onChangeHandler(event)}
            />

            <label htmlFor="userPassword" className="block mt-1">
              Password:
            </label>
            <input
              id="userPassword"
              type="password"
              name="userPassword"
              className="block rounded-lg px-3 py-2 bg-zinc-700 outline-none"
              value={password}
              placeholder="····"
              onChange={(event) => onChangeHandler(event)}
            />

            <button
              className="bg-fuchsia-900 hover:bg-opacity-80 bg-opacity-50 text-white w-full py-2 rounded-lg mt-4"
              onClick={(event: any) => {
                if (signingUp) {
                  signUpWithEmailAndPasswordHandler(event, email, password);
                } else {
                  signInWithEmailAndPasswordHandler(event, email, password);
                }
              }}
            >
              {signingUp ? "Sign up" : "Sign in"}
            </button>
          </form>

          <button
            className="text-center text-sm text-white/50 hover:text-white/60 transition-all mt-2"
            onClick={() => {
              setSigningUp((prev) => !prev);
            }}
          >
            {signingUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
          </button>
        </div>
      </AnimatePresence>
    </div>
  );
}
