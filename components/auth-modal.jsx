"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabaseClient";
import { Chrome, Loader2 } from "lucide-react";
import React, { useState } from "react";
import UserProfileModal from "./user-profile";
import { useProfile } from "@/contexts/profile-context";
import { useAuth } from "@/contexts/auth-context";
export function AuthModal({ isOpen, onClose, onLogout }) {
  const [mode, setMode] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { currentUser } = useProfile();
  const { logout } = useAuth();

  async function handleRegister(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;

      const userId = data.user?.id;
      if (!userId) throw new Error("User ID not found");

      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId, // same as auth.users ka id
          name: name,
          email: email,
          role: "user",
        },
      ]);

      if (insertError) throw insertError;

      onClose();
    } catch (err) {
      setError(err.message || "Failed to register");
    } finally {
      setIsLoading(false);
      setName("");
      setEmail("");
      setPassword("");
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      onClose();
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setIsLoading(false);
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div>
      {currentUser ? (
        <UserProfileModal
          open={isOpen}
          onOpenChange={(open) => !open && onClose()}
          currentUser={currentUser}
          onLogout={logout}
        />
      ) : (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent className="w-full sm:max-w-md rounded-2xl p-6">
            <DialogHeader className="space-y-1 text-center">
              <DialogTitle className="text-xl font-semibold">
                {mode === "login" ? "Welcome Back" : "Create an Account"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Login to access your account and continue"
                  : "Register to start your journey with us"}
              </DialogDescription>
            </DialogHeader>

            <Tabs
              defaultValue="login"
              onValueChange={(val) => {
                setMode(val);
                setError("");
              }}
              className="w-full mt-4"
            >
              <TabsList className="grid w-full grid-cols-2 rounded-xl">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              {/* LOGIN FORM */}
              <TabsContent value="login" className="pt-4">
                <form onSubmit={handleLogin} className="grid gap-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && mode === "login" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">
                      OR
                    </span>
                  </div>
                </form>
              </TabsContent>

              {/* REGISTER FORM */}
              <TabsContent value="register" className="pt-4">
                <form onSubmit={handleRegister} className="grid gap-4">
                  <div>
                    <Label htmlFor="register-name">Name</Label>
                    <Input
                      id="register-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && mode === "register" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}

                  <div className="relative my-4">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-background px-2 text-xs text-muted-foreground">
                      OR
                    </span>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
