import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const stats = [
  { id: 1, name: "Projects Managed", value: "10,000+" },
  { id: 2, name: "Teams Empowered", value: "5,000+" },
  { id: 3, name: "Tasks Completed", value: "1M+" },
  { id: 4, name: "Time Saved", value: "1000+ hours" },
];

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Streamline Your Projects, Empower Your Teams
              </h1>
              <p className="mt-6 text-lg">
                ColHive's unique hierarchical approach revolutionizes project
                management, making collaboration seamless and intuitive for
                teams of all sizes.
              </p>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                <Button className="rounded-xl p-6 shadow-sm">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center text-sm font-semibold"
                  >
                    Dashboard
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button className="rounded-xl p-6 shadow-sm" variant="outline">
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center text-sm font-semibold"
                  >
                    Learn more
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative mt-10 w-full sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
              <div className="mx-auto">
                <Image
                  src="/placeholder.svg"
                  alt="ColHive Dashboard"
                  width={800}
                  height={400}
                  className="relative rounded-xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-secondary-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Trusted by teams worldwide
              </h2>
              <p className="text-muted-foreground mt-4 text-lg leading-8">
                ColHive has helped thousands of teams achieve their project
                goals efficiently.
              </p>
            </div>
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="bg-background/50 flex flex-col p-8"
                >
                  <dt className="text-foreground text-sm leading-6 font-semibold">
                    {stat.name}
                  </dt>
                  <dd className="text-muted-foreground order-first text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </main>
  );
}
