import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 underline">
        Hello world!
      </h1>
      <Button>Hello</Button>
    </div>
  );
}

