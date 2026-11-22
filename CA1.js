
/* =========================================
   CAMPUSEASE - COMPLETE JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. INITIAL ISSUE DATA
    // =====================================

    const STORAGE_KEY = "campusEaseIssues";

    const defaultIssues = [
        {
            name: "Lift not working",
            location: "Block B - Academic Block",
            date: "16 Oct 2026",
            status: "Pending",
            priority: "High",
            description: "The lift is not working properly."
        },
        {
            name: "Broken ramp",
            location: "Block A - Library",
            date: "14 Oct 2026",
            status: "In Progress",
            priority: "Medium",
            description: "The ramp needs maintenance."
        },
        {
            name: "Washroom access",
            location: "Block C - Academic Block",
            date: "12 Oct 2026",
            status: "Resolved",
            priority: "Low",
            description: "Accessibility facilities needed improvement."
        },
        {
            name: "Parking issue",
            location: "Block A - Parking Area",
            date: "10 Oct 2026",
            status: "Resolved",
            priority: "Medium",
            description: "Accessible parking space was unavailable."
        }
    ];

    let issues = [];

    // Load saved reports from localStorage
    try {
        const savedIssues = localStorage.getItem(STORAGE_KEY);

        if (savedIssues) {
            issues = JSON.parse(savedIssues);

            if (!Array.isArray(issues)) {
                issues = defaultIssues;
            }
        } else {
            issues = defaultIssues;
            saveIssues();
        }
    } catch (error) {
        issues = defaultIssues;
    }

    function saveIssues() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
        } catch (error) {
            console.error("Unable to save reports:", error);
        }
    }


    // =====================================
    // 2. HELPER FUNCTIONS
    // =====================================

    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const characters = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            };

            return characters[character];
        });
    }

    function getStatusClass(status) {
        if (status === "Resolved") return "resolved";
        if (status === "In Progress") return "progress";
        return "pending";
    }

    function getIssueIcon(issueName) {
        const name = issueName.toLowerCase();

        if (name.includes("lift")) return "fa-elevator";
        if (name.includes("ramp")) return "fa-person-walking";
        if (name.includes("washroom")) return "fa-restroom";
        if (name.includes("parking")) return "fa-square-parking";

        return "fa-circle-exclamation";
    }

    function getCurrentDate() {
        return new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }


    // =====================================
    // 3. SEARCH FACILITIES
    // =====================================

    const searchForm = document.querySelector(".search");
    const searchInput = document.getElementById("herosearch");

    const facilityCards = Array.from(
        document.querySelectorAll(".facility-link")
    );

    function searchFacilities(query) {

        const searchValue = query.trim().toLowerCase();

        let found = 0;

        facilityCards.forEach(function (card) {

            const cardText = card.textContent.toLowerCase();

            if (cardText.includes(searchValue)) {
                card.style.display = "";
                found++;
            } else {
                card.style.display = "none";
            }

        });

        if (searchValue !== "") {
            document.getElementById("facilities")?.scrollIntoView({
                behavior: "smooth"
            });

            if (found === 0) {
                alert("No matching facility found.");
            }
        }
    }

    if (searchForm && searchInput) {

        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            searchFacilities(searchInput.value);
        });

    }


    // =====================================
    // 4. CATEGORY FILTER
    // =====================================

    const categoryCards = document.querySelectorAll(".category-card");

    const categoryKeywords = {
        "ramps": ["ramp"],
        "lifts": ["lift"],
        "washrooms": ["washroom"],
        "parking": ["parking"],
        "classrooms": ["classroom"],
        "other": [
            "gym",
            "mall",
            "pool",
            "mess",
            "hostel",
            "hospital",
            "library"
        ]
    };

    categoryCards.forEach(function (category) {

        category.addEventListener("click", function () {

            const heading = category.querySelector("h3");

            if (!heading) return;

            const selectedCategory = heading.textContent
                .trim()
                .toLowerCase();

            const keywords = categoryKeywords[selectedCategory];

            if (!keywords) return;

            // Remove previous selection
            categoryCards.forEach(function (item) {
                item.classList.remove("selected");
            });

            // Highlight selected category
            category.classList.add("selected");

            // Clear search input
            if (searchInput) {
                searchInput.value = "";
            }

            let found = 0;

            facilityCards.forEach(function (card) {

                const cardText = card.textContent.toLowerCase();

                const matches = keywords.some(function (keyword) {
                    return cardText.includes(keyword);
                });

                card.style.display = matches ? "" : "none";

                if (matches) found++;

            });

            document.getElementById("facilities")?.scrollIntoView({
                behavior: "smooth"
            });

            if (found === 0) {
                alert("No facilities found in this category.");
            }

        });

    });


    // =====================================
    // 5. DISPLAY REPORTED ISSUES
    // =====================================

    function renderIssues() {

        const issuesList = document.querySelector(".issues-list");

        if (!issuesList) return;

        issuesList.innerHTML = "";

        issues.forEach(function (issue, index) {

            const issueCard = document.createElement("div");

            issueCard.className = "issue-card";

            const statusClass = getStatusClass(issue.status);
            const iconClass = getIssueIcon(issue.name);

            issueCard.innerHTML = `
                <div class="issue-icon blue">
                    <i class="fa-solid ${iconClass}"></i>
                </div>

                <div class="issue-info">
                    <h3>${escapeHTML(issue.name)}</h3>

                    <p>📍 ${escapeHTML(issue.location)}</p>

                    <small>
                        Reported on: ${escapeHTML(issue.date)}
                    </small>
                </div>

                <span class="issue-status ${statusClass}">
                    ${escapeHTML(issue.status)}
                </span>

                <button class="view-btn"
                    onclick="showIssueDetails(${index})">
                    View Details
                </button>
            `;

            issuesList.appendChild(issueCard);

        });

        updateIssueCount();
    }


    // =====================================
    // 6. UPDATE REPORTED ISSUE COUNTER
    // =====================================

    function updateIssueCount() {

        const issueCounter = document.querySelector(
            ".box4 .box-content h2:nth-of-type(2)"
        );

        if (issueCounter) {
            issueCounter.textContent = issues.length;
        }

    }


    // =====================================
    // 7. REPORT ISSUE FORM
    // =====================================

    const issueForm = document.getElementById("issueForm");

    if (issueForm) {

        issueForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const studentName =
                document.getElementById("studentName").value.trim();

            const location =
                document.getElementById("Location").value;

            const issueType =
                document.getElementById("issueType").value;

            const description =
                document.getElementById("description").value.trim();

            const selectedPriority =
                document.querySelector(
                    'input[name="priority-ops"]:checked'
                );

            const message =
                document.getElementById("formMessage");

            if (
                !studentName ||
                !location ||
                !issueType ||
                !description ||
                !selectedPriority
            ) {

                message.textContent = "Please fill in all required fields.";
                message.style.color = "red";

                return;
            }

            // Create a new issue object
            const newIssue = {
                name: issueType,
                studentName: studentName,
                location: location,
                date: getCurrentDate(),
                status: "Pending",
                priority: selectedPriority.value,
                description: description
            };

            // Save new issue
            issues.unshift(newIssue);

            saveIssues();

            // Refresh My Issues section
            renderIssues();

            // Show success message
            message.textContent =
                "Your issue has been reported successfully!";

            message.style.color = "green";

            // Reset form
            issueForm.reset();

            // Scroll to My Issues
            setTimeout(function () {
                document.getElementById("issues")?.scrollIntoView({
                    behavior: "smooth"
                });
            }, 700);

        });

    }


  

    window.showIssueDetails = function (index) {

        const modal = document.getElementById("issueModal");
        const modalDetails = document.getElementById("modalDetails");

        if (!modal || !modalDetails) return;

        const issue = issues[index];

        if (!issue) return;

        modalDetails.innerHTML = `
            <div class="modal-info">

                <h3>${escapeHTML(issue.name)}</h3>

                <p>
                    <strong>Student Name:</strong>
                    ${escapeHTML(issue.studentName || "Demo Student")}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${escapeHTML(issue.location)}
                </p>

                <p>
                    <strong>Reported On:</strong>
                    ${escapeHTML(issue.date)}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${escapeHTML(issue.priority)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(issue.status)}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${escapeHTML(issue.description)}
                </p>

                <div class="modal-progress">
                    <div class="progress-step">
                        <span>1</span>
                        <p>Reported</p>
                    </div>

                    <div class="progress-step">
                        <span>2</span>
                        <p>Under Review</p>
                    </div>

                    <div class="progress-step">
                        <span>3</span>
                        <p>Resolved</p>
                    </div>
                </div>

            </div>
        `;

        modal.style.display = "flex";

    };


    
    window.closeIssueDetails = function () {

        const modal = document.getElementById("issueModal");

        if (modal) {
            modal.style.display = "none";
        }

    };


    const issueModal = document.getElementById("issueModal");

    if (issueModal) {

        issueModal.addEventListener("click", function (event) {

            if (event.target === issueModal) {
                window.closeIssueDetails();
            }

        });

    }


   

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            if (!email || !password) {
                alert("Please enter your email and password.");
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                alert("Please enter a valid email address.");
                return;
            }

            alert(
                "Login form validated successfully! " +
                "Connect a backend to enable real login."
            );

        });

    }



    window.forgotPassword = function (event) {

        if (event) {
            event.preventDefault();
        }

        alert(
            "Password recovery is not connected yet. " +
            "Please contact the administrator."
        );

    };

    renderIssues();

});
