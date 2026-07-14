# Peter Evans-Ramos Portfolio Website

A responsive personal portfolio highlighting Peter's IT support experience, cybersecurity education, certifications, and hands-on projects. The site is intentionally simple: it uses no framework, build step, database, or paid service.

## Technologies used

- HTML5 for content and structure
- CSS3 for layout, colors, responsiveness, and restrained animation
- Vanilla JavaScript for the mobile menu, active navigation, reveal effects, and current year

## Folder structure

```text
portfolio-website/
├── index.html                         Main page and portfolio content
├── css/
│   └── style.css                      All visual styles and responsive rules
├── js/
│   └── script.js                      Small interactive enhancements
├── assets/
│   ├── images/                        Future profile and project images
│   └── documents/
│       └── peter-evans-ramos-resume.pdf
└── README.md                          Project instructions
```

## Open the website locally

1. Open the `portfolio-website` folder.
2. Double-click `index.html`.
3. The site will open in your default browser. No installation or internet connection is required.

## Edit the content

Open `index.html` in a text editor such as Visual Studio Code. Each major section has a descriptive `id`, such as `about`, `skills`, `experience`, and `projects`. Edit the text between the matching HTML tags, save the file, and refresh your browser.

Employment entries are grouped inside `.experience-timeline` in `index.html`. To add another job, copy one complete `<article class="timeline-item">` block, then replace its title, employer, dates, and bullet points with verified information.

The public LinkedIn profile used by the contact section and footer is [linkedin.com/in/peterevansramos](https://www.linkedin.com/in/peterevansramos/).

Colors, spacing, and layout are defined near the top of `css/style.css` as CSS custom properties. Changing a value such as `--blue` updates that color throughout the site.

## Preview changes

The quickest preview method is to save your files and refresh `index.html` in a browser. For an optional local server in Visual Studio Code, you may install the free Live Server extension, but it is not required.

Check changes at several browser widths. Browser developer tools usually include desktop, tablet, and mobile previews.

## Publish with GitHub Pages

Publishing is not automatic. When you are ready:

1. Create a GitHub repository, such as `portfolio-website`.
2. Upload or push the contents of this folder so `index.html` is at the repository root.
3. On GitHub, open **Settings**, then **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.
6. Wait for GitHub to display the public website address.

GitHub's interface may change over time, so consult the current GitHub Pages documentation if a label looks different. Review your email address, LinkedIn link, resume, and all project statuses before publishing.

## Replace the resume PDF

1. Name the new file `peter-evans-ramos-resume.pdf`.
2. Replace the existing file in `assets/documents/`.
3. Keep the same filename so both website links continue working.

If you choose another filename, update both PDF links in `index.html`.

## Add images later

Place a professional portrait or project screenshots in `assets/images/`. Use lowercase, descriptive filenames without spaces, such as `peter-headshot.jpg` or `ubuntu-home-lab.png`.

The hero currently uses a CSS-styled `PER` monogram. To replace it with a portrait later, add an `<img>` element inside the `.profile-monogram` area in `index.html`, give it useful alternative text, and add styling in `css/style.css`. Project cards include comments showing where future screenshot, GitHub, or case-study links can be added.

Before publishing images, resize and compress them so the site stays fast. Avoid including sensitive information in screenshots.

## Future improvements

- Replace the hero placeholder with a professional photo
- Add project screenshots and detailed case studies
- Link completed projects to their GitHub repositories
- Update learning labels and project badges as skills develop
- Add verified certification links if they become available
- Add a custom domain after publishing on GitHub Pages

## Accessibility notes

The site includes semantic page landmarks, keyboard-visible focus styles, a skip link, labeled navigation controls, responsive text and layouts, and reduced-motion support. Keep headings in order and write descriptive alternative text when adding images.
