"use client";

/**
 * BlogContent - Main body text with optional inline image
 */

import Image from "next/image";

export default function BlogContent({ post }) {
  const paragraphs = post.content?.split(/\n\n+/) || [post.excerpt || "Lorem ipsum dolor sit amet."];
  const midIndex = Math.floor(paragraphs.length / 2);

  return (
    <article className="prose prose-gray max-w-none">
      <div className="space-y-4 text-gray-600 leading-relaxed">
        {paragraphs.map((p, i) => (
          <div key={i}>
            <p>{p}</p>
            {i === midIndex && post.contentImage && (
              <div className="my-6 relative aspect-square max-w-sm mx-auto">
                <Image
                  src={post.contentImage}
                  alt=""
                  fill
                  className="object-cover rounded-lg"
                  sizes="400px"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
