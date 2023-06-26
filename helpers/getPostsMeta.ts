import getFilePathsFromTreeWithExt from "@/utils/getFilePathsFromTreeWithExt";
import getPostByFilePath from "./getPostByFilePath";

export default async function getPostsMeta(): Promise<PostMeta[] | null> {
  const filetree: GithubFiletree = await (await getResFromGithubApi()).json();
  const postsFilePaths = getFilePathsFromTreeWithExt(filetree, ".mdx");

  const posts: PostMeta[] = [];
  for (const postFilePath of postsFilePaths) {
    const post = await getPostByFilePath(postFilePath);
    if (post) posts.push(post.meta);
  }

  console.log(posts);
  return posts;
}

function getResFromGithubApi() {
  return fetch(
    `https://api.github.com/repos/empflow/nextjs-blog-content/git/trees/main?recursive=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
}
