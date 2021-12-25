import { Outlet, LiveReload, Link, Links, Meta, useCatch } from "remix";
import globalStylesUrl from "~/styles/global.css";

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
      <Layout>
        {/* add the UI you want your users to see */}
        <p>{error.message}</p>
      </Layout>
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
    // You can customize the behavior for other status codes
    default:
      throw new Error(caught.data || caught.statusText);
  }
  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <h1>
          {caught.status}: {caught.statusText}
        </h1>
        {message}
      </Layout>
    </Document>
  );
}
