document
  .getElementById("customer-form")
  .addEventListener("submit", function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Custom logic before submitting the form
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const company = document.getElementById("company").value;

    // Simple validation
    if (name === "" || address === "" || company === "") {
      alert("Please fill in all fields.");
    } else {
      // Submit the form manually if validation is successful
      this.submit();
    }
  });

//
