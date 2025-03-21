"use client";

import { Avatar, AvatarIcon } from "@heroui/avatar";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useRouter } from "next/navigation";

import { logout } from "@/api/logout/api";

export function UserComponent() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Avatar isBordered as="button" className="transition-transform" icon={<AvatarIcon />} />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="logout" color="danger" onPress={handleLogout}>
          Cerrar sesión
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
