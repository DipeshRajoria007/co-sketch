import DraggableWhiteboard from "@/components/DraggableWhiteboard";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface RoomPageProps {
  params: { roomId: string };
}

export default function RoomPage({ params }: RoomPageProps) {
  return (
    <div className="flex-1 w-full h-[calc(100vh-4rem)]">
      <SignedIn>
        <DraggableWhiteboard roomId={params.roomId} />
      </SignedIn>
      <SignedOut>
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-6 max-w-md mx-auto p-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Join Room: {params.roomId}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to collaborate with others in this whiteboard room
              </p>
            </div>
            <div className="space-y-4">
              <SignInButton mode="modal">
                <Button size="lg" className="w-full">
                  Sign In to Join Room
                </Button>
              </SignInButton>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You&apos;ll be able to draw, see other users&apos; cursors, and
                collaborate in real-time
              </p>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
