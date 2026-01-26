import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { type EditorView } from "@codemirror/view";
import stringifyPretty from "json-stringify-pretty-compact";
import { createEditor } from "../libs/codemirror-editor-factory";
import { type StylePropertySpecification } from "maplibre-gl";
import { type TransactionSpec } from "@codemirror/state";
import { cn } from "@/lib/utils";

export type InputJsonProps = {
  value: object
  className?: string
  onChange(object: object): void
  onFocus?(...args: unknown[]): unknown
  onBlur?(...args: unknown[]): unknown
  lintType: "layer" | "style" | "expression" | "json"
  spec?: StylePropertySpecification | undefined
  withScroll?: boolean
};

const InputJson: React.FC<InputJsonProps> = ({
  value: propsValue,
  className,
  onChange,
  onFocus,
  onBlur,
  lintType = "layer",
  spec,
  withScroll = false
}) => {
  useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [prevValue, setPrevValue] = useState("");
  const editorRef = useRef<EditorView | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const cancelNextChange = useRef(false);

  const getPrettyJson = useCallback((data: any) => {
    return stringifyPretty(data, { indent: 2, maxLength: 40 });
  }, []);

  const handleEditorChange = useCallback((newCode: string) => {
    if (cancelNextChange.current) {
      cancelNextChange.current = false;
      setPrevValue(newCode);
      return;
    }

    if (prevValue !== newCode) {
      try {
        const parsed = JSON.parse(newCode);
        onChange(parsed);
      } catch (_err) {
        // Silent catch for invalid JSON during editing
      }
    }
    setPrevValue(newCode);
  }, [prevValue, onChange]);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const initialPretty = getPrettyJson(propsValue);
      setPrevValue(initialPretty);
      editorRef.current = createEditor({
        parent: containerRef.current,
        value: initialPretty,
        lintType: lintType,
        onChange: handleEditorChange,
        onFocus: () => {
          setIsEditing(true);
          if (onFocus) onFocus();
        },
        onBlur: () => {
          setIsEditing(false);
          if (onBlur) onBlur();
        },
        spec: spec
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = undefined;
      }
    };
  }, []); // Only once on mount

  useEffect(() => {
    if (!isEditing && editorRef.current) {
      const currentDoc = editorRef.current.state.doc.toString();
      const nextPretty = getPrettyJson(propsValue);

      if (currentDoc !== nextPretty) {
        cancelNextChange.current = true;
        const transactionSpec: TransactionSpec = {
          changes: {
            from: 0,
            to: currentDoc.length,
            insert: nextPretty
          }
        };
        if (withScroll) {
          transactionSpec.selection = editorRef.current.state.selection;
          transactionSpec.scrollIntoView = true;
        }
        editorRef.current.dispatch(transactionSpec);
        setPrevValue(nextPretty); // Update prevValue to avoid comparison mismatch
      }
    }
  }, [propsValue, isEditing, withScroll, getPrettyJson]);

  return (
    <div
      className="relative w-full overflow-hidden rounded-md border border-input shadow-sm"
      data-wd-key="json-editor"
      aria-hidden="true"
      style={{ cursor: "text" }}
    >
      <div
        className={cn("h-full w-full bg-background text-[11px]", className)}
        ref={containerRef}
      />
    </div>
  );
};

export default InputJson;
