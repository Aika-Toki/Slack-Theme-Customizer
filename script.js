function generateColor() {
  let result = ["#"];
  for (let i = 0; i < 3; i++) {
    result.push(
      Number(Math.floor(Math.random() * 256))
        .toString(16)
        .padStart(2, 0)
        .toUpperCase()
    );
  }
  return result.join("");
}
function getColorScheme(colorstr) {
  console.log(colorstr);
  let _default =
    "#3F0E40,#000000,#1164A3,#FFFFFF,#4D2A51,#FFFFFF,#2BAC76,#ECE7EC,#350d36,#FFFFFF";
  let result = [];
  let property = [
    "sidebar-bg",
    "sidebar-item-bg-select",
    "sidebar-item-fg-select",
    "sidebar-item-bg-hover",
    "sidebar-item-fg",
    "active-badge",
    "mention-badge",
    "topnav-bg",
    "topnav-fg",
  ];
  result = colorstr ? colorstr.split(",") : _default.split(",");
  result.splice(1, 1);
  let cp = Array.from(document.querySelectorAll("div#colorPreview>div"));
  for (let i = 0; i < cp.length; i++) {
    cp[i].style.setProperty("--bgColor", result[i]);
    document
      .querySelector(":root")
      .style.setProperty(`--${property[i]}`, result[i]);
  }
  // document.body.innerHTML =
  //   '<input type="text" value="' +
  //   result.join(",") +
  //   '" style="width: 90vw; height: max-content; font-size: 20px; font-family: monospace;"/><button onclick="getColorScheme()">Random!!</button><br><div style="background-image: ' +
  //   gradientstr +
  //   '; width: 66vw; height: 10vh;">';
}
function random() {
  let result = [];
  for (let i = 0; i < 9; i++) {
    result.push(generateColor());
  }
  result.splice(1, 0, "#000000");
  getColorScheme(result.join(","));
  document.querySelector("#colorInput").value = result.join(",");
}
document.querySelector("button#random").addEventListener("click", random);
document
  .querySelector("input#colorInput")
  .addEventListener("change", (e) => getColorScheme(e.target.value));
