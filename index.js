// Lab: Event Listeners in JavaScript
// Each section below matches a step in the README.

// ---------------------------------------------------------------------------
// 1. Handle Button Clicks
// ---------------------------------------------------------------------------

// Palette used when cycling the page background. Values are written as rgb()
// strings so they are predictable in the browser and in jsdom.
const BACKGROUND_COLORS = [
  "rgb(253, 230, 138)", // amber
  "rgb(167, 243, 208)", // emerald
  "rgb(191, 219, 254)", // sky
  "rgb(251, 207, 232)", // pink
  "rgb(221, 214, 254)", // violet
];

let currentColorIndex = -1;

// Advance through the palette so every click produces a visible change.
function getNextBackgroundColor() {
  currentColorIndex = (currentColorIndex + 1) % BACKGROUND_COLORS.length;
  return BACKGROUND_COLORS[currentColorIndex];
}

// Change the page background color. Called directly and from the button
// click listener attached in setupEventListeners().
function changeBackgroundColor() {
  document.body.style.backgroundColor = getNextBackgroundColor();
  updateInteractionStatus("click");
  return document.body.style.backgroundColor;
}

// Clear the inline background so the page falls back to its default (white).
// Wired to the double-click event in setupEventListeners().
function resetBackgroundColor() {
  document.body.style.backgroundColor = "";
}

// ---------------------------------------------------------------------------
// 2. Capture Keyboard Input
// ---------------------------------------------------------------------------

// Show the key the user pressed. Used directly and as a document keydown
// listener.
function displayKeyPress(event) {
  if (!event || typeof event.key === "undefined") {
    return;
  }

  const keyPressDisplay = document.getElementById("keyPressDisplay");
  if (!keyPressDisplay) {
    return;
  }

  keyPressDisplay.textContent = `Key pressed: ${event.key}`;
  updateInteractionStatus("key");
}

// ---------------------------------------------------------------------------
// 3. Process Text Input
// ---------------------------------------------------------------------------

// Mirror the text field's value into a paragraph as the user types.
function displayUserInput() {
  const textInput = document.getElementById("textInput");
  const textInputDisplay = document.getElementById("textInputDisplay");

  if (!textInput || !textInputDisplay) {
    return;
  }

  textInputDisplay.textContent = `You typed: ${textInput.value}`;
  updateInteractionStatus("input");
}

// ---------------------------------------------------------------------------
// 4. Combine Multiple Events
// ---------------------------------------------------------------------------

// Counts from the different event sources, shown on the page when the
// optional status element is present. Keeping this in one place lets the
// button, keyboard, and input handlers cooperate instead of duplicating code.
const interactions = { clicks: 0, keys: 0, inputs: 0 };

function updateInteractionStatus(kind) {
  if (kind === "click") interactions.clicks += 1;
  if (kind === "key") interactions.keys += 1;
  if (kind === "input") interactions.inputs += 1;

  const status = document.getElementById("interactionStatus");
  if (!status) {
    return;
  }

  status.textContent =
    `Interactions — button clicks: ${interactions.clicks}, ` +
    `key presses: ${interactions.keys}, ` +
    `input events: ${interactions.inputs}`;
}

// ---------------------------------------------------------------------------
// 5. BONUS: Additional Features
// ---------------------------------------------------------------------------

// Highlight a button while the pointer is over it.
function addHoverHighlight(element) {
  element.addEventListener("mouseover", () => {
    element.style.backgroundColor = "rgb(219, 234, 254)";
  });

  element.addEventListener("mouseout", () => {
    element.style.backgroundColor = "";
  });
}

// ---------------------------------------------------------------------------
// Attach Event Listeners
// ---------------------------------------------------------------------------

// The document-level keydown listener should be registered only once, even if
// setupEventListeners() runs again (e.g. after the DOM is rebuilt in tests).
let documentKeydownAttached = false;

function setupEventListeners() {
  const changeColorButton = document.getElementById("changeColorButton");
  const resetColorButton = document.getElementById("resetColorButton");
  const textInput = document.getElementById("textInput");

  // Single click cycles the background color.
  if (changeColorButton) {
    changeColorButton.addEventListener("click", changeBackgroundColor);
    addHoverHighlight(changeColorButton);
  }

  // Double-click resets the background.
  if (resetColorButton) {
    resetColorButton.addEventListener("dblclick", resetBackgroundColor);
    addHoverHighlight(resetColorButton);
  }

  // Every key press updates the display, no matter where focus is.
  if (!documentKeydownAttached) {
    document.addEventListener("keydown", displayKeyPress);
    documentKeydownAttached = true;
  }

  if (textInput) {
    // Real-time mirror of the field's contents.
    textInput.addEventListener("input", displayUserInput);

    // Combined interaction: pressing Enter in the field also changes the
    // background color.
    textInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        changeBackgroundColor();
      }
    });
  }
}

// Initialize event listeners when the DOM is ready. In tests the DOM is reset
// and setupEventListeners() is called directly, so this branch stays quiet.
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupEventListeners);
  } else {
    setupEventListeners();
  }
}

// Export for Jest while remaining safe in a plain browser <script>.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    changeBackgroundColor,
    resetBackgroundColor,
    displayKeyPress,
    displayUserInput,
    setupEventListeners,
  };
}
