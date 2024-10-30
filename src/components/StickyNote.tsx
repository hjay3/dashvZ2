import React from 'react';

interface StickyNoteProps {
  id: number;
  x: number;
  y: number;
  text: string;
  onChange: (id: number, text: string) => void;
}

const StickyNote = ({ id, x, y, text, onChange }: StickyNoteProps) => {
  return (
    <div
      className="sticky-note"
      style={{ left: x, top: y }}
    >
      <textarea
        placeholder="Write your note here..."
        onChange={(e) => onChange(id, e.target.value)}
        value={text}
      />
    </div>
  );
};

export default StickyNote;