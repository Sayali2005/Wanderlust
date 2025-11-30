document.addEventListener("DOMContentLoaded", () => {
    const taxSwitch = document.getElementById("switchCheckDefault");
    if (taxSwitch) {
        taxSwitch.addEventListener("click", () => {
            let tax_Info = document.getElementsByClassName("taxInfo");
            for (let info of tax_Info) {
                if (info.style.display != "inline") {
                    info.style.display = "inline";
                } else {
                    info.style.display = "none";
                }
            }
        });
    }

    const filters = document.querySelectorAll(".filter");
    for (let filter of filters) {
        filter.addEventListener("click", () => {
            let category = filter.querySelector("p").innerText.trim();
            console.log("Category clicked:", category);
            window.location.href = `/listings?category=${category}`;
        });
    }
});
