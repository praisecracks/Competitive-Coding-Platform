import { LearningTrack } from "../data";

export const masterCss: LearningTrack = {
  id: "master-css",
  title: "Master CSS",
  subtitle: "Style Websites Like a Pro",
  description:
    "Learn how to style real web pages with colors, spacing, layouts, responsiveness, animations, and modern UI design using CSS.",
  type: "master_track",
  icon: "Palette",
  color: "pink",
  coverImage:
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=600",
  totalHours: 22,
  language: "html",
  category: "CSS",
  topics: [
    {
      id: "css-introduction",
      title: "Introduction to CSS",
      description:
        "Understand what CSS does, how it connects to HTML, and how browsers turn styles into visual design.",
      duration: "70 min",
      subtopics: [
        {
          id: "css-what-is-css",
          title: "What is CSS?",
          content: {
            explanation: [
              "CSS stands for Cascading Style Sheets. HTML gives a web page its structure, but CSS controls how that structure looks. Without CSS, a website can still display content, but it usually looks plain, unfinished, and difficult to enjoy.",
              "CSS is what allows you to control colors, fonts, spacing, borders, background images, shadows, layout, responsiveness, and animations. When you see a beautiful landing page, dashboard, mobile-friendly website, or product interface, CSS is one of the main reasons it looks polished.",
              "The word cascading means that CSS rules can flow from one place to another. Some styles can affect many elements at once, while more specific styles can override general ones. This is why understanding how CSS applies styles is important.",
              "In real projects, CSS helps turn a rough HTML structure into a usable product. It is not just about decoration. Good CSS improves readability, trust, user experience, and how professional your app feels."
            ],
            example: {
              title: "Styling Your First Page",
              html: `<h1>Hello CodeMaster</h1>
<p>This page is styled with CSS.</p>
<button>Start Learning</button>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #0f172a;
  color: white;
  text-align: center;
  padding: 40px;
}

h1 {
  color: #ec4899;
  font-size: 42px;
}

p {
  color: #cbd5e1;
}

button {
  background: #ec4899;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 10px;
}`,
              explanation:
                "The HTML creates the heading, paragraph, and button. CSS changes how they look by controlling the background, colors, font, spacing, and button design."
            },
            practice:
              "Change the background color, update the heading color, and make the button larger."
          },
        },
        {
          id: "css-how-css-connects",
          title: "How CSS Connects to HTML",
          content: {
            explanation: [
              "CSS works by selecting HTML elements and applying visual rules to them. The browser reads the HTML, finds the matching CSS selectors, and then paints the final result on the screen.",
              "There are three common ways to use CSS: inline CSS, internal CSS, and external CSS. Inline CSS is written directly inside an HTML element. Internal CSS is written inside a style tag. External CSS is written in a separate file and linked to the HTML page.",
              "In real projects, external CSS is usually preferred because it keeps your HTML cleaner and makes your styles easier to maintain. However, while learning, writing HTML and CSS side by side helps you quickly see how each rule affects the page.",
              "The important idea is simple: HTML describes what the content is, while CSS describes how that content should look."
            ],
            example: {
              title: "HTML and CSS Working Together",
              html: `<div class="profile-card">
  <h2>Adeyemi</h2>
  <p>Frontend learner building clean interfaces.</p>
</div>`,
              css: `.profile-card {
  background: white;
  color: #111827;
  padding: 24px;
  border-radius: 18px;
  max-width: 340px;
  margin: 40px auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.profile-card h2 {
  color: #ec4899;
}`,
              explanation:
                "The HTML creates a profile card. The CSS selects the card using .profile-card and gives it spacing, color, rounded corners, and shadow."
            },
            practice:
              "Change the class name from profile-card to student-card in both the HTML and CSS."
          },
        },
        {
          id: "css-selectors",
          title: "CSS Selectors",
          content: {
            explanation: [
              "Selectors tell CSS which HTML elements should receive a style. Without selectors, the browser will not know where your CSS rules should apply.",
              "You can select elements directly using names like h1, p, or button. You can select a class using a dot, like .card. You can select an id using a hash, like #hero. Classes are usually the most flexible and reusable option.",
              "A good selector helps you control your design without accidentally changing the wrong part of the page. For example, styling all p tags might affect every paragraph, while styling .card p only affects paragraphs inside cards.",
              "As your pages grow, selectors become more important. Clean selectors make your CSS easier to read, debug, and reuse."
            ],
            example: {
              title: "Element, Class, and ID Selectors",
              html: `<section id="hero">
  <h1>Welcome</h1>

  <div class="card">
    <h2>Learning CSS</h2>
    <p>This card is styled using a class selector.</p>
  </div>
</section>`,
              css: `h1 {
  color: #38bdf8;
  text-align: center;
}

#hero {
  padding: 40px;
  background: #020617;
}

.card {
  background: white;
  color: #111827;
  padding: 24px;
  border-radius: 16px;
  max-width: 340px;
  margin: 30px auto;
}`,
              explanation:
                "The h1 selector styles all h1 elements. The #hero selector styles the element with id='hero'. The .card selector styles elements with class='card'."
            },
            practice:
              "Create a second card with the same class and observe how both cards receive the same style."
          },
        },
      ],
    },
    {
      id: "css-cascade-specificity",
      title: "Cascade, Specificity, and Inheritance",
      description:
        "Understand how CSS resolves conflicting rules and how styles inherit or override each other.",
      duration: "80 min",
      subtopics: [
        {
          id: "css-cascade",
          title: "The Cascade",
          content: {
            explanation: [
              "The cascade is the algorithm that determines which CSS rules apply when multiple rules target the same element. Later rules in your stylesheet usually override earlier ones if they have the same specificity.",
              "But order is just one factor. The cascade also considers importance, with !important declarations being the strongest, followed by inline styles, then IDs, classes, and finally element selectors.",
              "Understanding the cascade helps you write CSS that is predictable. Instead of fighting against overrides, you can structure your styles in a way that makes sense.",
              "In real projects, the cascade is your friend when you organize CSS from general styles to specific ones. You start with resets and base styles, then components, then utilities."
            ],
            example: {
              title: "Cascade Order Example",
              html: `<p class="message">This text has multiple styles.</p>
<p>This text has only one style.</p>`,
              css: `p {
  color: #334155;
}

.message {
  color: #ec4899;
}

.message {
  color: #0f172a;
}`,
              explanation:
                "Both paragraph rules target the same element. The last .message rule overrides earlier ones because later rules win in the cascade when specificity is equal."
            },
            practice:
              "Reorder the two .message blocks and see how the text color changes based on order."
          },
        },
        {
          id: "css-specificity",
          title: "Specificity",
          content: {
            explanation: [
              "Specificity is how the browser decides which CSS rule to apply when multiple rules target the same element but have different selectors.",
              "Inline styles have the highest specificity. IDs are next, then classes and attributes, then element selectors. The universal selector * has no specificity at all.",
              "For example, a class selector like .card is more specific than an element selector like div. An ID selector like #card is more specific than both. This is why overusing IDs can make your CSS rigid and hard to override.",
              "The best practice is to keep specificity low and flat. When everything has similar specificity, the cascade works predictably and your styles remain easy to change."
            ],
            example: {
              title: "Specificity Comparison",
              html: `<div id="special" class="box">What color am I?</div>`,
              css: `div {
  color: #475569;
}

.box {
  color: #38bdf8;
}

#special {
  color: #ec4899;
}`,
              explanation:
                "The ID selector #special has the highest specificity, so the text becomes pink even though the class and element selectors also try to set the color."
            },
            practice:
              "Add a new rule .box.highlight with a different color and watch how adding a second class increases specificity."
          },
        },
        {
          id: "css-inheritance",
          title: "Inheritance",
          content: {
            explanation: [
              "Some CSS properties are inherited from parent elements to their children. For example, when you set font-family on the body, all text inside inherits that font unless overridden.",
              "Not all properties inherit. Box model properties like margin, padding, and border do not inherit, which makes sense because each element needs its own spacing.",
              "You can force inheritance using the inherit keyword, and you can prevent it using initial or unset. Understanding inheritance helps you write less CSS because you set styles once at a higher level.",
              "For instance, setting color on the body means you don't have to set it individually on every heading and paragraph."
            ],
            example: {
              title: "Inheritance in Action",
              html: `<div class="parent">
  <h2>This heading inherits styles</h2>
  <p>This paragraph also inherits the same font and color.</p>
  <button class="child">But this button overrides the color</button>
</div>`,
              css: `.parent {
  font-family: 'Georgia', serif;
  color: #0f172a;
  text-align: center;
}

.child {
  color: #ffffff;
  background: #ec4899;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
}`,
              explanation:
                "The parent div sets font-family and color. The heading and paragraph inherit these values, but the button overrides color while inheriting the font-family."
            },
            practice:
              "Add a new paragraph with a class that changes only its color while keeping the inherited font."
          },
        },
      ],
    },
    {
      id: "css-colors-typography",
      title: "Colors and Typography",
      description:
        "Learn how to control colors, fonts, text size, hierarchy, readability, and visual mood.",
      duration: "95 min",
      subtopics: [
        {
          id: "css-colors",
          title: "Working with Colors",
          content: {
            explanation: [
              "Color is one of the first things users notice in a design. It affects emotion, trust, readability, and how professional a website feels.",
              "CSS supports many color formats, including color names, hex values, RGB, RGBA, HSL, and gradients. In real projects, hex values and CSS variables are very common because they make colors easier to control consistently.",
              "Good color usage is not about using many colors. It is about choosing a small set of colors and using them with purpose. Most professional designs use a background color, a text color, a muted text color, and one or two accent colors.",
              "Contrast is very important. If your text color is too close to the background color, users will struggle to read your content. Strong contrast makes your interface easier and more comfortable to use."
            ],
            example: {
              title: "Using Colors Professionally",
              html: `<section class="hero">
  <p class="label">CSS DESIGN</p>
  <h1>Build Better Interfaces</h1>
  <p>Colors help your page feel clear, modern, and intentional.</p>
</section>`,
              css: `body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #020617;
}

.hero {
  color: white;
  padding: 70px 24px;
  text-align: center;
}

.label {
  color: #ec4899;
  font-weight: bold;
  letter-spacing: 4px;
}

h1 {
  color: #ffffff;
  font-size: 44px;
}

p {
  color: #cbd5e1;
}`,
              explanation:
                "The dark background creates contrast. The pink label acts as an accent. The paragraph uses a softer color so it does not compete with the heading."
            },
            practice:
              "Change the accent color from pink to blue and adjust the paragraph color to keep it readable."
          },
        },
        {
          id: "css-typography",
          title: "Typography and Fonts",
          content: {
            explanation: [
              "Typography controls how text looks and feels. A page can have strong content, but poor typography can still make it hard to read.",
              "CSS lets you control font family, font size, font weight, line height, letter spacing, text alignment, and text transformation. These properties help create hierarchy between headings, paragraphs, labels, and buttons.",
              "Line height is especially important. If lines are too close together, reading becomes tiring. If they are too far apart, the content feels disconnected. Good line height gives the text breathing space.",
              "Professional UI design uses typography to guide the eye. A user should immediately know what is most important, what supports it, and what action they should take next."
            ],
            example: {
              title: "Readable Text Styling",
              html: `<article class="content">
  <p class="eyebrow">TYPOGRAPHY</p>
  <h1>Learning CSS Typography</h1>
  <p>
    Typography helps users read your content comfortably and understand what matters first.
  </p>
</article>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #f8fafc;
  color: #0f172a;
  padding: 40px;
}

.content {
  max-width: 620px;
  margin: auto;
}

.eyebrow {
  color: #ec4899;
  font-weight: bold;
  letter-spacing: 3px;
  font-size: 12px;
}

h1 {
  font-size: 42px;
  line-height: 1.1;
}

p {
  font-size: 18px;
  line-height: 1.7;
  color: #475569;
}`,
              explanation:
                "The heading is large and tight. The paragraph has more line height, making it easier to read. The eyebrow label adds hierarchy before the heading."
            },
            practice:
              "Increase the paragraph font size and adjust the line height until the text feels comfortable."
          },
        },
        {
          id: "css-gradients",
          title: "Gradients",
          content: {
            explanation: [
              "Gradients allow one color to blend smoothly into another. They are often used in modern landing pages, buttons, cards, banners, and hero sections.",
              "A linear gradient moves in a direction, such as left to right or top to bottom. A radial gradient spreads from a center point outward. Gradients can make a design feel more energetic than using one flat color.",
              "The key to using gradients well is restraint. Too many strong gradients can make a page look noisy. A good gradient should support the content, not distract from it.",
              "Gradients are especially useful when paired with simple text, clean spacing, and strong contrast."
            ],
            example: {
              title: "Gradient Hero Section",
              html: `<section class="hero">
  <h1>Design with CSS</h1>
  <p>Create beautiful sections with simple gradient backgrounds.</p>
</section>`,
              css: `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.hero {
  min-height: 320px;
  padding: 60px 24px;
  color: white;
  text-align: center;
  background: linear-gradient(135deg, #ec4899, #8b5cf6, #06b6d4);
}

.hero h1 {
  font-size: 48px;
}

.hero p {
  font-size: 18px;
}`,
              explanation:
                "The linear-gradient creates a smooth color blend across the hero section. The white text stands out clearly against the colorful background."
            },
            practice:
              "Change the gradient direction and replace one of the colors with your favorite color."
          },
        },
      ],
    },
    {
      id: "css-box-model-spacing",
      title: "Box Model and Spacing",
      description:
        "Understand padding, margin, borders, width, height, and how elements take space.",
      duration: "100 min",
      subtopics: [
        {
          id: "css-box-model-basics",
          title: "The CSS Box Model",
          content: {
            explanation: [
              "Every HTML element is treated like a box by the browser. This is called the box model. Understanding it is one of the biggest steps toward controlling layout properly.",
              "The box model has four main parts: content, padding, border, and margin. Content is the actual text or image. Padding is the space inside the box. Border is the line around the box. Margin is the space outside the box.",
              "When beginners struggle with layout, it is often because they do not yet understand which type of space they are changing. Padding grows the inside of the element. Margin pushes other elements away.",
              "Once you understand the box model, layouts stop feeling random. You begin to understand why elements stretch, move, overlap, or create space."
            ],
            example: {
              title: "Box Model in Action",
              html: `<div class="box">
  <h2>CSS Box Model</h2>
  <p>This box has padding, border, and margin.</p>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #111827;
  color: white;
}

.box {
  width: 320px;
  padding: 24px;
  border: 2px solid #ec4899;
  margin: 50px auto;
  border-radius: 16px;
  background: #1f2937;
}`,
              explanation:
                "The width controls the box size. Padding creates inner space. Border outlines the box. Margin centers it and creates space outside."
            },
            practice:
              "Change the padding, border size, and margin to see how each one affects the box."
          },
        },
        {
          id: "css-sizing",
          title: "Width, Height, and Max-Width",
          content: {
            explanation: [
              "Width and height control the size of an element. However, in real websites, fixed sizes can sometimes cause problems because screens are not all the same size.",
              "A fixed width like 500px always tries to stay 500px wide. This can break on small screens. A max-width allows an element to grow only up to a certain size, while still shrinking on smaller screens.",
              "This is why many professional layouts use width: 100% together with max-width. It makes content flexible without becoming too wide on large screens.",
              "Good sizing makes a page feel stable, readable, and responsive."
            ],
            example: {
              title: "Responsive Card Width",
              html: `<div class="card">
  <h2>Responsive Card</h2>
  <p>This card can shrink on smaller screens but will not grow too wide.</p>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #f8fafc;
  padding: 24px;
}

.card {
  width: 100%;
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);
}`,
              explanation:
                "The card uses width: 100% so it can shrink, and max-width: 420px so it does not become too wide on larger screens."
            },
            practice:
              "Change max-width to 600px and observe how the card becomes wider on desktop."
          },
        },
        {
          id: "css-border-radius-shadow",
          title: "Borders, Radius, and Shadows",
          content: {
            explanation: [
              "Borders, rounded corners, and shadows are small design details that can make a UI feel more polished. They help separate sections, cards, buttons, and containers from the background.",
              "border adds a visible line around an element. border-radius rounds the corners. box-shadow creates depth by making an element appear slightly lifted from the page.",
              "A good shadow should usually be subtle. Very strong shadows can make a design look old or messy. Modern UI often uses soft shadows with low opacity.",
              "When combined well, borders and shadows improve structure without making the page feel heavy."
            ],
            example: {
              title: "Modern UI Card",
              html: `<div class="card">
  <span class="badge">NEW</span>
  <h2>Premium Card</h2>
  <p>This card uses border, radius, and shadow to feel polished.</p>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #f1f5f9;
  padding: 40px;
}

.card {
  max-width: 360px;
  margin: auto;
  background: white;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
}

.badge {
  color: #ec4899;
  font-size: 12px;
  font-weight: bold;
}`,
              explanation:
                "The border defines the card edge, the border-radius softens the corners, and the shadow creates depth."
            },
            practice:
              "Reduce the border-radius, then increase it again to see how it changes the feeling of the card."
          },
        },
      ],
    },
    {
      id: "css-display-types",
      title: "Display Types",
      description:
        "Learn how block, inline, and inline-block affect element behavior and layout flow.",
      duration: "60 min",
      subtopics: [
        {
          id: "css-display-property",
          title: "Block, Inline, and Inline-Block",
          content: {
            explanation: [
              "The display property determines how an element behaves in the layout flow. Block-level elements take up the full width available and create new lines before and after. Examples include div, h1, and p.",
              "Inline elements only take up as much width as needed and do not force new lines. Examples include span, a, and strong. You cannot set width or height on inline elements.",
              "Inline-block elements combine both behaviors. They flow like inline elements but allow you to set width, height, margin, and padding like block elements.",
              "Choosing the right display type is essential. Most layouts use block elements for structure, inline elements for text, and inline-block for specific UI pieces like buttons inside text."
            ],
            example: {
              title: "Display Types Compared",
              html: `<div class="block">Block element (full width)</div>
<span class="inline">Inline element</span>
<span class="inline">Another inline</span>
<div class="inline-block">Inline-block element</div>
<div class="inline-block">Another inline-block</div>`,
              css: `.block {
  background: #ec4899;
  padding: 12px;
  margin-bottom: 12px;
  color: white;
}

.inline {
  background: #38bdf8;
  padding: 8px;
  margin: 4px;
  color: white;
}

.inline-block {
  display: inline-block;
  background: #10b981;
  padding: 12px;
  margin: 8px;
  color: white;
  width: 180px;
}`,
              explanation:
                "The block element fills the width. Inline elements sit side by side but ignore width. Inline-block elements also sit side by side but respect width and margins."
            },
            practice:
              "Change the width of the inline-block elements and add more text to see how they behave differently from inline elements."
          },
        },
        {
          id: "css-display-none",
          title: "Hiding Elements",
          content: {
            explanation: [
              "Sometimes you need to hide an element without removing it from the HTML. CSS provides different ways to hide content, each with different effects on layout.",
              "display: none completely removes the element from the page. It takes up no space, and other elements behave as if it never existed.",
              "visibility: hidden hides the element but keeps its space reserved. The layout does not shift, leaving a blank gap.",
              "opacity: 0 makes the element transparent while keeping it in the layout and still interactive unless you also disable pointer events."
            ],
            example: {
              title: "Different Ways to Hide",
              html: `<div class="box visible">Visible Box</div>
<div class="box hidden-display">Hidden with display: none</div>
<div class="box hidden-visibility">Hidden with visibility: hidden</div>
<div class="box visible">Visible Box</div>`,
              css: `.box {
  background: #ec4899;
  color: white;
  padding: 16px;
  margin: 8px;
  border-radius: 8px;
}

.hidden-display {
  display: none;
}

.hidden-visibility {
  visibility: hidden;
}`,
              explanation:
                "The first hidden box disappears completely, and the layout closes the gap. The second hidden box leaves an empty space where it would have been."
            },
            practice:
              "Change hidden-display to use visibility: hidden and see how the behavior changes."
          },
        },
      ],
    },
    {
      id: "css-flexbox",
      title: "Flexbox",
      description:
        "Master one-dimensional layouts with Flexbox for navigation, cards, and centered content.",
      duration: "120 min",
      subtopics: [
        {
          id: "css-flexbox-basics",
          title: "Flexbox Fundamentals",
          content: {
            explanation: [
              "Flexbox is a CSS layout system used to arrange items in a row or column. It is one of the most important tools for modern web design.",
              "Before Flexbox, aligning items was often difficult. With Flexbox, centering, spacing, and arranging elements becomes much easier.",
              "The parent element becomes a flex container when you add display: flex. The children inside it become flex items. You can then control direction, spacing, alignment, and wrapping.",
              "Flexbox is perfect for navigation bars, cards, buttons, profile rows, pricing sections, and many common UI sections."
            ],
            example: {
              title: "Creating a Flex Layout",
              html: `<div class="cards">
  <div class="card">HTML</div>
  <div class="card">CSS</div>
  <div class="card">JavaScript</div>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #020617;
  padding: 40px;
}

.cards {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.card {
  background: #1e293b;
  color: white;
  padding: 24px;
  border-radius: 16px;
  min-width: 140px;
  text-align: center;
}`,
              explanation:
                "The cards container uses display: flex. Gap creates space between cards. justify-content centers them horizontally."
            },
            practice:
              "Change justify-content to space-between, flex-start, and flex-end to see how the cards move."
          },
        },
        {
          id: "css-flex-alignment",
          title: "Flexbox Alignment",
          content: {
            explanation: [
              "Flexbox becomes powerful when you understand alignment. justify-content controls alignment on the main axis, while align-items controls alignment on the cross axis.",
              "If flex-direction is row, the main axis is horizontal and the cross axis is vertical. If flex-direction is column, the main axis becomes vertical and the cross axis becomes horizontal.",
              "This is why beginners sometimes get confused. The meaning of justify-content and align-items depends on the direction of the flex container.",
              "Once you understand the axes, centering and arranging content becomes much easier."
            ],
            example: {
              title: "Centering with Flexbox",
              html: `<section class="screen">
  <div class="panel">
    <h2>Centered Panel</h2>
    <p>This panel is centered using Flexbox.</p>
  </div>
</section>`,
              css: `body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.screen {
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0f172a;
}

.panel {
  background: white;
  padding: 28px;
  border-radius: 18px;
  text-align: center;
  max-width: 360px;
}`,
              explanation:
                "justify-content centers the panel horizontally, while align-items centers it vertically inside the screen section."
            },
            practice:
              "Change align-items to flex-start and observe how the panel moves upward."
          },
        },
        {
          id: "css-flex-wrap-direction",
          title: "Flex Wrap and Direction",
          content: {
            explanation: [
              "By default, flex items try to fit on one line. When there are too many items, they might overflow or squish.",
              "flex-wrap: wrap allows items to move to the next line when there is not enough space. This is essential for responsive card grids and galleries.",
              "flex-direction changes the main axis. Column direction stacks items vertically, which is useful for mobile navigation or sidebars.",
              "Combining direction and wrap with flex-flow gives you powerful control over how items arrange in different screen sizes."
            ],
            example: {
              title: "Responsive Flex Wrap",
              html: `<div class="flex-container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>`,
              css: `.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background: #0f172a;
  padding: 20px;
}

.item {
  background: #ec4899;
  color: white;
  padding: 32px;
  border-radius: 12px;
  width: 100px;
  text-align: center;
}`,
              explanation:
                "The flex container wraps items onto new lines when they don't fit. Gap creates consistent space between items regardless of wrap."
            },
            practice:
              "Change flex-direction to column and adjust the container height to see how wrapping works vertically."
          },
        },
      ],
    },
    {
      id: "css-grid",
      title: "Grid",
      description:
        "Build powerful two-dimensional layouts with CSS Grid for complex page structures.",
      duration: "120 min",
      subtopics: [
        {
          id: "css-grid-basics",
          title: "CSS Grid Fundamentals",
          content: {
            explanation: [
              "CSS Grid is used to build two-dimensional layouts. That means it controls rows and columns at the same time.",
              "Flexbox is great for one-direction layouts. Grid is better when you need full page sections, dashboards, image galleries, course cards, and structured layouts.",
              "A grid container is created with display: grid. You can define columns using grid-template-columns and control spacing with gap.",
              "Grid makes it easier to build layouts that look clean, balanced, and organized."
            ],
            example: {
              title: "Building a Simple Grid",
              html: `<div class="grid">
  <div class="item">One</div>
  <div class="item">Two</div>
  <div class="item">Three</div>
  <div class="item">Four</div>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #f8fafc;
  padding: 40px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.item {
  background: #ec4899;
  color: white;
  padding: 30px;
  border-radius: 14px;
  text-align: center;
}`,
              explanation:
                "The grid has two equal columns. Each item automatically fills the available grid cells."
            },
            practice:
              "Change the grid to three columns using repeat(3, 1fr)."
          },
        },
        {
          id: "css-grid-template",
          title: "Grid Template Areas",
          content: {
            explanation: [
              "Grid template areas let you name sections of your grid and place items using those names. This is one of the most readable ways to build complex layouts.",
              "You define a grid area with grid-template-areas using ASCII art. Each row is a string, and each word in the string represents a cell in that row.",
              "Then you assign items to those areas using the grid-area property. The layout becomes easy to understand just by looking at the CSS.",
              "Template areas are perfect for page layouts with headers, sidebars, main content, and footers."
            ],
            example: {
              title: "Page Layout with Grid Areas",
              html: `<div class="page">
  <header class="header">Header</header>
  <nav class="nav">Nav</nav>
  <main class="main">Main Content</main>
  <aside class="sidebar">Sidebar</aside>
  <footer class="footer">Footer</footer>
</div>`,
              css: `.page {
  display: grid;
  grid-template-areas:
    "header header"
    "nav main"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  gap: 16px;
  min-height: 400px;
  padding: 20px;
}

.header {
  grid-area: header;
  background: #ec4899;
  padding: 20px;
}

.nav {
  grid-area: nav;
  background: #38bdf8;
  padding: 20px;
}

.main {
  grid-area: main;
  background: #10b981;
  padding: 20px;
}

.sidebar {
  grid-area: sidebar;
  background: #f59e0b;
  padding: 20px;
}

.footer {
  grid-area: footer;
  background: #8b5cf6;
  padding: 20px;
}`,
              explanation:
                "The grid-template-areas creates a visual map of the layout. Each item is placed using grid-area matching the names."
            },
            practice:
              "Modify the template areas to move the sidebar to the left of the main content."
          },
        },
        {
          id: "css-grid-spanning",
          title: "Spanning Columns and Rows",
          content: {
            explanation: [
              "Sometimes an item needs to take up more than one column or row. Grid makes this easy with spanning keywords.",
              "You can use grid-column: span 2 to make an element stretch across two columns. Similarly, grid-row: span 2 stretches across two rows.",
              "Spanning helps create featured items in galleries, dashboards with large widgets, or asymmetric layouts that feel dynamic.",
              "Combining spanning with auto-placement creates interesting grid designs without complex positioning."
            ],
            example: {
              title: "Featured Card Spanning",
              html: `<div class="gallery">
  <div class="featured">Featured Item</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
  <div>Item 5</div>
</div>`,
              css: `.gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
}

.gallery > div {
  background: #ec4899;
  color: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
}

.featured {
  grid-column: span 2;
  background: #8b5cf6;
}`,
              explanation:
                "The featured item spans across two columns while the other items occupy single cells in the grid."
            },
            practice:
              "Make the featured item span both columns and rows by adding grid-row: span 2."
          },
        },
      ],
    },
    {
      id: "css-positioning-zindex",
      title: "Positioning and Z-Index",
      description:
        "Control element positioning, stacking order, and create overlays, modals, and sticky headers.",
      duration: "90 min",
      subtopics: [
        {
          id: "css-position-types",
          title: "Position Types",
          content: {
            explanation: [
              "The position property changes how an element is placed in the document flow. Static is the default where elements follow normal layout order.",
              "Relative positions an element relative to its normal position. You can move it without affecting other elements' layout.",
              "Absolute removes the element from the normal flow and positions it relative to its nearest positioned ancestor. It's used for tooltips, badges, and overlays.",
              "Fixed positions relative to the viewport and stays in place during scrolling. Sticky toggles between relative and fixed based on scroll position."
            ],
            example: {
              title: "Positioning Examples",
              html: `<div class="container">
  <div class="relative-box">Relative (moved)</div>
  <div class="absolute-badge">Absolute Badge</div>
</div>
<div class="fixed-button">Fixed Button</div>`,
              css: `.container {
  position: relative;
  background: #f1f5f9;
  min-height: 200px;
  margin: 20px;
  padding: 20px;
}

.relative-box {
  position: relative;
  top: 20px;
  left: 20px;
  background: #ec4899;
  padding: 16px;
  color: white;
}

.absolute-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #10b981;
  padding: 8px 12px;
  color: white;
  border-radius: 0 0 0 8px;
}

.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #3b82f6;
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
}`,
              explanation:
                "The relative box shifts from its original spot. The absolute badge attaches to the container corner. The fixed button stays in the viewport when scrolling."
            },
            practice:
              "Add a sticky header to the page that stays at the top when scrolling past it."
          },
        },
        {
          id: "css-zindex",
          title: "Z-Index and Stacking Context",
          content: {
            explanation: [
              "When elements overlap, z-index controls which one appears on top. Higher z-index numbers appear above lower ones.",
              "Z-index only works on positioned elements (relative, absolute, fixed, or sticky). Without position set, z-index has no effect.",
              "Each stacking context is isolated. A child's z-index only compares against other children of the same parent, not against elements in other contexts.",
              "Understanding z-index prevents frustrating bugs where one element stubbornly stays behind another even with a high number."
            ],
            example: {
              title: "Stacking Order",
              html: `<div class="stack">
  <div class="box1">Box 1 (z-index: 1)</div>
  <div class="box2">Box 2 (z-index: 3)</div>
  <div class="box3">Box 3 (z-index: 2)</div>
</div>`,
              css: `.stack {
  position: relative;
  min-height: 250px;
  margin: 40px;
}

.box1, .box2, .box3 {
  position: absolute;
  width: 150px;
  padding: 20px;
  color: white;
  border-radius: 8px;
}

.box1 {
  background: #ec4899;
  top: 20px;
  left: 20px;
  z-index: 1;
}

.box2 {
  background: #3b82f6;
  top: 60px;
  left: 60px;
  z-index: 3;
}

.box3 {
  background: #10b981;
  top: 100px;
  left: 100px;
  z-index: 2;
}`,
              explanation:
                "Box 2 has the highest z-index and appears on top, even though it was not added last in the HTML."
            },
            practice:
              "Change the z-index values to make Box 3 appear on top of Box 2."
          },
        },
      ],
    },
    {
      id: "css-responsive-design",
      title: "Responsive Design",
      description:
        "Make pages look good on mobile, tablet, and desktop screens.",
      duration: "100 min",
      subtopics: [
        {
          id: "css-media-queries",
          title: "Media Queries",
          content: {
            explanation: [
              "Responsive design means your website adjusts to different screen sizes. A page should not only look good on a laptop. It should also work well on phones and tablets.",
              "Media queries allow CSS to apply different styles depending on the screen width. This lets you change layouts, font sizes, spacing, and visibility based on the device.",
              "A common approach is mobile-first design. You write simple mobile styles first, then add larger screen styles using media queries.",
              "This is how modern websites avoid breaking on smaller screens."
            ],
            example: {
              title: "Mobile First Layout",
              html: `<div class="layout">
  <div class="card">Profile</div>
  <div class="card">Stats</div>
  <div class="card">Projects</div>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #020617;
  padding: 20px;
}

.layout {
  display: grid;
  gap: 16px;
}

.card {
  background: #1e293b;
  color: white;
  padding: 24px;
  border-radius: 16px;
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: repeat(3, 1fr);
  }
}`,
              explanation:
                "On small screens, the cards stack vertically. On screens wider than 768px, they become three columns."
            },
            practice:
              "Change the breakpoint from 768px to 1024px and observe when the layout changes."
          },
        },
        {
          id: "css-responsive-units",
          title: "Responsive Units",
          content: {
            explanation: [
              "Pixels are fixed units that do not scale. For responsive design, relative units like percentages, em, rem, and viewport units are more flexible.",
              "Percentages are relative to the parent element's size. A child with width: 50% takes half of its parent's width.",
              "Rem is relative to the root font size (usually 16px by default). Using rem for spacing and typography makes scaling consistent across breakpoints.",
              "Viewport units (vw, vh) are relative to the screen size. 1vw is 1% of the viewport width, great for full-width sections and hero text."
            ],
            example: {
              title: "Relative Units in Action",
              html: `<div class="hero">
  <h1>Responsive Design</h1>
  <p>Using rem, vw, and percentages makes layouts fluid.</p>
</div>
<div class="container">
  <div class="box">50% width</div>
</div>`,
              css: `.hero {
  background: #ec4899;
  color: white;
  padding: 8vh 1rem;
  text-align: center;
}

.hero h1 {
  font-size: clamp(1.8rem, 5vw, 3.5rem);
}

.container {
  padding: 1rem;
}

.box {
  width: 50%;
  background: #38bdf8;
  padding: 1rem;
  color: white;
  border-radius: 8px;
}`,
              explanation:
                "The heading uses clamp for responsive font sizing. Padding uses vh for viewport-based spacing. The box takes 50% of its container width."
            },
            practice:
              "Change the box width to 100% on mobile using a media query and back to 50% on desktop."
          },
        },
        {
          id: "css-responsive-images",
          title: "Responsive Images",
          content: {
            explanation: [
              "Images can easily break a layout if they are too wide for their container. A large image may overflow on mobile unless you control its size.",
              "A common rule is max-width: 100%. This makes the image shrink when the container is smaller, while still keeping its natural size when there is enough space.",
              "height: auto keeps the image proportion correct. Without it, the image might stretch or look squeezed.",
              "Responsive images are important for blogs, portfolios, landing pages, product cards, and almost every visual website."
            ],
            example: {
              title: "Making Images Responsive",
              html: `<div class="card">
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80" alt="Laptop with code">
  <h2>Responsive Image</h2>
  <p>This image fits inside its card.</p>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #f8fafc;
  padding: 24px;
}

.card {
  max-width: 420px;
  margin: auto;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.14);
}

img {
  width: 100%;
  height: auto;
  display: block;
}

.card h2,
.card p {
  padding: 0 20px;
}`,
              explanation:
                "The image uses width: 100% so it fills the card, while height: auto keeps the image proportion natural."
            },
            practice:
              "Change the card max-width and observe how the image adapts."
          },
        },
      ],
    },
    {
      id: "css-variables",
      title: "CSS Variables",
      description:
        "Create reusable values, build consistent design systems, and write maintainable CSS with custom properties.",
      duration: "70 min",
      subtopics: [
        {
          id: "css-variables-basics",
          title: "Declaring and Using Variables",
          content: {
            explanation: [
              "CSS variables, also known as custom properties, let you store values in one place and reuse them throughout your stylesheet.",
              "Declare a variable with two dashes followed by a name, like --primary-color. Then use it with the var() function: color: var(--primary-color).",
              "Variables respect the cascade. You can define them on the :root selector to make them available globally, or on specific components for local scope.",
              "Using variables makes updating colors, spacing, or font sizes much easier. Change one value, and it updates everywhere the variable is used."
            ],
            example: {
              title: "CSS Variables in Action",
              html: `<div class="card">
  <h2>CSS Variables</h2>
  <button class="btn">Click Me</button>
</div>`,
              css: `:root {
  --primary: #ec4899;
  --primary-dark: #be185d;
  --spacing: 1.5rem;
  --radius: 12px;
}

.card {
  background: white;
  padding: var(--spacing);
  border-radius: var(--radius);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  max-width: 300px;
  margin: 2rem auto;
}

.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius);
  cursor: pointer;
}

.btn:hover {
  background: var(--primary-dark);
}`,
              explanation:
                "All colors, spacing, and radius values are stored as variables. Changing :root values updates the entire component."
            },
            practice:
              "Add a new variable for font-family and apply it to the card and button."
          },
        },
        {
          id: "css-variables-scope",
          title: "Variable Scope and Fallbacks",
          content: {
            explanation: [
              "CSS variables inherit just like other CSS properties. A variable defined on a parent is available to its children unless overridden.",
              "You can override a variable inside a specific selector to create variations of a component without rewriting all styles.",
              "The var() function accepts a fallback value: var(--undefined-variable, blue). This prevents broken styles if a variable is missing.",
              "Using variables with media queries allows responsive theming. You can change --spacing from 1rem to 2rem at different breakpoints."
            ],
            example: {
              title: "Variable Scope and Overrides",
              html: `<div class="default-theme">
  <div class="card">Default Theme Card</div>
</div>
<div class="dark-theme">
  <div class="card">Dark Theme Card</div>
</div>`,
              css: `.default-theme {
  --bg: white;
  --text: #111827;
  --border: #e2e8f0;
}

.dark-theme {
  --bg: #1e293b;
  --text: #f8fafc;
  --border: #475569;
}

.card {
  background: var(--bg, white);
  color: var(--text, black);
  border: 1px solid var(--border);
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem;
}`,
              explanation:
                "The same .card class uses different variable values depending on which parent defines them. The fallback values protect against missing variables."
            },
            practice:
              "Create a new theme with a different background color and text color using variable overrides."
          },
        },
      ],
    },
    {
      id: "css-transitions-animations",
      title: "Transitions and Animations",
      description:
        "Add smooth interactions using hover states, transitions, transforms, and keyframe animations.",
      duration: "90 min",
      subtopics: [
        {
          id: "css-transitions",
          title: "Transitions",
          content: {
            explanation: [
              "Hover states make interfaces feel interactive. When a user moves their cursor over a button or card, the design can respond visually.",
              "Transitions control how smoothly a value changes. Without a transition, the change happens instantly. With a transition, the change feels softer and more professional.",
              "Common properties to animate include background, color, transform, opacity, and box-shadow. Not every property animates smoothly, so it is better to focus on properties designed for movement and visual feedback.",
              "Small interaction details can make an app feel alive without making it distracting."
            ],
            example: {
              title: "Interactive Button",
              html: `<button class="btn">Hover Me</button>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #020617;
  min-height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn {
  background: #ec4899;
  color: white;
  border: none;
  padding: 14px 22px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.25s ease, background 0.25s ease;
}

.btn:hover {
  background: #be185d;
  transform: translateY(-3px);
}`,
              explanation:
                "The hover state changes the button background and moves it slightly upward. The transition makes the change smooth."
            },
            practice:
              "Add a box-shadow on hover and make the button scale slightly using transform: scale(1.05)."
          },
        },
        {
          id: "css-keyframes",
          title: "Keyframe Animations",
          content: {
            explanation: [
              "Keyframes allow you to create animations that move through multiple stages. Unlike transitions, keyframes do not need a hover or click to begin.",
              "You define an animation using @keyframes, then apply it to an element using the animation property.",
              "Animations can be used for loaders, subtle hero effects, attention indicators, and small UI details. The goal is not to animate everything, but to guide attention carefully.",
              "Good animations should feel smooth, intentional, and useful."
            ],
            example: {
              title: "Simple Floating Card",
              html: `<div class="card">
  <h2>Floating Card</h2>
  <p>This card moves gently using keyframes.</p>
</div>`,
              css: `body {
  font-family: Arial, sans-serif;
  background: #0f172a;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  background: white;
  color: #111827;
  padding: 24px;
  border-radius: 18px;
  animation: float 2.5s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }

  100% {
    transform: translateY(0);
  }
}`,
              explanation:
                "The @keyframes rule defines the movement. The animation property applies the float animation to the card repeatedly."
            },
            practice:
              "Change the animation duration from 2.5s to 1s and observe how the movement feels."
          },
        },
      ],
    },
    {
      id: "css-ui-components",
      title: "Forms, Buttons, Cards, Navbars",
      description:
        "Build common UI components with practical CSS patterns used in real applications.",
      duration: "110 min",
      subtopics: [
        {
          id: "css-forms",
          title: "Styling Forms",
          content: {
            explanation: [
              "Forms are essential for user input, sign-ups, contact pages, and searches. Styled forms improve usability and brand consistency.",
              "Modern form styling includes consistent input padding, borders, focus states, and clear labels. The :focus pseudo-class highlights the active input for accessibility.",
              "Group related fields, provide helpful error or success states, and ensure sufficient contrast for placeholder text.",
              "A well-styled form feels more trustworthy and encourages users to complete it."
            ],
            example: {
              title: "Styled Contact Form",
              html: `<form class="form">
  <h2>Contact Us</h2>
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" placeholder="Your name">
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" placeholder="you@example.com">
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" rows="4" placeholder="How can we help?"></textarea>
  </div>
  <button type="submit">Send Message</button>
</form>`,
              css: `.form {
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.form h2 {
  margin-top: 0;
  color: #111827;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236,72,153,0.1);
}

button {
  background: #ec4899;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background: #be185d;
}`,
              explanation:
                "The form has clean spacing, focus states for accessibility, and consistent styling across inputs and buttons."
            },
            practice:
              "Add an error state class to show a red border when an input is invalid."
          },
        },
        {
          id: "css-buttons",
          title: "Button Variations",
          content: {
            explanation: [
              "Buttons are primary interactive elements. Different button styles communicate different levels of importance.",
              "Primary buttons use the brand color for main actions. Secondary buttons are outlined or subtle. Danger buttons use red for destructive actions.",
              "Button states include default, hover, active, and disabled. Each state provides visual feedback to the user.",
              "Consistent button sizing, padding, and border radius creates a cohesive design system across your UI."
            ],
            example: {
              title: "Button Style System",
              html: `<div class="button-group">
  <button class="btn-primary">Primary</button>
  <button class="btn-secondary">Secondary</button>
  <button class="btn-outline">Outline</button>
  <button class="btn-danger">Delete</button>
  <button class="btn-primary" disabled>Disabled</button>
</div>`,
              css: `.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 2rem;
  background: #f8fafc;
}

.btn-primary {
  background: #ec4899;
  color: white;
}

.btn-primary:hover {
  background: #be185d;
}

.btn-secondary {
  background: #475569;
  color: white;
}

.btn-secondary:hover {
  background: #334155;
}

.btn-outline {
  background: transparent;
  color: #ec4899;
  border: 2px solid #ec4899;
}

.btn-outline:hover {
  background: #ec4899;
  color: white;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

button {
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
              explanation:
                "Different button variants communicate different action levels. Hover states and disabled states provide clear feedback."
            },
            practice:
              "Add an icon to the primary button using HTML and CSS positioning."
          },
        },
        {
          id: "css-cards",
          title: "Card Components",
          content: {
            explanation: [
              "Cards are containers for related content like products, articles, or user profiles. They organize information into digestible chunks.",
              "A good card has clear boundaries, appropriate spacing, a visual hierarchy, and often an image or icon to anchor the content.",
              "Cards can be interactive with hover effects, linking to more details. They should work in groups (grids) and individually.",
              "Consistent card styling across your site creates a professional, polished feel."
            ],
            example: {
              title: "Product Card Collection",
              html: `<div class="card-grid">
  <div class="product-card">
    <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80" alt="Camera">
    <h3>Premium Camera</h3>
    <p>Professional grade with 4K video</p>
    <div class="price">$499</div>
    <button>Add to Cart</button>
  </div>
  <div class="product-card">
    <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80" alt="Watch">
    <h3>Smart Watch</h3>
    <p>Track fitness and stay connected</p>
    <div class="price">$299</div>
    <button>Add to Cart</button>
  </div>
</div>`,
              css: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: #f1f5f9;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  padding: 0 0 1.5rem 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -12px rgba(0,0,0,0.15);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  margin: 1rem 1rem 0.5rem;
  color: #111827;
}

.product-card p {
  margin: 0 1rem 1rem;
  color: #64748b;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ec4899;
  margin: 0 1rem 1rem;
}

.product-card button {
  margin: 0 1rem;
  width: calc(100% - 2rem);
  background: #111827;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
}

.product-card button:hover {
  background: #ec4899;
}`,
              explanation:
                "The card grid uses auto-fit for responsive columns. Cards have hover lift effects, consistent spacing, and interactive buttons."
            },
            practice:
              "Add a badge like 'NEW' or 'SALE' positioned absolutely on the card corner."
          },
        },
        {
          id: "css-navbars",
          title: "Navigation Bars",
          content: {
            explanation: [
              "Navigation bars are the primary way users move through your site. They need to be functional, responsive, and accessible.",
              "Desktop navbars typically use Flexbox to align logo, navigation links, and actions like login or search.",
              "Mobile navbars often collapse into a hamburger menu. Media queries let you switch between layouts at different breakpoints.",
              "Good navigation is predictable, highlights the current page, and works on all devices."
            ],
            example: {
              title: "Responsive Navbar",
              html: `<nav class="navbar">
  <div class="logo">CodeMaster</div>
  <ul class="nav-links">
    <li><a href="#">Home</a></li>
    <li><a href="#">Courses</a></li>
    <li><a href="#">Pricing</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <button class="mobile-menu">☰</button>
</nav>
<div class="hero-banner">
  <h1>Master CSS</h1>
  <p>Build beautiful, responsive websites</p>
</div>`,
              css: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #111827;
  color: white;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ec4899;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.nav-links a:hover {
  color: #ec4899;
}

.mobile-menu {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
}

.hero-banner {
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu {
    display: block;
  }
}`,
              explanation:
                "Desktop navbar uses Flexbox to align items. On mobile, the navigation links hide and a menu button appears (hamburger menu pattern)."
            },
            practice:
              "Use a media query to make the navbar stack vertically on very small screens with flex-direction: column."
          },
        },
      ],
    },
    {
      id: "css-design-system-basics",
      title: "Design System Basics",
      description:
        "Create consistent, maintainable CSS with design tokens, component patterns, and utility classes.",
      duration: "90 min",
      subtopics: [
        {
          id: "css-design-tokens",
          title: "Design Tokens",
          content: {
            explanation: [
              "Design tokens are named variables that store design decisions like colors, spacing, font sizes, and border radii.",
              "Using tokens ensures consistency across your entire application. Instead of hardcoding #ec4899 everywhere, you use a token like --color-primary.",
              "Tokens make theme switching easier. Change token values, and every component using that token updates automatically.",
              "A good token system includes scales: spacing scale (0, 4px, 8px, 12px, etc.), color scale (primary, secondary, gray, etc.), and typography scale (text-xs, text-sm, text-base, etc.)."
            ],
            example: {
              title: "Design Token System",
              html: `<div class="card">
  <span class="badge">Design Tokens</span>
  <h2>Consistent Design</h2>
  <p>This component uses tokens for colors, spacing, and typography.</p>
  <div class="button-group">
    <button class="btn-primary">Save</button>
    <button class="btn-secondary">Cancel</button>
  </div>
</div>`,
              css: `:root {
  --color-primary: #ec4899;
  --color-primary-dark: #be185d;
  --color-secondary: #64748b;
  --color-bg: #ffffff;
  --color-text: #111827;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
}

.card {
  background: var(--color-bg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  max-width: 400px;
  margin: 2rem auto;
}

.badge {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: bold;
  letter-spacing: 1px;
}

.card h2 {
  margin: var(--spacing-sm) 0;
  font-size: var(--font-size-xl);
  color: var(--color-text);
}

.card p {
  color: var(--color-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.5;
}

.button-group {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: transparent;
  color: var(--color-secondary);
  border: 1px solid var(--color-secondary);
}

button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-sm);
  border: none;
  font-size: var(--font-size-base);
  cursor: pointer;
}`,
              explanation:
                "All design decisions use tokens. Changing any :root value updates every component that uses that token."
            },
            practice:
              "Add new tokens for font-family and transition duration, then use them in the component styles."
          },
        },
        {
          id: "css-component-patterns",
          title: "Component Patterns",
          content: {
            explanation: [
              "Component patterns help you build reusable UI pieces with consistent structure and behavior.",
              "A button component can have variants (primary, secondary, outline, danger) using modifier classes like .btn-primary or .btn-outline.",
              "A card component might have .card, .card-header, .card-body, and .card-footer for flexible composition.",
              "Using BEM (Block Element Modifier) naming helps keep component styles organized and prevents conflicts."
            ],
            example: {
              title: "Reusable Alert Component",
              html: `<div class="alert alert-success">
  <strong>Success!</strong> Your changes have been saved.
</div>
<div class="alert alert-warning">
  <strong>Warning!</strong> Your session will expire soon.
</div>
<div class="alert alert-error">
  <strong>Error!</strong> Something went wrong.
</div>`,
              css: `.alert {
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin: 1rem 0;
  font-family: Arial, sans-serif;
  border-left: 4px solid;
}

.alert-success {
  background: #ecfdf5;
  border-left-color: #10b981;
  color: #065f46;
}

.alert-warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
  color: #92400e;
}

.alert-error {
  background: #fef2f2;
  border-left-color: #ef4444;
  color: #991b1b;
}

.alert strong {
  display: inline-block;
  margin-right: 0.5rem;
}`,
              explanation:
                "The alert base class handles layout and spacing. Variant classes change colors for different message types."
            },
            practice:
              "Create an info alert variant with blue colors using the same pattern."
          },
        },
      ],
    },
    {
      id: "css-final-project",
      title: "Final Mini Project: Responsive Landing Page",
      description:
        "Build a complete, modern landing page that applies everything learned in the CSS track.",
      duration: "120 min",
      subtopics: [
        {
          id: "css-project-landing",
          title: "Responsive Product Landing Page",
          content: {
            explanation: [
              "This final project combines all the concepts: Flexbox, Grid, responsive design, CSS variables, typography, spacing, animations, and component design.",
              "You will build a complete landing page with a navigation bar, hero section, features grid, pricing cards, and footer.",
              "The page must be fully responsive, working on mobile, tablet, and desktop. Use media queries to adjust layout at different breakpoints.",
              "Apply a consistent design system with CSS variables for colors, spacing, and typography. Add subtle animations for hover states and smooth scrolling."
            ],
            example: {
              title: "Complete Landing Page",
              html: `<nav class="navbar">
  <div class="logo">Product<span>Hub</span></div>
  <ul class="nav-links">
    <li><a href="#">Features</a></li>
    <li><a href="#">Pricing</a></li>
    <li><a href="#">About</a></li>
  </ul>
  <button class="cta-btn">Get Started</button>
  <button class="mobile-toggle">☰</button>
</nav>

<section class="hero">
  <h1>Build Better <span class="gradient-text">Websites</span></h1>
  <p>The platform that helps you create stunning, responsive designs with modern CSS.</p>
  <div class="hero-buttons">
    <button class="btn-primary">Start Free Trial</button>
    <button class="btn-outline">View Demo</button>
  </div>
</section>

<section class="features">
  <h2>Everything you need</h2>
  <div class="features-grid">
    <div class="feature-card">
      <div class="icon">🎨</div>
      <h3>Modern Design</h3>
      <p>Beautiful components and layouts built with Flexbox and Grid.</p>
    </div>
    <div class="feature-card">
      <div class="icon">📱</div>
      <h3>Responsive</h3>
      <p>Looks perfect on desktop, tablet, and mobile devices.</p>
    </div>
    <div class="feature-card">
      <div class="icon">⚡</div>
      <h3>Performance</h3>
      <p>Optimized CSS for fast loading and smooth animations.</p>
    </div>
  </div>
</section>

<section class="pricing">
  <h2>Simple pricing</h2>
  <div class="pricing-grid">
    <div class="pricing-card">
      <h3>Basic</h3>
      <div class="price">$29<span>/mo</span></div>
      <ul>
        <li>Up to 5 projects</li>
        <li>Basic components</li>
        <li>Email support</li>
      </ul>
      <button>Choose Plan</button>
    </div>
    <div class="pricing-card featured">
      <div class="popular-badge">Most Popular</div>
      <h3>Pro</h3>
      <div class="price">$79<span>/mo</span></div>
      <ul>
        <li>Unlimited projects</li>
        <li>All components</li>
        <li>Priority support</li>
      </ul>
      <button>Choose Plan</button>
    </div>
    <div class="pricing-card">
      <h3>Enterprise</h3>
      <div class="price">$199<span>/mo</span></div>
      <ul>
        <li>Custom solutions</li>
        <li>Dedicated support</li>
        <li>SLA guarantee</li>
      </ul>
      <button>Contact Us</button>
    </div>
  </div>
</section>

<footer class="footer">
  <p>© 2025 ProductHub. All rights reserved.</p>
</footer>`,
              css: `:root {
  --primary: #ec4899;
  --primary-dark: #be185d;
  --secondary: #8b5cf6;
  --dark: #0f172a;
  --gray: #64748b;
  --light-gray: #f1f5f9;
  --white: #ffffff;
  --spacing-sm: 0.75rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 3rem;
  --radius-md: 12px;
  --radius-lg: 20px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--dark);
  line-height: 1.5;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 5%;
  background: var(--white);
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.logo span {
  color: var(--primary);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--dark);
  font-weight: 500;
}

.nav-links a:hover {
  color: var(--primary);
}

.cta-btn {
  background: var(--primary);
  color: var(--white);
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  cursor: pointer;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
}

.hero {
  text-align: center;
  padding: 5rem 1rem;
  background: linear-gradient(135deg, var(--light-gray) 0%, var(--white) 100%);
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero p {
  font-size: 1.2rem;
  color: var(--gray);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--primary);
  color: var(--white);
  border: none;
  padding: 0.8rem 1.8rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 0.8rem 1.8rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: var(--primary);
  color: var(--white);
}

.features {
  padding: 4rem 5%;
  background: var(--white);
}

.features h2 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  text-align: center;
  padding: 2rem;
  background: var(--light-gray);
  border-radius: var(--radius-lg);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--gray);
}

.pricing {
  padding: 4rem 5%;
  background: var(--light-gray);
}

.pricing h2 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 3rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.pricing-card {
  background: var(--white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  text-align: center;
  position: relative;
  transition: transform 0.3s;
}

.pricing-card.featured {
  border: 2px solid var(--primary);
  transform: scale(1.02);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: var(--white);
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.pricing-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 2.5rem;
  font-weight: bold;
  margin: 1rem 0;
}

.price span {
  font-size: 1rem;
  font-weight: normal;
  color: var(--gray);
}

.pricing-card ul {
  list-style: none;
  margin: 1.5rem 0;
}

.pricing-card li {
  padding: 0.5rem 0;
  color: var(--gray);
}

.pricing-card button {
  width: 100%;
  background: var(--primary);
  color: var(--white);
  border: none;
  padding: 0.8rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
}

.pricing-card button:hover {
  background: var(--primary-dark);
}

.footer {
  background: var(--dark);
  color: var(--gray);
  text-align: center;
  padding: 2rem;
}

@media (max-width: 768px) {
  .nav-links, .cta-btn {
    display: none;
  }
  
  .mobile-toggle {
    display: block;
  }
  
  .hero h1 {
    font-size: 2rem;
  }
  
  .pricing-card.featured {
    transform: none;
  }
}`,
              explanation:
                "This landing page uses CSS variables for theming, Grid and Flexbox for layout, media queries for responsiveness, and animations for interactive elements."
            },
            practice:
              "Add a testimonial section between features and pricing with a grid of three customer quotes using cards."
          },
        },
      ],
    },
  ],
};