function clickButton(){
    document.getElementById('confirmSelectionButton').click();
}

function checkSelections(){
    if(document.getElementById('build').value != "default" && document.getElementById('platform').value != "default" &&
    document.getElementById('action').value != "default" && document.getElementById('productVersion').value != "default")
        document.getElementById('finalSubmit').disabled = false;
}

function changeInputValues(i){
    document.getElementById('platform').value = document.getElementById('platformOutput' + i).innerText;
    document.getElementById('productVersion').value = document.getElementById('versionOutput' + i).innerText;
    document.getElementById('action').value = 'Deprecate';
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("presentTable");
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