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
import { validateFieldLength } from "~/utils/validateFields";
import { getUserId } from "~/utils/session.server";

function badRequest(data: any) {
  return json(data, { status: 400 });
}

export const action: ActionFunction = async ({ request }) => {
  const user_id = await getUserId(request);
  if (!user_id) return;
  const userId = parseInt(user_id); //userId in session is string, but Int in postgres
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  const fields = { title, body };

  const fieldErrors = {
    title: validateFieldLength(title, "Title", 3),
    body: validateFieldLength(body, "Post body", 10),
  };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  //TODO: correct typings
  const post = await db.post.create({
    data: { ...fields, userId },
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
