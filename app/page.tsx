export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <textarea className="w-full h-96 p-4 bg-gray-100 rounded-lg text-gray-900" />
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">
        Submit
      </button>
    </main>
  );
}
