"use client";

/**
 * CommentSection - Comments list + CommentForm
 */

import Image from "next/image";
import CommentForm from "./CommentForm";
import { comments } from "@/lib/data/blog";

export default function CommentSection({ postComments = comments }) {
  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <CommentForm />

      <div className="mt-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Comments</h3>
        <ul className="space-y-6">
          {postComments.map((c) => (
            <li key={c.id} className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                <Image src={c.avatar} alt={c.name} width={48} height={48} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900">{c.name}</span>
                  <span className="text-sm text-gray-500">{c.date}</span>
                </div>
                <p className="mt-1 text-gray-600 text-sm">{c.text}</p>
                <button className="mt-2 text-sm text-red-600 hover:underline">Reply</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="mt-6 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
          Load More Comments
        </button>
      </div>
    </section>
  );
}
