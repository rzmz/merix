import { ActionFunction, Form, redirect, useActionData, useTransition } from "remix";
import invariant from "tiny-invariant";
import { createPost } from "~/post";

export let action: ActionFunction = async ({ request }) => {
    let formData = await request.formData();
    let title = formData.get("title");
    let slug = formData.get("slug");
    let markdown = formData.get("markdown");

    let errors = {} as any;
    if (!title) errors.title = true;
    if (!slug) errors.slug = true;
    if (!markdown) errors.markdown = true;

    if (Object.keys(errors).length) {
        return errors;
    }

    invariant(typeof title === "string", "title must be a string");
    invariant(typeof slug === "string", "slug must be a string");
    invariant(typeof markdown === "string", "markdown must be a string");

    await createPost({ title, slug, markdown });

    return redirect("/posts/admin");
};

export default function NewPost() {
    let errors = useActionData();
    let transition = useTransition();

    return (
        <div>
            <h2>New Post</h2>
            <Form method="post">
                <p>
                    <label>
                        Post Title:{" "}
                        {errors?.title && <em>Title is required</em>}
                        <input type="text" name="title" />
                    </label>
                </p>
                <p>
                    <label>
                        Post Slug: {errors?.slug && <em>Slug is required</em>}
                        <input type="text" name="slug" />
                    </label>
                </p>
                <p>
                    <label htmlFor="markdown">Markdown</label>{" "}
                    {errors?.markdown && <em>Markdown is required</em>}
                    <br />
                    <textarea
                        name="markdown"
                        rows={20}
                        style={{ width: "100%" }}
                    ></textarea>
                </p>
                <p>
                    <button type="submit">
                        {transition.submission ? "Creating..." : "Create Post"}
                    </button>
                </p>
            </Form>
        </div>
    );
}
