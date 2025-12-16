"use strict";

// =======================
// DOM ELEMENT REFERENCES
// =======================

// Main dropdown for selecting building type
let buildingType_select = document.getElementById("building-type");
let buildingType = buildingType_select.options[buildingType_select.selectedIndex].value;

// Section for showing building-related input fields
let estimateNumElv_div = document.querySelector(".estimate-num-elv");

// Input fields for dynamic forms
let numApt_input = document.getElementById("number-of-apartments").querySelector("input");
let numFloors_input = document.getElementById("number-of-floors").querySelector("input");
let numBasements_input = document.getElementById("number-of-basements").querySelector("input");
let numElevators_input = document.getElementById("number-of-elevators").querySelector("input");
let maxOcc_input = document.getElementById("maximum-occupancy").querySelector("input");

// Output field for calculated number of elevators
let displayCalcElv_input = document.getElementById("elevator-amount").querySelector("input");

// Product line radio buttons and warning message
let productLineSelection_div = document.querySelector(".product-line");
let radioBtns_div = document.querySelector(".radio-btns");
let warning_p = document.getElementById("warning");

// Fields for displaying pricing breakdown
let finalPricingDisplay_div = document.querySelector(".final-pricing-display");
let displayUnitPrice_input = document.getElementById("elevator-unit-price").querySelector("input");
let displayElvTotalPrice_input = document.getElementById("elevator-total-price").querySelector("input");
let displayInstallFee_input = document.getElementById("installation-fees").querySelector("input");
let displayEstTotalCost_input = document.getElementById("final-price").querySelector("input");

// Currency formatter (USD)
let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

// =======================
// DATA STRUCTURES
// =======================

// Required fields by building type
const buildingTypeFields = {
    residential: ["number-of-apartments", "number-of-floors"],
    commercial: ["number-of-floors", "maximum-occupancy"],
    industrial: ["number-of-elevators"]
};

// Unit prices for each product line
const unitPrices = {
    standard: 8000,
    premium: 12000,
    excelium: 15000,
};

// Installation fees by product line (percentages)
const installPercentFees = {
    standard: 10,
    premium: 15,
    excelium: 20,
};

// =======================
// CALCULATION FUNCTIONS
// =======================

/**
 * Calculates elevator requirements for residential buildings.
 */
function calcResidentialElev(numFloors, numApts) {
    const elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20);
    console.log(elevatorsRequired);
    return elevatorsRequired;
}

/**
 * Calculates elevator requirements for commercial buildings including freight elevators.
 */
function calcCommercialElev(numFloors, maxOccupancy) {
    const elevatorsRequired = Math.ceil((maxOccupancy * numFloors) / 200) * Math.ceil(numFloors / 10);
    const freighElevatorsRequired = Math.ceil(numFloors / 10);
    return freighElevatorsRequired + elevatorsRequired;
}

/**
 * Calculates the installation fee based on a percentage of total price.
 */
function calcInstallFee(totalPrice, installPercentFee) {
    return (installPercentFee / 100) * totalPrice;
}

// =======================
// DISPLAY FUNCTIONS
// =======================

/**
 * Resets all form inputs and hides dynamic elements.
 */
function resetForm() {
    estimateNumElv_div.style.display = "none";

    // Clear all number inputs and hide unused sections
    estimateNumElv_div.querySelectorAll("div").forEach((el) => {
        el.querySelectorAll("input[type='number']").forEach((input) => {
            input.value = "";
        });
        el.querySelectorAll("div.col-4").forEach((div) => {
            div.classList.add("d-none");
        });
    });

    // Clear elevator count and pricing info
    displayCalcElv_input.value = "";
    productLineSelection_div.style.display = "none";
    warning_p.style.display = "none";

    // Uncheck product line radio buttons
    productLineSelection_div.querySelectorAll("input[type='radio']").forEach((radioBtn) => {
        radioBtn.checked = false;
    });

    // Clear pricing display
    finalPricingDisplay_div.style.display = "none";
    finalPricingDisplay_div.querySelectorAll("input[type='text']").forEach((input) => {
        input.setAttribute("value", "");
    });
}

/**
 * Displays form fields based on selected building type.
 */
function displayBuildingFields(buildingType) {
    estimateNumElv_div.style.display = "block";
    estimateNumElv_div.querySelector(".step-description").style.display = "block";
    estimateNumElv_div.querySelector(".card-block").style.display = "block";

    // Show only relevant input rows
    estimateNumElv_div.querySelectorAll(".row").forEach((row) => {
        row.classList.remove("d-none");
    });

    for (let fieldID of buildingTypeFields[buildingType]) {
        estimateNumElv_div.querySelector(`div[id='${fieldID}']`).classList.remove("d-none");
    }

    productLineSelection_div.style.display = "block";
    finalPricingDisplay_div.style.display = "block";
}

/**
 * Displays calculated number of elevators based on building type.
 */
function displayElvCalcResult(buildingType) {
    let calculatedElv;

    if (buildingType == "commercial") {
        calculatedElv = calcCommercialElev(
            parseInt(numFloors_input.value),
            parseInt(maxOcc_input.value)
        );
    } else if (buildingType == "residential") {
        calculatedElv = calcResidentialElev(
            parseInt(numFloors_input.value),
            parseInt(numApt_input.value)
        );
    } else {
        // Industrial: manual input
        calculatedElv = numElevators_input.value;
    }

    displayCalcElv_input.value = calculatedElv;
}

/**
 * Displays pricing breakdown based on selected product line and number of elevators.
 */
function displayPricing(productLine, numElv) {
    let unitPrice = unitPrices[productLine];
    let installPercentFee = installPercentFees[productLine];
    let subtotal = unitPrice * numElv;
    let totalInstallFee = calcInstallFee(subtotal, installPercentFee);
    let totalPrice = subtotal + totalInstallFee;

    // Update pricing inputs with formatted values
    displayUnitPrice_input.setAttribute("value", formatter.format(unitPrice));
    displayElvTotalPrice_input.setAttribute("value", formatter.format(subtotal));
    displayInstallFee_input.setAttribute("value", formatter.format(totalInstallFee));
    displayEstTotalCost_input.setAttribute("value", formatter.format(totalPrice));
}

/**
 * Triggers pricing calculation only if elevator count is valid.
 */
function updatePricingDisplay() {
    if (!displayCalcElv_input.value) {
        warning_p.style.display = "block";
        this.checked = false;
    } else {
        warning_p.style.display = "none";
        let numElv = parseInt(displayCalcElv_input.value);
        try {
            let productLine = document.querySelector("input[name='product-line']:checked").id;
            displayPricing(productLine, numElv);
        } catch {
            // Silent fail if no product line selected
        }
    }
}

/**
 * Validates that all required fields are filled for the selected building type.
 */
function allBuildingFieldsCompleted(buildingType) {
    for (let fieldID of buildingTypeFields[buildingType]) {
        if (estimateNumElv_div.querySelector(`div[id='${fieldID}'] input`).value == "") {
            return false;
        }
    }
    return true;
}

// =======================
// EVENT LISTENERS
// =======================

// Radio buttons: pricing update on selection
radioBtns_div.querySelectorAll("input[type='radio']").forEach((radioBtn) => {
    radioBtn.addEventListener("click", updatePricingDisplay);
});

// Dropdown: building type change triggers form reset and conditional display
buildingType_select.addEventListener("change", function () {
    resetForm();
    buildingType = this.value;

    if (buildingType == "---Select---") {
        resetForm();
    } else {
        displayBuildingFields(buildingType);

        // Trigger elevator calculation and pricing when inputs change
        estimateNumElv_div.addEventListener("change", function () {
            if (!allBuildingFieldsCompleted(buildingType)) {
                return;
            } else {
                displayElvCalcResult(buildingType);
                updatePricingDisplay();
            }
        });
    }
});

// =======================
// UI: Background Color Per Building Type
// =======================
document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("building-type");
    const block1 = document.getElementById("step1");
    const block2 = document.getElementById("step2");
    const block3 = document.getElementById("step3");
    const block4 = document.getElementById("step4");

    // Dynamically changes tab colors based on building type
    function updateBackground() {
        if (dropdown.value === "commercial") {
            block1.style.backgroundColor = "lightcoral";
            block2.style.backgroundColor = "lightcoral";
            block3.style.backgroundColor = "lightcoral";
            block4.style.backgroundColor = "lightcoral";
        } else if (dropdown.value === "residential") {
            block1.style.backgroundColor = "lightblue";
            block2.style.backgroundColor = "lightblue";
            block3.style.backgroundColor = "lightblue";
            block4.style.backgroundColor = "lightblue";
        } else {
            // Default/industrial/unspecified
            block1.style.backgroundColor = "gray";
            block2.style.backgroundColor = "gray";
            block3.style.backgroundColor = "gray";
            block4.style.backgroundColor = "gray";
        }
    }

    updateBackground();
    dropdown.addEventListener("change", updateBackground);
});
