import { LogoutIcon } from "@/icons";

export const sidebar_constant = [
  {
    name: "Profile",
    path: "/profile",
    icon: <p>PF</p>,
    testid: "profile-link",
  },
  {
    name: "Logout",
    path: "/logout",
    icon: <LogoutIcon />,
    testid: "logout-link",
  },
];
