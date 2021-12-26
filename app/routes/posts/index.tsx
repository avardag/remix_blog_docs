import { Link, useLoaderData, LoaderFunction } from "remix";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { db } from "~/utils/db.server";

export type Post = { id: string; title: string; body: string; createdAt: Date };
//export a function loader from route module to use, fetch, edit sever data
//to do server side stuff
//loader runs on the server
//used to load data from server
export const loader: LoaderFunction = async () => {
  // return fakeDb.invoices.findAll();
  const data = {
    // posts: await db.post.findMany({})
    // or to be more specific:
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };
  return data;
};

export default function Posts() {
  //to use data fetched by loader function
  const { posts } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Post Items</h1>
        <Link to="/posts/new" className="btn">
          New Post
        </Link>
      </div>
      <ul className="posts-list">
        {posts.map((post: Post) => (
          <li key={post.id}>
            <Link to={post.id.toString()}>
              <h3>{post.title}</h3>
              <p>
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
