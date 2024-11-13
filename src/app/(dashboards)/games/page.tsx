import { redirect } from "next/navigation";

const DefaultPage = () => {
  redirect("/games/trending");
};

export default DefaultPage;
