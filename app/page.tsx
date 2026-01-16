import Dashboard from "./components/Dashboard";
import Icon from "./components/Icon";
import Sidebar from "./components/Sidebar";

export default function Home() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Good morning, <span className="gradient-text">Hien</span> 👋
              </h1>
              <p className="text-foreground-muted">{currentDate}</p>
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-accent/20 active:scale-95">
              <Icon name="plus" strokeWidth={2} />
              Add New Task
            </button>
          </div>
        </header>

        {/* Dashboard Content (Client Component) */}
        <Dashboard />

        {/* Motivation Quote */}
        <section className="mt-8 bg-linear-to-r from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-2xl p-6 animate-fade-in stagger-5 opacity-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <p className="text-lg font-medium italic">
                &quot;The secret of getting ahead is getting started.&quot;
              </p>
              <p className="text-sm text-foreground-muted mt-1">— Mark Twain</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
