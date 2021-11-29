

//*********************************** */
//document.addEventListener("DOMContentLoaded", function (event) {
    var cards = document.querySelectorAll(".card");
    cards.forEach(i => {
        i.addEventListener("click", function () {
            i.parentNode.submit()
            console.log("clicked the thing")
        })
    });
//})


function truncateText(selector, maxLength) {
    var element = document.querySelector(selector),
        truncated = element.innerText;

    if (truncated.length > maxLength) {
        truncated = truncated.substr(0,maxLength) + '...';
    }
    return truncated;
}
//You can then call the function with something like what i have below.
document.querySelector('.car-description').innerText = truncateText('.car-description', 300);
