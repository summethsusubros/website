function updateTextField(i) {
    document.getElementById("versionInput").value = document.getElementById("versionOutput" + i).innerText;
    document.getElementById("majorVersionInput").value = document.getElementById("majorVersionOutput" + i).innerText;
    document.getElementById("startDateInput").value = document.getElementById("startDateOutput" + i).innerText;
    document.getElementById("endDateInput").value = document.getElementById("endDateOutput" + i).innerText;
    document.getElementById("bitnessInput").value = document.getElementById("bitnessOutput" + i).innerText;
    document.getElementById("downloadLinkInput").value = document.getElementById("downloadLinkOutput" + i).innerText;
    document.getElementById("discriptionInput").value = document.getElementById("discriptionOutput" + i).innerText;
    document.getElementById("locationInput").value = document.getElementById("locationOutput" + i).innerText;
    document.getElementById("notesInput").value = document.getElementById("notesOutput" + i).innerText;

    document.getElementById("versionInput").style.pointerEvents = "None";
    document.getElementById("versionInput").style.backgroundColor = "rgba(12, 12, 12, 0.1)";
}

function copyToTextField(i) {
    document.getElementById("versionInput").value = document.getElementById("versionOutput" + i).innerText;
    document.getElementById("majorVersionInput").value = document.getElementById("majorVersionOutput" + i).innerText;
    document.getElementById("startDateInput").value = document.getElementById("startDateOutput" + i).innerText;
    document.getElementById("endDateInput").value = document.getElementById("endDateOutput" + i).innerText;
    document.getElementById("bitnessInput").value = document.getElementById("bitnessOutput" + i).innerText;
    document.getElementById("downloadLinkInput").value = document.getElementById("downloadLinkOutput" + i).innerText;
    document.getElementById("discriptionInput").value = document.getElementById("discriptionOutput" + i).innerText;
    document.getElementById("locationInput").value = document.getElementById("locationOutput" + i).innerText;
    document.getElementById("notesInput").value = document.getElementById("notesOutput" + i).innerText;
    document.getElementById("versionInput").style.pointerEvents = "auto";
    document.getElementById("versionInput").style.backgroundColor = "white";
}

function cancel() {
    document.getElementById("versionInput").style.pointerEvents = "auto";
    document.getElementById("versionInput").style.backgroundColor = "white";
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("versionTable");
    switching = true;
    dir = "asc"; 
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        if (dir == "asc") {
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
            }
        } else if (dir == "desc") {
            if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
            }
        }
        }
        if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        switchcount ++;      
        } else {
        if (switchcount == 0 && dir == "asc") {
            dir = "desc";
            switching = true;
        }
        }
    }
}
