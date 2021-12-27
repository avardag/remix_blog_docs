import {
  Outlet,
  LiveReload,
  Link,
  Links,
  Meta,
  useCatch,
  useLoaderData,
  LoaderFunction,
} from "remix";
import globalStylesUrl from "~/styles/global.css";
import { getUser } from "./utils/session.server";

//export links function from any route module , to apply styles specific to that roite
//also include <Links /> in Document component, so styles are applied
export const links = () => [{ rel: "stylesheet", href: globalStylesUrl }];
//export meta function to add meta tags to html document
//also include <Meta /> in Document component
export const meta = () => {
  const description = "A cool blog built with Remix";
  const keywords = "remix, react, javascript, blog";
  return { description, keywords };
};
//loader func
export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  return {
    user,
  };
};
//Default root func af my app
export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}
//html markup for the root component, all app is wrapped inside it
function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
      <title>{title ? title : "First Remix Blog"}</title>
      <body>
        {children}
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useLoaderData();
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button type="submit" className="btn">
                  Logout
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}
/*
You cannot `useLoaderData` in an error boundary.
TypeError: Cannot destructure property 'user' of '(0 , import_remix3.useLoaderData)(...)' as it is undefined.
*/
function ErrorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          Remix
        </Link>
        <ul className="nav">
          <li>
            <Link to="/posts">Posts</Link>
          </li>
        </ul>
      </nav>
      <div className="container">{children}</div>
    </>
  );
}

//An ErrorBoundary is a React component that renders whenever there is an error anywhere on the route,
// either during rendering or during data loading.
// Note: We use the word "error" to mean an uncaught exception; something you didn't anticipate happening.
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Oh no!">
      <ErrorLayout>
        {/* add the UI you want your users to see */}
        <p>{error.message}</p>
      </ErrorLayout>
    </Document>
  );
}
//for errors in Response
//use CatchBoundary and useCatch to create a custom 404 error message as a fallback for all Not Found routes.
export function CatchBoundary() {
  let caught = useCatch();
  let message;
  switch (caught.status) {
    case 404:
      message = <p>This is a custom error message for 404 pages</p>;
      break;
    case 500:
      message = <p>This is a custom error message for 500 pages</p>;
      break;
    // You can customize the behavior for other status codes
    default:
      throw new Error(caught.data || caught.statusText);
  }
  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ErrorLayout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </ErrorLayout>
    </Document>
  );
}
