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
import { login, register, createUserSession } from "~/utils/session.server";
import { validateFieldLength } from "~/utils/validateFields";

function badRequest(data: any) {
  return json(data, { status: 400 });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const authType = formData.get("authType");
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const fields = { authType, username, password };

  const fieldErrors = {
    username: validateFieldLength(username, "Username", 3),
    password: validateFieldLength(password, "Password", 6),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }
  //handle login or signup
  switch (authType) {
    case "login": {
      // Find user
      const user = await login({ username, password });

      // Check user
      if (!user) {
        return badRequest({
          fields,
          fieldErrors: { username: "Invalid credentials" },
        });
      }

      // Create Session
      return createUserSession(user.id.toString(), "/posts");
    }
    case "register": {
      // Check if user exists
      const userExists = await db.user.findFirst({
        where: {
          username,
        },
      });
      if (userExists) {
        return badRequest({
          fields,
          fieldErrors: { username: `User ${username} already exists` },
        });
      }

      // Create user
      const user = await register({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: "Something went wrong",
        });
      }

      // Create session
      return createUserSession(user.id.toString(), "/posts");
    }
    default: {
      return badRequest({
        fields,
        formError: "Login type is invalid",
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData();
  const usernameError = actionData?.fieldErrors?.username;
  const passwordError = actionData?.fieldErrors?.password;
  const defaultAuthType = actionData?.fields?.authType;
  const defaultUsername = actionData?.fields?.username;
  const defaultPassword = actionData?.fields?.password;
  return (
    <div className="auth-container">
      <div className="page-header">
        <h1>Login</h1>
      </div>
      <div className="page-content">
        <form method="post">
          <fieldset>
            <legend>Login or Register</legend>
            <label>
              <input
                type="radio"
                name="authType"
                value="login"
                defaultChecked={!defaultAuthType || defaultAuthType === "login"}
              />{" "}
              Login
            </label>
            <label>
              <input
                type="radio"
                name="authType"
                value="register"
                defaultChecked={defaultAuthType === "register"}
              />{" "}
              Register
            </label>
          </fieldset>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              defaultValue={defaultUsername ? defaultUsername : ""}
            />
            <div className="error">
              {usernameError && <p>{usernameError}</p>}
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue={defaultPassword ? defaultPassword : ""}
            />
            <div className="error">
              {passwordError && <p>{passwordError}</p>}
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
