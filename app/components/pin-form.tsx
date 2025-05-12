"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Trash2 } from "lucide-react"

interface PinFormProps {
  onSubmit: (title: string, description: string) => void
  onCancel: () => void
  onDelete?: () => void
  title: string
  description: string
  isEditing?: boolean
}

export function PinForm({
  onSubmit,
  onCancel,
  onDelete,
  title: initialTitle,
  description: initialDescription,
  isEditing = false,
}: PinFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSubmit(title, description)
    }
  }

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
        <div className="flex justify-between">
          {isEditing && onDelete ? (
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
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="text-white hover:bg-neutral-700"
            >
              Cancel
            </Button>
          )}
          <div className="flex gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                className="border-neutral-700 text-white hover:bg-neutral-700"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" size="sm" className="bg-red-900 hover:bg-red-800 text-white">
              {isEditing ? "Update" : "Add"} Pin
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
