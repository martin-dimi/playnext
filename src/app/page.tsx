import { SteamProfilePage } from "./steam";
import { PsnProfilePage } from "./psn";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default async function Home() {
  return (
    <main className="dark flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <Tabs defaultValue="steam" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="steam">Steam</TabsTrigger>
          <TabsTrigger value="psn">PSN</TabsTrigger>
        </TabsList>
        <TabsContent value="steam">
          <SteamProfilePage />
        </TabsContent>
        <TabsContent value="psn">
          <PsnProfilePage />
        </TabsContent>
      </Tabs>
    </main>
  );
}
