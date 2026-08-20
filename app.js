// JKMaxx Paints Interactive Quotation Studio App Logic

// 1. Initial/Default Data Preset matching the User's original PDF
const originalPreset = {
    refNo: "JKMP / NGP / 26-27 /",
    date: "26 /06/2026",
    clientName: "Bhayaji Landge",
    clientMobile: "9823666443",
    dearGreeting: "Dear Sir,",
    introMsg: "Greetings from JK MaxX Paints ,",
    introP1: "JK MaxX Paints as a part of JK Cement (Pioneer in White Cement & Wall Putty) now in Decorative Paints segment.",
    introP2: "We would like to thank you for showing interest in our Products. As per our discussion, we submit here our best offer for your Nagpur.",
    products: [
        {
            name: "Majesta tru shyn interior emulsion 20 liter",
            specification: "It delivers a captivating, deep Luxe Sheen that transforms walls into a surface of sheer sophistication. Experience the perfect fusion of advanced durability and lasting, opulent beauty",
            rate: "11660/-",
            pageBreakAfter: false
        },
        {
            name: "Maximo Ultra Exterior Emulsion - 20 litre",
            specification: "All Weather Proof Technology, Therma-Guard Tech upto 7 degrees, Rich Sheen, Anti-Algal & Anti-Fungal, Bridges Hairline Cracks, 8 Years warranty",
            rate: "8650/-",
            pageBreakAfter: false
        },
        {
            name: "JK Maxx Seal Damp proof - 20 litre",
            specification: "Waterproofing Guarantee, High Elongation, Water Pressure Resistance, Superior Adhesion, Bridges Cracks Upto 1.5mm, Interior & Exterior, 10 Years warranty",
            rate: "4800/-",
            pageBreakAfter: false
        },
        {
            name: "WallMaxX Putty 40kg",
            specification: "Resists Flaking, No Chalking, Superior Adhesion, Longer Paint Life",
            rate: "710 /-",
            pageBreakAfter: false
        },
        {
            name: "Rustic Bag 2mm 25 kg",
            specification: "JK Maximo Patternz is a high performance textured wall finish. It is based on high performance Silicone acrylic emulsions, inorganic pigments, siliceous minerals, Special biocides, algicides, fungicides, surfactants etc. It is ideal for exteriors & interiors of the buildings. It has a long life and is easy to apply. JK Maximo Patternz Superfine provide unique features so essential yet missing in conventional/look alike products",
            rate: "770 /-",
            pageBreakAfter: true // Matches original PDF where the 6th item goes to Page 2
        },
        {
            name: "Primer Interior 20 liter",
            specification: "Superior Whiteness\nChalking Free\nEase of Application",
            rate: "1800/-",
            pageBreakAfter: false
        }
    ],
    remarks: [
        "The above rate inclusive of loading, unloading, transportation and GST – 18% as applicable.",
        "The rates mentioned for Paint is for Bases, Colorant cost would be extra.",
        "Payment Terms - Immediately after delivery of the material."
    ],
    closingMsg: "We trust that you will find our quote satisfactory and look forward to working with you. Please contact us should you have any questions at all.",
    signOffCompany: "For JK MaxX Paints",
    repName: "Aniket Bramnhe",
    repTitle: "Demand and Generation",
    repLocation: "Nagpur",
    repMobile: "Mo. No. - 90968422"
};

// 2. Active Application State
let activeState = JSON.parse(JSON.stringify(originalPreset));

// Helper functions for security and performance (CodeRabbit Review Fixes)
function escapeHTML(str) {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

const debouncedUpdatePreview = debounce(updatePreview, 150);

// 3. Select DOM Elements
const refNoInput = document.getElementById("ref-no");
const docDateInput = document.getElementById("doc-date");
const clientNameInput = document.getElementById("client-name");
const clientMobileInput = document.getElementById("client-mobile");
const dearGreetingInput = document.getElementById("dear-greeting");
const introMsgInput = document.getElementById("intro-msg");
const introP1Input = document.getElementById("intro-p1");
const introP2Input = document.getElementById("intro-p2");
const closingMsgInput = document.getElementById("closing-msg");
const signOffCompanyInput = document.getElementById("sign-off-company");
const repNameInput = document.getElementById("rep-name");
const repTitleInput = document.getElementById("rep-title");
const repLocationInput = document.getElementById("rep-location");
const repMobileInput = document.getElementById("rep-mobile");

// Preview Elements
const prevRefNo = document.getElementById("prev-ref-no");
const prevDocDate = document.getElementById("prev-doc-date");
const prevClientName = document.getElementById("prev-client-name");
const prevClientMobile = document.getElementById("prev-client-mobile");
const prevDearGreeting = document.getElementById("prev-dear-greeting");
const prevIntroMsg = document.getElementById("prev-intro-msg");
const prevIntroP1 = document.getElementById("prev-intro-p1");
const prevIntroP2 = document.getElementById("prev-intro-p2");
const prevTableBody = document.getElementById("prev-table-body");
const prevRemarksList = document.getElementById("prev-remarks-list");
const prevClosingMsg = document.getElementById("prev-closing-msg");
const prevSignOffCompany = document.getElementById("prev-sign-off-company");
const prevRepName = document.getElementById("prev-rep-name");
const prevRepTitle = document.getElementById("prev-rep-title");
const prevRepLocation = document.getElementById("prev-rep-location");
const prevRepMobile = document.getElementById("prev-rep-mobile");

// Containers & Buttons
const productsContainer = document.getElementById("products-list-container");
const remarksContainer = document.getElementById("remarks-list-container");
const btnAddProduct = document.getElementById("btn-add-product");
const btnAddRemark = document.getElementById("btn-add-remark");
const btnReset = document.getElementById("btn-reset");
const btnClear = document.getElementById("btn-clear");
const btnDownloadPdf = document.getElementById("btn-download-pdf");
const btnPrintBrowser = document.getElementById("btn-print-browser");
const pageCountBadge = document.getElementById("page-count-badge");

// Welcome Screen Elements
const welcomePortal = document.getElementById("welcome-portal");
const btnStartPreset = document.getElementById("btn-start-preset");
const btnStartBlank = document.getElementById("btn-start-blank");
const btnHome = document.getElementById("btn-home");
const appContainer = document.querySelector(".app-container");

// 4. Initialization
window.addEventListener("DOMContentLoaded", () => {
    loadState(activeState);
    setupEventListeners();
    setupMobileNav();
    updatePageIndicator();
});

// Load state into inputs and trigger updates
function loadState(state) {
    refNoInput.value = state.refNo;
    docDateInput.value = state.date;
    clientNameInput.value = state.clientName;
    clientMobileInput.value = state.clientMobile;
    dearGreetingInput.value = state.dearGreeting;
    introMsgInput.value = state.introMsg;
    introP1Input.value = state.introP1;
    introP2Input.value = state.introP2;
    closingMsgInput.value = state.closingMsg;
    signOffCompanyInput.value = state.signOffCompany;
    repNameInput.value = state.repName;
    repTitleInput.value = state.repTitle;
    repLocationInput.value = state.repLocation;
    repMobileInput.value = state.repMobile;

    renderProductsEditor();
    renderRemarksEditor();
    updatePreview();
}

// 5. Update Preview Content dynamically
function updatePreview() {
    // Basic Text Fields
    prevRefNo.textContent = refNoInput.value;
    prevDocDate.textContent = docDateInput.value;
    prevClientName.textContent = clientNameInput.value;
    prevClientMobile.textContent = clientMobileInput.value;
    prevDearGreeting.textContent = dearGreetingInput.value;
    prevIntroMsg.textContent = introMsgInput.value;
    prevIntroP1.textContent = introP1Input.value;
    prevIntroP2.textContent = introP2Input.value;
    prevClosingMsg.textContent = closingMsgInput.value;
    prevSignOffCompany.textContent = signOffCompanyInput.value;
    prevRepName.textContent = repNameInput.value;
    prevRepTitle.textContent = repTitleInput.value;
    prevRepLocation.textContent = repLocationInput.value;
    prevRepMobile.textContent = repMobileInput.value;

    // Render Table Content
    prevTableBody.innerHTML = "";
    activeState.products.forEach((prod, index) => {
        const tr = document.createElement("tr");
        
        const escapedName = escapeHTML(prod.name || "");
        const escapedRate = escapeHTML(prod.rate || "");
        const formattedSpec = escapeHTML(prod.specification || "").replace(/\n/g, "<br>");

        tr.innerHTML = `
            <td><strong>${escapedName}</strong></td>
            <td>${formattedSpec}</td>
            <td>${escapedRate}</td>
        `;
        prevTableBody.appendChild(tr);

        // Inject page break if toggled
        if (prod.pageBreakAfter) {
            const trBreak = document.createElement("tr");
            trBreak.className = "page-break-row";
            trBreak.innerHTML = `
                <td colspan="3">
                    <div class="page-break-indicator">
                        <span>PAGE BREAK</span>
                    </div>
                </td>
            `;
            prevTableBody.appendChild(trBreak);
        }
    });

    // Render Remarks List
    prevRemarksList.innerHTML = "";
    activeState.remarks.forEach(rem => {
        if (rem.trim() !== "") {
            const li = document.createElement("li");
            li.textContent = rem;
            prevRemarksList.appendChild(li);
        }
    });

    updatePageIndicator();
}

// Render product row editors in sidebar
function renderProductsEditor() {
    productsContainer.innerHTML = "";
    activeState.products.forEach((prod, index) => {
        const div = document.createElement("div");
        div.className = "product-row-editor";
        div.innerHTML = `
            <div class="row-editor-header">
                <span class="row-index-badge">Product #${index + 1}</span>
                <button type="button" class="btn-remove-row" title="Remove Product">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="form-group">
                <label>Product Name</label>
                <input type="text" class="prod-name-field" data-index="${index}">
            </div>
            <div class="form-group">
                <label>Specification</label>
                <textarea class="prod-spec-field" rows="2" data-index="${index}"></textarea>
            </div>
            <div class="form-grid-2">
                <div class="form-group">
                    <label>Rate (e.g. 1800/-)</label>
                    <input type="text" class="prod-rate-field" data-index="${index}">
                </div>
                <div class="form-group" style="flex-direction: row; align-items: center; gap: 0.5rem; justify-content: flex-start; margin-top: 1.2rem;">
                    <input type="checkbox" id="break-after-${index}" class="prod-break-field" data-index="${index}">
                    <label for="break-after-${index}" style="margin: 0; cursor: pointer; text-transform: none;">Page Break After</label>
                </div>
            </div>
        `;
        
        // Safely set attributes programmatically (prevents Attribute Injection XSS)
        div.querySelector(".prod-name-field").value = prod.name || "";
        div.querySelector(".prod-spec-field").value = prod.specification || "";
        div.querySelector(".prod-rate-field").value = prod.rate || "";
        div.querySelector(".prod-break-field").checked = !!prod.pageBreakAfter;
        
        // Bind dynamic listeners directly to prevent Global Scope Pollution
        div.querySelector(".btn-remove-row").addEventListener("click", () => {
            removeProduct(index);
        });

        productsContainer.appendChild(div);
    });

    // Rebind events to dynamic inputs using debounced preview updates
    document.querySelectorAll(".prod-name-field").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = e.target.dataset.index;
            activeState.products[idx].name = e.target.value;
            debouncedUpdatePreview();
        });
    });

    document.querySelectorAll(".prod-spec-field").forEach(textarea => {
        textarea.addEventListener("input", (e) => {
            const idx = e.target.dataset.index;
            activeState.products[idx].specification = e.target.value;
            debouncedUpdatePreview();
        });
    });

    document.querySelectorAll(".prod-rate-field").forEach(input => {
        input.addEventListener("input", (e) => {
            const idx = e.target.dataset.index;
            activeState.products[idx].rate = e.target.value;
            debouncedUpdatePreview();
        });
    });

    document.querySelectorAll(".prod-break-field").forEach(checkbox => {
        checkbox.addEventListener("change", (e) => {
            const idx = e.target.dataset.index;
            activeState.products[idx].pageBreakAfter = e.target.checked;
            debouncedUpdatePreview();
        });
    });
}

// Remove product helper
window.removeProduct = function(index) {
    activeState.products.splice(index, 1);
    renderProductsEditor();
    updatePreview();
};

// Add product helper
btnAddProduct.addEventListener("click", () => {
    activeState.products.push({
        name: "",
        specification: "",
        rate: "0/-",
        pageBreakAfter: false
    });
    renderProductsEditor();
    updatePreview();
    // Scroll to the bottom of the editor
    productsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

// Render remark row editors in sidebar
function renderRemarksEditor() {
    remarksContainer.innerHTML = "";
    activeState.remarks.forEach((rem, index) => {
        const div = document.createElement("div");
        div.className = "remark-row-editor";
        div.innerHTML = `
            <div class="row-editor-header">
                <span class="row-index-badge">Remark #${index + 1}</span>
                <button type="button" class="btn-remove-row" title="Remove Remark">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div class="form-group">
                <textarea class="remark-text-field" rows="2" data-index="${index}"></textarea>
            </div>
        `;
        
        // Safely set attributes programmatically (prevents Attribute Injection XSS)
        div.querySelector(".remark-text-field").value = rem || "";
        
        // Bind dynamic listeners directly to prevent Global Scope Pollution
        div.querySelector(".btn-remove-row").addEventListener("click", () => {
            removeRemark(index);
        });

        remarksContainer.appendChild(div);
    });

    // Rebind events to dynamic remark inputs using debounced preview updates
    document.querySelectorAll(".remark-text-field").forEach(textarea => {
        textarea.addEventListener("input", (e) => {
            const idx = e.target.dataset.index;
            activeState.remarks[idx] = e.target.value;
            debouncedUpdatePreview();
        });
    });
}

// Remove remark helper
window.removeRemark = function(index) {
    activeState.remarks.splice(index, 1);
    renderRemarksEditor();
    updatePreview();
};

// Add remark helper
btnAddRemark.addEventListener("click", () => {
    activeState.remarks.push("");
    renderRemarksEditor();
    updatePreview();
});

// Calculate and show approx page counts
function updatePageIndicator() {
    const el = document.getElementById("quotation-document");
    // Standard A4 pixel height in CSS (roughly 1122px is 297mm at standard 96dpi)
    const pageHeight = 1122;
    const currentHeight = el.scrollHeight;
    const pageCount = Math.max(1, Math.ceil(currentHeight / pageHeight));
    pageCountBadge.textContent = `Est. Page(s): ${pageCount}`;
}

// 6. Global Event Listeners
function setupEventListeners() {
    // Bind change/keyup events to core inputs
    const coreInputs = [
        { el: refNoInput, key: 'refNo' },
        { el: docDateInput, key: 'date' },
        { el: clientNameInput, key: 'clientName' },
        { el: clientMobileInput, key: 'clientMobile' },
        { el: dearGreetingInput, key: 'dearGreeting' },
        { el: introMsgInput, key: 'introMsg' },
        { el: introP1Input, key: 'introP1' },
        { el: introP2Input, key: 'introP2' },
        { el: closingMsgInput, key: 'closingMsg' },
        { el: signOffCompanyInput, key: 'signOffCompany' },
        { el: repNameInput, key: 'repName' },
        { el: repTitleInput, key: 'repTitle' },
        { el: repLocationInput, key: 'repLocation' },
        { el: repMobileInput, key: 'repMobile' }
    ];

    coreInputs.forEach(item => {
        item.el.addEventListener("input", (e) => {
            activeState[item.key] = e.target.value;
            debouncedUpdatePreview();
        });
    });

    // Reset button
    btnReset.addEventListener("click", () => {
        if (confirm("Reset document to the original default preset? All your custom changes will be overwritten.")) {
            activeState = JSON.parse(JSON.stringify(originalPreset));
            loadState(activeState);
        }
    });

    // Clear button
    btnClear.addEventListener("click", () => {
        if (confirm("Clear all text fields, products and remarks?")) {
            activeState = {
                refNo: "",
                date: "",
                clientName: "",
                clientMobile: "",
                dearGreeting: "Dear Sir,",
                introMsg: "",
                introP1: "",
                introP2: "",
                products: [],
                remarks: [],
                closingMsg: "",
                signOffCompany: "",
                repName: "",
                repTitle: "",
                repLocation: "",
                repMobile: ""
            };
            loadState(activeState);
        }
    });

    // PDF generation trigger
    btnDownloadPdf.addEventListener("click", downloadPDF);

    // Browser Print trigger
    btnPrintBrowser.addEventListener("click", () => {
        window.print();
    });

    // Welcome Portal Button - Start with original preset
    btnStartPreset.addEventListener("click", () => {
        activeState = JSON.parse(JSON.stringify(originalPreset));
        loadState(activeState);
        welcomePortal.classList.add("fade-out");
        appContainer.classList.remove("app-blurred");
        setTimeout(scalePreview, 100); // re-trigger scaling adjustment
    });

    // Welcome Portal Button - Start blank
    btnStartBlank.addEventListener("click", () => {
        activeState = {
            refNo: "",
            date: "",
            clientName: "",
            clientMobile: "",
            dearGreeting: "Dear Sir,",
            introMsg: "",
            introP1: "",
            introP2: "",
            products: [],
            remarks: [],
            closingMsg: "",
            signOffCompany: "",
            repName: "",
            repTitle: "",
            repLocation: "",
            repMobile: ""
        };
        loadState(activeState);
        welcomePortal.classList.add("fade-out");
        appContainer.classList.remove("app-blurred");
        setTimeout(scalePreview, 100); // re-trigger scaling adjustment
    });

    // Home Button - return to welcome portal
    btnHome.addEventListener("click", () => {
        welcomePortal.classList.remove("fade-out");
        appContainer.classList.add("app-blurred");
    });
}

// 7. Dynamic PDF Export using html2pdf.js
function downloadPDF() {
    const docElement = document.getElementById("quotation-document");
    if (!docElement) return;
    
    // Get client name for dynamic file name
    const clientSanitized = (clientNameInput.value || "Client").trim().replace(/[^a-zA-Z0-9]/g, "_");
    const refSanitized = (refNoInput.value || "Quote").trim().replace(/[^a-zA-Z0-9]/g, "_");
    const filename = `JKMaxx_Quotation_${clientSanitized}_${refSanitized}.pdf`;

    // Save scroll positions to prevent view jumping
    const workspace = document.querySelector(".document-workspace");
    const prevScrollTop = workspace ? workspace.scrollTop : 0;
    const prevScrollLeft = workspace ? workspace.scrollLeft : 0;

    // Reset scroll to 0 to prevent html2canvas cropping
    if (workspace) {
        workspace.scrollTop = 0;
        workspace.scrollLeft = 0;
    }

    // html2pdf options
    const opt = {
        margin: 0, // 0 margins so A4 fits exactly with docElement padding
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, // high quality
            useCORS: true, 
            logging: false,
            letterRendering: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: 794, // Force html2canvas viewport width to match A4 width (210mm)
            windowHeight: docElement.offsetHeight,
            onclone: (clonedDoc) => {
                const clone = clonedDoc.getElementById("quotation-document");
                if (clone) {
                    clone.style.height = `${clone.scrollHeight}px`;
                }
            }
        },
        jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait' 
        },
        pagebreak: { 
            mode: ['css', 'legacy'], // handles manual page breaks (.page-break-row)
            avoid: ['.metadata-row', '.recipient-section', '.salutation-section', 'thead', '.signoff-container'] 
        }
    };

    // Temporarily apply print classes during PDF rendering
    document.body.classList.add("pdf-rendering");

    // Use html2pdf on the live element
    html2pdf().from(docElement).set(opt).save()
        .then(() => {
            document.body.classList.remove("pdf-rendering");
            // Restore scroll positions
            if (workspace) {
                workspace.scrollTop = prevScrollTop;
                workspace.scrollLeft = prevScrollLeft;
            }
        })
        .catch(err => {
            console.error("PDF Export Error: ", err);
            document.body.classList.remove("pdf-rendering");
            // Restore scroll positions
            if (workspace) {
                workspace.scrollTop = prevScrollTop;
                workspace.scrollLeft = prevScrollLeft;
            }
            alert("Could not generate PDF. Please try the 'Browser Print' option instead.");
        });
}

// 8. Mobile Navigation & Scaling Logic
function setupMobileNav() {
    const tabEdit = document.getElementById("tab-btn-edit");
    const tabPreview = document.getElementById("tab-btn-preview");
    const appContainer = document.querySelector(".app-container");

    if (tabEdit && tabPreview && appContainer) {
        tabEdit.addEventListener("click", () => {
            tabEdit.classList.add("active");
            tabPreview.classList.remove("active");
            appContainer.classList.remove("show-preview");
        });

        tabPreview.addEventListener("click", () => {
            tabPreview.classList.add("active");
            tabEdit.classList.remove("active");
            appContainer.classList.add("show-preview");
            // Recalculate scaling when showing the preview page
            setTimeout(scalePreview, 50);
        });
    }

    // Call scalePreview on window resize
    window.addEventListener("resize", scalePreview);
    // Initial call
    scalePreview();
}

function scalePreview() {
    const workspace = document.querySelector(".document-workspace");
    const doc = document.getElementById("quotation-document");
    if (!workspace || !doc) return;

    if (window.innerWidth <= 768) {
        const workspaceWidth = workspace.clientWidth - 20; // 10px padding on each side
        const docWidth = doc.offsetWidth || 794; // fallback A4 width in px if offsetWidth is 0
        const scale = workspaceWidth / docWidth;

        if (scale < 1) {
            doc.style.transform = `scale(${scale})`;
            doc.style.transformOrigin = "top center";
            
            // Adjust workspace layout so the scaled document doesn't leave whitespace
            const scaledHeight = doc.scrollHeight * scale;
            doc.style.marginBottom = `-${doc.scrollHeight - scaledHeight}px`;
        } else {
            doc.style.transform = "none";
            doc.style.marginBottom = "0";
        }
    } else {
        doc.style.transform = "none";
        doc.style.transformOrigin = "initial";
        doc.style.marginBottom = "0";
    }
}

