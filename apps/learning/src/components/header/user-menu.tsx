import { User } from "@/queries/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  GraduationCapIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  user: User;
}

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/curriculum", label: "Curriculum", icon: GraduationCapIcon },
];

export function UserMenu({ user }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:ring-2 ring-offset-2 ring-purple-500 rounded-full">
        <Avatar>
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((s) => s[0].toUpperCase())
              .join("")}
          </AvatarFallback>
          <AvatarImage src={user.avatarUrl ?? ""} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {items.map((item) => (
          <DropdownMenuItem asChild>
            <Link to={item.href} className="gap-2">
              <item.icon className="size-4" />
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/api/auth/logout" className="gap-2">
            <LogOutIcon className="size-4" />
            Logout
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
