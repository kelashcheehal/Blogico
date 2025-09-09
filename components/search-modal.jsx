"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    // Handle search logic here
    console.log("Searching for:", searchQuery)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e)
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-in-out",
        isOpen ? "visible" : "invisible"
      )}>
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose} />
      <div
        className={cn(
          "relative w-full max-w-md transition-all duration-300 transform",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
        <div className="modal-content bg-background border rounded-lg shadow-xl p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Search</h3>
              <Button variant="ghost" size="sm" onClick={onClose} type="button">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              type="text"
              placeholder="Search blogs, authors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              autoFocus />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">Search</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
