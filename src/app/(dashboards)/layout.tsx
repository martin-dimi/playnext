import Sidebar from "./sidebar";
import TopBar from "./topbar";

const GamesLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden">
      <TopBar />

      <section className="flex grow gap-4 overflow-hidden">
        <Sidebar />
        {children}
      </section>
    </main>
  );
};

export default GamesLayout;
