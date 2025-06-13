"use client";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

interface WhiteboardProps {
  roomId: string;
}

const Whiteboard = ({ roomId }: WhiteboardProps) => {
  return (
    <div className="w-full h-[calc(100vh-4rem)] fixed top-[4rem] left-0">
      <Tldraw />
    </div>
  );
};

export default Whiteboard;
