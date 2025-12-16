"use strict";

let buildingType_select = document.getElementById("building-type");
let buildingType =
    buildingType_select.options[buildingType_select.selectedIndex].value;
let estimateNumElv_div = document.querySelector(".estimate-num-elv");
let numApt_input = document
    .getElementById("number-of-apartments")
    .querySelector("input");
let numFloors_input = document
    .getElementById("number-of-floors")
    .querySelector("input");
let numBasements_input = document
    .getElementById("number-of-basements")
    .querySelector("input");
let numElevators_input = document
    .getElementById("number-of-elevators")
    .querySelector("input");
let maxOcc_input = document
    .getElementById("maximum-occupancy")
    .querySelector("input");
let displayCalcElv_input = document
    .getElementById("elevator-amount")
    .querySelector("input");

let productLineSelection_div = document.querySelector(".product-line");
let radioBtns_div = document.querySelector(".radio-btns");
let warning_p = document.getElementById("warning");

let finalPricingDisplay_div = document.querySelector(".final-pricing-display");
let displayUnitPrice_input = document
    .getElementById("elevator-unit-price")
    .querySelector("input");
let displayElvTotalPrice_input = document
    .getElementById("elevator-total-price")
    .querySelector("input");
let displayInstallFee_input = document
    .getElementById("installation-fees")
    .querySelector("input");
let displayEstTotalCost_input = document
    .getElementById("final-price")
    .querySelector("input");

let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});
const buildingTypeFields = {
    residential: [
        "number-of-apartments",
        "number-of-floors",
    ],
    commercial: [
        "number-of-floors",
        "maximum-occupancy",
    ],
    industrial: [
        "number-of-elevators",
    ]
};
const unitPrices = {
    standard: 8000,
    premium: 12000,
    excelium: 15000,
};
const installPercentFees = {
    standard: 10,
    premium: 15,
    excelium: 20,
};

// CALCULATIONS
function calcResidentialElev(numFloors, numApts) {
    const elevatorsRequired = Math.ceil(numApts / numFloors / 6)*Math.ceil(numFloors / 20);
    console.log(elevatorsRequired)
    return elevatorsRequired;
}
function calcCommercialElev(numFloors, maxOccupancy) {
    const elevatorsRequired = Math.ceil((maxOccupancy * numFloors) / 200)*Math.ceil(numFloors / 10);
    const freighElevatorsRequired = Math.ceil(numFloors / 10);
    return freighElevatorsRequired + elevatorsRequired;
}

function calcInstallFee(totalPrice, installPercentFee) {
    return (installPercentFee / 100) * totalPrice;
}

// DISPLAY
function resetForm() {
    estimateNumElv_div.style.display = "none";
    estimateNumElv_div.querySelectorAll("div").forEach((el) => {
        el.querySelectorAll("input[type='number']").forEach((input) => {
            input.value = "";
        });
        el.querySelectorAll("div.col-4").forEach((div) => {
            div.classList.add("d-none");
        });
    });
    displayCalcElv_input.value = "";
    productLineSelection_div.style.display = "none";
    warning_p.style.display = "none";
    productLineSelection_div
        .querySelectorAll("input[type='radio']")
        .forEach((radioBtn) => {
            radioBtn.checked = false;
        });

    finalPricingDisplay_div.style.display = "none";
    finalPricingDisplay_div
        .querySelectorAll("input[type='text']")
        .forEach((input) => {
            input.setAttribute("value", "");
        });
}

function displayBuildingFields(buildingType) {
    estimateNumElv_div.style.display = "block";
    estimateNumElv_div.querySelector(".step-description").style.display =
        "block";
    estimateNumElv_div.querySelector(".card-block").style.display = "block";
    estimateNumElv_div.querySelectorAll(".row").forEach((row) => {
        row.classList.remove("d-none");
    });
    for (let fieldID of buildingTypeFields[buildingType]) {
        estimateNumElv_div
            .querySelector(`div[id='${fieldID}']`)
            .classList.remove("d-none");
    }
    productLineSelection_div.style.display = "block";
    finalPricingDisplay_div.style.display = "block";
}

function displayElvCalcResult(buildingType) {
    let calculatedElv;
    if (buildingType == "commercial") {
        calculatedElv = calcCommercialElev(
            parseInt(numFloors_input.value),
            parseInt(maxOcc_input.value)
        );
        displayCalcElv_input.value = calculatedElv;
    } else if (buildingType == "residential") {
        calculatedElv = calcResidentialElev(
            parseInt(numFloors_input.value),
            parseInt(numApt_input.value)
        );
        displayCalcElv_input.value = calculatedElv;
    } else {
        calculatedElv = numElevators_input.value;
        displayCalcElv_input.value = calculatedElv;
    }
}

function displayPricing(productLine, numElv) {
    let unitPrice = unitPrices[productLine];
    let installPercentFee = installPercentFees[productLine];
    let subtotal = unitPrice * numElv;
    let totalInstallFee = calcInstallFee(subtotal, installPercentFee);
    let totalPrice = subtotal + totalInstallFee;
    displayUnitPrice_input.setAttribute("value", formatter.format(unitPrice));
    displayElvTotalPrice_input.setAttribute(
        "value",
        formatter.format(subtotal)
    );
    displayInstallFee_input.setAttribute(
        "value",
        formatter.format(totalInstallFee)
    );
    displayEstTotalCost_input.setAttribute(
        "value",
        formatter.format(totalPrice)
    );
}

function updatePricingDisplay() {
    if (!displayCalcElv_input.value) {
        warning_p.style.display = "block";
        this.checked = false;
    } else {
        let numElv = parseInt(displayCalcElv_input.value);
        warning_p.style.display = "none";
        try {
            let productLine = document.querySelector(
                "input[name='product-line']:checked"
            ).id;
            displayPricing(productLine, numElv);
        } catch {
        }
    }
}

function allBuildingFieldsCompleted(buildingType) {
    for (let fieldID of buildingTypeFields[buildingType]) {
        if (
            estimateNumElv_div.querySelector(`div[id='${fieldID}'] input`)
                .value == ""
        ) {
            return false;
        }
    }
    return true;
}

radioBtns_div.querySelectorAll("input[type='radio']").forEach((radioBtn) => {
    radioBtn.addEventListener("click", updatePricingDisplay);
});

buildingType_select.addEventListener("change", function () {
    resetForm();
    buildingType = this.value;
    if (buildingType == "---Select---") {
        resetForm();
    } else {
        displayBuildingFields(buildingType);
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

document.addEventListener("DOMContentLoaded", function(){
    const dropdown = document.getElementById("building-type")
    const block1 = document.getElementById("step1")
    const block2 = document.getElementById("step2")
    const block3 = document.getElementById("step3")
    const block4 = document.getElementById("step4")


    function updatBackground(){

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

        } else if (dropdown.value !== "residential" | "commercial") {
            block1.style.backgroundColor = "gray";
            block2.style.backgroundColor = "gray";
            block3.style.backgroundColor = "gray";
            block4.style.backgroundColor = "gray";
        }

    }
    updatBackground()
    dropdown.addEventListener("change", updatBackground)
});

document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Map input IDs to keys expected by API and modal span IDs
  const fieldsMap = [
    { key: "fullName", inputId: "fullName", modalId: "modal-name" },
    { key: "email", inputId: "email", modalId: "modal-email" },
    { key: "phone", inputId: "phone", modalId: "modal-phone" },
    { key: "company_name", inputId: "company_name", modalId: "modal-company" },
    { key: "project_name", inputId: "project_name", modalId: "modal-project-name" },
    { key: "project_desc", inputId: "project_desc", modalId: "modal-description" },
    { key: "department", inputId: "department", modalId: "modal-department" },
    { key: "message", inputId: "message", modalId: "modal-message" },
  ];

  try {
    // Gather all form data dynamically
    const data = {};
    fieldsMap.forEach(({ key, inputId }) => {
      data[key] = document.getElementById(inputId).value.trim();
    });

    // Debug
    console.log("Data to send:", data);

    // POST request
    const response = await fetch("http://99.79.77.144:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const result = await response.json();
    console.log("Success:", result);

    // Populate modal with response data or original data
    fieldsMap.forEach(({ key, modalId }) => {
      document.getElementById(modalId).textContent = data[key] || "";
    });

    // File attachment (not handled by this form, so just default text)
    document.getElementById("modal-file").textContent = "No File Attachment";

    // Show the Bootstrap modal
    const modal = new bootstrap.Modal(document.getElementById("success-message"));
    modal.show();

  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem submitting the form.");
  }
});



