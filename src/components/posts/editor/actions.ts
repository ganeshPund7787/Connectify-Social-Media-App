"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input: string, mediaIds: string[] = []) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content, mediaIds: validatedMediaIds } = createPostSchema.parse({
    content: input,
    mediaIds,
  });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
      // attachments: {
      //   connect: validatedMediaIds.map((id) => ({ id })),
      // },
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}
