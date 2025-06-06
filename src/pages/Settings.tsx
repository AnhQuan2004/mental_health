
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Key, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");

  const defaultSystemPrompt = `You are a compassionate and empathetic mental health support AI. Your role is to:

- Listen actively and provide emotional support
- Offer evidence-based coping strategies and techniques
- Help users process their thoughts and feelings
- Provide psychoeducation about mental health topics
- Encourage healthy habits and self-care
- Recognize when professional help may be needed

Guidelines:
- Always be non-judgmental, warm, and understanding
- Use person-first language
- Validate emotions while offering helpful perspectives
- Never diagnose mental health conditions
- Encourage professional help for serious concerns
- Maintain appropriate boundaries as an AI assistant

Remember: You are here to support, not replace, professional mental health care.`;

  useEffect(() => {
    const savedApiKey = localStorage.getItem("gemini-api-key");
    const savedPrompt = localStorage.getItem("system-prompt");
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedPrompt) setSystemPrompt(savedPrompt);
    else setSystemPrompt(defaultSystemPrompt);
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to continue.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("gemini-api-key", apiKey);
    localStorage.setItem("system-prompt", systemPrompt);
    
    toast({
      title: "Settings Saved",
      description: "Your configuration has been saved successfully.",
    });
  };

  const resetToDefault = () => {
    setSystemPrompt(defaultSystemPrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/")}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* API Key Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <CardTitle>Gemini API Configuration</CardTitle>
              </div>
              <CardDescription>
                Enter your Google Gemini API key to enable the chatbot functionality. 
                Your key is stored locally and never shared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key">Gemini API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your Gemini API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Don't have an API key? Get one from the{" "}
                  <a 
                    href="https://makersuite.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Google AI Studio
                  </a>
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
                <p className="text-sm text-blue-800">
                  Your API key is stored locally in your browser and is used only to communicate 
                  with Google's Gemini API. We never have access to your key or conversation data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* System Prompt Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <CardTitle>AI Personality & Behavior</CardTitle>
              </div>
              <CardDescription>
                Customize how your AI companion behaves and responds. 
                This system prompt defines the AI's role and communication style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="system-prompt">System Prompt</Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Enter your custom system prompt..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="mt-1 min-h-[300px]"
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={resetToDefault}
                  className="flex items-center space-x-2"
                >
                  <span>Reset to Default</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
