import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { useState, useEffect } from "react";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import "./rich-text-editor.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "excel-table",
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] p-4 border rounded-md focus:outline-none",
      },
    },
  });

  // Handle pasting from Excel
  // useEffect(() => {
  //   if (editor) {
  //     const handlePaste = (event: ClipboardEvent) => {
  //       const text = event.clipboardData?.getData("text/plain");
  //       const html = event.clipboardData?.getData("text/html");

  //       // Check if it looks like a table (contains tabs or multiple spaces)
  //       if (text && (text.includes("\t") || /\s{2,}/.test(text))) {
  //         event.preventDefault();

  //         // Convert tab-separated text to HTML table
  //         const rows = text.split("\n").filter((row) => row.trim());

  //         if (rows.length > 0) {
  //           let tableHtml = '<table class="excel-table"><tbody>';

  //           // Check if first row should be treated as header
  //           const firstRow = rows[0].split("\t");
  //           tableHtml += "<tr>";
  //           firstRow.forEach((cell) => {
  //             tableHtml += `<th>${cell}</th>`;
  //           });
  //           tableHtml += "</tr>";

  //           // Add remaining rows
  //           for (let i = 1; i < rows.length; i++) {
  //             const cells = rows[i].split("\t");
  //             tableHtml += "<tr>";
  //             cells.forEach((cell) => {
  //               tableHtml += `<td>${cell}</td>`;
  //             });
  //             tableHtml += "</tr>";
  //           }

  //           tableHtml += "</tbody></table>";
  //           editor.commands.insertContent(tableHtml);
  //         }
  //       } else if (html && html.includes("<table")) {
  //         // If HTML already contains a table, we can use it directly but add our class
  //         event.preventDefault();
  //         const modifiedHtml = html.replace(
  //           /<table/g,
  //           '<table class="excel-table"'
  //         );
  //         editor.commands.insertContent(modifiedHtml);
  //       }
  //     };

  //     editor.view.dom.addEventListener("paste", handlePaste);

  //     return () => {
  //       editor.view.dom.removeEventListener("paste", handlePaste);
  //     };
  //   }
  // }, [editor]);

  useEffect(() => {
    if (editor) {
      const handlePaste = (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData("text/plain");
        const html = event.clipboardData?.getData("text/html");

        // Avoid double pasting when pasting from Excel (which provides both text and HTML)
        if (html && html.includes("<table")) {
          return; // Let Tiptap handle it
        }

        if (text && text.includes("\t")) {
          event.preventDefault();

          // Convert tab-separated text to HTML table
          const rows = text.split("\n").filter((row) => row.trim());
          if (rows.length > 0) {
            let tableHtml = '<table class="excel-table"><tbody>';

            // First row as header
            tableHtml += "<tr>";
            rows[0].split("\t").forEach((cell) => {
              tableHtml += `<th>${cell}</th>`;
            });
            tableHtml += "</tr>";

            // Remaining rows as data
            for (let i = 1; i < rows.length; i++) {
              const cells = rows[i].split("\t");
              tableHtml += "<tr>";
              cells.forEach((cell) => {
                tableHtml += `<td>${cell}</td>`;
              });
              tableHtml += "</tr>";
            }

            tableHtml += "</tbody></table>";
            editor.commands.insertContent(tableHtml);
          }
        }
      };

      editor.view.dom.addEventListener("paste", handlePaste);
      return () => {
        editor.view.dom.removeEventListener("paste", handlePaste);
      };
    }
  }, [editor]);

  // Client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-[200px] p-4 border rounded-md bg-gray-50"></div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1">
        <Toggle
          pressed={editor?.isActive("bold")}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          aria-label="Bold"
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive("italic")}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          aria-label="Italic"
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive("underline")}
          onPressedChange={() =>
            editor?.chain().focus().toggleUnderline().run()
          }
          aria-label="Underline"
          size="sm"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <Toggle
          pressed={editor?.isActive("bulletList")}
          onPressedChange={() =>
            editor?.chain().focus().toggleBulletList().run()
          }
          aria-label="Bullet List"
          size="sm"
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive("orderedList")}
          onPressedChange={() =>
            editor?.chain().focus().toggleOrderedList().run()
          }
          aria-label="Numbered List"
          size="sm"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <Toggle
          pressed={editor?.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor?.chain().focus().setTextAlign("left").run()
          }
          aria-label="Align Left"
          size="sm"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor?.chain().focus().setTextAlign("center").run()
          }
          aria-label="Align Center"
          size="sm"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          pressed={editor?.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor?.chain().focus().setTextAlign("right").run()
          }
          aria-label="Align Right"
          size="sm"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <div className="w-px h-6 bg-gray-300 mx-1"></div>

        <Toggle
          pressed={false}
          onPressedChange={() => {
            editor
              ?.chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run();
          }}
          aria-label="Insert Table"
          size="sm"
          title="Insert Table"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
          </svg>
        </Toggle>
      </div>

      <EditorContent editor={editor} className="prose max-w-none" />

      <div className="bg-gray-50 p-2 border-t text-xs text-gray-500">
        Tip: You can paste Excel data directly into the editor to maintain table
        formatting
      </div>
    </div>
  );
}
