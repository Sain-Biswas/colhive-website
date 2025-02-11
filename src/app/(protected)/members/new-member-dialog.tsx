"use client";

import { CirclePlusIcon } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formSchema = z.object({
  email: z.string(),
});

export default function NewMemberDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CirclePlusIcon />
          <p>Add Member</p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Invitation to Other Users</DialogTitle>
          <DialogDescription>
            Enter details below of the new member
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
