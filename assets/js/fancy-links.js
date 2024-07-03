const fade = document.getElementById("fade");

document.querySelectorAll("a.fancy-link:not(#backToTop), #logo, .gallery-img").forEach(item => {
    item.addEventListener("click", e => {
        e.preventDefault();
        fade.style.left = e.clientX + "px";
        fade.style.top = e.clientY + "px";

        fade.style.animationName = "grow";
        fade.style.animationDuration = "1s";
        fade.style.animationTimingFunction = "ease";
        fade.style.animationDirection = "normal";
        
        fade.style.borderRadius = "50%";
        fade.style.width = "100vmax";
        fade.style.height = "100vmax";

        fade.style.backgroundColor = "black"; // for art category pages
        
        setTimeout(() => {
            window.location.href = item.href;
        }, 1000);
    });
});

window.addEventListener("pageshow", e => {
    if (e.persisted) {
        console.log("Persisted");
        fade.style.left = "";
        fade.style.top = "";

        fade.style.animationName = "";
        fade.style.animationDuration = "";
        fade.style.animationTimingFunction = "";
        fade.style.animationDirection = "reverse";
        
        fade.style.borderRadius = "";
        fade.style.width = "";
        fade.style.height = "";

        fade.style.backgroundColor = "";
    }
});

document.getElementById("backToTop").addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo(0, 0);
});