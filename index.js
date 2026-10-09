// Problem cards
const advice = {
  study: {
    title: "📚 Make study pressure manageable",
    intro: "You don't have to finish everything at once.",
    steps: [
      "Write down your tasks and deadlines.",
      "Choose the most important task first.",
      "Study for 25 minutes, then take a short break."
    ]
  },
  career: {
    title: "💼 Turn career worries into a plan",
    intro: "You don't need your whole future figured out today.",
    steps: [
      "Choose one career role to explore.",
      "Pick one relevant skill to learn.",
      "Set a small weekly goal."
    ]
  },
  peer: {
    title: "👥 Focus on your own progress",
    intro: "Someone else's timeline is not a measurement of your worth.",
    steps: [
      "Notice when comparison affects your mood.",
      "Set goals based on your current ability.",
      "Record one improvement every week."
    ]
  },
  exhaustion: {
    title: "🌧️ Give yourself room to recover",
    intro: "Rest is a need, not a reward you must earn.",
    steps: [
      "Pause and take a few comfortable breaths.",
      "Choose one small task or take time to rest.",
      "Talk to someone you trust if the feeling continues."
    ]
  }
};

const solutionBox = document.querySelector("#solution");

document.querySelectorAll("[data-problem]").forEach((card) => {
  card.addEventListener("click", () => {
    const selected = advice[card.dataset.problem];

    document.querySelectorAll("[data-problem]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === card));
    });

    solutionBox.replaceChildren();

    const heading = document.createElement("h3");
    heading.textContent = selected.title;

    const intro = document.createElement("p");
    intro.textContent = selected.intro;

    const list = document.createElement("ul");

    selected.steps.forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step;
      list.appendChild(li);
    });

    solutionBox.append(heading, intro, list);
  });
});

// Mood check-in
const moodAdvice = {
  stressed: "Write down one thing you can control today.",
  tired: "Take a short break, drink water and give yourself time to rest.",
  low: "Take one tiny step and consider talking to someone you trust.",
  anxious: "Pause, notice five things around you, and decide your next small step.",
  okay: "It's okay to feel okay. What is one thing you want to do today?"
};

document.querySelectorAll("[data-mood]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-mood]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });

    document.querySelector("#moodMessage").textContent =
      moodAdvice[button.dataset.mood];
  });
});

// Anonymous Student Wall
const samplePosts = [
  {
    id: "sample1",
    category: "Career Tension",
    story: "Everyone seems ahead of me. I'm worried about placements.",
    likes: 3,
    sample: true
  },
  {
    id: "sample2",
    category: "Peer Pressure",
    story: "I keep comparing my marks with my friends.",
    likes: 5,
    sample: true
  },
  {
    id: "sample3",
    category: "Study Pressure",
    story: "There is so much to study that I don't know where to start.",
    likes: 2,
    sample: true
  }
];

const messages = [
  "💚 You don't have to figure everything out today.",
  "💚 Your journey is your own. Small progress still counts.",
  "💚 Take a breath and ask for support when you need it."
];

const form = document.querySelector("#postForm");
const storyInput = document.querySelector("#story");
const categoryInput = document.querySelector("#category");
const postsBox = document.querySelector("#posts");
const postMessage = document.querySelector("#postMessage");
const filter = document.querySelector("#filter");
const count = document.querySelector("#count");
const storageKey = "studentSpacePosts";

function getPosts() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderPosts() {
  postsBox.replaceChildren();

  const allPosts = [...getPosts(), ...samplePosts].filter((post) => {
    return filter.value === "All" || post.category === filter.value;
  });

  if (allPosts.length === 0) {
    postsBox.appendChild(
      makeElement("div", "empty-posts", "No posts here yet. Start the conversation.")
    );
    return;
  }

  allPosts.forEach((post) => {
    const card = makeElement("article", "post");
    const header = makeElement("div", "post-header");

    header.append(
      makeElement("strong", "", "Anonymous student"),
      makeElement("span", "", post.category)
    );

    const story = makeElement("p", "post-story", post.story);

    const encouragement = makeElement(
      "div",
      "encouragement",
      messages[(post.id.length + post.story.length) % messages.length]
    );

    const support = makeElement(
      "button",
      "support-btn",
      `💚 ${post.likes || 0} support`
    );

    support.type = "button";

    support.addEventListener("click", () => {
      post.likes = (post.likes || 0) + 1;

      if (!post.sample) {
        const updated = getPosts().map((item) =>
          item.id === post.id ? { ...item, likes: post.likes } : item
        );

        try {
          localStorage.setItem(storageKey, JSON.stringify(updated));
        } catch {}
      }

      support.textContent = `💚 ${post.likes} support`;
    });

    card.append(header, story, encouragement, support);
    postsBox.appendChild(card);
  });
}

storyInput.addEventListener("input", () => {
  count.textContent = `${storyInput.value.length} / 500 characters`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const story = storyInput.value.trim();

  if (story.length < 10 || story.length > 500) {
    postMessage.textContent = "Write between 10 and 500 characters.";
    return;
  }

  const post = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    category: categoryInput.value,
    story,
    likes: 0,
    sample: false
  };

  try {
    const posts = getPosts();
    posts.unshift(post);
    localStorage.setItem(storageKey, JSON.stringify(posts));
  } catch {
    postMessage.textContent = "Could not save your post in this browser.";
    return;
  }

  form.reset();
  count.textContent = "0 / 500 characters";
  filter.value = "All";
  postMessage.textContent = "Post added to this browser's wall.";
  renderPosts();
});

filter.addEventListener("change", renderPosts);

document.querySelector("#clearPosts").addEventListener("click", () => {
  if (getPosts().length === 0) {
    postMessage.textContent = "You haven't added any posts yet.";
    return;
  }

  if (confirm("Delete all your posts saved in this browser?")) {
    localStorage.removeItem(storageKey);
    postMessage.textContent = "Your saved posts have been deleted.";
    renderPosts();
  }
});

renderPosts();

// Focus timer
let secondsLeft = 25 * 60;
let timerInterval = null;

const timerDisplay = document.querySelector("#timer");
const timerMessage = document.querySelector("#timerMessage");

function updateTimer() {
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

document.querySelector("#start").addEventListener("click", () => {
  if (timerInterval !== null) return;

  if (secondsLeft === 0) secondsLeft = 25 * 60;

  timerMessage.textContent = "Focus on one thing at a time.";

  timerInterval = setInterval(() => {
    secondsLeft--;
    updateTimer();

    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerMessage.textContent = "Session complete! Take a short break.";
    }
  }, 1000);
});

document.querySelector("#pause").addEventListener("click", () => {
  if (timerInterval !== null) clearInterval(timerInterval);
  timerInterval = null;
  timerMessage.textContent = "Timer paused.";
});

document.querySelector("#reset").addEventListener("click", () => {
  if (timerInterval !== null) clearInterval(timerInterval);
  timerInterval = null;
  secondsLeft = 25 * 60;
  updateTimer();
  timerMessage.textContent = "Timer reset. Ready when you are.";
});

updateTimer();

// Checklist progress
const tasks = document.querySelectorAll(".task");
const progress = document.querySelector("#progress");

function updateProgress() {
  const completed = [...tasks].filter((task) => task.checked).length;
  progress.textContent = `${completed} of ${tasks.length} tasks completed.`;
}

tasks.forEach((task) => {
  task.addEventListener("change", updateProgress);
});


const feedbackForm = document.getElementById("feedback-form");

if (feedbackForm) {
  feedbackForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const rating = feedbackForm.querySelector(
      'input[name="rating"]:checked'
    );

    if (!rating) {
      return;
    }

    const feedback = {
      name: document.getElementById("visitor-name").value.trim(),
      rating: Number(rating.value),
      favourite: document.getElementById("favourite").value,
      suggestion: document.getElementById("suggestion").value.trim(),
      recommend: document.getElementById("recommend").checked,
      submittedAt: new Date().toISOString()
    };

    // Demo only: save feedback in this browser.
    try {
      const savedFeedback = JSON.parse(
        localStorage.getItem("studentSpaceFeedback") || "[]"
      );

      savedFeedback.push(feedback);

      localStorage.setItem(
        "studentSpaceFeedback",
        JSON.stringify(savedFeedback)
      );

      document.getElementById("feedback-status").textContent =
        "Thank you! Your feedback was saved in this browser. 💚";

      feedbackForm.reset();
    } catch (error) {
      document.getElementById("feedback-status").textContent =
        "We couldn't save your feedback. Please try again.";
    }
  });
}