import { ClerkProvider } from "@clerk/nextjs";
import Sidebar from "./sidebar";
import TopBar from "./topbar";

const GamesLayout = async ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <main className="flex w-full flex-col overflow-hidden">
      <ClerkProvider dynamic>
        <TopBar />

        <section className="flex grow overflow-hidden">
          <Sidebar />
          {children}
        </section>
      </ClerkProvider>
    </main>
  );
};

export default GamesLayout;
