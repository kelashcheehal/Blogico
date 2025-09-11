"use client";

import { useState, useEffect } from "react";
import { X, Save, Edit3, Plus, Tag, Calendar, Upload } from "lucide-react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import RichTextEditor from "@/components/rich-text-editor";

export default function BlogModal({ isOpen, onClose, blog = null, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
    tags: "",
    category: "",
    status: "draft",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditMode = !!blog;

  const categories = [
    "Technology",
    "Tutorial",
    "News",
    "Web Development",
    "Mobile Development",
    "AI & Machine Learning",
    "Design",
    "Business",
    "Lifestyle",
    "Other",
  ];

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim("-"); // Remove leading/trailing hyphens
  };

  // Initialize form data when blog prop changes
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        content: blog.content || "",
        thumbnail: blog.thumbnail || "",
        tags: blog.tags ? blog.tags.join(", ") : "",
        category: blog.category || "",
        status: blog.status || "draft",
      });
    } else {
      setFormData({
        title: "",
        slug: "",
        content: "",
        thumbnail: "",
        tags: "",
        category: "",
        status: "draft",
      });
    }
    setErrors({});
  }, [blog, isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "title") {
        newData.slug = generateSlug(value);
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Post ka naam required hai";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug required hai";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content required hai";
    }

    if (!formData.category) {
      newErrors.category = "Category select karni hai";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThumbnailUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({ ...prev, thumbnail: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const blogData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        updatedAt: new Date().toISOString(),
        ...(isEditMode
          ? { id: blog.id }
          : { createdAt: new Date().toISOString() }),
      };

      await onSave(blogData);
      onClose();
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setFormData((prev) => ({ ...prev, status: "published" }));
    setTimeout(() => handleSave(), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="modal-content relative w-full max-w-5xl max-h-[90vh] bg-background rounded-lg shadow-xl border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <div className="flex items-center gap-3">
            {isEditMode ? (
              <Edit3 className="h-5 w-5 text-primary" />
            ) : (
              <Plus className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-xl font-semibold">
              {isEditMode ? "Blog Post Edit Karein" : "Naya Blog Post Banayein"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Post ka Naam (Title) *
              </Label>
              <Input
                id="title"
                placeholder="Jaise: How to Build a Blog with Next.js and Supabase"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={cn(errors.title && "border-destructive")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium">
                Slug (SEO-friendly URL) *
              </Label>
              <Input
                id="slug"
                placeholder="how-to-build-blog-nextjs-supabase"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                className={cn(errors.slug && "border-destructive")}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">
                URL me use hoga: /blog/{formData.slug}
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="thumbnail"
                className="text-sm font-medium flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Cover Image / Thumbnail (Optional lekin Recommended)
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("thumbnail").click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Image Upload Karein
                </Button>
                {formData.thumbnail && (
                  <div className="flex items-center gap-2">
                    <img
                      src={formData.thumbnail || "/placeholder.svg"}
                      alt="Thumbnail preview"
                      className="h-12 w-12 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, thumbnail: "" }))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Content (Rich Text Editor - Images, Links, Formatting ke sath) *
              </Label>
              <div
                className={cn(
                  "rounded-lg",
                  errors.content && "border border-destructive"
                )}
              >
                <RichTextEditor
                  content={formData.content}
                  onChange={(content) => handleInputChange("content", content)}
                  placeholder="Apna blog post content yahan likhein... Images add kar sakte ho, text format kar sakte ho!"
                />
              </div>
              {errors.content && (
                <p className="text-sm text-destructive">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground">
                💡 Tip: Image button se multiple images add kar sakte ho content
                ke beech me!
              </p>
            </div>

            {/* Tags and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tags */}
              <div className="space-y-2">
                <Label
                  htmlFor="tags"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Tag className="h-4 w-4" />
                  Tags (Keywords)
                </Label>
                <Input
                  id="tags"
                  placeholder="Next.js, Supabase, Tutorial"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Comma se separate karein
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger
                    className={cn(errors.category && "border-destructive")}
                  >
                    <SelectValue placeholder="Category select karein" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-destructive">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="draft"
                    name="status"
                    value="draft"
                    checked={formData.status === "draft"}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="draft" className="text-sm cursor-pointer">
                    Draft (Save karke baad me publish)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="published"
                    name="status"
                    value="published"
                    checked={formData.status === "published"}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value)
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="published" className="text-sm cursor-pointer">
                    Published (Abhi publish kar do)
                  </Label>
                </div>
              </div>
            </div>

            {/* Preview Tags */}
            {formData.tags && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tag Preview:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(",").map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <Badge key={index} variant="outline" className="text-xs">
                        {trimmedTag}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {isEditMode ? "Last updated" : "Created"}:{" "}
            {new Date().toLocaleDateString()}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {formData.status === "draft" ? "Save Draft" : "Save"}
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
