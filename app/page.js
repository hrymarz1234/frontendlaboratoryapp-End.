import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100 text-gray-800 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-5xl font-bold text-center sm:text-left text-gray-800">
          Projekt Zaliczeniowy
        </h1>
        <p className="text-center sm:text-left text-lg sm:text-xl max-w-xl text-gray-600">
          Aplikacja służy jako projekt zaliczeniowy. Obsługuje grę &quot;Simon Mówi&quot; oraz autoryzację i weryfikację
          kont użytkowników za pomocą Firebase. Projekt stworzony za pomocą Next.js
        </p>
        <p className="text-center sm:text-left text-lg sm:text-xl max-w-xl text-gray-600">
          Hubert Rymarz
        </p>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm sm:text-base text-gray-500">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to nextjs.org &rarr;
        </a>
      </footer>
    </div>
  );
}
