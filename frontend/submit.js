// =========================================
// FIELDLOG - SUBMIT REPORT
// =========================================

const API_URL =
    "https://site-daily-reports.up.railway.app";


// =========================================
// ELEMENTS
// =========================================

const reportForm =
    document.getElementById("reportForm");

const reportDate =
    document.getElementById("reportDate");

const workersPresent =
    document.getElementById("workersPresent");

const workDone =
    document.getElementById("workDone");

const blockers =
    document.getElementById("blockers");

const submittedBy =
    document.getElementById("submittedBy");

const saveReportButton =
    document.getElementById("saveReportButton");

const cancelReportButton =
    document.getElementById("cancelReportButton");

const backToReportsLink =
    document.getElementById("backToReportsLink");

const submitSiteTitle =
    document.getElementById("submitSiteTitle");

const submitSiteLocation =
    document.getElementById("submitSiteLocation");

const reportMessage =
    document.getElementById("reportMessage");


// =========================================
// SITE ID
// =========================================

const params =
    new URLSearchParams(
        window.location.search
    );


const siteId =
    params.get("id");


// =========================================
// INITIALIZE
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeSubmitPage
);


async function initializeSubmitPage() {

    if (!siteId) {

        showMessage(
            "Construction site ID was not found.",
            "error"
        );

        saveReportButton.disabled = true;

        return;

    }


    configureNavigation();

    setTodayDate();

    await loadSiteDetails();

}


// =========================================
// NAVIGATION
// =========================================

function configureNavigation() {

    const reportsURL =
        `site.html?id=${encodeURIComponent(siteId)}`;


    backToReportsLink.href =
        reportsURL;


    cancelReportButton.addEventListener(
        "click",
        () => {

            window.location.href =
                reportsURL;

        }
    );

}


// =========================================
// TODAY DATE
// =========================================

function setTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    reportDate.value =
        `${year}-${month}-${day}`;

}


// =========================================
// LOAD SITE
// =========================================

async function loadSiteDetails() {

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
                "Construction site not found."
            );

        }


        submitSiteTitle.textContent =
            site.name;


        submitSiteLocation.textContent =

            site.location ||
            "Location not specified";

    }
    catch (error) {

        console.error(
            "SITE ERROR:",
            error
        );


        submitSiteTitle.textContent =
            `Site #${siteId}`;


        submitSiteLocation.textContent =
            "Unable to load site details.";

    }

}


// =========================================
// SUBMIT REPORT
// =========================================

reportForm.addEventListener(
    "submit",
    submitReport
);


async function submitReport(event) {

    event.preventDefault();


    hideMessage();


    const reportData = {

        report_date:
            reportDate.value,

        workers_present:
            Number(workersPresent.value),

        work_done:
            workDone.value.trim(),

        blockers:
            blockers.value.trim(),

        submitted_by:
            submittedBy.value.trim()

    };


    if (
        !reportData.report_date ||
        workersPresent.value === "" ||
        !reportData.work_done ||
        !reportData.submitted_by
    ) {

        showMessage(
            "Please complete all required fields.",
            "error"
        );

        return;

    }


    saveReportButton.disabled = true;


    saveReportButton.textContent =
        "Submitting Report...";


    try {

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
                        JSON.stringify(
                            reportData
                        )

                }

            );


        if (response.status === 409) {

            showMessage(
                "A report for this date already exists",
                "error"
            );

            return;

        }


        if (!response.ok) {

            const data =
                await response
                    .json()
                    .catch(() => ({}));


            throw new Error(

                data.error ||
                data.message ||
                "Unable to submit report."

            );

        }


        showMessage(
            "Daily report submitted successfully.",
            "success"
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
            "SUBMIT REPORT ERROR:",
            error
        );


        showMessage(
            error.message,
            "error"
        );

    }
    finally {

        saveReportButton.disabled = false;


        saveReportButton.textContent =
            "Submit Daily Report";

    }

}


// =========================================
// MESSAGE
// =========================================

function showMessage(
    message,
    type
) {

    reportMessage.textContent =
        message;


    reportMessage.className =
        `message-box ${type}`;

}


function hideMessage() {

    reportMessage.textContent = "";


    reportMessage.className =
        "message-box hidden";

}