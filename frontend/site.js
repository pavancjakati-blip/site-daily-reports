// =========================================
// FIELDLOG - SITE REPORTS
// =========================================

const API_URL =
    "https://site-daily-reports.up.railway.app";


let toastTimer;


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeSiteReportsPage
);


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


    await loadSiteDetails(siteId);

    await loadReports(siteId);

}


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
// SUBMIT BUTTON
// =========================================

function configureSubmitButton(siteId) {

    const submitButton =
        document.getElementById(
            "submitReportButton"
        );


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
                "Unable to load sites."
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
                "Construction site not found."
            );

        }


        siteTitle.innerHTML = `

            ${escapeHTML(site.name)} <span>Reports.</span>

        `;


        siteLocation.textContent =

            `${
                site.location ||
                "Location not specified"
            } · Daily construction field reports`;

    }
    catch (error) {

        console.error(
            "SITE DETAILS ERROR:",
            error
        );


        siteTitle.innerHTML = `

            Site <span>Reports.</span>

        `;


        siteLocation.textContent =
            "Unable to load construction site details.";

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
            "REPORT ERROR:",
            error
        );


        showReportsError(
            "The daily reports could not be loaded."
        );

    }

}


// =========================================
// LOAD REPORT BY DATE
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
                "Unable to find report."
            );

        }


        const data =
            await response.json();


        renderReports(

            Array.isArray(data)
                ? data
                : [data]

        );

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
// FILTERS
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


    showAllButton.addEventListener(
        "click",
        async () => {

            dateInput.value = "";


            await loadReports(siteId);

        }
    );

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


    const reportList =
        Array.isArray(reports)
            ? reports
            : [];


    reportCount.textContent =

        `${reportList.length} ${
            reportList.length === 1
                ? "REPORT"
                : "REPORTS"
        }`;


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

            (firstReport, secondReport) =>

                new Date(
                    secondReport.report_date
                ) -

                new Date(
                    firstReport.report_date
                )

        );


    reportsContainer.innerHTML =

        sortedReports

            .map(createReportCard)

            .join("");

}


// =========================================
// CREATE DAILY SITE REPORT TABLE
// =========================================

function createReportCard(report) {

    const reportDate =
        formatReportDate(
            report.report_date
        );


    const workersPresent =
        report.workers_present ?? 0;


    const workDone =
        report.work_done ||
        "No work details provided.";


    const blockers =
        report.blockers ||
        "No blockers";


    const submittedBy =
        report.submitted_by ||
        "Not specified";


    return `

        <article class="site-report-card">


            <!-- =================================
                 REPORT HEADER
            ================================== -->

            <div class="site-report-header">


                <div class="site-report-brand">

                    <span class="site-report-eyebrow">
                        FIELDLOG
                    </span>

                    <h3>
                        DAILY SITE REPORT
                    </h3>

                </div>


                <div class="site-report-header-date">

                    <span>
                        REPORT DATE
                    </span>

                    <strong>
                        ${escapeHTML(reportDate)}
                    </strong>

                </div>


            </div>



            <!-- =================================
                 REPORT TABLE
            ================================== -->

            <div class="site-report-table">


                <!-- SUBMITTED BY -->

                <div class="site-report-row">

                    <div class="site-report-label-cell">

                        <span>
                            Submitted By
                        </span>

                    </div>


                    <div class="site-report-value-cell">

                        <strong class="submitted-person">

                            ${escapeHTML(submittedBy)}

                        </strong>

                    </div>

                </div>



                <!-- WORKERS PRESENT -->

                <div class="site-report-row">

                    <div class="site-report-label-cell">

                        <span>
                            Workers Present
                        </span>

                    </div>


                    <div class="site-report-value-cell">

                        <div class="clean-workers-value">

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

                </div>



                <!-- WORK DONE -->

                <div
                    class="
                        site-report-row
                        site-report-work-row
                    "
                >

                    <div class="site-report-label-cell">

                        <span>
                            Work Done
                        </span>

                    </div>


                    <div class="site-report-value-cell">

                        <div class="clean-report-value"><p>${escapeHTML(workDone)}</p></div>

                    </div>

                </div>



                <!-- BLOCKERS -->

                <div
                    class="
                        site-report-row
                        site-report-blocker-row
                    "
                >

                    <div class="site-report-label-cell">

                        <span>
                            Blockers
                        </span>

                    </div>


                    <div class="site-report-value-cell">

                        <div class="clean-blocker-value"><p>${escapeHTML(blockers)}</p></div>

                    </div>

                </div>


            </div>


        </article>

    `;

}


// =========================================
// DATE FORMAT
// =========================================

function formatReportDate(dateValue) {

    if (!dateValue) {

        return "Date not available";

    }


    const dateOnly =
        String(dateValue).split("T")[0];


    const parts =
        dateOnly.split("-");


    const year =
        Number(parts[0]);


    const month =
        Number(parts[1]) - 1;


    const day =
        Number(parts[2]);


    const reportDate =
        new Date(
            year,
            month,
            day
        );


    return reportDate.toLocaleDateString(
        "en-GB",
        {

            day: "numeric",

            month: "long",

            year: "numeric"

        }
    );

}


// =========================================
// LOADING
// =========================================

function showReportsLoading() {

    const container =
        document.getElementById(
            "reportsContainer"
        );


    container.innerHTML = `

        <div class="loading-state">

            <div class="loader"></div>

            <p>
                Loading daily reports...
            </p>

        </div>

    `;

}


// =========================================
// ERROR
// =========================================

function showReportsError(message) {

    const container =
        document.getElementById(
            "reportsContainer"
        );


    container.innerHTML = `

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

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    clearTimeout(toastTimer);


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

}


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value ?? "")

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}