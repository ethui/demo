import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => ({ breadcrumb: "Home" }),
  component: Home,
});

function Home() {
  return <></>;
}
