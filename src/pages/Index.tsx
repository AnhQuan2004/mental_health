import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings, Heart, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                Mental Health Chatbot
              </h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/settings")}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
              <Button
                onClick={() => navigate("/chat")}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Start Chat</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Your Personal
            <span className="text-blue-600 block">Mental Health Companion</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A safe, private space to talk about your thoughts and feelings.
            Powered by AI to provide supportive conversations whenever you need
            them.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/chat")}
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-blue-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Private & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Your conversations are completely private. We use your own API
                key, so your data stays between you and the AI.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-green-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">24/7 Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Mental health support doesn't keep office hours. Get help
                whenever you need it, day or night.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-purple-100 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="text-center">
              <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Personalized Care</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Customize your AI companion with your own system prompts to get
                the support that works best for you.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <Card className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm border-blue-100">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-gray-800 mb-4">
              Getting Started
            </CardTitle>
            <CardDescription className="text-lg">
              Set up your personal mental health chatbot in just a few steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  1
                </div>
                <h3 className="font-semibold">Configure Settings</h3>
                <p className="text-gray-600">
                  Add your Gemini API key and customize your AI companion's
                  personality
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  2
                </div>
                <h3 className="font-semibold">Start Chatting</h3>
                <p className="text-gray-600">
                  Begin your conversation in a safe, judgment-free environment
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  3
                </div>
                <h3 className="font-semibold">Feel Better</h3>
                <p className="text-gray-600">
                  Get support, insights, and coping strategies tailored to your
                  needs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <p className="text-sm text-yellow-800 text-center">
                <strong>Important:</strong> This AI chatbot is designed to
                provide support and information, but it is not a replacement for
                professional mental health treatment. If you're experiencing a
                mental health crisis, please contact a healthcare professional
                or emergency services immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
