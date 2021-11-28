import parseFrontMatter from "front-matter";
import fs from "fs/promises";
import { marked } from "marked";
import path from "path";
import invariant from "tiny-invariant";

// relative to the server output not the source!
const postsPath = path.join(__dirname, "..", "posts");

export type Post = {
    slug: string;
    title: string;
};

export type PostMarkdownAttributes = {
    title: string;
};

function isValidPostAttributes(
    attributes: any
): attributes is PostMarkdownAttributes {
    return attributes?.title;
}

export async function getPost(slug: string) {
    let filepath = path.join(postsPath, slug + ".md");
    let file = await fs.readFile(filepath);
    let { attributes, body } = parseFrontMatter(file.toString());
    invariant(
        isValidPostAttributes(attributes),
        `Post ${filepath} is missing attributes`
    );
    const html = marked(body);
    return { slug, html, title: attributes.title };
}

export async function getPosts(): Promise<Post[]> {
    const dir = await fs.readdir(postsPath);

    return Promise.all(
        dir.map(async (filename) => {
            const file = await fs.readFile(
                path.join(postsPath, filename),
                "utf8"
            );
            const { attributes } = parseFrontMatter(file.toString());
            invariant(
                isValidPostAttributes(attributes),
                `${filename} has bad meta data!`
            );
            return {
                slug: filename.replace(/\.md$/, ""),
                title: attributes.title,
            };
        })
    );
}

type NewPost = {
    title: string;
    slug: string;
    markdown: string;
};

export async function createPost(post: NewPost) {
    await new Promise((res) => setTimeout(res, 1000));
    let md = `---\ntitle: ${post.title}\n---\n\n${post.markdown}`;
    await fs.writeFile(path.join(postsPath, post.slug + ".md"), md, "utf8");
    return getPost(post.slug);
}
