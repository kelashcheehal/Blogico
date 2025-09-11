"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useProfile } from "@/contexts/profile-context";
import { useAuth } from "@/contexts/auth-context";

export default function UserProfileModal({ open, onOpenChange }) {
  const { avatarUrl, profileData, displayName, avatarFallback, currentUser } =
    useProfile();
  const { logout, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const userName = profileData?.name || displayName || "?";
  const email = currentUser?.email || "No email";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm rounded-xl shadow-lg flex flex-col items-center">
        {/* Accessibility */}
        <DialogHeader className="w-full">
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>

        {/* User Info */}
        <div className="border-b w-full">
          <div className="flex items-center space-x-3 py-3">
            <Avatar className="h-10 w-10">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={userName} />
              ) : null}
              <AvatarFallback className="bg-gray-200 text-gray-700 font-medium">
                {avatarFallback || "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <div className="font-medium">{userName}</div>
              <div className="text-sm text-muted-foreground">{email}</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={async () => {
            setLoading(true);
            try {
              await logout();
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 rounded-lg border-gray-300"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-transparent"></span>
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Logout
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
