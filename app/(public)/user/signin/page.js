'use client';

import React, { useState, useEffect } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';


const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);  
  const auth = getAuth();
  const params = useSearchParams();
  const router = useRouter();

  const returnUrl = params.get("returnUrl") || "/user/profile";

  useEffect(() => {
    
    setIsClient(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
     
      if (isClient) {
        await setPersistence(auth, browserSessionPersistence);  
        await signInWithEmailAndPassword(auth, email, password);
        router.push(returnUrl);
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(`Błąd: ${errorMessage}`);
    }
  };

  if (!isClient) {
    return null; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Logowanie</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" value="Adres e-mail" />
            <TextInput
              id="email"
              type="email"
              placeholder="Wprowadź adres e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" value="Hasło" />
            <TextInput
              id="password"
              type="password"
              placeholder="Wprowadź hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" gradientDuoTone="blueToPurple" className="w-full">
            Zaloguj się
          </Button>
        </form>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(SignInPage), { ssr: false });
