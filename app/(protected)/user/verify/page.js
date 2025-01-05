"use client";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {
  const auth = getAuth();
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
   
      signOut(auth)
        .then(() => {
          console.log("User signed out");
        })
        .catch((error) => {
          console.error("Error signing out: ", error);
        });
    }
  }, [user, auth]);

  return (
    <>
      <h1>Email not verified</h1>
      <p>
        Verify clicking on the link sent to your email address: <strong>{user?.email}</strong>
      </p>
    </>
  );
}