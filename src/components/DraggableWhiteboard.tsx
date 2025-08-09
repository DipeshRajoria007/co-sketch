"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, type Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import {
  Pencil,
  Eraser,
  Highlighter,
  Circle,
  Square,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WhiteboardProps {
  roomId: string;
}

interface Point {
  x: number;
  y: number;
}

interface Line {
  points: [Point, Point];
  tool: Tool;
  color: string;
  width: number;
}

interface User {
  id: string;
  name: string;
  initials: string;
  cursor?: Point;
  tool?: Tool;
  isDrawing?: boolean;
  color?: string;
  size?: number;
}

type Tool = "pencil" | "eraser" | "marker" | "circle" | "square";

const PASTEL_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Lavender", value: "#70bcfc" },
  { name: "Mint", value: "#B8E6B8" },
  { name: "Peach", value: "#c46a00" },
  { name: "Lemon", value: "#FFFACD" },
  { name: "Rose", value: "#fa9092" },
];

const SIZE_OPTIONS = [
  { label: "Fine", value: 3 },
  { label: "Medium", value: 6 },
  { label: "Bold", value: 10 },
  { label: "Heavy", value: 16 },
  { label: "Extra", value: 24 },
];

const BACKGROUND_COLORS = [
  { name: "Dark", value: "#111111" },
  { name: "Red", value: "#7F1D1D" },
  { name: "Green", value: "#14532D" },
  { name: "Blue", value: "#1E3A8A" },
  { name: "Brown", value: "#451A03" },
  { name: "Transparent", value: "transparent" },
];

const TOOLS: { id: Tool; icon: React.ReactNode; label: string }[] = [
  { id: "pencil", icon: <Pencil className="h-4 w-4" />, label: "Pencil" },
  { id: "eraser", icon: <Eraser className="h-4 w-4" />, label: "Eraser" },
  { id: "marker", icon: <Highlighter className="h-4 w-4" />, label: "Marker" },
  { id: "circle", icon: <Circle className="h-4 w-4" />, label: "Circle" },
  { id: "square", icon: <Square className="h-4 w-4" />, label: "Square" },
];

// Generate initials from a full name
const generateInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2); // Limit to 2 characters
};

const DraggableWhiteboard = ({ roomId }: WhiteboardProps) => {
  const { user: clerkUser, isLoaded } = useUser();
  const socketRef = useRef<Socket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pencil");
  const [selectedColor, setSelectedColor] = useState<string>("#FFFFFF");
  const [selectedSize, setSelectedSize] = useState<number>(3);
  const [backgroundColor, setBackgroundColor] = useState<string>("#111111");
  const [users, setUsers] = useState<Record<string, User>>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const drawing = useRef(false);
  const lastPoint = useRef<Point | null>(null);
  const cursorUpdateTimeout = useRef<NodeJS.Timeout | null>(null);

  const getToolStyles = useCallback(
    (tool: Tool, color?: string, size?: number) => {
      const currentColor = color || selectedColor;
      const currentSize = size || selectedSize;

      switch (tool) {
        case "pencil":
          return {
            color: currentColor,
            width: currentSize,
            globalCompositeOperation: "source-over" as GlobalCompositeOperation,
          };
        case "eraser":
          return {
            color: backgroundColor,
            width: currentSize * 1.5,
            opacity: 1,
            globalCompositeOperation: "source-over" as GlobalCompositeOperation,
          };
        case "marker":
          return {
            color: currentColor,
            width: currentSize * 1.2,
            globalCompositeOperation: "source-over" as GlobalCompositeOperation,
          };
        case "circle":
          return {
            color: currentColor,
            width: currentSize,
            globalCompositeOperation: "source-over" as GlobalCompositeOperation,
          };
        case "square":
          return {
            color: currentColor,
            width: currentSize,
            globalCompositeOperation: "source-over" as GlobalCompositeOperation,
          };
        default:
          return {
            color: currentColor,
            width: currentSize,
            globalCompositeOperation: "source-over" as GlobalCompositeOperation,
          };
      }
    },
    [selectedColor, selectedSize, backgroundColor]
  );

  const drawSegment = (from: Point, to: Point, tool: Tool, emit = false) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const styles = getToolStyles(tool);
    ctx.strokeStyle = styles.color;
    ctx.lineWidth = styles.width;
    ctx.globalCompositeOperation = styles.globalCompositeOperation;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.closePath();

    if (emit) {
      const line: Line = {
        points: [from, to],
        tool,
        color: styles.color,
        width: styles.width,
      };
      socketRef.current?.emit("stroke", { roomId, line });
    }
  };

  const getPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const updateCursor = (point: Point) => {
    if (socketRef.current) {
      // Throttle cursor updates to avoid spam
      if (cursorUpdateTimeout.current) {
        clearTimeout(cursorUpdateTimeout.current);
      }

      cursorUpdateTimeout.current = setTimeout(() => {
        socketRef.current?.emit("cursor-move", {
          roomId,
          cursor: point,
          tool: selectedTool,
          isDrawing: drawing.current,
          color: selectedColor,
          size: selectedSize,
        });
      }, 16); // ~60fps
    }
  };

  const hideCursor = () => {
    if (socketRef.current) {
      socketRef.current.emit("cursor-hide", { roomId });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    lastPoint.current = getPoint(e);
    // Show cursor when starting to draw
    updateCursor(lastPoint.current);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const newPoint = getPoint(e);

    // Only update cursor position when actively drawing
    if (drawing.current && lastPoint.current) {
      updateCursor(newPoint);
      drawSegment(lastPoint.current, newPoint, selectedTool, true);
      lastPoint.current = newPoint;
    }
  };

  const handlePointerLeave = () => {
    // Hide cursor when leaving canvas area
    if (drawing.current) {
      hideCursor();
    }
    endDrawing();
  };

  const endDrawing = () => {
    if (drawing.current) {
      // Hide cursor when finishing drawing
      hideCursor();
    }
    drawing.current = false;
    lastPoint.current = null;
  };

  const clearCanvas = () => {
    if (ctxRef.current && canvasRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      // Reapply background color after clearing
      if (backgroundColor !== "transparent") {
        ctxRef.current.fillStyle = backgroundColor;
        ctxRef.current.fillRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
      }
      // Emit clear event to other users
      socketRef.current?.emit("clear", { roomId });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isLoaded) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Reapply background color after resize
      const ctx = canvas.getContext("2d");
      if (ctx && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#FFFFFF";
      // Set canvas background color
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctxRef.current = ctx;
    }

    // Create user from Clerk data
    const userName =
      clerkUser?.fullName ||
      clerkUser?.firstName ||
      clerkUser?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "Anonymous User";
    const user: User = {
      id: "",
      name: userName,
      initials: generateInitials(userName),
    };
    setCurrentUser(user);

    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;
    socket.emit("join", { roomId, user });

    socket.on("init", (lines: Line[]) => {
      lines.forEach((line) => {
        if (line.tool && line.color && line.width) {
          // Use the stored line properties for consistent rendering
          const ctx = ctxRef.current;
          if (!ctx) return;

          ctx.strokeStyle = line.color;
          ctx.lineWidth = line.width;
          ctx.globalCompositeOperation =
            line.tool === "eraser" ? "source-over" : "source-over";
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          ctx.beginPath();
          ctx.moveTo(line.points[0].x, line.points[0].y);
          ctx.lineTo(line.points[1].x, line.points[1].y);
          ctx.stroke();
          ctx.closePath();
        } else {
          // Fallback for older line format
          const styles = getToolStyles("pencil", "#FFFFFF", 3);
          const ctx = ctxRef.current;
          if (!ctx) return;
          ctx.strokeStyle = styles.color;
          ctx.lineWidth = styles.width;
          ctx.globalCompositeOperation = styles.globalCompositeOperation;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(line.points[0].x, line.points[0].y);
          ctx.lineTo(line.points[1].x, line.points[1].y);
          ctx.stroke();
          ctx.closePath();
        }
      });
    });

    socket.on("stroke", (line: Line) => {
      if (line.tool && line.color && line.width) {
        const ctx = ctxRef.current;
        if (!ctx) return;

        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.globalCompositeOperation =
          line.tool === "eraser" ? "source-over" : "source-over";
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        ctx.lineTo(line.points[1].x, line.points[1].y);
        ctx.stroke();
        ctx.closePath();
      } else {
        // Fallback for older line format
        const styles = getToolStyles("pencil", "#FFFFFF", 3);
        const ctx = ctxRef.current;
        if (!ctx) return;
        ctx.strokeStyle = styles.color;
        ctx.lineWidth = styles.width;
        ctx.globalCompositeOperation = styles.globalCompositeOperation;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(line.points[0].x, line.points[0].y);
        ctx.lineTo(line.points[1].x, line.points[1].y);
        ctx.stroke();
        ctx.closePath();
      }
    });

    socket.on("clear", () => {
      if (ctxRef.current && canvasRef.current) {
        ctxRef.current.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        // Reapply background color after clearing
        if (backgroundColor !== "transparent") {
          ctxRef.current.fillStyle = backgroundColor;
          ctxRef.current.fillRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }
    });

    // User management events
    socket.on("users", (existingUsers: User[]) => {
      const usersMap: Record<string, User> = {};
      existingUsers.forEach((user) => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    });

    socket.on("user-joined", (user: User) => {
      setUsers((prev) => ({ ...prev, [user.id]: user }));
    });

    socket.on("user-left", ({ userId }: { userId: string }) => {
      setUsers((prev) => {
        const newUsers = { ...prev };
        delete newUsers[userId];
        return newUsers;
      });
    });

    // Cursor events
    socket.on(
      "cursor-update",
      ({ userId, user }: { userId: string; user: User }) => {
        setUsers((prev) => ({ ...prev, [userId]: user }));
      }
    );

    socket.on("cursor-hide", ({ userId }: { userId: string }) => {
      setUsers((prev) => {
        const newUsers = { ...prev };
        if (newUsers[userId]) {
          newUsers[userId] = {
            ...newUsers[userId],
            cursor: undefined,
            tool: undefined,
            isDrawing: false,
            color: undefined,
            size: undefined,
          };
        }
        return newUsers;
      });
    });

    return () => {
      if (cursorUpdateTimeout.current) {
        clearTimeout(cursorUpdateTimeout.current);
      }
      socket.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [roomId, isLoaded, clerkUser, getToolStyles, backgroundColor]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="relative h-full w-full flex items-center justify-center">
        <div className="text-lg text-gray-500">Loading whiteboard...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Main Tool Bar - Top Center */}
      <div className="flex absolute top-5 left-[50%] translate-x-[-50%] bg-gray-100 dark:bg-[#232329] rounded-lg p-2 gap-2 z-10">
        {TOOLS.map((tool) => (
          <Button
            key={tool.id}
            variant={selectedTool === tool.id ? "default" : "ghost"}
            size="icon"
            className={cn(
              "w-10 h-10",
              selectedTool === tool.id && "bg-primary text-primary-foreground"
            )}
            onClick={() => setSelectedTool(tool.id)}
            title={tool.label}
          >
            {tool.icon}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="icon"
          className="w-10 h-10 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Left Floating Secondary Controls */}
      <div className="absolute left-4 top-[25%] w-56 bg-[#232329] text-white rounded-lg shadow-xl z-10 p-4 space-y-4">
        {/* Stroke Colors */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Stroke</h3>
          <div className="grid grid-cols-6 gap-2">
            {PASTEL_COLORS.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-7 h-7 rounded border-2 transition-all",
                  selectedColor === color.value
                    ? "border-blue-400 scale-110"
                    : "border-gray-600 hover:border-gray-400"
                )}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Background Colors */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">Background</h3>
          <div className="grid grid-cols-6 gap-2">
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color.value}
                className={cn(
                  "w-7 h-7 rounded border-2 transition-all relative",
                  backgroundColor === color.value
                    ? "border-blue-400 scale-110"
                    : "border-gray-600 hover:border-gray-400"
                )}
                style={{
                  backgroundColor:
                    color.value === "transparent" ? "#2D3748" : color.value,
                }}
                onClick={() => setBackgroundColor(color.value)}
                title={color.name}
              >
                {color.value === "transparent" && (
                  <div className="absolute inset-1 bg-gradient-to-br from-red-500 via-transparent to-red-500 opacity-50" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stroke Width */}
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-300">
            Stroke width
          </h3>
          <div className="flex gap-2">
            {SIZE_OPTIONS.map((size) => (
              <button
                key={size.value}
                className={cn(
                  " w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center transition-colors",
                  selectedSize === size.value && "bg-blue-500 hover:bg-blue-600"
                )}
                onClick={() => setSelectedSize(size.value)}
                title={`${size.label} (${size.value}px)`}
              >
                <div
                  className="bg-white rounded-full"
                  style={{
                    width: `${Math.min(size.value * 2, 20)}px`,
                    height: `${Math.min(size.value, 4)}px`,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[100vh] touch-none cursor-crosshair"
        style={{
          backgroundColor:
            backgroundColor === "transparent" ? "transparent" : backgroundColor,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrawing}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Other users' cursors */}
      {Object.values(users).map((user) =>
        user.cursor ? (
          <div
            key={user.id}
            className="absolute pointer-events-none z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
            }}
          >
            {/* Cursor pointer */}
            <div className="relative">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className={user.isDrawing ? "animate-pulse" : ""}
              >
                <path
                  d="M5.64645 5.64645L18.3536 18.3536L12 12L5.64645 5.64645Z"
                  fill={
                    user.isDrawing && user.color
                      ? user.color
                      : user.isDrawing
                      ? "#EF4444"
                      : "#3B82F6"
                  }
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>

              {/* User initials and tool info */}
              <div
                className="absolute top-6 left-6 text-white text-xs font-medium px-2 py-1 rounded-md shadow-lg whitespace-nowrap"
                style={{
                  backgroundColor:
                    user.isDrawing && user.color
                      ? user.color
                      : user.isDrawing
                      ? "#EF4444"
                      : "#3B82F6",
                }}
              >
                {user.initials}
                {user.isDrawing && user.tool && (
                  <span className="ml-1 opacity-75">
                    (
                    {user.tool === "pencil"
                      ? "✏️"
                      : user.tool === "eraser"
                      ? "🧽"
                      : user.tool === "marker"
                      ? "🖍️"
                      : user.tool === "circle"
                      ? "⭕"
                      : user.tool === "square"
                      ? "⬜"
                      : "✏️"}
                    {user.size && ` ${user.size}px`})
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Current user indicator */}
      {currentUser && (
        <div className="absolute top-4 right-4 z-10 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg">
          <div className="text-sm font-medium">{currentUser.initials}</div>
        </div>
      )}
    </div>
  );
};

export default DraggableWhiteboard;
