import Icon from "@/app/components/Icon";

export default function SettingsPage() {
  return (
    <>
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded-xl">
            <Icon name="settings" className="w-6 h-6 text-accent" />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Settings
          </h1>
        </div>
        <p className="text-foreground-muted">
          Customize your experience and preferences
        </p>
      </header>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Appearance */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-foreground-muted">
                  Choose your preferred color scheme
                </p>
              </div>
              <select className="bg-background-secondary border border-border rounded-lg px-3 py-2 text-sm">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </section>

        {/* Tasks */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Tasks</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default Priority</p>
                <p className="text-sm text-foreground-muted">
                  Priority for new tasks
                </p>
              </div>
              <select className="bg-background-secondary border border-border rounded-lg px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Completed Tasks</p>
                <p className="text-sm text-foreground-muted">
                  Display completed tasks in the list
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-background-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </section>

        {/* Habits */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Habits</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Week Starts On</p>
                <p className="text-sm text-foreground-muted">
                  First day of the week for habit tracking
                </p>
              </div>
              <select className="bg-background-secondary border border-border rounded-lg px-3 py-2 text-sm">
                <option value="monday">Monday</option>
                <option value="sunday">Sunday</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Streak Reset Time</p>
                <p className="text-sm text-foreground-muted">
                  When the day resets for habit completion
                </p>
              </div>
              <select className="bg-background-secondary border border-border rounded-lg px-3 py-2 text-sm">
                <option value="midnight">Midnight</option>
                <option value="4am">4:00 AM</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Data</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-foreground-muted">
                  Download all your tasks and habits
                </p>
              </div>
              <button className="bg-background-secondary border border-border hover:bg-background-secondary/80 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Export
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-500">Delete All Data</p>
                <p className="text-sm text-foreground-muted">
                  Permanently remove all tasks and habits
                </p>
              </div>
              <button className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
