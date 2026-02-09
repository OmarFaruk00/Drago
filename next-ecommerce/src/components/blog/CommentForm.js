"use client";

/**
 * CommentForm - Leave a Reply form
 */

import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [form, setForm] = useState({ name: "", email: "", comment: "", save: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    setForm({ name: "", email: "", comment: "", save: false });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Leave a Reply</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <input
          type="email"
          placeholder="Your Email Address"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
      <textarea
        placeholder="Type your comment here"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        required
        rows={4}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={form.save}
          onChange={(e) => setForm({ ...form, save: e.target.checked })}
          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
        />
        Save my name, email, and website in this browser for the next time I comment.
      </label>
      <button type="submit" className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
        Post Comment
      </button>
    </form>
  );
}
