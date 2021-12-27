import {
  LoaderFunction,
  useLoaderData,
  Link,
  ActionFunction,
  redirect,
} from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import type { Post, User } from "@prisma/client";

type LoaderData = {
  post: Post;
  user: User | null;
};

export const loader: LoaderFunction = async ({
  params,
  request,
}): Promise<LoaderData> => {
  const user = await getUser(request);
  // const id = parseInt(params.postId as string);
  const id = parseInt(params.postId ?? "");
  let post;
  try {
    post = await db.post.findUnique({
      where: { id },
    });
  } catch (e) {
    throw new Error("Post not found");
  }
  // const post = await db.post.findUnique({
  //   where: { id },
  // });
  if (!post) throw new Error("Post not found");
  // if (!post) throw new Response("Post not found here", { status: 400 });
  return { post, user };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const user = await getUser(request);
    const id = parseInt(params.postId ?? "");
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) throw new Error("Post not found");

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id } });
    }

    return redirect("/posts");
  }
};

export default function Post() {
  // const params = useParams<{ postId: string }>();
  //param postId because file for dynamic route is named $postId.tsx
  const { post, user } = useLoaderData<LoaderData>();
  return (
    <div>
      <div className="page-header">
        <h1>{post.title}</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>

      <div className="page-content">{post.body}</div>

      <div className="page-footer">
        {user && post.userId === user.id && (
          <form method="POST">
            <input type="hidden" name="_method" value="delete" />
            <button className="btn btn-delete">Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}
