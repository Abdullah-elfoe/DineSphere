MAIN_CONTENT = document.getElementById("main-page");
SEARCH_CONTENT = document.getElementById("search-page");


function switchContent() {
    searchbar = document.getElementById("thesearchbar");
    if (searchbar.value == "") {
        SEARCH_CONTENT.style.display = "none";
        MAIN_CONTENT.style.display = "block";
    } else {
        MAIN_CONTENT.style.display = "none";
        SEARCH_CONTENT.style.display = "block";
    }
}
