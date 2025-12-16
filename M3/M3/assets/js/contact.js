/**	CONTACT FORM
*************************************************** **/
var _hash = window.location.hash;

/**
	BROWSER HASH - from php/contact.php redirect!

	#alert_success 		= email sent
	#alert_failed		= email not sent - internal server error (404 error or SMTP problem)
	#alert_mandatory	= email not sent - required fields empty
**/	jQuery(_hash).show();


document.getElementById("contact-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  // Map input IDs to keys expected by API and modal span IDs
  const fieldsMap = [
    { key: "fullname", inputId: "fullname", modalId: "modal-name" },
    { key: "email", inputId: "email", modalId: "modal-email" },
    { key: "phone", inputId: "phone", modalId: "modal-phone" },
    { key: "company_name", inputId: "company_name", modalId: "modal-company" },
    { key: "project_name", inputId: "project_name", modalId: "modal-project-name" },
    { key: "project_desc", inputId: "project_desc", modalId: "modal-description" },
    { key: "department", inputId: "department", modalId: "modal-department" },
    { key: "message", inputId: "message", modalId: "modal-message" },
  ];

  try {
    // Gather form data
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

    // Populate modal data
    fieldsMap.forEach(({ key, modalId }) => {
      document.getElementById(modalId).textContent = data[key] || "";
    });

    // File attachment 
    document.getElementById("modal-file").textContent = " Null";

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById("success-message"));
    modal.show();

  } catch (error) {
    console.error("Error:", error);
    alert("There was a problem submitting the form.");
  }
});