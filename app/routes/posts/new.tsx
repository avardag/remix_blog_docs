import { Link, redirect, Form, ActionFunction, useActionData } from "remix";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  const fields = { title, body };

  //TODO: connect to DB
  // await createPost({ title, body});

  // return redirect(`/posts/${title}`);
};
export default function NewPost() {
  const actionData = useActionData();
  return (
    <>
      <div className="page-header">
        <h1>New posts</h1>
        <Link to={"/posts"} className={"btn btn-reverse"}>
          Back
        </Link>
      </div>
      <div className="page-content">
        <Form method="post">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" />
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea name="body" id="body" />
          </div>
          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </Form>
      </div>
    </>
  );
}
