import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/bugs/")({
  beforeLoad: () => ({ breadcrumb: "Bugs" }),
  component: Bugs,
});

const scenarios = [
  { title: "Stale address", to: "/bugs/stale-address" },
  { title: "Access control", to: "/bugs/access-control" },
  { title: "Decimals", to: "/bugs/decimals" },
  { title: "Allowance", to: "/bugs/allowance" },
  { title: "Silent failure", to: "/bugs/silent-failure" },
];

function Bugs() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground text-sm">
        Each page below is broken. The page tells you what it is supposed to do
        and shows the raw error. It does not tell you why.
      </p>
      <ul className="flex flex-col gap-1">
        {scenarios.map(({ title, to }) => (
          <li key={to}>
            <Link className="underline" to={to}>
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
