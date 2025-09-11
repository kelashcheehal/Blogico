"use client";

import ResizeImage from "tiptap-extension-resize-image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const MenuBar = ({ editor }) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setIsUploading(true);
        const reader = new FileReader();
        reader.onload = (event) => {
          const url = event.target.result;
          editor.chain().focus().setImage({ src: url }).run();
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md p-3 flex flex-wrap gap-1 transition-all duration-300">
      {/* Text Formatting Group */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50">
        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("code") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-8 bg-border/50 mx-2" />

      {/* Headings Group */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50">
        <Button
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "ghost"
          }
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "ghost"
          }
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "ghost"
          }
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-8 bg-border/50 mx-2" />

      {/* Lists Group */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50">
        <Button
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-8 bg-border/50 mx-2" />

      {/* Alignment Group */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50">
        <Button
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
          }
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive({ textAlign: "right" }) ? "default" : "ghost"
          }
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant={
            editor.isActive({ textAlign: "justify" }) ? "default" : "ghost"
          }
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-8 bg-border/50 mx-2" />

      {/* Media Group */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={addImage}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant={editor.isActive("link") ? "default" : "ghost"}
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95"
          onClick={() => setShowLinkInput(!showLinkInput)}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="w-px h-8 bg-border/50 mx-2" />

      {/* History Group */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <div className="flex items-center gap-2 ml-2 animate-in slide-in-from-left-2 duration-300">
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-48 transition-all duration-200 focus:w-56"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setLink();
              }
            }}
            autoFocus
          />
          <Button
            size="sm"
            onClick={setLink}
            className="transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Add
          </Button>
        </div>
      )}
    </div>
  );
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizeImage.configure({
        HTMLAttributes: {
          class:
            "rounded-xl my-6 shadow-lg transition-all duration-300 hover:shadow-xl",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-primary underline cursor-pointer transition-colors duration-200 hover:text-primary/80",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-6 transition-all duration-300",
      },
    },
    immediatelyRender: false, // 👈 ye line zaroor rakho
  });

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-background">
      <MenuBar editor={editor} />
      <div className="relative max-h-[600px] overflow-auto">
        <EditorContent
          editor={editor}
          className="focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 transition-all duration-200 rounded-b-xl"
        />
      </div>
    </div>
  );
}
