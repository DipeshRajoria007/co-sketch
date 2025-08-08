import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { Users } from "lucide-react";
import { Zap } from "lucide-react";
import { Star } from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Navigation */}
      {/* <nav className="border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50 border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CoSketch
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/product"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Product
            </Link>
            <Link
              href="#pricing"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="dark:border-gray-600 dark:text-gray-300 dark:hover:text-white"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeatureSection />
      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Perfect for every team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From design teams to educators, CoSketch adapts to your
              collaboration needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Design Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Brainstorm ideas, create wireframes, and iterate on designs
                together in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Educators
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Conduct interactive lessons, explain concepts visually, and
                engage students remotely.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white dark:text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">
                Remote Teams
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Bridge the gap between remote team members with visual
                collaboration tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by teams worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  &ldquo;CoSketch has revolutionized how our design team
                  collaborates. The real-time features are incredible!&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">
                      Design Lead at TechCorp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  &ldquo;The video chat integration makes remote brainstorming
                  sessions feel like we&rsquo;re in the same room.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Mike Chen</p>
                    <p className="text-sm text-gray-500">
                      Product Manager at StartupXYZ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-700 dark:border-gray-600">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  &ldquo;Simple to use yet powerful. Our students love the
                  interactive whiteboard features.&rdquo;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Dr. Emily Rodriguez</p>
                    <p className="text-sm text-gray-500">
                      Professor at University
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black dark:bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white dark:text-black mb-4">
            Ready to transform your collaboration?
          </h2>
          <p className="text-xl text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using CoSketch to bring their ideas
            to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 text-white dark:text-black border-white dark:border-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CoSketch</span>
              </div>
              <p className="text-gray-400">
                Real-time collaborative whiteboard for modern teams.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/product"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CoSketch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
