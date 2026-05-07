#!/usr/bin/env node
/**
 * Builds skeleton/index.html from content/site.json (dmelis-inspired Skeleton layout).
 * Add more exporters later, e.g. scripts/render-html5up.mjs, wired via npm scripts.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sitePath = path.join(root, "content", "site.json");
const outPath = path.join(root, "skeleton", "index.html");

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

function socialIcon(type) {
  const map = {
    scholar: { icon: 'class="ai ai-google-scholar ai-lg" aria-hidden="true"' },
    github: { icon: 'class="fa fa-github" aria-hidden="true"' },
    linkedin: { icon: 'class="fa fa-linkedin-square" aria-hidden="true"' },
    email: { icon: 'class="fa fa-envelope" aria-hidden="true"' },
  };
  return map[type] || { icon: 'class="fa fa-link" aria-hidden="true"' };
}

function renderSocial(social) {
  return social
    .map((s) => {
      const { icon } = socialIcon(s.type);
      const isMail = s.type === "email" || (s.url && s.url.startsWith("mailto:"));
      if (isMail) {
        return `<a href="${escapeHtml(s.url)}" title="Email"><i ${icon}></i></a>`;
      }
      return `<a href="${escapeHtml(s.url)}" target="_blank" rel="noopener noreferrer" title="${escapeHtml(s.type)}"><i ${icon}></i></a>`;
    })
    .join("\n              ");
}

function renderNav(nav) {
  return nav
    .map(
      (item) =>
        `          <li class="navbar-item"><a class="navbar-link" href="index.html#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`
    )
    .join("\n");
}

function renderExperience(items) {
  return items
    .map((job) => {
      const bullets = job.bullets
        .map((b) => `            <li>${b}</li>`)
        .join("\n");
      return `        <div class="experience-block" style="margin-bottom: 2rem;">
          <p style="margin-bottom: 0;">
            <img src="${escapeHtml(job.logo)}" alt="${escapeHtml(job.logoAlt)}" width="8%" style="float:left;margin-right:1em"/>
            <b>${escapeHtml(job.role)}</b> [${escapeHtml(job.dates)}] <br/>
            ${job.orgHtml}
          </p>
          <ul style="margin-left: 80px; margin-top: 0.5rem; clear: both;">
${bullets}
          </ul>
        </div>`;
    })
    .join("\n");
}

function renderEducation(items) {
  return items
    .map(
      (e) => `        <p>
          <img src="${escapeHtml(e.logo)}" alt="${escapeHtml(e.logoAlt)}" width="8%" style="float:left;margin-right:1em"/>
          ${e.degreeHtml} <br/> ${e.schoolHtml}
        </p>`
    )
    .join("\n\n");
}

function renderPubList(list) {
  return list
    .map(
      (p) => `        <li style="margin-bottom: 1rem;">
          <div>${p.titleHtml}</div>
          <div style="font-size: 0.9rem;">${p.authorsHtml}</div>
          <div style="font-size: 0.85rem; color: #555;">${p.venueHtml}</div>
        </li>`
    )
    .join("\n");
}

function renderBlog(posts) {
  const cells = posts
    .map(
      (p) => `        <div class="four columns">
          <a href="${escapeHtml(p.href)}" class="blog-thumb" target="_blank" rel="noopener noreferrer">
            <img src="${escapeHtml(p.img)}" alt="${escapeHtml(p.alt)}" class="u-max-full-width"/>
          </a>
        </div>`
    )
    .join("\n");
  return `      <div class="row">${cells}
      </div>`;
}

function renderTimeline(items) {
  return items
    .map((t) => {
      const dir = t.side === "l" ? "direction-l" : "direction-r";
      return `    <li>
      <div class="${dir}">
        <div class="flag-wrapper">
          <span class="flag">${escapeHtml(t.flag)}</span>
          <span class="time-wrapper"><span class="time">${escapeHtml(t.time)}</span></span>
        </div>
        <div class="desc">${t.descHtml}</div>
      </div>
    </li>`;
    })
    .join("\n\n");
}

function buildHtml(data) {
  const m = data.meta;
  const p = data.profile;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(m.title)}</title>
  <meta name="description" content="${escapeHtml(m.description)}">
  <meta name="author" content="${escapeHtml(m.author)}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="google-site-verification" content="${escapeHtml(m.googleSiteVerification)}"/>

  <link href="https://fonts.googleapis.com/css?family=Raleway:400,300,600" rel="stylesheet" type="text/css">

  <link rel="stylesheet" href="libs/external/skeleton/normalize.css">
  <link rel="stylesheet" href="libs/external/skeleton/skeleton.css">
  <link rel="stylesheet" href="libs/custom/my_css.css">
  <script src="libs/external/jquery-3.1.1.min.js"></script>
  <link rel="stylesheet" href="libs/external/font-awesome-4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" href="libs/external/academicons-1.8.6/css/academicons.min.css">
  <link rel="stylesheet" href="libs/external/timeline.css">
  <script src="libs/custom/my_js.js"></script>

  <link rel="icon" type="image/png" href="../images/favicon-32.png">
  <link rel="shortcut icon" type="image/png" href="../images/favicon-32.png">

  <script async src="https://www.googletagmanager.com/gtag/js?id=${escapeHtml(m.analyticsUa)}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${escapeHtml(m.analyticsUa)}');
  </script>
  <style>
    .social-row a { margin-right: 12px; font-size: 22px; color: #222; text-decoration: none; }
    .social-row a:hover { color: #33C3F0; }
    .blog-thumb img { border: 1px solid #eee; border-radius: 4px; }
    .experience-block:after { content: ""; display: table; clear: both; }
  </style>
</head>
<body>

  <div class="container">

    <section class="header">
      <div class="row">
        <div class="three columns">
          <a href="index.html"><img title="${escapeHtml(p.photoTitle)}" class="u-max-full-width" src="${escapeHtml(p.photoSrc)}" alt=""></a>
        </div>
        <div class="nine columns main-description">
          <h1>${escapeHtml(p.name)}</h1>
          ${p.lines.map((line) => `<p>${line}</p>`).join("\n          ")}
          <p class="social-row">
              ${renderSocial(p.social)}
          </p>
        </div>
      </div>
    </section>

    <div class="navbar-spacer"></div>
    <nav class="navbar">
      <div class="container">
        <ul class="navbar-list">
${renderNav(data.nav)}
        </ul>
      </div>
    </nav>

<span class="anchor" id="about"></span>
<div class="docs-section">
  <h4>About</h4>
  ${data.about.paragraphs.map((x) => `<p>${x}</p>`).join("\n  ")}
</div>

<span class="anchor" id="experience"></span>
<div class="docs-section">
  <h4>Experience</h4>
${renderExperience(data.experience)}
</div>

<span class="anchor" id="education"></span>
<div class="docs-section">
  <h4>Education</h4>
${renderEducation(data.education)}
</div>

<span class="anchor" id="publications"></span>
<div class="docs-section">
  <h4>Publications &nbsp; <span style="font-weight:400;font-size:1rem;">[<a href="${escapeHtml(data.publications.scholarUrl)}" target="_blank" rel="noopener noreferrer">Google Scholar</a>]</span></h4>
  <h5>Journal papers</h5>
  <ol>
${renderPubList(data.publications.journal)}
  </ol>
  <h5>Conference proceedings</h5>
  <ol>
${renderPubList(data.publications.conference)}
  </ol>
</div>

<span class="anchor" id="skills"></span>
<div class="docs-section">
  <h4>Skills</h4>
  <ul>
    ${data.skills.map((s) => `<li>${s.html}</li>`).join("\n    ")}
  </ul>
</div>

<span class="anchor" id="blog"></span>
<div class="docs-section">
  <h4>Technical blog</h4>
  <p>${data.blog.headingNoteHtml}</p>
${renderBlog(data.blog.posts)}
</div>

<span class="anchor" id="vita"></span>
<div class="docs-section">
  <h4>Vit&aelig;</h4>
  <p>${data.vita.introHtml}</p>
  <ul class="timeline">
${renderTimeline(data.timeline)}
  </ul>
</div>

    <div class="footer">
      <p>${data.footer.html}</p>
    </div>

  </div>

</body>
</html>
`;
}

const raw = fs.readFileSync(sitePath, "utf8");
const data = JSON.parse(raw);
fs.writeFileSync(outPath, buildHtml(data), "utf8");
console.log("Wrote", path.relative(root, outPath));
