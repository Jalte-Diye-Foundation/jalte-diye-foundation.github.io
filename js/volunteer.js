const volunteerForm = document.getElementById("volunteerForm");
const formStatus = document.getElementById("formStatus");

if (volunteerForm && formStatus) {
    volunteerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!volunteerForm.checkValidity()) {
            volunteerForm.reportValidity();
            return;
        }

        const selectedProjects = Array.from(
            document.querySelectorAll('input[name="projects"]:checked')
        ).map((item) => item.value);

        const selectedAreas = Array.from(
            document.querySelectorAll('input[name="areas"]:checked')
        ).map((item) => item.value);

        if (selectedProjects.length === 0 && selectedAreas.length === 0) {
            formStatus.textContent = "Please select at least one project/initiative or interest area.";
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
            "Projects/Initiatives: " + (selectedProjects.length ? selectedProjects.join(", ") : "(Not specified)"),
            "Interest Areas: " + (selectedAreas.length ? selectedAreas.join(", ") : "(Not specified)"),
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
            "Thank you for applying! Your application is complete. Your email app should open now. If it does not, please email contact@jaltediyefoundation.org manually.";
        formStatus.style.color = '#207c2f';
        formStatus.style.fontWeight = 'bold';
    });
}
