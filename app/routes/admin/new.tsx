import { Form } from "remix";

export default function NewPost() {
    return (
        <div>
            <h2>New Post</h2>
            <Form method="post">
                <p>
                    <label>
                        Post Title: <input type="text" name="title" />
                    </label>
                </p>
                <p>
                    <label>
                        Post Slug: <input type="text" name="slug" />
                    </label>
                </p>
                <p>
                    <label htmlFor="markdown">Markdown</label>
                    <br />
                    <textarea name="markdown" rows={20}></textarea>
                </p>
                <p>
                    <button type="submit">Create Post</button>
                </p>
            </Form>
        </div>
    );
}
