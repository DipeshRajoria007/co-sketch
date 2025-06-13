"use client";
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";

interface WhiteboardProps {
  roomId: string;
}

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: [Point, Point];
}

const Whiteboard = ({ roomId }: WhiteboardProps) => {
  const socketRef = useRef<Socket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);

  const drawSegment = (from: Point, to: Point, emit = false) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();
    if (emit) {
      socketRef.current?.emit("stroke", { roomId, line: { points: [from, to] } });
    }
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    lastPoint.current = getPoint(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !lastPoint.current) return;
    const newPoint = getPoint(e);
    drawSegment(lastPoint.current, newPoint, true);
    lastPoint.current = newPoint;
  };

  const endDrawing = () => {
    drawing.current = false;
    lastPoint.current = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#000";
      ctxRef.current = ctx;
    }

    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;
    socket.emit("join", roomId);

    socket.on("init", (lines: Line[]) => {
      lines.forEach((line) => drawSegment(line.points[0], line.points[1]));
    });

    socket.on("stroke", (line: Line) => {
      drawSegment(line.points[0], line.points[1]);
    });

    return () => {
      socket.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [roomId]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[calc(100vh-4rem)] fixed top-[4rem] left-0 touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrawing}
      onPointerLeave={endDrawing}
    />
  );
};

export default Whiteboard;
