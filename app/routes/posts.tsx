import { Outlet } from "remix";

export default function Posts() {
  return (
    <>
      {/*All nested routes in /posts folder are displayed through Outlet component*/}
      {/*name a nested routes folder same as filename in /routes folder*/}
      {/*we have posts.tsx (index file for posts) in /routes, so we created a folder /posts*/}
      {/*which contanes index.tsx etc. They will be displayed through Outlet*/}
      <Outlet />
    </>
  );
}
