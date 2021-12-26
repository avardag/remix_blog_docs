import {
  Link,
  redirect,
  Form,
  ActionFunction,
  useActionData,
  json,
} from "remix";
import type FormDataEntryValue from "remix";
import { db } from "~/utils/db.server";

function validateTitle(title: FormDataEntryValue | null | string) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}

function validateBody(body: FormDataEntryValue | null | string) {
  if (typeof body !== "string" || body.length < 10) {
    return "Post should be at least 10 characters long";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }
  //TODO: correct typings
  const post = await db.post.create({
    data: fields as { title: string; body: string },
  });

  return redirect(`/posts/${post.id}`);
};
export default function NewPost() {
  const actionData = useActionData();
  const titleError = actionData?.fieldErrors?.title;
  const bodyError = actionData?.fieldErrors?.body;
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
            <input
              type="text"
              name="title"
              id="title"
              defaultValue={actionData?.fields?.title}
            />
            <div className="error">{titleError && <p>{titleError}</p>}</div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post Body</label>
            <textarea
              name="body"
              id="body"
              defaultValue={actionData?.fields?.body}
            />
            <div className="error">{bodyError && <p>{bodyError}</p>}</div>
          </div>
          <button type="submit" className="btn btn-block">
            Add Post
          </button>
        </Form>
      </div>
    </>
  );
}
