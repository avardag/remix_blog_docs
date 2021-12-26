import {
  LoaderFunction,
  useLoaderData,
  Link,
  ActionFunction,
  redirect,
} from "remix";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ params }) => {
  const id = parseInt(params.postId as string);
  const post = await db.post.findUnique({
    where: { id },
  });
  if (!post) throw new Error("Post not found");
  return post;
};

export const action: ActionFunction = async ({ request, params }) => {
  const id = parseInt(params.postId as string);
  const form = await request.formData();
  if (form.get("_method") === "delete") {
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) throw new Error("Post not found");

    await db.post.delete({ where: { id } });

    return redirect("/posts");
  }
};
export default function Post() {
  // const params = useParams<{ postId: string }>();
  //param postId because file for dynamic route is named $postId.tsx
  const post = useLoaderData();

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
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button className="btn btn-delete">Delete</button>
        </form>
      </div>
    </div>
  );
}
