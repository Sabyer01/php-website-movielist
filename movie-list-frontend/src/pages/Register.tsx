import { useState, type FormEvent } from "react";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof RegisterForm) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [field]: e.target.value });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    setTimeout(() => {
      setSubmitting(false);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-th-black flex">
      {/* Left - Form (40%) */}
      <div className="w-full lg:w-[40%] flex items-center justify-center p-8 lg:p-12 border-r border-th-border/20">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-th-accent mb-2 tracking-wide">
            REELIST
          </h1>
          <p className="text-th-owhite/90 text-sm mb-8">
            Create your account and start tracking.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-th-owhite/90 mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update("name")}
                required
                placeholder="Your name"
                className="w-full rounded-sm border border-th-border/30 bg-th-black/90 px-4 py-2.5 text-th-white placeholder:text-th-owhite/70 focus:outline-none focus:border-th-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-th-owhite/90 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={update("email")}
                required
                placeholder="you@example.com"
                className="w-full rounded-sm border border-th-border/30 bg-th-black/90 px-4 py-2.5 text-th-white placeholder:text-th-owhite/70 focus:outline-none focus:border-th-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-th-owhite/90 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={update("password")}
                required
                placeholder="••••••••"
                className="w-full rounded-sm border border-th-border/30 bg-th-black/90 px-4 py-2.5 text-th-white placeholder:text-th-owhite/70 focus:outline-none focus:border-th-accent transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-th-owhite/90 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                value={form.password_confirmation}
                onChange={update("password_confirmation")}
                required
                placeholder="••••••••"
                className="w-full rounded-sm border border-th-border/30 bg-th-black/90 px-4 py-2.5 text-th-white placeholder:text-th-owhite/70 focus:outline-none focus:border-th-accent transition-colors"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 w-full py-2.5 rounded-sm bg-th-accent text-th-black font-medium hover:brightness-110 transition-all disabled:opacity-60"
            >
              {submitting ? "Creating account…" : "Register"}
            </button>

            <p className="text-sm text-th-descrip text-center mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-th-accent hover:underline">
                Log in
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Right - About (60%) */}
      <div className="hidden lg:flex w-[60%] relative items-center justify-center p-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-th-accent/10 via-transparent to-th-black" />
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-th-accent/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg">
          <p className="text-th-accent text-sm font-medium tracking-widest uppercase mb-4">
            Your personal cinema
          </p>
          <h2 className="text-4xl xl:text-5xl font-display text-th-white leading-tight mb-6">
            Track what you watch.<br />
            Discover what to watch next.
          </h2>
          <p className="text-th-descrip text-lg leading-relaxed mb-10">
            Reelist helps you build your movie & series lists, rate what you’ve seen,
            and get recommendations based on your taste.
          </p>

          <div className="flex gap-8 text-sm text-th-descrip">
            <div>
              <p className="text-th-white text-2xl font-medium mb-1">10k+</p>
              <p>Movies tracked</p>
            </div>
            <div>
              <p className="text-th-white text-2xl font-medium mb-1">2.4k</p>
              <p>Active users</p>
            </div>
            <div>
              <p className="text-th-white text-2xl font-medium mb-1">4.9</p>
              <p>Avg rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}