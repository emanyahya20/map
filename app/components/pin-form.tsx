"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, MapPin } from "lucide-react";

interface PinFormProps {
  onSubmit: (title: string, description: string) => void;
  onCancel: () => void;
  onDelete?: () => void;
  onUpdateLocation?: () => void;
  title: string;
  description: string;
  isEditing?: boolean;
}

export function PinForm({
  onSubmit,
  onCancel,
  onDelete,
  onUpdateLocation,
  title: initialTitle,
  description: initialDescription,
  isEditing = false,
}: PinFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title, description);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Input
            placeholder="Pin title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-neutral-900 border-neutral-700 text-white"
            autoFocus
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full resize-none bg-neutral-900 border-neutral-700 text-white"
            rows={3}
          />
        </div>
        <div className="flex justify-between flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={onDelete}
                className="bg-red-900 hover:bg-red-800"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
            {isEditing && onUpdateLocation && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onUpdateLocation}
                className="bg-blue-900 hover:bg-blue-800 text-white"
              >
                <MapPin className="h-4 w-4 mr-1" />
                Save
              </Button>
            )}
          </div>

          <div className="flex gap-2 ml-auto">
            {(!isEditing || (isEditing && onDelete)) && (
              <Button
                type="button"
                variant={isEditing ? "outline" : "ghost"}
                size="sm"
                onClick={onCancel}
                className={
                  isEditing
                    ? "border-neutral-700 text-white hover:bg-neutral-700"
                    : "text-white hover:bg-neutral-700"
                }
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              size="sm"
              className="bg-red-900 hover:bg-red-800 text-white"
            >
              {isEditing ? "Update" : "Add"} Pin
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
