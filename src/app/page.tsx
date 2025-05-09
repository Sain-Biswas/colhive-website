import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  BellIcon,
  CheckCircleIcon,
  Facebook,
  Instagram,
  LayoutIcon,
  Linkedin,
  Twitter,
  UsersIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const stats = [
  { id: 1, name: "Projects Managed", value: "10,000+" },
  { id: 2, name: "Teams Empowered", value: "5,000+" },
  { id: 3, name: "Tasks Completed", value: "1M+" },
  { id: 4, name: "Time Saved", value: "1000+ hours" },
];

const features = [
  {
    name: "Task Management",
    description:
      "Organize and prioritize tasks with ease using our intuitive interface.",
    icon: CheckCircleIcon,
  },
  {
    name: "Team Collaboration",
    description:
      "Foster seamless communication and cooperation within your team.",
    icon: UsersIcon,
  },
  {
    name: "Customizable Workspaces",
    description:
      "Tailor your workspace to fit your unique project management needs.",
    icon: LayoutIcon,
  },
  {
    name: "Real-time Notifications",
    description:
      "Stay updated with instant alerts on project changes and updates.",
    icon: BellIcon,
  },
];

const steps = [
  { name: "Create", description: "Set up your project and define your goals" },
  { name: "Collaborate", description: "Invite team members and assign tasks" },
  { name: "Track", description: "Monitor progress and adjust as needed" },
  {
    name: "Succeed",
    description: "Complete projects on time and within budget",
  },
];

const testimonials = [
  {
    body: "ColHive has transformed the way our team manages projects. It's intuitive, powerful, and incredibly flexible.",
    author: {
      name: "Leslie Alexander",
      handle: "lesliealexander",
      imageUrl: "/placeholder.svg",
      role: "Co-Founder / CEO",
    },
  },
  {
    body: "The hierarchical approach in ColHive makes it easy to break down complex projects into manageable tasks. A game-changer for our workflow.",
    author: {
      name: "Michael Foster",
      handle: "michaelfoster",
      imageUrl: "/placeholder.svg",
      role: "Product Manager",
    },
  },
  {
    body: "I love how ColHive combines simplicity with powerful features. It's perfect for both tech-savvy users and those new to project management tools.",
    author: {
      name: "Dries Vincent",
      handle: "driesvincent",
      imageUrl: "/placeholder.svg",
      role: "Team Lead",
    },
  },
];

const navigation = {
  main: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Jobs", href: "#" },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ],
};

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
                ColHive&apos;s unique hierarchical approach revolutionizes
                project management, making collaboration seamless and intuitive
                for teams of all sizes.
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
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-primary text-base leading-7 font-semibold">
              Powerful Features
            </h2>
            <p className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your projects
            </p>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              ColHive provides a comprehensive set of tools to streamline your
              project management process and boost team productivity.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="text-muted-foreground flex items-center gap-x-3 text-base leading-7 font-semibold">
                    <feature.icon
                      className="text-primary h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                    {feature.name}
                  </dt>
                  <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-base leading-7">
                    <p className="flex-auto">{feature.description}</p>
                    <p className="mt-6">
                      <a
                        href="#"
                        className="text-primary text-sm leading-6 font-semibold"
                      >
                        Learn more <span aria-hidden="true">→</span>
                      </a>
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
      <section className="bg-secondary py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-primary text-base leading-7 font-semibold">
              How It Works
            </h2>
            <p className="text-secondary-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple steps to project success
            </p>
            <p className="text-muted-foreground mt-6 text-lg leading-8">
              ColHive&apos;s intuitive process makes project management a
              breeze. Follow these steps to achieve your goals efficiently.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step.name} className="flex flex-col items-center">
                  <dt className="text-primary flex items-center gap-x-3 text-base leading-7 font-semibold">
                    <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full">
                      {index + 1}
                    </div>
                    {step.name}
                  </dt>
                  <dd className="text-muted-foreground mt-4 flex flex-auto flex-col text-center text-base leading-7">
                    <p className="flex-auto">{step.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-16 flex justify-center">
            <Image
              src="/placeholder.svg"
              alt="ColHive Dashboard"
              width={800}
              height={450}
              className="rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>
      <section className="bg-background py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-primary text-lg leading-8 font-semibold tracking-tight">
              Testimonials
            </h2>
            <p className="text-foreground mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by teams everywhere
            </p>
          </div>

          <div className="mt-6 grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((testimonial, testimonialIdx) => (
              <Card key={testimonialIdx} className="sm:px-4">
                <CardContent className="italic">{testimonial.body}</CardContent>
                <CardFooter className="mt-6 flex gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={testimonial.author.imageUrl} />
                    <AvatarFallback className="size-10">
                      {testimonial.author.name
                        ?.split(" ")
                        .map((i) => i.charAt(0).toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-center">
                    <p className="font-bold">{testimonial.author.name}</p>
                    <p className="text-sm">@{testimonial.author.handle}</p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-secondary">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
          <nav
            className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
            aria-label="Footer"
          >
            {navigation.main.map((item) => (
              <div key={item.name} className="pb-6">
                <a
                  href={item.href}
                  className="text-secondary-foreground hover:text-primary text-sm leading-6"
                >
                  {item.name}
                </a>
              </div>
            ))}
          </nav>
          <div className="mt-10 flex justify-center space-x-10">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-secondary-foreground hover:text-primary"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <p className="mt-10 text-center text-xs leading-5 text-gray-500">
            &copy; 2025 ColHive, Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
