"use client";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Organization name must be provided."),
});

export default function NewOrganizationForm() {
  return <div>New Organization Form</div>;
}
