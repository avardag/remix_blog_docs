import { useParams } from "remix";

export default function Post() {
  const params = useParams<{ postId: string }>();
  //param postId because file for dynamic route is named $postId.tsx
  return (
    <div>
      <h1>Post {params.postId}</h1>
    </div>
  );
}
