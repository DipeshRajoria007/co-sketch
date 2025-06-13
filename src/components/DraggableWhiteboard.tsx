"use client";
import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { Move } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const BOARD_SIZE = 2000; // pixels

const DraggableWhiteboard = ({ roomId }: WhiteboardProps) => {
  const socketRef = useRef<Socket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);

  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<Point | null>(null);
  const position = useRef({ x: 0, y: 0 });
  const [, forceUpdate] = useState({});

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
    if (e.button === 2) {
      setDragging(true);
      dragStart.current = { x: e.clientX - position.current.x, y: e.clientY - position.current.y };
    } else {
      drawing.current = true;
      lastPoint.current = getPoint(e);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragging && dragStart.current) {
      position.current = { x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y };
      forceUpdate({});
    } else if (drawing.current && lastPoint.current) {
      const newPoint = getPoint(e);
      drawSegment(lastPoint.current, newPoint, true);
      lastPoint.current = newPoint;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragging && e.button === 2) {
      setDragging(false);
      dragStart.current = null;
    } else {
      drawing.current = false;
      lastPoint.current = null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = BOARD_SIZE;
      canvas.height = BOARD_SIZE;
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
    <div className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ transform: `translate(${position.current.x}px, ${position.current.y}px)` }}
        className="absolute top-0 left-0 touch-none cursor-crosshair"
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <Button
        className="absolute bottom-5 right-5"
        variant={dragging ? "default" : "secondary"}
        onClick={() => {
          setDragging(false);
          position.current = { x: 0, y: 0 };
          forceUpdate({});
        }}
      >
        <Move className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default DraggableWhiteboard;
