"use client";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import useGetPlatformTheme from "@/hooks/useGetPlatformTheme";
import Image from "next/image";

const HeroSection = () => {
  const router = useRouter();
  const { resolvedTheme } = useGetPlatformTheme();
  console.log({ resolvedTheme });
  const { user } = useUser();
  console.log({ user });
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <Badge
        variant="secondary"
        className="mb-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
      >
        🚀 Real-time Collaboration
      </Badge>
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
        Collaborate in Real-time with
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {" "}
          CoSketch
        </span>
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
        The ultimate collaborative whiteboard experience. Draw, brainstorm, and
        communicate with your team in real-time, complete with video chat and
        seamless synchronization.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        {user?.id ? (
          <Button
            size="lg"
            className="hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
            onClick={() => {
              router.push("/get-started");
            }}
          >
            Start Collaborating
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        ) : (
          <SignInButton
            mode="modal"
            appearance={{
              baseTheme: resolvedTheme,
            }}
          >
            <Button size="lg" className=" text-lg px-8 py-3">
              Sign In to Collaborate
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </SignInButton>
        )}
        <Button variant="outline" size="lg" className="text-lg px-8 py-3">
          <Play className="mr-2 w-5 h-5" />
          Watch Demo
        </Button>
      </div>

      {/* Hero Image Placeholder */}
      <div className="relative max-w-5xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <Image
            src="/assets/hero-image.png"
            alt="CoSketch Dashboard Preview"
            className="w-full h-auto"
            width={1000}
            height={600}
          />
        </div>
        <div className="absolute -top-4 -right-4 bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-sm font-medium">
          Live Demo
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
