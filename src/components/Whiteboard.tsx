"use client";
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

interface WhiteboardProps {
  roomId: string;
}

const Whiteboard = ({ roomId }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<any>();

  useEffect(() => {
    socketRef.current = io({ path: '/api/socket' });

    socketRef.current.emit('join', roomId);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      // Preserve current drawing before resizing because changing the canvas
      // size clears its contents.
      const prevCanvas = document.createElement('canvas');
      prevCanvas.width = canvas.width;
      prevCanvas.height = canvas.height;
      const prevCtx = prevCanvas.getContext('2d');
      if (prevCtx) {
        prevCtx.drawImage(canvas, 0, 0);
      }

      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (prevCtx) {
        ctx.drawImage(prevCanvas, 0, 0, prevCanvas.width, prevCanvas.height);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let drawing = false;
    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const start = (e: MouseEvent | TouchEvent) => {
      drawing = true;
      draw(e);
    };
    const end = () => {
      drawing = false;
      ctx.beginPath();
    };
    const draw = (e: MouseEvent | TouchEvent) => {
      if (!drawing) return;
      const { x, y } = getPos(e);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
      socketRef.current?.emit('draw', { roomId, x, y });
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('touchstart', start);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchmove', draw);

    const handleMessage = (data: { x: number; y: number }) => {
      if (typeof data.x === 'number' && typeof data.y === 'number') {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(data.x, data.y);
      }
    };

    socketRef.current.on('draw', handleMessage);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', start);
      canvas.removeEventListener('touchstart', start);
      canvas.removeEventListener('mouseup', end);
      canvas.removeEventListener('touchend', end);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('touchmove', draw);
      socketRef.current?.off('draw', handleMessage);
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  return <canvas ref={canvasRef} className="w-full h-full border" />;
};

export default Whiteboard;
