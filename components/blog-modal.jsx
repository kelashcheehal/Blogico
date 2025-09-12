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
import RichTextEditor from "@/components/rich-text-editor";
import { useProfile } from "@/contexts/profile-context";
import { supabase } from "@/lib/supabaseClient";
export default function BlogModal({ isOpen, onClose, blog = null }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    thumbnail: "",
    tags: "",
    category: "",
    status: "draft",
  });
  const { currentUser } = useProfile();
  const author_id = currentUser?.id;
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
  }, [blog, isOpen]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData((prev) => ({ ...prev, thumbnail: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Save Data:", formData);
    onClose();
  };

  async function handlePublish(formData) {
    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          thumbnail: formData.thumbnail,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          author_id: author_id, // sirf uuid save hoga
        },
      ])
      .select(); // insert ke baad row return karega

    if (error) {
      console.error("Insert error:", error.message);
    } else {
      console.log(formData);
      console.log("Blog inserted:", data);
    }
  }

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
            {blog ? (
              <Edit3 className="h-5 w-5 text-primary" />
            ) : (
              <Plus className="h-5 w-5 text-primary" />
            )}
            <h2 className="text-xl font-semibold">
              {blog ? "Blog Post Edit Karein" : "Naya Blog Post Banayein"}
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Post ka Naam *</Label>
              <Input
                id="title"
                placeholder="Jaise: How to Build a Blog with Next.js"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                placeholder="how-to-build-blog-nextjs"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                URL: /blog/{formData.slug}
              </p>
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Cover Image
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
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
                </Button>
                {formData.thumbnail && (
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="h-12 w-12 object-cover rounded border"
                  />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>Content *</Label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => handleInputChange("content", content)}
                placeholder="Apna blog post content yahan likhein..."
              />
            </div>

            {/* Tags + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Tags
                </Label>
                <Input
                  placeholder="Next.js, Supabase, Tutorial"
                  value={formData.tags}
                  onChange={(e) => handleInputChange("tags", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => handleInputChange("category", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category select karein" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tag Preview */}
            {formData.tags && (
              <div className="space-y-2">
                <Label>Tag Preview:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(",").map((tag, i) => (
                    <Badge key={i} variant="outline">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-muted/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {blog ? "Last updated" : "Created"}:{" "}
            {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button
              onClick={() => handlePublish(formData)}
              className="bg-primary text-white"
            >
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
