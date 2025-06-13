import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { Users } from "lucide-react";
import { Video } from "lucide-react";
import { Zap } from "lucide-react";
import { Shield } from "lucide-react";
import { Globe } from "lucide-react";

const FeatureSection = () => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need for seamless collaboration
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            CoSketch combines powerful drawing tools with real-time
            collaboration features to enhance your team's productivity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Advanced Drawing Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Professional drawing tools with customizable colors, brush
                sizes, and shapes for all your creative needs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Real-time Collaboration
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See changes instantly as your team draws and edits. Perfect
                synchronization across all connected users.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Video className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Integrated Video Chat
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Communicate face-to-face while collaborating with built-in video
                chat powered by WebRTC technology.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Lightning Fast
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built with Next.js and WebSockets for ultra-fast performance and
                real-time updates without lag.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Secure Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enterprise-grade security with Clerk authentication to keep your
                collaborative sessions safe and private.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-gray-700 dark:border-gray-600">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Room Management
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create private rooms, invite team members, and manage access
                controls for organized collaboration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
