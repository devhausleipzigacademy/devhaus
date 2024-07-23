import { Link } from "@tanstack/react-router";
import { UserMenu } from "./user-menu";
import { Route } from "@/routes/__root";
import { Button } from "../ui/button";
import { SiGithub } from "@icons-pack/react-simple-icons";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  const { user } = Route.useRouteContext();
  return (
    <header className="px-4 border-b py-2 flex justify-between items-center">
      <div className="flex gap-6 items-center">
        {navigation.map((item) => (
          <Link to={item.href} className="[&.active]:font-bold">
            {item.label}
          </Link>
        ))}
      </div>
      {user ? (
        <UserMenu user={user} />
      ) : (
        <Button asChild>
          <a href="/api/auth/login/github" className="flex gap-2 items-center">
            <SiGithub className="size-4" /> Login with Github
          </a>
        </Button>
      )}
    </header>
  );
}
