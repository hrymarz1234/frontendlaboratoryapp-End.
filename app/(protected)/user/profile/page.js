'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import Image from 'next/image'; // Import komponentu Image z next/image

const ProfilePage = () => {
  const auth = getAuth();
  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      displayName: '',
      photoURL: '',
      city: '',
      zipCode: '',
      street: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        const fetchUserData = async () => {
          try {
            const docRef = doc(db, 'users', user.uid);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
              const data = snapshot.data();
              const address = data.address || { city: '', zipCode: '', street: '' };
              setValue('email', user.email || '');
              setValue('displayName', user.displayName || '');
              setValue('photoURL', user.photoURL || '');
              setValue('city', address.city);
              setValue('zipCode', address.zipCode);
              setValue('street', address.street);
            } else {
              setError('Nie znaleziono dokumentu dla tego użytkownika.');
            }
          } catch (error) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        };
        fetchUserData();
      } else {
        setCurrentUser(null);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [auth, router, setValue]); // Dodaj zależności, aby hook reagował na zmiany

  const onSubmit = async (data) => {
    try {
      const docRef = doc(db, 'users', currentUser?.uid);
      const { city, zipCode, street, ...rest } = data;
      await setDoc(docRef, {
        ...rest,
        address: { city, zipCode, street },
      }, { merge: true });
      alert('Profil został zaktualizowany');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Wystąpił błąd podczas aktualizacji profilu.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/user/signout'); 
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Wystąpił błąd podczas wylogowywania.');
    }
  };

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Edytuj Profil</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Nazwa wyświetlana
            </label>
            <input
              type="text"
              id="displayName"
              {...register('displayName')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded bg-gray-200 cursor-not-allowed"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">
              Zdjęcie profilowe URL
            </label>
            <input
              type="url"
              id="photoURL"
              {...register('photoURL')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
            {watch('photoURL') && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Podgląd zdjęcia:</p>
                <Image
                  src={watch('photoURL')}
                  alt="Podgląd zdjęcia"
                  width={128} // Ustaw szerokość
                  height={128} // Ustaw wysokość
                  className="mt-2 rounded border border-gray-300"
                />
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="street" className="block text-sm font-medium text-gray-700">
              Ulica
            </label>
            <input
              type="text"
              id="street"
              {...register('street')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              Miasto
            </label>
            <input
              type="text"
              id="city"
              {...register('city')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Kod pocztowy
            </label>
            <input
              type="text"
              id="zipCode"
              {...register('zipCode')}
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Zaktualizuj profil
          </button>
        </form>

        <button
          onClick={handleSignOut}
          className="w-full mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Wyloguj się
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
