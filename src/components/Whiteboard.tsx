"use client";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

interface WhiteboardProps {
  roomId: string;
}

const Whiteboard = ({ roomId }: WhiteboardProps) => {
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;
    socket.emit("join", roomId);

    socket.on("sync", (snapshot: any) => {
      const editor = editorRef.current;
      if (editor && snapshot) {
        try {
          editor.store?.loadSnapshot?.(snapshot);
        } catch {
          /* empty */
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const handleMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleChangePage = (snapshot: any) => {
    socketRef.current?.emit("sync", { roomId, data: snapshot });
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] fixed top-[4rem] left-0">
      <Tldraw onMount={handleMount} onChangePage={handleChangePage} />
    </div>
  );
};

export default Whiteboard;
