import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Leave Request Portal" },
    {
      name: "description",
      content:
        "This portal is dedicated to leave requests management by supervisors and employees can also use it to request a leave.",
    },
  ];
}

export default function Home() {
  return <Welcome />;
}
