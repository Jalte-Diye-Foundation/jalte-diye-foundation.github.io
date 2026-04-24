const volunteerForm = document.getElementById("volunteerForm");
const formStatus = document.getElementById("formStatus");

if (volunteerForm && formStatus) {
    volunteerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!volunteerForm.checkValidity()) {
            volunteerForm.reportValidity();
            return;
        }

        const selectedAreas = Array.from(
            document.querySelectorAll('input[name="areas"]:checked')
        ).map((item) => item.value);

        if (selectedAreas.length === 0) {
            formStatus.textContent = "Please select at least one interest area.";
            return;
        }

        const data = new FormData(volunteerForm);
        const lines = [
            "Volunteer Application",
            "",
            "Full Name: " + data.get("fullName"),
            "Email: " + data.get("email"),
            "Phone Number: " + data.get("phone"),
            "City: " + data.get("city"),
            "Availability: " + data.get("availability"),
            "Preferred Mode: " + data.get("mode"),
            "Interest Areas: " + selectedAreas.join(", "),
            "",
            "Skills and Experience:",
            String(data.get("skills")),
            "",
            "Motivation:",
            String(data.get("message"))
        ];

        const subject = encodeURIComponent("Volunteer Application - " + data.get("fullName"));
        const body = encodeURIComponent(lines.join("\n"));

        window.location.href =
            "mailto:contact@jaltediyefoundation.org?subject=" + subject + "&body=" + body;
        formStatus.textContent =
            "Your email app should open now. If it does not, please email contact@jaltediyefoundation.org manually.";
    });
}
