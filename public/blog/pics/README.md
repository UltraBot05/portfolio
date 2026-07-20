# Blog Image Storage

Images for blog posts are organized by post slug.

## Folder structure

```
public/blog/pics/
  <post-slug>/
    image.jpg
    screenshot.png
    ...
```

## Usage in Markdown

Reference images in your blog post markdown like this:

```markdown
![Alt text describing the image](/blog/pics/your-post-slug/image.jpg)
```

## Workflow

1. Write your post at `/write`
2. The editor shows the exact folder path and markdown syntax for your post's slug
3. Create the folder `public/blog/pics/<your-slug>/`
4. Drop your images in there
5. Reference them in your markdown as shown above

## Notes

- Images in `public/` are served statically — they are public
- Keep images reasonably sized (compress before adding)
- Prefer `.webp` for photos, `.svg` for diagrams
- The blog reader handles broken images gracefully (hides them)
