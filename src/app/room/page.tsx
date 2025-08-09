"use client";
import { redirect } from "next/navigation";
import { NextPage } from "next";
import { useUser } from "@clerk/nextjs";

const RoomPage: NextPage = () => {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    redirect("/");
  } else {
    redirect("/room/1");
  }
};

export default RoomPage;
