
let confettiInterval = null;

// Toggle visibility for virtue detail sections (inside the virtues scroll)
function toggleDetails(id) {
    const details = document.getElementById(id);
    if (!details) return;

    if (details.style.display === "block") {
        details.style.display = "none";
    } else {
        details.style.display = "block";
    }
}

// Quiz function for 3 questions + celebration popup
// Quiz function for 3 questions + celebration / try again logic
function checkQuiz() {
    const questions = [
        {
            name: "q1",
            correct: "ren",
            feedbackId: "feedback-q1",
            correctText: "Correct! Ren (humaneness) is the central virtue.",
            incorrectText: "Incorrect — the correct answer is Ren."
        },
        {
            name: "q2",
            correct: "grocery",
            feedbackId: "feedback-q2",
            correctText: "Yes! Helping someone without being asked shows Ren in action.",
            incorrectText: "Not quite — helping someone carry heavy groceries is the best example of Ren here."
        },
        {
            name: "q3",
            correct: "shu",
            feedbackId: "feedback-q3",
            correctText: "Exactly — Shu is about empathy and reciprocity.",
            incorrectText: "Close, but Shu is the virtue most closely tied to empathy."
        }
    ];

    let allAnswered = true;
    let correctCount = 0;

    questions.forEach(q => {
        const options = document.querySelectorAll(`input[name="${q.name}"]`);
        let selected = null;

        options.forEach(option => {
            if (option.checked) {
                selected = option.value;
            }
        });

        const feedback = document.getElementById(q.feedbackId);

        if (!selected) {
            feedback.textContent = "Please select an answer.";
            feedback.className = "quiz-feedback";
            allAnswered = false;
        } else if (selected === q.correct) {
            feedback.textContent = q.correctText;
            feedback.className = "correct quiz-feedback";
            correctCount++;
        } else {
            feedback.textContent = q.incorrectText;
            feedback.className = "incorrect quiz-feedback";
        }
    });

    // If not all answered, no popups at all
    if (!allAnswered) {
        hideCelebration();
        hideTryAgain();
        return;
    }

    // All answered: either celebration (all correct) or try again bubble
    if (correctCount === questions.length) {
        showCelebration();
        hideTryAgain();
    } else {
        hideCelebration();
        showTryAgain();
    }
}

function showCelebration() {
    const overlay = document.getElementById("quiz-celebration");
    if (!overlay) return;

    overlay.style.display = "flex";

    // Stop previous confetti loop if somehow active
    if (confettiInterval) clearInterval(confettiInterval);

    // Create an initial burst immediately
    createConfetti(60);

    // Then create new bursts every 500ms (change timing if you want)
    confettiInterval = setInterval(() => {
        createConfetti(40);  // smaller bursts repeatedly
    }, 500);
}



// Hide celebration overlay and remove confetti
function hideCelebration() {
    const overlay = document.getElementById("quiz-celebration");
    if (!overlay) return;

    overlay.style.display = "none";

    // Remove all confetti pieces
    const confetti = overlay.querySelectorAll(".confetti");
    confetti.forEach(piece => piece.remove());

    // Stop continuous confetti
    if (confettiInterval) {
        clearInterval(confettiInterval);
        confettiInterval = null;
    }
}


// Show "Try Again" bubble
function showTryAgain() {
    const overlay = document.getElementById("quiz-try-again");
    if (!overlay) return;
    overlay.style.display = "flex";
}

// Hide "Try Again" bubble
function hideTryAgain() {
    const overlay = document.getElementById("quiz-try-again");
    if (!overlay) return;
    overlay.style.display = "none";
}

function createConfetti(count) {
    const overlay = document.getElementById("quiz-celebration");
    if (!overlay) return;

    const colors = ["#f4b400", "#0f9d58", "#db4437", "#4285f4", "#ff6f61"];

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti");

        const startX = Math.random() * 100;
        piece.style.setProperty("--x", `${startX}vw`);

        const dx = (Math.random() - 0.5) * 60;
        const dy = -(20 + Math.random() * 60);

        piece.style.setProperty("--dx", `${dx}vw`);
        piece.style.setProperty("--dy", `${dy}vh`);

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.animationDelay = (Math.random() * 0.2) + "s";

        overlay.appendChild(piece);

        // Auto-remove piece after animation ends
        setTimeout(() => piece.remove(), 1200); // matches animation-duration
    }
}



// Scroll “unroll” menu behavior
function showScrollSection(id) {
    const sections = document.querySelectorAll(".scroll-section");

    sections.forEach(section => {
        if (section.id === id) {
            section.classList.add("open");   // this one unrolls
        } else {
            section.classList.remove("open"); // all others roll up
        }
    });

    // If you DON'T want the page to jump/scroll, REMOVE this block:
    /*
    const active = document.getElementById(id);
    if (active) {
        active.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    */
}

document.addEventListener("DOMContentLoaded", () => {
    const menuButtons = document.querySelectorAll(".top-menu button");

    menuButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");
            showScrollSection(targetId);
        });
    });

    // Close celebration popup on button click
    const closeButton = document.getElementById("close-celebration");
    if (closeButton) {
        closeButton.addEventListener("click", hideCelebration);
    }

    // Close try again bubble on button click
    const closeTryAgainButton = document.getElementById("close-try-again");
    if (closeTryAgainButton) {
        closeTryAgainButton.addEventListener("click", hideTryAgain);
    }

    // Make sure only the first section is open on load
    showScrollSection("intro");
});
