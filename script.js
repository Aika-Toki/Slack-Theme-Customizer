import chroma from "chroma-js";
import iziToast from "izitoast";
import Swal from "sweetalert2";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/material.css";
import "tippy.js/animations/shift-away.css";
import contentText from "./langdata.json" assert { type: "json" };

console.log(contentText);
function searchQuery() {
  let search = location.search.substr(1, location.search.length);
  let query = {};
  search.split("&").forEach((e) => {
    let _e = e.split("=");
    query[_e[0]] = _e[1];
  });
  return query;
}
function getLangText(key) {
  let language = searchQuery()["hl"];
  if (!language || !contentText[key].hasOwnProperty(language))
    location.search = "?hl=en_us";
  return contentText[key][language] || contentText[key]["en_us"];
}
function setLangText() {
  let language = searchQuery()["hl"];
  if (!language || !contentText["language"].hasOwnProperty(language))
    location.search = "?hl=en_us";
  let key = Object.keys(contentText);
  key.forEach((e) => {
    Array.from(
      document.body.querySelectorAll('[data-lang="' + e + '"]')
    ).forEach(
      (_e) =>
        (_e.textContent = contentText[e][language] || contentText[e]["en_us"])
    );
  });
}
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
  console.debug(colorstr);
  let _default =
    "#3F0E40,#000000,#1164A3,#FFFFFF,#4D2A51,#FFFFFF,#2BAC76,#CD2553,#350d36,#FFFFFF";
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
    let a = result[i].substr(1, 6).match(/.{2}/g);
    a = a.map((e) => parseInt(e, 16));
    // console.debug(a);
    document
      .querySelector(":root")
      .style.setProperty(`--${property[i]}-rgb`, a.join(", "));
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
  editorFix();
  document.querySelector(".editor_input").value = result.join(",");
  onEditorBlured();
}
function addColorPreviews(text) {
  var colorRegex = /#[0-9A-Fa-f]{6}\b/g;

  var newText = text.replace(colorRegex, (match) => {
    return (
      '<span class="color-preview--inline" style="background-color:' +
      match +
      '"></span>' +
      match
    );
  });

  return newText;
}
function get(q, qt) {
  let els = Array.from(
    document.querySelector(".theme_list").querySelectorAll(".list_item")
  );
  els = els.filter((e) => !e.classList.contains("theme_item_template"));
  els.map((e) => {
    e.remove();
  });
  if (document.querySelector(".loading").classList.contains("hidden"))
    document.querySelector(".loading").classList.remove("hidden");
  if (!document.querySelector(".filters").classList.contains("loader"))
    document.querySelector(".filters").classList.add("loader");
  let query = [];
  if (q != "" && q != undefined) query.push(`q=${q}`);
  if (qt != "" && qt != undefined) query.push(`qt=${qt}`);
  let querystr = query.length != 0 ? "?" + query.join("&") : "";
  let uri =
    "https://script.google.com/macros/s/AKfycbxUEOZJsoVz3z1znXUYiBVhG7ZYy-kBFXLyUn6XGnjaCfTjDlubh-rgVJS6pIXtS-_p/exec" +
    querystr;
  fetch(uri)
    .then((r) => r.json())
    .then((data) => {
      // console.debug(data);
      if (data.status == true) {
        setData(data.content);
        document.querySelector(".loading").classList.add("hidden");
        document.querySelector(".filters").classList.remove("loader");
      } else {
        Swal.fire("Error", data.content, "error");
      }
    });
}
function fpost() {
  $("#post-modal").iziModal("close");
  let title = document.querySelector("#post__title").value;
  let tag = document
    .querySelector("#post__tag")
    .value.split(" ")
    .map((e) => capitalize(e));
  let code = document
    .querySelector("#editor_input")
    .getAttribute("data-clear-code");
  let author = document.querySelector("#post__author").value;
  post(title, tag, code, author);
}
function post(title, tag, code, author) {
  let data = { title: title, tag: tag, code: code, author: author };
  let format = btoa(JSON.stringify(data));
  let uri =
    "https://script.google.com/macros/s/AKfycbxUEOZJsoVz3z1znXUYiBVhG7ZYy-kBFXLyUn6XGnjaCfTjDlubh-rgVJS6pIXtS-_p/exec";
  if (document.querySelector(".loading").classList.contains("hidden"))
    document.querySelector(".loading").classList.remove("hidden");
  if (!document.querySelector(".filters").classList.contains("loader"))
    document.querySelector(".filters").classList.add("loader");
  console.debug(uri);
  fetch(uri, {
    method: "POST",
    body: format,
  })
    .then((r) => r.json())
    .then((data) => {
      console.debug(data);
      if (data.status == true) {
        refresh();
      } else {
        Swal.fire("Error", data.content, "error");
      }
    });
}
function setData(data) {
  if (data.length != 0) {
    data.forEach((e) => {
      let d = JSON.parse(e);
      let n = document.querySelector(".theme_item_template").cloneNode(true);
      n.classList.remove("theme_item_template");
      n.querySelector(
        '[data-variable="variable.themeAuthorName"]'
      ).textContent = d.author;
      n.querySelector('[data-variable="variable.themeName"]').textContent =
        d.title;
      n.querySelector('[data-variable="variable.themeCode"]').textContent =
        d.code;
      n.querySelector('[data-variable="variable.themeTag"]').textContent = d.tag
        .map((_e) => capitalize(_e))
        .join(", ");
      d.id
        ? setTooltip(n.querySelector(".info-icon"), "ID: " + d.id, "right")
        : setTooltip(
            n.querySelector(".info-icon"),
            "ID: " + getLangText("tooltip.prevVerData"),
            "right"
          );
      n.querySelector(".stc-theme__tag").outerHTML += accessibilityBadge(
        checkAccessibility(d.code)[0]
      );
      n.querySelector(".stc-theme__code").innerHTML = addColorPreviews(
        n.querySelector(".stc-theme__code").textContent
      );
      n.querySelector(".stc-theme__code").setAttribute("data-code", d.code);
      n.querySelector(".stc-theme__author__avatar").style.filter =
        "hue-rotate(" + Math.floor(Math.random() * 36) + "0deg)";
      n.querySelector(".button_preview").addEventListener("click", preview);
      n.querySelector(".button_copy").addEventListener("click", copy);
      document.querySelector(".theme_item_template").parentElement.append(n);
    });
  } else {
    let n = document.querySelector(".theme_item_template").cloneNode(true);
    n.classList.remove("theme_item_template");
    n.innerHTML = `<div class="not-found"><h3>${getLangText(
      "interface.notFoundLead"
    )}</h3><p>${getLangText("interface.notFoundDescription")}</p></div>`;
    document.querySelector(".theme_item_template").parentElement.append(n);
  }
}
function refresh() {
  search();
}
function editorStatus() {
  if (document.querySelector(".editor_input").value == "") {
    document
      .querySelector(".editor + .placeholder > .placeholder")
      .classList.remove("hidden");
  } else {
    document
      .querySelector(".editor + .placeholder > .placeholder")
      .classList.add("hidden");
  }
  // document.querySelector(".editor_label>p").textContent = document.querySelector(".editor_input").value;
}
function editorPreview() {
  editorStatus();
  let cache = document.querySelector(".editor_input").value;
  cache = cache.replaceAll(" ", "").split(",");
  if (cache.length == 8) {
    cache.splice(8, 0, cache[0]);
    cache.splice(9, 0, cache[5]);
  }
  cache = cache.join(",").toUpperCase();
  document.querySelector(".editor_input").value = cache;
  let preview = addColorPreviews(document.querySelector(".editor_input").value);
  document.querySelector(".editor_input_preview_inner").innerHTML = preview;
  document
    .querySelector(".editor_input")
    .setAttribute(
      "data-clear-code",
      document.querySelector(".editor_input").value
    );
  document.querySelector(".editor_input").value = "";
  checkAccessibility(cache);
  getColorScheme(cache);
}
function editorFix() {
  document.querySelector(".editor_input").value = document
    .querySelector(".editor_input")
    .getAttribute("data-clear-code");
  document.querySelector(".editor_input_preview_inner").innerHTML = "";
  editorStatus();
}
function preview(e) {
  getColorScheme(
    e.target
      .closest(".renderer")
      .querySelector(".stc-theme__code")
      .getAttribute("data-code")
  );
  checkAccessibility(
    e.target
      .closest(".renderer")
      .querySelector(".stc-theme__code")
      .getAttribute("data-code")
  );
}
function copy(e) {
  navigator.permissions.query({ name: "clipboard-write" }).then((r) => {
    if (r.state == "denied") {
      Swal.fire("Error", "Writing to the clipboard has been denied", "error");
    } else {
      navigator.clipboard.writeText(
        e.target
          .closest(".renderer")
          .querySelector(".stc-theme__code")
          .getAttribute("data-code")
      );
      iziToast.show({
        title: "Copied!!",
        color: "green",
        position: "topCenter",
        timeout: 2000,
      });
    }
  });
}
function openSearchModal() {
  $("#search-modal").iziModal("open", {
    overlayClose: false,
  });
}
function openPostModal() {
  $("#post-modal").iziModal("open", {
    overlayClose: false,
  });
}
function openEditModal() {
  $("#edit-modal").iziModal("open");
}
function search() {
  $("#search-modal").iziModal("close");
  let q =
    document.querySelector("#search__q").value != ""
      ? document.querySelector("#search__q").value
      : "";
  let qt =
    document.querySelector("#search__qt").value != ""
      ? JSON.stringify(
          document
            .querySelector("#search__qt")
            .value.split(" ")
            .map((e) => e.replaceAll(" ", ""))
        )
      : "";
  let qtc =
    document.querySelector("#search__qt").value != ""
      ? "tag:" +
        document.querySelector("#search__qt").value.replaceAll(" ", ",")
      : "";
  document.querySelector("#search_keyword").textContent =
    q == "" && qt == "" ? getLangText("interface.search") : `${q} ${qtc}`;
  get(q, qt);
}
function clearSearch() {
  document.querySelector("#search__q").value = "";
  document.querySelector("#search__qt").value = "";
  search();
}
function checkAccessibility(colorstr) {
  let colors = colorstr.split(",");
  let score = [];
  let details = [];
  let element = [
    [colors[0], colors[5]],
    [colors[4], colors[5]],
    [colors[2], colors[3]],
    [colors[7], "#ffffff"],
    [colors[0], colors[6]],
    [colors[8], colors[9]],
  ];
  let elementName = [
    "Sidebar-Base",
    "Sidebar-Hover",
    "Sidebar-Select",
    "Mention-Badge",
    "Active-Badge",
    "Topbar",
  ];
  let unavailableElement = [];
  let dataAccessibilityarr = [];
  element.forEach((e, i) => {
    let contrastRatio = chroma.contrast(e[0], e[1]);
    details.push(`${e[0]} / ${e[1]} => ${contrastRatio}`);
    if (contrastRatio >= 7.0) {
      score.push("S");
      dataAccessibilityarr.push("class-s");
    } else if (contrastRatio >= 4.5) {
      score.push("A");
      dataAccessibilityarr.push("class-a");
    } else {
      score.push("-");
      unavailableElement.push(elementName[i]);
      dataAccessibilityarr.push("incompatible");
    }
  });
  let resultClass = ["s", "a", "-"];
  if (score.filter((e) => e != "-").length == element.length) {
    if (score.filter((e) => e == "S").length >= Math.ceil(element.length / 2)) {
      resultClass = resultClass[0];
    } else {
      resultClass = resultClass[1];
    }
  } else {
    resultClass = resultClass[2];
  }
  console.debug(`${resultClass} (${score})`);
  console.debug(details);
  let unavailableElementstr =
    unavailableElement.length != 0
      ? unavailableElement.join(", ")
      : getLangText("accessibility.none");
  return [resultClass, unavailableElementstr, dataAccessibilityarr];
}
function accessibilityBadge(score) {
  let url = "";
  if (score == "s") {
    url =
      "https://img.shields.io/badge/" +
      getLangText("interface.accessibility") +
      "-" +
      getLangText("interface.accessibilityS") +
      "-009dc4?style=flat";
  } else if (score == "a") {
    url =
      "https://img.shields.io/badge/" +
      getLangText("interface.accessibility") +
      "-" +
      getLangText("interface.accessibilityA") +
      "-48a34f?style=flat";
  } else {
    url =
      "https://img.shields.io/badge/" +
      getLangText("interface.accessibility") +
      "----CCCCCC?style=flat";
  }
  let tag = `<img class="stc-theme__accessibility-badge" src="${url}">`;
  return tag;
}
function capitalize(str) {
  if (typeof str !== "string" || !str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function checkEditingColor(colorstr) {
  document.querySelector(".accessibility_badge>.badge").innerHTML =
    accessibilityBadge(checkAccessibility(colorstr)[0]);
  document.querySelector(".accessibility_badge>.badge").hasOwnProperty("_tippy")
    ? modifyToolTip(
        ".accessibility_badge>.badge",
        getLangText("interface.incompatible") +
          ": " +
          checkAccessibility(colorstr)[1]
      )
    : setTooltip(
        ".accessibility_badge>.badge",
        getLangText("interface.incompatible") +
          ": " +
          checkAccessibility(colorstr)[1],
        "top"
      );

  let accessibilities = Array.from(
    document.querySelectorAll("#edit-modal .label-with-icon > span")
  );
  accessibilities.map((e, i) =>
    e.setAttribute("data-accessibility", checkAccessibility(colorstr)[2][i])
  );
  // document.querySelector(".accessibility_badge>.tooltip").textContent =
  //   getLangText("interface.incompatible") +
  //   ": " +
  //   checkAccessibility(colorstr)[1];
}
function onEditorBlured() {
  editorPreview();
  setVisualEditor();
  checkEditingColor(
    document.querySelector(".editor_input").getAttribute("data-clear-code")
  );
}
function setVisualEditor() {
  let data = document
    .querySelector(".editor_input")
    .getAttribute("data-clear-code")
    .split(",");
  $(".sidebar_bg").val(data[0]);
  $(".sidebar_item_fg").val(data[5]);
  $(".sidebar_item_bg_select").val(data[2]);
  $(".sidebar_item_fg_select").val(data[3]);
  $(".sidebar_item_bg_hover").val(data[4]);
  $(".mention_badge").val(data[7]);
  $(".active_badge").val(data[6]);
  $(".topbar_bg").val(data[8]);
  $(".topbar_fg").val(data[9]);
}
function changeColorScheme() {
  $("html").toggleClass("light");
  $("html").toggleClass("dark");
}
function apply2Editor(event) {
  let tar = event.target;
  let tarclass = Array.from(tar.classList).filter((e) => e != "input")[0];
  $("." + tarclass).val(tar.value);
  let data = [
    $(".sidebar_bg").val(),
    "#000000",
    $(".sidebar_item_bg_select").val(),
    $(".sidebar_item_fg_select").val(),
    $(".sidebar_item_bg_hover").val(),
    $(".sidebar_item_fg").val(),
    $(".active_badge").val(),
    $(".mention_badge").val(),
    $(".topbar_bg").val(),
    $(".topbar_fg").val(),
  ];
  $(".editor_input").val(data.join(","));
  onEditorBlured();
}
function setTooltip(q, c, p) {
  tippy(q, {
    content: c,
    theme: "material",
    animation: "shift-away",
    placement: p,
    arrow: false,
  });
}
function modifyToolTip(q, c) {
  document.querySelector(q)._tippy.setContent(c);
}
setLangText();
$("#post__title").attr("placeholder", getLangText("modal.post.themeName"));
$("#post__tag").attr("placeholder", getLangText("modal.post.themeTags"));
$("#post__author").attr("placeholder", getLangText("modal.post.userName"));
$("#search__q").attr("placeholder", getLangText("modal.search.themeName"));
$("#search__qt").attr("placeholder", getLangText("modal.search.themeTags"));
onEditorBlured();
// getColorScheme();
$("#search-modal").iziModal();
$("#post-modal").iziModal();
$("#edit-modal").iziModal({
  overlayClose: false,
  width: 950,
});
$(".button_random").on("click", random);
$(".button_color-scheme").on("click", changeColorScheme);
$(".editor_input").on("input", editorStatus);
$(".editor_input").on("blur", onEditorBlured);
$(".editor_input").on("focus", editorFix);
$("button.filters").on("click", refresh);
$("button.search").on("click", openSearchModal);
$("button.post").on("click", openPostModal);
$(".button_edit").on("click", openEditModal);
$("#button_search").on("click", search);
$("#button_clearSearch").on("click", clearSearch);
$("#button_post").on("click", fpost);
$("#button_close").on("click", () => {
  $("#edit-modal").iziModal("close");
});
$("#edit-modal input.input_color").on("input", apply2Editor);
$("#edit-modal input.input_text").on("change", apply2Editor);
setVisualEditor();

setTooltip(".button_random", getLangText("tooltip.random"), "top");
setTooltip(".button_color-scheme", getLangText("tooltip.colorScheme"), "top");
setTooltip(".button_materialize", getLangText("tooltip.materialize"), "top");
setTooltip(".button_edit", getLangText("tooltip.edit"), "top");

get();
