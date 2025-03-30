document.addEventListener("click", async function(event) {
    if(!event.target.getAttribute("type") || event.target.getAttribute("type") !== "submit")
        return

    if(event.target.getAttribute("href"))
        return;

    if (!event.target.parentElement) return;
    let elements = event.target.parentElement.querySelectorAll("[id]"); 
    if (elements.length === 0) return;
    event.preventDefault();

    let postData = new URLSearchParams();
    elements.forEach(el => { postData.append(el.id, el.innerText || el.value || "")});

    console.log("Intercepted Data:", Object.fromEntries(postData));
    const response = await fetch(window.location.pathname, {
        method: "POST",
        body: postData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        credentials: "same-origin"
    });

    if (!response.ok) return;

    const rawText = await response.text();
    if(!rawText) return;
    if (rawText === "fetched") return;

    const cleanedText = rawText.trim();
    const expectedTag = event.target.parentElement.tagName;
    if (cleanedText.startsWith("<!DOCTYPE html>") || cleanedText.startsWith("<html>")) {
        const parsedDoc = new DOMParser().parseFromString(rawText, "text/html");
            document.open();
            document.write(parsedDoc.documentElement.outerHTML);
            document.close();
    } else if (rawText.startsWith("<" + expectedTag.toLowerCase())) {
        const newBody = new DOMParser().parseFromString(rawText, "text/html").body;
        document.body.replaceWith(newBody);
    } else {
        console.error("error");
    }
});