# CyberSecure Prep

A lightweight, single-page web application to help university students prepare for cybersecurity exams. The app delivers structured lectures followed by quizzes, tracks progress, and adds gamification elements to boost engagement.

## Features

• Three sample lectures (Introduction to Cybersecurity, Network Security Basics, Fundamentals of Cryptography). Feel free to extend `lectures` in `app.js`.

• After each lecture, take an auto-graded quiz.

• Progress is saved in your browser's `localStorage` so you can leave and come back anytime.

• Dashboard to review scores and revisit incorrectly answered questions.

• Achievement badges for extra motivation.

• Clean, modern UI with no external build tools—just open the HTML file.

## Getting Started

1. Clone or download this repository.
2. Open `index.html` in your preferred browser. **That's it!**

> Tip: If you plan to serve the files via a local server (recommended for Chrome), run:
>
> ```bash
> python3 -m http.server 8000
> ```
> Then navigate to http://localhost:8000.

## Project Structure

```
├── index.html      # Entry point
├── style.css       # Styles
├── app.js          # Application logic & data
└── README.md       # This file
```

## Customising Content

Open `app.js` and edit the `lectures` array:

```js
{
  id: 4,
  title: 'Web Application Security',
  content: `Your markdown-style lecture text…`,
  quiz: [
    { q: 'Question?', options: ['A', 'B', 'C', 'D'], answer: 1 },
    // more questions
  ],
}
```

Change CSS variables in `style.css` to match your branding.

## License

MIT © 2024 Your Name