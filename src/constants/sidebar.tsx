import { FeedbackIcon, LogoutIcon, ProfileIcon } from "@/icons";
import { User } from "lucide-react";

export const sidebar_constant = [
  {
    name: "Profile",
    path: "/profile",
    icon: <User />,
    testid: "profile-link",
  },
  {
    name: "Feedback",
    path: "/feedback",
    icon: <FeedbackIcon />,
    testid: "feedback-link",
  },
  {
    name: "Logout",
    path: "/logout",
    icon: <LogoutIcon />,
    testid: "logout-link",
  },
];
