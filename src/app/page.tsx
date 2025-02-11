import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex gap-8">
      <Button variant="link">
        <Link href="/login">Login</Link>
      </Button>
      <Button variant="link">
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    </div>
  );
}
