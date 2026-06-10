# Samrat Prajapati Portfolio

A responsive personal portfolio website for Samrat Prajapati, built with plain HTML, CSS, and JavaScript.

## Preview

Use a local server so the browser can load `data/projects.json`, for example:

```sh
python3 -m http.server
```

Then open `http://localhost:8000`.

## Files

- `index.html` - page content and sections
- `styles.css` - responsive visual design
- `script.js` - mobile menu, reveal animations, active nav, and email copy
- `admin.html` - simple dashboard for managing project cards
- `data/projects.json` - project titles, topics, links, tags, and thumbnails
- `assets/samrat-profile.png` - profile image used in the hero section

## Customize

Update the social links in the footer of `index.html` when the final Facebook, Instagram, and LinkedIn URLs are ready.
Project cards are managed from `admin.html`. Add or edit projects there, then export `projects.json` and replace `data/projects.json` before pushing the site to GitHub.

The admin page also has a `Push to GitHub` button. To use it, create a fine-grained GitHub token for `samrat49/Portfolio` with `Contents: Read and write`, paste it into the admin page, and click `Push to GitHub`. The token is not saved in the project files.
