"use client";

import { motion } from "framer-motion";
import ResizeImage from "tiptap-extension-resize-image";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
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

  if (!editor) return null;

  return (
    <motion.div
      className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-md p-3 flex flex-wrap gap-1 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
    >
      {/* === Text Formatting === */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
        {[
          {
            cmd: () => editor.chain().focus().toggleBold().run(),
            icon: Bold,
            active: "bold",
          },
          {
            cmd: () => editor.chain().focus().toggleItalic().run(),
            icon: Italic,
            active: "italic",
          },
          {
            cmd: () => editor.chain().focus().toggleStrike().run(),
            icon: Strikethrough,
            active: "strike",
          },
          {
            cmd: () => editor.chain().focus().toggleCode().run(),
            icon: Code,
            active: "code",
          },
        ].map(({ cmd, icon: Icon, active }, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button
              variant={editor.isActive(active) ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={cmd}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* === Headings === */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
        {[1, 2, 3].map((level) => {
          const Icon = [Heading1, Heading2, Heading3][level - 1];
          return (
            <motion.div
              key={level}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
            >
              <Button
                variant={
                  editor.isActive("heading", { level }) ? "default" : "ghost"
                }
                size="icon"
                className="h-8 w-8"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level }).run()
                }
              >
                <Icon className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* === Lists === */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
        {[
          {
            cmd: () => editor.chain().focus().toggleBulletList().run(),
            icon: List,
            active: "bulletList",
          },
          {
            cmd: () => editor.chain().focus().toggleOrderedList().run(),
            icon: ListOrdered,
            active: "orderedList",
          },
          {
            cmd: () => editor.chain().focus().toggleBlockquote().run(),
            icon: Quote,
            active: "blockquote",
          },
        ].map(({ cmd, icon: Icon, active }, i) => (
          <motion.div
            key={i}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button
              variant={editor.isActive(active) ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8"
              onClick={cmd}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* === Alignment === */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
        {[
          { align: "left", icon: AlignLeft },
          { align: "center", icon: AlignCenter },
          { align: "right", icon: AlignRight },
          { align: "justify", icon: AlignJustify },
        ].map(({ align, icon: Icon }) => (
          <motion.div
            key={align}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <Button
              variant={
                editor.isActive({ textAlign: align }) ? "default" : "ghost"
              }
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().setTextAlign(align).run()}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* === Media === */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          <Button
            variant="ghost"
            size="icon"
            onClick={addImage}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
        <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}>
          <Button
            variant={editor.isActive("link") ? "default" : "ghost"}
            size="icon"
            onClick={() => setShowLinkInput(!showLinkInput)}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* === History === */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40">
        <Button
          variant="ghost"
          size="icon"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {showLinkInput && (
        <motion.div
          className="flex items-center gap-2 ml-2"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-48"
            onKeyDown={(e) => e.key === "Enter" && setLink()}
            autoFocus
          />
          <Button size="sm" onClick={setLink}>
            Add
          </Button>
        </motion.div>
      )}
    </motion.div>
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
          class: "rounded-xl my-6 shadow-lg hover:shadow-xl transition",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline hover:text-primary/80 transition",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none min-h-[400px] p-6 transition-all duration-300",
      },
    },
    immediatelyRender: false,
  });

  return (
    <motion.div
      className="border rounded-xl overflow-hidden shadow-sm bg-background"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <MenuBar editor={editor} />
      <div className="relative max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <EditorContent
          editor={editor}
          className="focus-within:ring-2 focus-within:ring-primary/20 focus-within:ring-offset-2 rounded-b-xl"
        />
      </div>
    </motion.div>
  );
}
