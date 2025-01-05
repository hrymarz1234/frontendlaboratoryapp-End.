'use client';

import React from "react";
import { signOut, getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "flowbite-react";

export default function LogoutForm() {
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await signOut(getAuth());
      router.push("/");
    } catch (error) {
      console.error("Błąd podczas wylogowywania:", error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Czy na pewno chcesz się wylogować?</h2>
        <Button 
          type="submit" 
          gradientDuoTone="greenToBlue" 
          className="w-full py-3 text-xl font-semibold transition-colors duration-300 hover:bg-green-600 focus:ring-4 focus:ring-green-300"
        >
          Wyloguj się
        </Button>
      </div>
    </form>
  );
}