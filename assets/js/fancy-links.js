const fade = document.getElementById("fade");
// const fade = document.createElement("div");
// fade.id = "fade";
// document.body.prepend(fade);

document.querySelectorAll("a:not(#backToTop, #toc a), #logo, .gallery-img").forEach(item => {
    item.addEventListener("click", e => {
        e.preventDefault();
        fade.style.left = e.clientX + "px";
        fade.style.top = e.clientY + "px";

        fade.style.animationName = "grow";
        fade.style.animationDuration = "1s";
        fade.style.animationTimingFunction = "ease";
        fade.style.animationDirection = "normal";
        
        fade.style.borderRadius = "50%";
        fade.style.width = "110vmax";
        fade.style.height = "110vmax";
        fade.style.border = "100px solid #E94F37";

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
        fade.style.border = "none";

        fade.style.backgroundColor = "";
    }
});

document.getElementById("backToTop").addEventListener("click", e => {
    e.preventDefault();
    window.scrollTo(0, 0);
});