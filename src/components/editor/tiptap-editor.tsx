"use client";

import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Undo,
  Redo,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface TiptapEditorProps {
  initialContent?: string;
  onUpdate?: (html: string) => void;
}

export function TiptapEditor({
  initialContent = "<p>Tulis berita kegiatan OSIS SMAN 2 Pangkep...</p>",
  onUpdate,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] rounded-b-lg bg-slate-950/90 px-4 py-3 text-sm text-slate-100 focus:outline-none prose prose-invert max-w-none",
      },
    },
    onUpdate: ({ editor: instance }) => {
      onUpdate?.(instance.getHTML());
    },
  });

  React.useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, { emitUpdate: false });
    }
  }, [editor, initialContent]);

  if (!editor) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 bg-slate-900 px-3 py-2">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-medium text-sky-400">
          <FileText className="size-3.5" />
          Editor
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-200 hover:bg-slate-800"
          title="Bold"
        >
          <Bold className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-200 hover:bg-slate-800"
          title="Italic"
        >
          <Italic className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-200 hover:bg-slate-800"
          title="Heading 2"
        >
          <Heading2 className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-200 hover:bg-slate-800"
          title="Bullet List"
        >
          <List className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-200 hover:bg-slate-800"
          title="Numbered List"
        >
          <ListOrdered className="size-3.5" />
        </Button>
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-300 hover:bg-slate-800"
            title="Undo"
          >
            <Undo className="size-3.5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            className="h-7 border-slate-700 bg-slate-950 px-2 text-slate-300 hover:bg-slate-800"
            title="Redo"
          >
            <Redo className="size-3.5" />
          </Button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
