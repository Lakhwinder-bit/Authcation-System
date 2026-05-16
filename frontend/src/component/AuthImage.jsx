export default function AuthImage({ isLogin }) {
  return (
    <div
      className={`lg:w-1/2 lg:block hidden h-full  transition-all duration-500 ease-in-out ${
        isLogin ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <img
        className="w-full h-full object-cover opacity-70 rounded-3xl"
        src="https://images.unsplash.com/photo-1607000975574-0b425df6975a?q=80&w=1074&auto=format&fit=crop"
        alt="auth"
      />
    </div>
  );
}