import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Bot,
  User,
  Settings,
  Trash2,
  Key,
  MessageSquare,
  Heart,
  Menu,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSaveSettings = () => {
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
    setShowSettings(false);
  };

  const resetToDefault = () => {
    setSystemPrompt(defaultSystemPrompt);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !apiKey) {
      if (!apiKey) {
        toast({
          title: "API Key Missing",
          description: "Please configure your API key in settings.",
          variant: "destructive",
        });
        setShowSettings(true);
      }
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      // Add current user message
      conversationHistory.push({
        role: "user",
        parts: [{ text: userMessage.content }],
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: conversationHistory,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't process that request.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description:
          "Failed to send message. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "Your conversation history has been cleared.",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Convert markdown-like syntax to HTML
  const formatMessageContent = (content: string) => {
    // Basic formatting
    let formatted = content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(/\n/g, "<br />"); // Line breaks

    // Headers
    formatted = formatted
      .replace(/^# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/^## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/^### (.*?)$/gm, "<h3>$1</h3>");

    // Lists
    formatted = formatted
      .replace(/^- (.*?)$/gm, "<li>$1</li>")
      .replace(/(<li>.*?<\/li>\n?)+/g, "<ul>$&</ul>");

    // Links
    formatted = formatted.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>'
    );

    return formatted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 flex">
      {/* Settings Sidebar */}
      <div
        className={`${
          showSettings ? "w-80" : "w-0"
        } transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-sm border-r border-blue-100`}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Settings</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* API Key Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Key className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-sm">API Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="api-key" className="text-sm">
                  Gemini API Key
                </Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your API key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Get one from{" "}
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
            </CardContent>
          </Card>

          {/* System Prompt Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5 text-green-600" />
                <CardTitle className="text-sm">AI Behavior</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="system-prompt" className="text-sm">
                  System Prompt
                </Label>
                <Textarea
                  id="system-prompt"
                  placeholder="Enter your custom system prompt..."
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="mt-1 h-32 text-xs"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                className="w-full"
              >
                Reset to Default
              </Button>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Save Settings
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <Heart className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Mental Health Chatbot
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </Button>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Bot className="h-16 w-16 text-blue-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">
                  Welcome to your safe space
                </h3>
                <p className="text-gray-500">
                  I'm here to listen and support you. Feel free to share what's
                  on your mind.
                </p>
                {!apiKey && (
                  <Button
                    onClick={() => setShowSettings(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure API Key
                  </Button>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === "assistant" && (
                      <Bot className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    )}
                    {message.role === "user" && (
                      <User className="h-4 w-4 text-white mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      {message.role === "assistant" ? (
                        <div
                          className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-blue-600 prose-a:text-blue-600"
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(message.content),
                          }}
                        />
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.role === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={isLoading || !apiKey}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim() || !apiKey}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!apiKey && (
              <p className="text-sm text-red-600 mt-2">
                Please configure your API key in settings to start chatting.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
