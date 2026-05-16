export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-yellow-400 text-black p-3 rounded-full font-semibold hover:bg-yellow-500"
    >
      {text}
    </button>
  );
}