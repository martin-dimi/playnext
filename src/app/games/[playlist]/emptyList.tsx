import { LinkSimple } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

export default function EmptyGameList({ playlist }: { playlist: string }) {
  if (playlist === "trending") {
    return <div>No trending games found. Please rerun migration.</div>;
  }

  return <IntegrationMissing />;
}

function IntegrationMissing() {
  return (
    <div className="ml-[-50px] h-full w-full flex justify-center items-center">
      <div className="w-fit h-fit">
        <Link href="/profile" className="text-xl flex gap-1">
          Please setup{" "}
          <span className="text-gold flex gap-1 items-center">
            Steam <LinkSimple className="text-gold" />
          </span>{" "}
          integration
        </Link>
      </div>
    </div>
  );
}
