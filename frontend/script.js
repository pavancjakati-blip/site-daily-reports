// =========================================
// FIELDLOG FRONTEND
// =========================================

const API_URL =
    "https://site-daily-reports.up.railway.app";


// =========================================
// PAGE DETECTION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const sitesContainer =
        document.getElementById("sitesContainer");

    const reportsContainer =
        document.getElementById("reportsContainer");

    const reportForm =
        document.getElementById("reportForm");


    if (sitesContainer) {

        initializeSitesPage();

        return;

    }


    if (reportsContainer) {

        initializeSiteReportsPage();

        return;

    }


    if (reportForm) {

        initializeSubmitPage();

    }

});


// =========================================
// GET SITE ID
// =========================================

function getSiteId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("id");

}


// =========================================
// INDEX PAGE
// =========================================

let allSites = [];


async function initializeSitesPage() {

    configureSiteModal();

    configureSiteSearch();

    await loadSites();

}


// =========================================
// LOAD SITES
// =========================================

async function loadSites() {

    const sitesContainer =
        document.getElementById("sitesContainer");


    if (!sitesContainer) {

        return;

    }


    showSitesLoading();


    try {

        const response =
            await fetch(`${API_URL}/sites`);


        if (!response.ok) {

            throw new Error(
                `Unable to load sites. Status: ${response.status}`
            );

        }


        const data =
            await response.json();


        allSites =
            Array.isArray(data)
                ? data
                : [];


        renderSites(allSites);

    }
    catch (error) {

        console.error(
            "SITE LOAD ERROR:",
            error
        );


        sitesContainer.innerHTML = `

            <div class="error-state">

                <h3>
                    Unable to load construction sites
                </h3>

                <p>
                    Please check the backend connection
                    and refresh the page.
                </p>

            </div>

        `;


        updateSiteCount(0, 0);

    }

}


// =========================================
// RENDER SITES
// =========================================

function renderSites(sites) {

    const sitesContainer =
        document.getElementById("sitesContainer");


    if (!sitesContainer) {

        return;

    }


    const siteList =
        Array.isArray(sites)
            ? sites
            : [];


    updateSiteCount(
        siteList.length,
        allSites.length
    );


    if (siteList.length === 0) {

        sitesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    🏗
                </div>

                <h3>
                    No construction sites found
                </h3>

                <p>
                    Add a new construction site
                    to begin daily field reporting.
                </p>

            </div>

        `;


        return;

    }


    sitesContainer.innerHTML =

        siteList

            .map(createSiteCard)

            .join("");

}


// =========================================
// CREATE SITE CARD
// =========================================

function createSiteCard(site) {

    return `

        <a
            href="site.html?id=${encodeURIComponent(site.id)}"
            class="site-card"
        >

            <div class="site-card-icon">
                🏗
            </div>


            <div class="site-card-content">

                <span class="site-card-label">
                    CONSTRUCTION SITE
                </span>


                <h3>
                    ${escapeHTML(site.name)}
                </h3>


                <p>
                    ${escapeHTML(site.location)}
                </p>

            </div>


            <div class="site-card-action">

                <span>
                    View Reports
                </span>

                <strong>
                    →
                </strong>

            </div>

        </a>

    `;

}


// =========================================
// SITE COUNT
// =========================================

function updateSiteCount(
    visibleCount,
    totalCount
) {

    const visibleSiteCount =
        document.getElementById(
            "visibleSiteCount"
        );


    const totalSiteCount =
        document.getElementById(
            "totalSiteCount"
        );


    if (visibleSiteCount) {

        visibleSiteCount.textContent =
            visibleCount;

    }


    if (totalSiteCount) {

        totalSiteCount.textContent =
            totalCount;

    }

}


// =========================================
// SITE SEARCH
// =========================================

function configureSiteSearch() {

    const siteSearch =
        document.getElementById(
            "siteSearch"
        );


    if (!siteSearch) {

        return;

    }


    siteSearch.addEventListener(
        "input",
        () => {

            const searchValue =

                siteSearch.value

                    .trim()

                    .toLowerCase();


            const filteredSites =

                allSites.filter((site) => {

                    const name =

                        String(site.name || "")

                            .toLowerCase();


                    const location =

                        String(site.location || "")

                            .toLowerCase();


                    return (

                        name.includes(searchValue)

                        ||

                        location.includes(searchValue)

                    );

                });


            renderSites(filteredSites);

        }
    );

}


// =========================================
// SITE MODAL
// =========================================

function configureSiteModal() {

    const modal =
        document.getElementById(
            "siteModal"
        );


    const openButton =
        document.getElementById(
            "openSiteModal"
        );


    const closeButton =
        document.getElementById(
            "closeSiteModal"
        );


    const cancelButton =
        document.getElementById(
            "cancelSiteModal"
        );


    const siteForm =
        document.getElementById(
            "siteForm"
        );


    if (!modal) {

        return;

    }


    function openModal() {

        modal.classList.add("show");

    }


    function closeModal() {

        modal.classList.remove("show");

    }


    if (openButton) {

        openButton.addEventListener(
            "click",
            openModal
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );

    }


    modal.addEventListener(
        "click",
        (event) => {

            if (event.target === modal) {

                closeModal();

            }

        }
    );


    if (siteForm) {

        siteForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const siteName =

                    document
                        .getElementById("siteName")
                        .value
                        .trim();


                const siteLocation =

                    document
                        .getElementById("siteLocation")
                        .value
                        .trim();


                if (
                    !siteName
                    ||
                    !siteLocation
                ) {

                    showToast(
                        "Please enter site name and location."
                    );

                    return;

                }


                await createSite(
                    siteName,
                    siteLocation
                );

            }
        );

    }

}


// =========================================
// CREATE SITE
// =========================================

async function createSite(
    name,
    location
) {

    try {

        const response =
            await fetch(
                `${API_URL}/sites`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        name,

                        location

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Unable to create site. Status: ${response.status}`
            );

        }


        const modal =
            document.getElementById(
                "siteModal"
            );


        const siteForm =
            document.getElementById(
                "siteForm"
            );


        if (modal) {

            modal.classList.remove("show");

        }


        if (siteForm) {

            siteForm.reset();

        }


        showToast(
            "Construction site created successfully."
        );


        await loadSites();

    }
    catch (error) {

        console.error(
            "CREATE SITE ERROR:",
            error
        );


        showToast(
            "Unable to create construction site."
        );

    }

}


// =========================================
// SITES LOADING
// =========================================

function showSitesLoading() {

    const sitesContainer =
        document.getElementById(
            "sitesContainer"
        );


    if (!sitesContainer) {

        return;

    }


    sitesContainer.innerHTML = `

        <div class="loading-state">

            <div class="loader"></div>

            <p>
                Loading construction sites...
            </p>

        </div>

    `;

}


// =========================================
// SITE REPORT PAGE
// =========================================

async function initializeSiteReportsPage() {

    const siteId = getSiteId();


    if (!siteId) {

        showReportsError(
            "Construction site ID was not found."
        );

        return;

    }


    configureSubmitButton(siteId);

    configureReportFilters(siteId);


    await Promise.all([

        loadSiteDetails(siteId),

        loadReports(siteId)

    ]);

}


// =========================================
// CONFIGURE SUBMIT BUTTON
// =========================================

function configureSubmitButton(siteId) {

    const submitButton =
        document.getElementById(
            "submitReportButton"
        );


    if (!submitButton) {

        return;

    }


    submitButton.href =

        `submit.html?id=${encodeURIComponent(siteId)}`;

}


// =========================================
// LOAD SITE DETAILS
// =========================================

async function loadSiteDetails(siteId) {

    const siteTitle =
        document.getElementById(
            "siteTitle"
        );


    const siteLocation =
        document.getElementById(
            "siteLocation"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/sites`
            );


        if (!response.ok) {

            throw new Error(
                `Unable to load sites. Status: ${response.status}`
            );

        }


        const sites =
            await response.json();


        const site =
            sites.find(

                (item) =>

                    String(item.id) ===
                    String(siteId)

            );


        if (!site) {

            throw new Error(
                "Construction site was not found."
            );

        }


        if (siteTitle) {

            siteTitle.innerHTML =

                `${escapeHTML(site.name)} <span>Reports.</span>`;

        }


        if (siteLocation) {

            siteLocation.textContent =

                `${site.location} · Daily construction field reports`;

        }

    }
    catch (error) {

        console.error(
            "SITE DETAILS ERROR:",
            error
        );


        if (siteTitle) {

            siteTitle.innerHTML =

                `Site <span>Reports.</span>`;

        }


        if (siteLocation) {

            siteLocation.textContent =

                "Unable to load construction site details.";

        }

    }

}


// =========================================
// LOAD REPORTS
// =========================================

async function loadReports(siteId) {

    showReportsLoading();


    try {

        const response =
            await fetch(

                `${API_URL}/sites/${siteId}/reports`

            );


        if (!response.ok) {

            throw new Error(

                `Unable to load reports. Status: ${response.status}`

            );

        }


        const reports =
            await response.json();


        renderReports(reports);

    }
    catch (error) {

        console.error(
            "REPORT LOAD ERROR:",
            error
        );


        showReportsError(

            "The daily reports could not be loaded."

        );

    }

}


// =========================================
// REPORT BY DATE
// =========================================

async function loadReportByDate(
    siteId,
    selectedDate
) {

    showReportsLoading();


    try {

        const response =
            await fetch(

                `${API_URL}/sites/${siteId}/reports/${selectedDate}`

            );


        if (response.status === 404) {

            renderReports([]);

            return;

        }


        if (!response.ok) {

            throw new Error(
                `Unable to find report. Status: ${response.status}`
            );

        }


        const data =
            await response.json();


        const reports =

            Array.isArray(data)

                ? data

                : [data];


        renderReports(reports);

    }
    catch (error) {

        console.error(
            "REPORT DATE ERROR:",
            error
        );


        showReportsError(
            "The report could not be found."
        );

    }

}


// =========================================
// REPORT FILTERS
// =========================================

function configureReportFilters(siteId) {

    const dateInput =
        document.getElementById(
            "reportDate"
        );


    const findButton =
        document.getElementById(
            "findReportButton"
        );


    const showAllButton =
        document.getElementById(
            "showAllButton"
        );


    if (findButton) {

        findButton.addEventListener(
            "click",
            async () => {

                const selectedDate =
                    dateInput.value;


                if (!selectedDate) {

                    showToast(
                        "Please select a report date."
                    );

                    return;

                }


                await loadReportByDate(
                    siteId,
                    selectedDate
                );

            }
        );

    }


    if (showAllButton) {

        showAllButton.addEventListener(
            "click",
            async () => {

                dateInput.value = "";

                await loadReports(siteId);

            }
        );

    }

}


// =========================================
// RENDER REPORTS
// =========================================

function renderReports(reports) {

    const reportsContainer =
        document.getElementById(
            "reportsContainer"
        );


    const reportCount =
        document.getElementById(
            "reportCount"
        );


    if (!reportsContainer) {

        return;

    }


    const reportList =

        Array.isArray(reports)

            ? reports

            : [];


    if (reportCount) {

        reportCount.textContent =

            `${reportList.length} ${
                reportList.length === 1
                    ? "REPORT"
                    : "REPORTS"
            }`;

    }


    if (reportList.length === 0) {

        reportsContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ▤
                </div>

                <h3>
                    No reports submitted yet
                </h3>

                <p>
                    No daily report is available
                    for this site or selected date.
                </p>

            </div>

        `;


        return;

    }


    const sortedReports =

        [...reportList].sort(

            (
                firstReport,
                secondReport
            ) =>

                new Date(
                    secondReport.report_date
                )

                -

                new Date(
                    firstReport.report_date
                )

        );


    reportsContainer.innerHTML =

        sortedReports

            .map(createReportCard)

            .join("");

}

function createReportCard(report) {

    const dateInformation =
        formatReportDate(report.report_date);


    const workersPresent =
        report.workers_present ?? 0;


    const workCompleted =
        report.work_done ||
        report.work_completed ||
        "No work details provided.";


    const blockers =
        report.blockers ||
        report.issues ||
        "No blockers";


    const submittedBy =
        report.submitted_by ||
        "Not specified";


    return `

        <article class="daily-site-report">


            <!-- REPORT HEADER -->

            <div class="daily-report-header">

                <div class="daily-report-heading">

                    <span class="daily-report-brand">
                        FIELDLOG
                    </span>

                    <h3>
                        DAILY SITE REPORT
                    </h3>

                </div>


                <div class="daily-report-date">

                    <span>
                        REPORT DATE
                    </span>

                    <strong>
                        ${escapeHTML(dateInformation.date)}
                    </strong>

                </div>

            </div>



            <!-- SUBMITTED BY -->

            <div class="daily-report-row">

                <div class="daily-report-label">
                    Submitted By
                </div>

                <div class="daily-report-value">

                    <strong>
                        ${escapeHTML(submittedBy)}
                    </strong>

                </div>

            </div>



            <!-- WORKERS PRESENT -->

            <div class="daily-report-row">

                <div class="daily-report-label">
                    Workers Present
                </div>

                <div class="daily-report-value workers-present-value">

                    <strong>
                        ${escapeHTML(
                            String(workersPresent)
                        )}
                    </strong>

                    <span>
                        Workers On-Site
                    </span>

                </div>

            </div>



            <!-- WORK DONE -->

            <div class="daily-report-row">

                <div class="daily-report-label">
                    Work Done
                </div>

                <div class="daily-report-value">

                    <p>${escapeHTML(workCompleted)}</p>

                </div>

            </div>



            <!-- BLOCKERS -->

            <div class="daily-report-row">

                <div class="daily-report-label">
                    Blockers
                </div>

                <div class="daily-report-value">

                    <p>${escapeHTML(blockers)}</p>

                </div>

            </div>


        </article>

    `;

}
// =========================================
// FORMAT SITE REPORT WORK TEXT
// =========================================

function formatSiteReportText(value) {

    const text =
        String(value || "").trim();


    if (!text) {

        return `

            <div class="site-work-item">

                <span class="site-work-bullet">
                    •
                </span>

                <span>
                    No work details provided.
                </span>

            </div>

        `;

    }


    const workItems =
        text
            .split(/\n|(?<=[.!?])\s+/)

            .map(
                (item) =>
                    item
                        .replace(/^[-•]\s*/, "")
                        .trim()
            )

            .filter(Boolean);


    return workItems

        .map(
            (item) => `

                <div class="site-work-item">

                    <span class="site-work-bullet">
                        •
                    </span>

                    <span>

                        ${escapeHTML(item)}

                    </span>

                </div>

            `
        )

        .join("");

}




// =========================================
// SUBMIT PAGE
// =========================================
async function initializeSubmitPage() {

    const siteId =
        getSiteId();


    if (!siteId) {

        showReportMessage(
            "Construction site ID was not found.",
            true
        );

        return;

    }


    console.log(
        "SUBMIT PAGE SITE ID:",
        siteId
    );


    configureSubmitPageLinks(siteId);

    setDefaultSubmitReportDate();

    configureReportForm(siteId);

    await loadSubmitSiteDetails(siteId);

}
function configureSubmitPageLinks(siteId) {

    const reportsUrl =

        `./site.html?id=${encodeURIComponent(siteId)}`;


    const backButton =
        document.getElementById(
            "backToReportsButton"
        );


    const cancelButton =
        document.getElementById(
            "cancelReportButton"
        );


    if (backButton) {

        backButton.href =
            "./index.html";

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    reportsUrl;

            }
        );

    }

}
// =========================================
// DEFAULT SUBMIT REPORT DATE
// =========================================

function setDefaultSubmitReportDate() {

    const reportDate =
        document.getElementById(
            "reportDate"
        );


    if (!reportDate) {

        return;

    }


    if (reportDate.value) {

        return;

    }


    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            today.getDate()
        ).padStart(
            2,
            "0"
        );


    reportDate.value =

        `${year}-${month}-${day}`;

}
// =========================================
// SUBMIT SITE DETAILS
// =========================================

async function loadSubmitSiteDetails(siteId) {

    const submitSiteTitle =
        document.getElementById(
            "submitSiteTitle"
        );

    const submitSiteLocation =
        document.getElementById(
            "submitSiteLocation"
        );


    try {

        const response =
            await fetch(
                `${API_URL}/sites`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load site."
            );

        }


        const sites =
            await response.json();


        const site =
            sites.find(

                (item) =>

                    String(item.id) ===
                    String(siteId)

            );


        if (!site) {

            throw new Error(
                "Site not found."
            );

        }


        if (submitSiteTitle) {

            submitSiteTitle.textContent =
                site.name;

        }

        if (submitSiteLocation) {

            submitSiteLocation.textContent =
                site.location ||
                "Location not specified";

        }

    }
    catch (error) {

        console.error(
            "SUBMIT SITE ERROR:",
            error
        );


        if (submitSiteTitle) {

            submitSiteTitle.textContent =
                `Site #${siteId}`;

        }

        if (submitSiteLocation) {

            submitSiteLocation.textContent =
                "Unable to load site details.";

        }

    }

}


// =========================================
// CONFIGURE REPORT FORM
// =========================================

function configureReportForm(siteId) {

    const reportForm =
        document.getElementById(
            "reportForm"
        );


    if (!reportForm) {

        return;

    }


    reportForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const reportDate =

                document
                    .getElementById("reportDate")
                    .value;


            const workersPresent =

                Number(

                    document
                        .getElementById("workersPresent")
                        .value

                );


            const workDone =

                document
                    .getElementById("workDone")
                    .value
                    .trim();


            const blockers =

                document
                    .getElementById("blockers")
                    .value
                    .trim();


            const submittedBy =

                document
                    .getElementById("submittedBy")
                    .value
                    .trim();


            const reportData = {

                report_date:
                    reportDate,

                workers_present:
                    workersPresent,

                work_done:
                    workDone,

                blockers:
                    blockers,

                submitted_by:
                    submittedBy

            };


            await submitDailyReport(
                siteId,
                reportData
            );

        }
    );

}


// =========================================
// SUBMIT DAILY REPORT
// =========================================

async function submitDailyReport(
    siteId,
    reportData
) {

    const saveButton =
        document.getElementById(
            "saveReportButton"
        );


    try {

        if (saveButton) {

            saveButton.disabled = true;

            saveButton.textContent =
                "Submitting...";

        }


        const response =
            await fetch(

                `${API_URL}/sites/${siteId}/reports`,

                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(reportData)

                }

            );


        if (!response.ok) {

            let errorMessage = "Unable to submit the daily report.";

            try {

                const data = await response.json();

                errorMessage = data.message || data.error || errorMessage;

            } catch (jsonErr) {

                try {

                    const text = await response.text();

                    if (text) errorMessage = text;

                } catch (textErr) {}

            }

            throw new Error(errorMessage);

        }


        showReportMessage(
            "Daily report submitted successfully.",
            false
        );


        setTimeout(
            () => {

                window.location.href =

                    `site.html?id=${encodeURIComponent(siteId)}`;

            },
            700
        );

    }
    catch (error) {

        console.error(
            "REPORT SUBMIT ERROR:",
            error
        );


        showReportMessage(
            error.message || "Unable to submit the daily report.",
            true
        );

    }
    finally {

        if (saveButton) {

            saveButton.disabled = false;

            saveButton.textContent =
                "Submit Daily Report";

        }

    }

}


// =========================================
// REPORT MESSAGE
// =========================================

function showReportMessage(
    message,
    isError
) {

    const messageBox =
        document.getElementById(
            "reportMessage"
        );


    if (!messageBox) {

        return;

    }


    messageBox.textContent =
        message;


    messageBox.classList.remove(
        "hidden"
    );


    messageBox.classList.toggle(
        "error",
        isError
    );


    messageBox.classList.toggle(
        "success",
        !isError
    );

}


// =========================================
// FORMAT DATE
// =========================================

function formatReportDate(dateValue) {

    if (!dateValue) {

        return {

            day: "REPORT DATE",

            date: "Date not available"

        };

    }


    const dateOnly =

        String(dateValue)
            .split("T")[0];


    const parts =

        dateOnly.split("-");


    if (parts.length !== 3) {

        return {

            day: "REPORT DATE",

            date: String(dateValue)

        };

    }


    const reportDate =

        new Date(

            Number(parts[0]),

            Number(parts[1]) - 1,

            Number(parts[2])

        );


    return {

        day:

            reportDate
                .toLocaleDateString(

                    "en-US",

                    {

                        weekday: "long"

                    }

                ),


        date:

            reportDate
                .toLocaleDateString(

                    "en-GB",

                    {

                        day: "numeric",

                        month: "long",

                        year: "numeric"

                    }

                )

    };

}


// =========================================
// REPORT LOADING
// =========================================

function showReportsLoading() {

    const reportsContainer =
        document.getElementById(
            "reportsContainer"
        );


    if (!reportsContainer) {

        return;

    }


    reportsContainer.innerHTML = `

        <div class="loading-state">

            <div class="loader"></div>

            <p>
                Loading daily reports...
            </p>

        </div>

    `;

}


// =========================================
// REPORT ERROR
// =========================================

function showReportsError(message) {

    const reportsContainer =
        document.getElementById(
            "reportsContainer"
        );


    if (!reportsContainer) {

        return;

    }


    reportsContainer.innerHTML = `

        <div class="error-state">

            <h3>
                Unable to load reports
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}


// =========================================
// TOAST
// =========================================

let toastTimer;


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        return;

    }


    clearTimeout(toastTimer);


    toast.textContent =
        message;


    toast.classList.add("show");


    toastTimer = setTimeout(
        () => {

            toast.classList.remove("show");

        },
        3000
    );

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    const text =
        String(value ?? "");


    return text

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}
