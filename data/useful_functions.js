((container) => {
  let puller = (container) =>
    Array.from(container.querySelectorAll("li i a"))
      .map((link) => link.textContent)
      .filter(
        (text) => isNaN(Number(text)) || text === "edit" || text.endsWith(" TV")
      );
  console.log(JSON.stringify(puller(container), null, 2));
})(temp1)
