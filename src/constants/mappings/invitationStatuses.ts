import {
  CircleCheckIcon,
  CircleGaugeIcon,
  CircleSlashIcon,
  CircleXIcon,
} from "lucide-react";

export const invitationStatuses = [
  {
    value: "pending",
    label: "Pending",
    icon: CircleGaugeIcon,
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: CircleCheckIcon,
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: CircleXIcon,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleSlashIcon,
  },
];

/*
"pending", "accepted", "rejected", "canceled"
*/
