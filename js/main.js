const topBar = document.getElementById("top-bar");
const exteriorColorSection = document.getElementById("exterior-buttons");
const interiorColorSection = document.getElementById("interior-buttons");
const exteriorImage = document.getElementById("exterior-image");
const interiorImage = document.getElementById("interior-image");
const wheelButtonsSection = document.getElementById("wheel-buttons");
const performanceBtn = document.getElementById("performance-btn");
const totalPriceElement = document.getElementById("total-price");
const fullSelfDrivingCheckbox = document.getElementById(
  "full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);
const downPaymentElement = document.getElementById("down-payment");
const monthlyPaymentElement = document.getElementById("monthly-payment");

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = "Stealth Grey";
const selectedOptions = {
  "Performance wheels": false,
  "Performance packages": false,
  "Full Self-driving": false,
};

const pricing = {
  "Performance wheels": 2500,
  "Performance packages": 5000,
  "Full Self-driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

// update total price
const updateTotalPrice = () => {
  currentPrice = basePrice;

  if (selectedOptions["Performance wheels"]) {
    currentPrice += pricing["Performance wheels"];
  }

  if (selectedOptions["Performance packages"]) {
    currentPrice += pricing["Performance packages"];
  }

  if (selectedOptions["Full Self-driving"]) {
    currentPrice += pricing["Full Self-driving"];
  }

  accessoryCheckboxes.forEach((checkbox) => {
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();

    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;
  updatePaymentBreakdown();
};

// Update payment based on current price
const updatePaymentBreakdown = () => {
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate loan details
  const loanMonths = 60;
  const interestRate = 0.03;

  const loanAmount = currentPrice - downPayment;

  // Monthly payment formula: P * (r(1+r)^n) / ((1 + r)^n-1)
  const monthlyInterestRate = interestRate / 12;

  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanMonths))) /
        (Math.pow(1 + monthlyInterestRate, loanMonths) - 1);
    
    monthlyPaymentElement.textContent = `$${monthlyPayment.toFixed(2).toLocaleString()}`;
};

// Handle top bar on scrolls
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// image mapping
const exteriorImages = {
  "Stealth Grey": "./images/model-y-stealth-grey.jpg",
  "Pearl White": "./images/model-y-pearl-white.jpg",
  "Deep Blue": "./images/model-y-deep-blue-metallic.jpg",
  "Solid Black": "./images/model-y-solid-black.jpg",
  "Ultra Red": "./images/model-y-ultra-red.jpg",
  "Quick Silver": "./images/model-y-quicksilver.jpg",
};

const interiorImages = {
  Dark: "./images/model-y-interior-dark.jpg",
  Light: "./images/model-y-interior-light.jpg",
};

// handle color selections
const handleColorButtonClick = (event) => {
  let button;
  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");

    if (event.currentTarget === exteriorColorSection) {
      selectedColor = button.querySelector("img").alt;
      updateExteriorImage();
    }

    if (event.currentTarget === interiorColorSection) {
      const color = button.querySelector("img").alt;
      interiorImage.src = interiorImages[color];
    }
  }
};

// Update exterior image based on color and wheels
const updateExteriorImage = () => {
  const performanceSuffix = selectedOptions["Performance wheels"]
    ? "-performance"
    : "";
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : "Stealth Grey";
  exteriorImage.src = exteriorImages[colorKey].replace(
    ".jpg",
    `${performanceSuffix}.jpg`
  );
};

// handle wheel button click
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

    event.target.classList.add("bg-gray-700", "text-white");

    selectedOptions["Performance wheels"] =
      event.target.textContent.includes("Performance");

    updateExteriorImage();
    updateTotalPrice();
  }
};

// Performance Package Selection
const handlePerformanceButtonClick = () => {
  const isSelected = performanceBtn.classList.toggle("bg-gray-700");
  performanceBtn.classList.toggle("text-white");

  selectedOptions["Performance packages"] = isSelected;

  updateTotalPrice();
};

// Full Self-Driving selection
const handleFullSelfDrivingCheckboxChange = () => {
  const isSelected = fullSelfDrivingCheckbox.checked;

  selectedOptions["Full Self-driving"] = isSelected;

  updateTotalPrice();
};

// Handle Accessory Chekbox Listener
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => updateTotalPrice());
});

updateTotalPrice();

// Event Listeners
window.addEventListener("scroll", () => requestAnimationFrame(handleScroll));
exteriorColorSection.addEventListener("click", handleColorButtonClick);
interiorColorSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceBtn.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener(
  "change",
  handleFullSelfDrivingCheckboxChange
);
