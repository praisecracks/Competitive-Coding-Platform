import { LearningTrack } from "../data";
export const masterHtml: LearningTrack = {
  id: "master-html",
  title: "Master HTML",
  subtitle: "Beginner to Real UI Building",
  description:
    "Complete HTML journey from first page to semantic, accessible websites. Every concept taught with live examples you can edit and see instantly.",
  type: "master_track",
  icon: "Globe",
  color: "orange",
  coverImage:
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  totalHours: 28,
  language: "html",
  category: "HTML",
  topics: [
    {
      id: "html-introduction",
      title: "Introduction to HTML",
      description:
        "Understand what HTML is and how websites are structured.",
      duration: "25 min",
      subtopics: [
        {
          id: "html-what-is-html",
          title: "What is HTML?",
          type: "read",
          content: {
            explanation: [
              "HTML stands for HyperText Markup Language. It is the foundation of every website you see on the internet.",
              "Think of HTML like the skeleton of a human body. It defines where everything goes. Headings, paragraphs, images, buttons, and layouts all start with HTML.",
              "When a browser loads a website, it reads HTML first. It then builds a structure called the DOM, which is what gets displayed visually.",
              "Understanding HTML is the first step into web development. Without it, nothing else makes sense."
            ],
            example: {
              title: "Your First HTML Page",
              html: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>

</head>
<body>
    <h1>Hello World</h1>
    <p>This is my first website. Welcome!</p>
</body>
</html>`,
              explanation:
                "This is a complete HTML document. The browser reads it and displays the content inside the body. The CSS in the style tag controls how it looks."
            },
            practice:
              "Change the text inside the <h1> to your name and update the paragraph to describe yourself. Change the h1 color to red."
          }
        },
        {
          id: "html-document-structure",
          title: "HTML Document Structure",
          type: "read",
          content: {
            explanation: [
              "Every HTML page follows a standard structure that browsers expect.",
              "The <!DOCTYPE html> declaration tells the browser this is an HTML5 document. It must be the first line.",
              "The <html> element is the root element that wraps all content. The lang attribute helps with accessibility and SEO.",
              "The <head> contains metadata - title, character encoding, links to stylesheets. None of this is visible on the page.",
              "The <body> contains all visible content - headings, paragraphs, images, and everything users see and interact with."
            ],
            example: {
              title: "Complete Document Structure",
              html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio - Home</title>
    <meta name="description" content="Welcome to my personal portfolio">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Welcome to My Portfolio</h1>
    <p>This is where visible content goes.</p>
    <script src="script.js"></script>
</body>
</html>`,
              explanation:
                "Each part of the document structure serves a specific purpose. The head content is invisible but crucial for SEO and styling."
            },
            practice:
              "Create a complete HTML document with proper structure. Add a title of 'My Learning Page', add a meta description, and put 'Learning HTML is fun!' in the body as an h1."
          }
        },
        {
          id: "html-comments",
          title: "HTML Comments: Documenting Your Code",
          type: "read",
          content: {
            explanation: [
              "Comments are notes in your code that are completely ignored by the browser. They exist only for developers.",
              "HTML comments use <!-- comment text --> syntax. They can span multiple lines.",
              "Use comments to explain complex sections, mark TODOs, temporarily disable code, or provide context for other developers.",
              "Good comments explain WHY, not WHAT. The code already shows what it does."
            ],
            example: {
              title: "Comment Patterns",
              html: `<!-- This is a single line comment -->

<!-- TODO: Add mobile navigation menu here -->
<div class="desktop-nav">
    <a href="/">Home</a>
</div>

<!-- 
    Section: Hero Banner
    This section appears at the top of every page
-->
<section class="hero">
    <h1>Welcome</h1>
</section>

<!-- Temporarily disabled while testing
<div class="old-feature">
    Old content here
</div>
-->`,
              explanation:
                "Comments help document your code and make it easier for others to understand. Use them liberally but keep them meaningful."
            },
            practice:
              "Create an HTML page with a header, main content, and footer section. Add comments to explain what each section does and a TODO comment for something you'd add later."
          }
        }
      ]
    },
    {
      id: "html-text-elements",
      title: "Text Elements and Tags",
      description: "Learn to structure text content with headings, paragraphs, and formatting.",
      duration: "60 min",
      subtopics: [
        {
          id: "html-headings",
          title: "Headings: Creating Information Hierarchy",
          type: "read",
          content: {
            explanation: [
              "Headings define the structure and hierarchy of your content. There are six levels from <h1> to <h6>.",
              "<h1> is the most important heading and should appear only once per page. It represents the main topic.",
              "Subsequent headings create a document outline. Search engines and screen readers use this hierarchy.",
              "Think of headings like a book: <h1> is the title, <h2> are chapters, <h3> are sections within chapters.",
              "Never skip heading levels for styling. Use CSS for visual changes, not heading levels."
            ],
            example: {
              title: "Heading Hierarchy Example",
              html: `<h1>Complete Web Development Guide</h1>

<h2>Chapter 1: HTML Basics</h2>
<h3>What is HTML?</h3>
<h3>Document Structure</h3>

<h2>Chapter 2: CSS Styling</h2>
<h3>Selectors</h3>
<h3>Properties</h3>

<!-- Bad: Don't skip heading levels -->
<h1>Main Title</h1>
<h3>Subsection</h3>  <!-- Don't skip from h1 to h3! -->`,
              explanation:
                "Use a logical heading hierarchy. Screen reader users navigate by headings, so skipping levels causes confusion."
            },
            practice:
              "Create an outline for a recipe page. Use an h1 for the recipe name, h2 for sections (Ingredients, Instructions, Tips), and h3 for subsections within Instructions."
          }
        },
        {
          id: "html-paragraphs",
          title: "Paragraphs and Text Content",
          type: "read",
          content: {
            explanation: [
              "The <p> element defines paragraphs of text. Browsers automatically add margin before and after.",
              "HTML collapses whitespace - multiple spaces or line breaks become a single space.",
              "Use <br> for line breaks inside paragraphs (poetry, addresses). Use <hr> for thematic breaks.",
              "For preformatted text (code, ASCII art), use <pre> which preserves spaces and line breaks.",
              "Never use multiple <br> tags for spacing. Use CSS margin instead."
            ],
            example: {
              title: "Working with Paragraphs",
              html: `<h2>Basic Paragraphs</h2>
<p>This is a normal paragraph. Browsers add space above and below automatically.</p>
<p>This is another paragraph. Notice the space between paragraphs.</p>

<h2>Line Breaks with &lt;br&gt;</h2>
<p>
Roses are red<br>
Violets are blue<br>
Sugar is sweet<br>
And so are you
</p>

<h2>Thematic Break with &lt;hr&gt;</h2>
<p>Content above the divider</p>
<hr>
<p>Content below the divider</p>

<h2>Preformatted Text with &lt;pre&gt;</h2>
<pre>
   /\\
  /  \\
 /____\\
 |    |
 |    |
</pre>`,
              explanation:
                "Paragraphs create readable text blocks. Use <br> sparingly (mainly in poems or addresses). <pre> is great for code examples."
            },
            practice:
              "Create a 'Contact Information' section. Use paragraphs for name and title. Use <br> for a multi-line address. Use <hr> to separate contact info from a map section."
          }
        },
        {
          id: "html-text-formatting",
          title: "Text Formatting: Bold, Italic, and Emphasis",
          type: "read",
          content: {
            explanation: [
              "HTML provides both presentational tags (visual only) and semantic tags (with meaning).",
              "Semantic tags: <strong> indicates importance (screen readers emphasize). <em> indicates stress emphasis.",
              "Presentational tags: <b> for bold, <i> for italic. Use these only when you want visual formatting without meaning.",
              "Other useful tags: <mark> for highlighting, <small> for fine print, <del> for deleted text.",
              "Use <sup> and <sub> for math and chemical formulas."
            ],
            example: {
              title: "Text Formatting Elements",
              html: `<h2>Semantic vs Presentational</h2>
<p>This is <strong>very important</strong> information (semantic).</p>
<p>This is <em>really emphasized</em> text (semantic).</p>
<p>This is <b>bold</b> but not important (presentational).</p>
<p>This is <i>italic</i> but not emphasized (presentational).</p>

<h2>Special Formatting</h2>
<p>This text has <mark>highlighted</mark> content.</p>
<p><small>Small print: Terms and conditions apply.</small></p>
<p>Original price: <del>$100</del> <ins>$79.99</ins></p>

<h2>Scientific Notation</h2>
<p>Water is H<sub>2</sub>O</p>
<p>Einstein's equation: E = mc<sup>2</sup></p>`,
              explanation:
                "Use <strong> and <em> when the emphasis affects meaning. Screen readers announce them differently, making your content more accessible."
            },
            practice:
              "Create a 'Flash Sale' announcement. Include a strong urgent message, emphasized discount, marked limited time, and small fine print."
          }
        },
        {
          id: "html-lists",
          title: "Lists: Organizing Information",
          type: "read",
          content: {
            explanation: [
              "Lists organize related items into structured collections. HTML provides three types.",
              "<ul> creates unordered (bulleted) lists. Use when order doesn't matter (grocery lists).",
              "<ol> creates ordered (numbered) lists. Use when sequence matters (instructions).",
              "<dl> creates description lists with <dt> (term) and <dd> (definition).",
              "Lists can be nested to create hierarchies. Navigation menus often use nested lists."
            ],
            example: {
              title: "All List Types",
              html: `<h2>Unordered List - Grocery List</h2>
<ul>
    <li>Apples</li>
    <li>Bananas</li>
    <li>Milk</li>
</ul>

<h2>Ordered List - Recipe Steps</h2>
<ol>
    <li>Preheat oven to 350°F</li>
    <li>Mix dry ingredients</li>
    <li>Add wet ingredients</li>
    <li>Bake for 30 minutes</li>
</ol>

<h2>Nested Lists - Website Structure</h2>
<ul>
    <li>Homepage</li>
    <li>Products
        <ul>
            <li>Electronics
                <ul>
                    <li>Laptops</li>
                    <li>Phones</li>
                </ul>
            </li>
            <li>Clothing</li>
        </ul>
    </li>
    <li>Contact</li>
</ul>

<h2>Description List - Glossary</h2>
<dl>
    <dt>HTML</dt>
    <dd>HyperText Markup Language - defines structure</dd>
    <dt>CSS</dt>
    <dd>Cascading Style Sheets - controls appearance</dd>
</dl>`,
              explanation:
                "Lists provide semantic structure. Screen readers announce the number of items. Nested lists create clear hierarchies."
            },
            practice:
              "Create a 'Top 5 Programming Languages' ordered list. Below it, create an unordered list of features for your favorite language."
          }
        },
        {
          id: "html-quotations",
          title: "Quotations and Citations",
          type: "read",
          content: {
            explanation: [
              "HTML provides specific elements for quoting content, both inline and block-level.",
              "<blockquote> is for longer block-level quotations. Use the cite attribute for source URL.",
              "<q> is for short inline quotations. Browsers add quotation marks automatically.",
              "<cite> is for citing sources - books, articles, or people.",
              "<address> is for contact information related to the page or article."
            ],
            example: {
              title: "Quotation Elements",
              html: `<h2>Blockquote</h2>
<blockquote cite="https://www.brainyquote.com/quotes/albert_einstein_100982">
    "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world."
    <footer>— Albert Einstein, <cite>What Life Means to Einstein</cite></footer>
</blockquote>

<h2>Inline Quote</h2>
<p>As Steve Jobs famously said, <q>Stay hungry, stay foolish.</q></p>

<h2>Address Element</h2>
<address>
    Written by John Doe<br>
    Visit us at:<br>
    Example.com<br>
    Box 564, Disneyland<br>
    USA
</address>`,
              explanation:
                "Use <blockquote> for quoted passages from other sources. The <cite> element identifies the source."
            },
            practice:
              "Find a famous quote from your favorite person. Present it as a blockquote with a cite reference. Add an address section for a fictional company."
          }
        }
      ]
    },
    {
      id: "html-links-images",
      title: "Links and Images",
      description: "Connect pages and embed visual content with hyperlinks and images.",
      duration: "60 min",
      subtopics: [
        {
          id: "html-hyperlinks",
          title: "Hyperlinks: Connecting the Web",
          type: "read",
          content: {
            explanation: [
              "The <a> (anchor) element creates hyperlinks - the fundamental connection that makes the web a web.",
              "The href attribute specifies the destination URL. Without href, it's just a placeholder.",
              "Absolute URLs point to external websites. Relative URLs point to pages within your site.",
              "Use target='_blank' to open links in new tabs. Add rel='noopener noreferrer' for security.",
              "Link text should be descriptive - avoid 'click here'."
            ],
            example: {
              title: "Different Types of Links",
              html: `<h2>External Links</h2>
<a href="https://www.google.com" target="_blank" rel="noopener noreferrer">
    Search Google (opens in new tab)
</a>

<h2>Internal Links</h2>
<a href="/about.html">About Us</a>
<a href="contact.html">Contact Page</a>

<h2>Anchor Links (Same Page)</h2>
<a href="#section1">Jump to Section 1</a>
<div id="section1" style="margin-top: 200px;">
    <h3>Section 1</h3>
    <p>Content here...</p>
</div>

<h2>Other URL Schemes</h2>
<a href="mailto:contact@example.com">Send Email</a>
<a href="tel:+15551234567">Call Us: (555) 123-4567</a>

<h2>Good vs Bad Link Text</h2>
<p>❌ Bad: <a href="/products">Click here</a> to see our products.</p>
<p>✅ Good: <a href="/products">View our product catalog</a> for great deals.</p>`,
              explanation:
                "Internal links use relative paths. Anchor links scroll to elements with matching IDs. Always use descriptive link text."
            },
            practice:
              "Create a navigation menu with 4 links (Home, About, Services, Contact). Add an external link that opens in a new tab."
          }
        },
        {
          id: "html-images",
          title: "Images: Embedding Visual Content",
          type: "read",
          content: {
            explanation: [
              "The <img> tag embeds images. It is self-closing (no closing tag).",
              "src attribute specifies the image URL. alt attribute provides text description for screen readers.",
              "Always include alt text! Decorative images can have alt='' (empty).",
              "Width and height attributes prevent layout shifts while the page loads.",
              "Use <figure> and <figcaption> to semantically group images with captions."
            ],
            example: {
              title: "Images Best Practices",
              html: `<h2>Basic Image</h2>
<img src="https://picsum.photos/id/1/400/300" 
     alt="Mountain landscape with forest and lake"
     width="400" height="300">

<h2>Image with Figure and Caption</h2>
<figure>
    <img src="https://picsum.photos/id/100/400/300" 
         alt="Canoe on a calm lake at sunrise">
    <figcaption>Sunrise canoeing on a peaceful mountain lake</figcaption>
</figure>

<h2>Decorative Image (Empty alt)</h2>
<img src="https://picsum.photos/id/20/50/50" 
     alt="" 
     width="50" height="50">
<span>Decorative - screen readers ignore it</span>

<h2>Image as Link</h2>
<a href="/gallery.html">
    <img src="https://picsum.photos/id/15/400/200" 
         alt="View our photo gallery - click to see more"
         width="400" height="200">
</a>

<h2>Lazy Loading</h2>
<img src="https://picsum.photos/id/42/400/300" 
     alt="Piano keys close-up"
     loading="lazy"
     width="400" height="300">`,
              explanation:
                "Always include alt text. Use empty alt for purely decorative images. <figure> with <figcaption> creates semantic image groups."
            },
            practice:
              "Create an image gallery with 3 images using figure/figcaption. Make one image a clickable link. Include proper alt descriptions."
          }
        }
      ]
    },
    {
      id: "html-tables",
      title: "Tables for Tabular Data",
      description: "Organize and display structured data with HTML tables.",
      duration: "50 min",
      subtopics: [
        {
          id: "html-table-basics",
          title: "Basic Table Structure",
          type: "read",
          content: {
            explanation: [
              "HTML tables display tabular data - spreadsheets, schedules, statistics. NEVER use tables for layout!",
              "Basic structure: <table> contains rows <tr>. Rows contain data cells <td> or header cells <th>.",
              "<th> defines header cells. Use scope='col' or scope='row' for screen readers.",
              "The <caption> element provides a title for the table."
            ],
            example: {
              title: "Basic Table",
              html: `<table border="1">
    <caption>Monthly Book Sales</caption>
    <thead>
        <tr>
            <th scope="col">Month</th>
            <th scope="col">Books Sold</th>
            <th scope="col">Revenue</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">January</th>
            <td>245</td>
            <td>$2,450</td>
        </tr>
        <tr>
            <th scope="row">February</th>
            <td>312</td>
            <td>$3,120</td>
        </tr>
        <tr>
            <th scope="row">March</th>
            <td>408</td>
            <td>$4,080</td>
        </tr>
    </tbody>
</table>`,
              explanation:
                "The first row uses <th> for column headers. Each row's first cell uses <th scope='row'> for row headers."
            },
            practice:
              "Create a table showing your weekly schedule. Days of week as column headers. Morning, Afternoon, Evening as row headers."
          }
        },
        {
          id: "html-table-advanced",
          title: "Advanced Tables: Spanning Cells",
          type: "read",
          content: {
            explanation: [
              "Use colspan to merge cells across multiple columns.",
              "Use rowspan to merge cells across multiple rows.",
              "<thead> groups header rows and repeats them when printing.",
              "<tbody> groups body content - you can have multiple tbody sections.",
              "<tfoot> groups footer rows (summaries, totals)."
            ],
            example: {
              title: "Advanced Table Features",
              html: `<table border="1">
    <caption>2024 Sales Report</caption>
    <thead>
        <tr>
            <th scope="col">Quarter</th>
            <th scope="col">Product A</th>
            <th scope="col">Product B</th>
            <th scope="col">Product C</th>
            <th scope="col">Total</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">Q1</th>
            <td>$10K</td>
            <td>$15K</td>
            <td>$8K</td>
            <td>$33K</td>
        </tr>
        <tr>
            <th scope="row">Q2</th>
            <td>$12K</td>
            <td>$18K</td>
            <td>$10K</td>
            <td>$40K</td>
        </tr>
        <tr>
            <th scope="row">Q3</th>
            <td>$14K</td>
            <td>$22K</td>
            <td colspan="2">Combined: $36K</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <th scope="row">Total</th>
            <td>$36K</td>
            <td>$55K</td>
            <td>$18K</td>
            <td>$109K</td>
        </tr>
    </tfoot>
</table>

<h3>Rowspan Example</h3>
<table border="1">
    <thead><tr><th>Category</th><th>Item</th><th>Price</th></tr></thead>
    <tbody>
        <tr><td rowspan="2">Electronics</td>
            <td>Laptop</td>
            <td>$999</td>
        </tr>
        <tr><td>Mouse</td><td>$25</td></tr>
        <tr><td rowspan="2">Clothing</td>
            <td>Shirt</td>
            <td>$30</td>
        </tr>
        <tr><td>Jeans</td><td>$60</td></tr>
    </tbody>
</table>`,
              explanation:
                "colspan merges cells horizontally. rowspan merges vertically. thead/tbody/tfoot provide semantic structure."
            },
            practice:
              "Create a class timetable with colspan to merge lunch break across all columns. Use rowspan for a teacher name that spans multiple class periods."
          }
        }
      ]
    },
    {
      id: "html-forms",
      title: "Forms and User Input",
      description: "Collect user data with forms, inputs, and validation.",
      duration: "80 min",
      subtopics: [
        {
          id: "html-form-basics",
          title: "Form Fundamentals",
          type: "read",
          content: {
            explanation: [
              "Forms collect user input and send it to a server. The <form> element is the container.",
              "action attribute: where to send the data (URL). method attribute: GET or POST.",
              "Each input needs a name attribute. The server uses names to identify submitted values.",
              "Always use <label>! The for attribute connects to input id. This makes forms accessible.",
              "Never rely only on client-side validation. Always validate on the server too."
            ],
            example: {
              title: "Basic Form Structure",
              html: `<h2>Contact Form</h2>
<form action="/submit-form" method="POST">
    <div>
        <label for="name">Full Name:</label>
        <input type="text" id="name" name="fullName">
    </div>
    <div>
        <label for="email">Email Address:</label>
        <input type="email" id="email" name="userEmail">
    </div>
    <div>
        <label for="message">Message:</label>
        <textarea id="message" name="userMessage" rows="4"></textarea>
    </div>
    <div>
        <button type="submit">Send Message</button>
    </div>
</form>

<h3>GET vs POST</h3>
<form action="/search" method="GET">
    <label for="search">Search:</label>
    <input type="search" id="search" name="q">
    <button type="submit">Search</button>
</form>

<form action="/login" method="POST">
    <label for="password">Password:</label>
    <input type="password" id="password" name="userPassword">
    <button type="submit">Login</button>
</form>`,
              explanation:
                "Always connect labels with inputs using id/for. GET is for searches. POST is for changes (registration, orders)."
            },
            practice:
              "Create a 'User Registration' form with fields for username, email, password, and confirm password. Include a submit button."
          }
        },
        {
          id: "html-input-types",
          title: "Input Types and Attributes",
          type: "read",
          content: {
            explanation: [
              "HTML5 introduced many specialized input types that provide better UX and validation.",
              "Common types: text, email, password, number, tel, url, search, date, color, range, file, checkbox, radio.",
              "Common attributes: placeholder, required, readonly, disabled, min/max.",
              "Browser support varies, but unsupported types fall back to text input."
            ],
            example: {
              title: "Input Type Showcase",
              html: `<form>
    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" placeholder="user@example.com" required>
    </div>
    <div>
        <label for="age">Age:</label>
        <input type="number" id="age" min="13" max="120" value="18">
    </div>
    <div>
        <label for="birthday">Birthday:</label>
        <input type="date" id="birthday">
    </div>
    <div>
        <label for="color">Favorite Color:</label>
        <input type="color" id="color" value="#3b82f6">
    </div>
    <div>
        <label for="volume">Volume:</label>
        <input type="range" id="volume" min="0" max="100" value="50">
    </div>
    <div>
        <label>Subscription:</label>
        <label><input type="radio" name="plan" value="free" checked> Free</label>
        <label><input type="radio" name="plan" value="premium"> Premium</label>
    </div>
    <div>
        <label><input type="checkbox" name="newsletter" checked> Subscribe</label>
    </div>
    <button type="submit">Register</button>
</form>`,
              explanation:
                "Each input type provides different UI and validation. range works well with output to show current value."
            },
            practice:
              "Create a 'Product Review' form with: rating (range 1-5), review date (date picker), and file upload for photo."
          }
        },
        {
          id: "html-form-validation",
          title: "Form Validation Attributes",
          type: "read",
          content: {
            explanation: [
              "HTML5 provides built-in validation attributes that work without JavaScript.",
              "required: Field cannot be empty. minlength/maxlength: Text length limits.",
              "min/max: Number/date ranges. pattern: Regular expression validation.",
              "The :valid and :invalid CSS pseudo-classes style fields based on validity.",
              "Validate on both client (UX) and server (security)."
            ],
            example: {
              title: "Validation Demo",
              html: `<style>
    input:valid { border-color: green; background-color: #f0fdf4; }
    input:invalid { border-color: red; background-color: #fef2f2; }
    input:required { border-left: 4px solid blue; }
</style>
<form>
    <div>
        <label for="username">Username (4-12 chars):</label>
        <input type="text" id="username" required minlength="4" maxlength="12" pattern="[A-Za-z0-9]+">
    </div>
    <div>
        <label for="password">Password (min 8 chars):</label>
        <input type="password" id="password" required minlength="8">
    </div>
    <div>
        <label for="age">Age (13-120):</label>
        <input type="number" id="age" min="13" max="120" value="18">
    </div>
    <div>
        <label for="zip">ZIP Code (5 digits):</label>
        <input type="text" id="zip" pattern="\\d{5}">
    </div>
    <div>
        <label><input type="checkbox" name="terms" required> I agree to terms</label>
    </div>
    <button type="submit">Submit</button>
</form>`,
              explanation:
                "The :valid and :invalid styles give instant visual feedback. pattern uses regular expressions for custom formats."
            },
            practice:
              "Create a 'Sign Up' form with: username (required, 6-15 chars, letters/numbers), password (required, min 8), age (18-100), and terms checkbox (required)."
          }
        }
      ]
    },
    {
      id: "html-semantic",
      title: "Semantic HTML",
      description: "Use HTML elements that convey meaning about their content.",
      duration: "50 min",
      subtopics: [
        {
          id: "html-semantic-elements",
          title: "Semantic Layout Elements",
          type: "read",
          content: {
            explanation: [
              "Semantic elements describe their meaning to browsers and developers.",
              "Common elements: <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>.",
              "Semantic HTML improves accessibility and SEO.",
              "Screen readers use semantic elements to help users navigate your page."
            ],
            example: {
              title: "Semantic Page Structure",
              html: `<header>
    <h1>Site Title</h1>
    <nav>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
    </nav>
</header>
<main>
    <article>
        <h2>Blog Post Title</h2>
        <p>Article content goes here...</p>
    </article>
    <aside>
        <h3>Related Links</h3>
        <ul><li><a href="#">Related Post 1</a></li></ul>
    </aside>
</main>
<footer>
    <p>&copy; 2024 My Website</p>
</footer>`,
              explanation:
                "Semantic elements create a clear document outline. Each element clearly defines its role in the page structure."
            },
            practice:
              "Convert a div-based layout to use semantic elements: header, nav, main, article, aside, and footer."
          }
        },
        {
          id: "html-accessibility",
          title: "Accessibility Basics",
          type: "read",
          content: {
            explanation: [
              "Accessibility ensures everyone can use your website, including people with disabilities.",
              "Use semantic HTML as the foundation - it's the most important accessibility feature.",
              "Always provide alt text for images. Use empty alt for decorative images.",
              "Use proper heading hierarchy (h1 to h6). Don't skip levels.",
              "Ensure sufficient color contrast. Don't rely on color alone to convey meaning."
            ],
            example: {
              title: "Accessible Form",
              html: `<form>
    <fieldset>
        <legend>Personal Information</legend>
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" required>
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" required>
        </div>
    </fieldset>
    <button type="submit">Submit</button>
</form>`,
              explanation:
                "fieldset and legend group related form controls. Always associate labels with inputs using for/id."
            },
            practice:
              "Make your contact form accessible with proper labels, fieldset, and legend."
          }
        }
      ]
    },
    {
      id: "html-multimedia",
      title: "Multimedia and Embeds",
      description: "Embed video, audio, iframes, and other rich content.",
      duration: "40 min",
      subtopics: [
        {
          id: "html-video-audio",
          title: "Video and Audio Elements",
          type: "read",
          content: {
            explanation: [
              "Use <video> to embed video content. The controls attribute adds play/pause.",
              "Use <audio> for sound content - podcasts, music, sound effects.",
              "Use multiple source formats (MP4, WebM) for browser compatibility.",
              "Always provide fallback content for unsupported browsers."
            ],
            example: {
              title: "Video and Audio Elements",
              html: `<h2>Video Example</h2>
<video width="400" controls>
    <source src="video.mp4" type="video/mp4">
    <source src="video.webm" type="video/webm">
    Your browser doesn't support video.
</video>

<h2>Audio Example</h2>
<audio controls>
    <source src="audio.mp3" type="audio/mpeg">
    <source src="audio.ogg" type="audio/ogg">
    Your browser doesn't support audio.
</audio>`,
              explanation:
                "Multiple source formats ensure compatibility. Controls attribute adds play/pause and volume."
            },
            practice:
              "Create a page with a video element that has controls and a poster image. Add fallback text."
          }
        },
        {
          id: "html-iframes",
          title: "Iframes for Embedded Content",
          type: "read",
          content: {
            explanation: [
              "Iframes embed another HTML page within your current page.",
              "Common uses: YouTube videos, Google Maps, external widgets.",
              "Always include a title attribute for accessibility.",
              "Use privacy-enhanced versions when available (youtube-nocookie.com)."
            ],
            example: {
              title: "Embedding External Content",
              html: `<h2>YouTube Video (Privacy Enhanced)</h2>
<iframe width="560" height="315" 
    src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" 
    title="YouTube video player"
    allowfullscreen>
</iframe>

<h2>Google Maps Embed</h2>
<iframe 
    src="https://maps.google.com/maps?q=New+York&output=embed"
    width="600" height="450" style="border:0;"
    allowfullscreen
    loading="lazy"
    title="Google Maps location">
</iframe>`,
              explanation:
                "The title attribute is required for accessibility. Use loading='lazy' for performance."
            },
            practice:
              "Embed a YouTube video (using privacy-enhanced URL) and a Google Map on your page. Add proper titles."
          }
        }
      ]
    },
    {
      id: "html-real-pages",
      title: "Building Real Pages",
      description: "Combine HTML elements to create complete website sections.",
      duration: "90 min",
      subtopics: [
        {
          id: "html-navbar",
          title: "Building a Navigation Bar",
          type: "read",
          content: {
            explanation: [
              "Navigation bars help users move around your website. Use <nav> with lists for semantic structure.",
              "Common patterns include logo + nav links + optional CTA button.",
              "Make your navigation clear and consistent across all pages.",
              "Use descriptive link text that tells users where they'll go."
            ],
            example: {
              title: "Responsive Navigation Bar",
              html: `<nav style="background: #2563eb; padding: 1rem;">
    <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center;">
        <div style="color: white; font-size: 1.5rem; font-weight: bold;">MySite</div>
        <ul style="display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;">
            <li><a href="#" style="color: white; text-decoration: none;">Home</a></li>
            <li><a href="#" style="color: white; text-decoration: none;">About</a></li>
            <li><a href="#" style="color: white; text-decoration: none;">Services</a></li>
            <li><a href="#" style="color: white; text-decoration: none;">Contact</a></li>
        </ul>
        <button style="background: white; color: #2563eb; padding: 0.5rem 1rem; border: none; border-radius: 0.25rem;">Sign Up</button>
    </div>
</nav>`,
              explanation:
                "A semantic nav element with an unordered list provides accessible navigation. Flexbox creates the horizontal layout."
            },
            practice:
              "Create a navigation bar with your site name/logo and 4 navigation links. Include a 'Get Started' button."
          }
        },
        {
          id: "html-hero",
          title: "Hero Section Design",
          type: "read",
          content: {
            explanation: [
              "Hero sections are the first thing visitors see. They grab attention and communicate your message.",
              "Key elements: headline, subheadline, call-to-action button(s), often with background image.",
              "The headline should be clear and benefit-driven.",
              "Make your CTA button stand out with contrasting colors."
            ],
            example: {
              title: "Hero Section Example",
              html: `<section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 2rem; text-align: center;">
    <div style="max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem;">Build Amazing Websites</h1>
        <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">
            Learn HTML, CSS, and JavaScript. Create responsive, beautiful websites that work everywhere.
        </p>
        <div>
            <button style="background: white; color: #667eea; padding: 0.75rem 2rem; border: none; border-radius: 0.5rem; font-size: 1rem; margin-right: 1rem; cursor: pointer;">
                Get Started
            </button>
            <button style="background: transparent; color: white; padding: 0.75rem 2rem; border: 2px solid white; border-radius: 0.5rem; font-size: 1rem; cursor: pointer;">
                Learn More
            </button>
        </div>
    </div>
</section>`,
              explanation:
                "Hero sections combine a headline, subheadline, and prominent CTA buttons. Gradients and contrast create visual impact."
            },
            practice:
              "Create a hero section for a fictional product or service. Include a headline, description, and two action buttons."
          }
        },
        {
          id: "html-cards",
          title: "Card Components",
          type: "read",
          content: {
            explanation: [
              "Cards display related information in a contained, scannable format.",
              "Common uses: product listings, team members, blog posts, features.",
              "Card components typically include image, title, description, and link.",
              "Use consi and spacing for a professional look."
            ],
            example: {
              title: "Feature Cards Grid",
              html: `<div style="background: #f3f4f6; padding: 3rem 2rem;">
    <h2 style="text-align: center; margin-bottom: 2rem;">Features</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto;">
        <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🚀</div>
            <h3>Fast Performance</h3>
            <p style="color: #6b7280; line-height: 1.5;">Lightning-fast loading times optimized for modern web standards.</p>
            <a href="#" style="color: #2563eb; text-decoration: none; display: inline-block; margin-top: 1rem;">Learn more →</a>
        </div>
        <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔒</div>
            <h3>Secure by Default</h3>
            <p style="color: #6b7280; line-height: 1.5;">Enterprise-grade security with automatic updates and monitoring.</p>
            <a href="#" style="color: #2563eb; text-decoration: none; display: inline-block; margin-top: 1rem;">Learn more →</a>
        </div>
        <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 2.5rem; margin-bottom: 1rem;">📱</div>
            <h3>Responsive Design</h3>
            <p style="color: #6b7280; line-height: 1.5;">Looks perfect on desktop, tablet, and mobile devices out of the box.</p>
            <a href="#" style="color: #2563eb; text-decoration: none; display: inline-block; margin-top: 1rem;">Learn more →</a>
        </div>
    </div>
</div>`,
              explanation:
                "CSS Grid creates a responsive card layout that adapts to screen size. Each card has consistent structure and spacing."
            },
            practice:
              "Create a team section with 3-4 card profiles. Each card should have an image placeholder, name, role, and short bio."
          }
        },
        {
          id: "html-footer",
          title: "Footer Sections",
          type: "read",
          content: {
            explanation: [
              "Footers appear at the bottom of every page and contain secondary navigation and information.",
              "Common footer content: copyright, links, contact info, social media, newsletter signup.",
              "Footers often have multiple columns of information.",
              "Include copyright notice with the current year."
            ],
            example: {
              title: "Complete Footer",
              html: `<footer style="background: #1f2937; color: #9ca3af; padding: 3rem 2rem 1.5rem;">
    <div style="max-width: 1200px; margin: 0 auto;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
            <div>
                <h3 style="color: white; margin-bottom: 1rem;">MySite</h3>
                <p>Building better websites for everyone.</p>
            </div>
            <div>
                <h4 style="color: white; margin-bottom: 1rem;">Product</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">Features</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">Pricing</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">FAQ</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color: white; margin-bottom: 1rem;">Company</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">About</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">Blog</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4 style="color: white; margin-bottom: 1rem;">Legal</h4>
                <ul style="list-style: none; padding: 0;">
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">Privacy</a></li>
                    <li><a href="#" style="color: #9ca3af; text-decoration: none;">Terms</a></li>
                </ul>
            </div>
        </div>
        <hr style="border-color: #374151;">
        <p style="text-align: center; margin-top: 1.5rem;">&copy; 2024 MySite. All rights reserved.</p>
    </div>
</footer>`,
              explanation:
                "A multi-column footer organizes information into logical groups. Copyright notice is essential for legal protection."
            },
            practice:
              "Create a footer with 4 columns: About, Services, Resources, and Social. Add a copyright notice at the bottom."
          }
        }
      ]
    },
    {
      id: "html-mini-project",
      title: "Mini Project: Portfolio Page",
      description: "Build a complete portfolio page combining everything you've learned.",
      duration: "120 min",
      subtopics: [
        {
          id: "html-portfolio-project",
          title: "Final Project: Personal Portfolio",
          type: "read",
          content: {
            explanation: [
              "Now combine everything into a complete personal portfolio page.",
              "Your portfolio should include: navigation bar, hero section, about section, projects section (cards), and footer.",
              "Use semantic HTML throughout. Ensure proper heading hierarchy.",
              "Make it responsive using CSS Grid/Flexbox where appropriate."
            ],
            example: {
              title: "Complete Portfolio Template",
              html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio | Web Developer</title>
    <meta name="description" content="Portfolio of a passionate web developer">
</head>
<body style="margin: 0; font-family: system-ui, -apple-system, sans-serif; line-height: 1.5;">
    <nav style="background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position: sticky; top: 0;">
        <div style="max-width: 1200px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 1.5rem; font-weight: bold;">MyPortfolio</div>
            <ul style="display: flex; gap: 2rem; list-style: none; margin: 0; padding: 0;">
                <li><a href="#" style="text-decoration: none; color: #374151;">Home</a></li>
                <li><a href="#" style="text-decoration: none; color: #374151;">About</a></li>
                <li><a href="#" style="text-decoration: none; color: #374151;">Projects</a></li>
                <li><a href="#" style="text-decoration: none; color: #374151;">Contact</a></li>
            </ul>
        </div>
    </nav>

    <section style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; padding: 5rem 2rem;">
        <div style="max-width: 800px; margin: 0 auto;">
            <h1 style="font-size: 3rem; margin-bottom: 1rem;">Hi, I'm Alex Johnson</h1>
            <p style="font-size: 1.25rem; margin-bottom: 2rem;">I build exceptional digital experiences that users love.</p>
            <button style="background: white; color: #667eea; padding: 0.75rem 2rem; border: none; border-radius: 0.5rem; font-size: 1rem;">View My Work</button>
        </div>
    </section>

    <section style="padding: 4rem 2rem; background: white;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 3rem;">About Me</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem;">
                <div>
                    <p>I'm a passionate web developer with 5+ years of experience creating responsive, user-friendly websites and applications.</p>
                    <p>I specialize in HTML, CSS, JavaScript, and modern frameworks. I believe in writing clean, maintainable code.</p>
                </div>
                <div>
                    <h3>Skills</h3>
                    <ul>
                        <li>HTML5 & Semantic HTML</li>
                        <li>CSS3 & Flexbox/Grid</li>
                        <li>JavaScript (ES6+)</li>
                        <li>Responsive Design</li>
                        <li>Accessibility (WCAG)</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <section style="padding: 4rem 2rem; background: #f3f4f6;">
        <div style="max-width: 1200px; margin: 0 auto;">
            <h2 style="text-align: center; margin-bottom: 3rem;">Featured Projects</h2>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3>Weather App</h3>
                    <p>Real-time weather application using JavaScript and OpenWeather API</p>
                    <a href="#" style="color: #667eea; text-decoration: none;">Learn more →</a>
                </div>
                <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3>Task Manager</h3>
                    <p>Productivity app with drag-and-drop task organization</p>
                    <a href="#" style="color: #667eea; text-decoration: none;">Learn more →</a>
                </div>
                <div style="background: white; border-radius: 0.5rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h3>Portfolio Template</h3>
                    <p>Responsive portfolio template for creative professionals</p>
                    <a href="#" style="color: #667eea; text-decoration: none;">Learn more →</a>
                </div>
            </div>
        </div>
    </section>

    <footer style="background: #1f2937; color: #9ca3af; padding: 3rem 2rem 1.5rem; text-align: center;">
        <p>&copy; 2024 Alex Johnson. Built with HTML5 and CSS.</p>
        <div style="margin-top: 1rem;">
            <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 0.5rem;">GitHub</a>
            <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 0.5rem;">Twitter</a>
            <a href="#" style="color: #9ca3af; text-decoration: none; margin: 0 0.5rem;">LinkedIn</a>
        </div>
    </footer>
</body>
</html>`,
              explanation:
                "This complete portfolio page combines navigation, hero section, about section, project cards, and footer. All elements work together to create a professional presentation."
            },
            practice:
              "Build your own portfolio page. Customize the colors, content, and projects to represent you. Add semantic HTML throughout."
          }
        }
      ]
    }
  ]
};