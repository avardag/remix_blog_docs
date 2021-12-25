import { Link, useLoaderData, LoaderFunction } from "remix";

export type Post = { id: string; title: string; body: string };
//export a function loader from route module to use, fetch, edit sever data
//to do server side stuff
//loader runs on the server
//used to load data from server
export const loader: LoaderFunction = () => {
  // return fakeDb.invoices.findAll();
  const data = {
    posts: [
      { id: "1", title: "First Post", body: "This is a test post" },
      { id: "2", title: "Second post", body: "This is a test post" },
      { id: "3", title: "Long post", body: "This is a test post" },
      { id: "4", title: "Last post", body: "This is a test post" },
    ],
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
            <Link to={post.id}>
              <h3>{post.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
