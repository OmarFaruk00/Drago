"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params?.id;
    if (id) router.replace(`/admin/products/add/${id}`);
  }, [params?.id, router]);

  return (
    <div className="p-8 text-center text-gray-500">
      Redirecting to edit...
    </div>
  );
}
