const contentText = {
  en_us: {
    "action.copy": "Copy",
    "action.preview": "Preview",
    "interface.channel": "Channel",
    "interface.channelSection": "Channels",
    "interface.directMessages": "Direct messages",
    "interface.hoveredChannel": "Hovered Channel",
    "interface.mentionedChannel": "Mentioned Channel",
    "interface.moreUnreadsBadge": "More unreads",
    "interface.search": "Search Workspace",
    "interface.selectedChannel": "Selected Channel",
    "interface.unreadChannel": "Unread Channel",
    "interface.unreadMentionsBadge": "Unread mentions",
    "interface.user": "User",
    "interface.workspace": "Workspace",
    "interface.writeThemeCode":
      "Write down the color code of your custom theme",
  },
  ja_jp: {
    "action.copy": "コピー",
    "action.preview": "プレビュー",
    "interface.channel": "チャンネル",
    "interface.channelSection": "チャンネル",
    "interface.directMessages": "ダイレクトメッセージ",
    "interface.hoveredChannel": "チャンネルホバー時",
    "interface.mentionedChannel": "メンションされたチャンネル",
    "interface.moreUnreadsBadge": "その他の未読メッセージ",
    "interface.search": "ワークスペース 内を検索する",
    "interface.selectedChannel": "チャンネル選択時",
    "interface.unreadChannel": "未読のチャンネル",
    "interface.unreadMentionsBadge": "未読のメンション",
    "interface.user": "ユーザー",
    "interface.workspace": "ワークスペース",
    "interface.writeThemeCode": "カスタムテーマのカラーコードを入力",
  },
};
function searchQuery() {
  let search = location.search.substr(1, location.search.length);
  let query = {};
  search.split("&").forEach((e) => {
    _e = e.split("=");
    query[_e[0]] = _e[1];
  });
  return query;
}
function setLangText() {
  let language = searchQuery()["hl"];
  if (!language || !contentText.hasOwnProperty(language))
    location.search = "?hl=en_us";
  let key = Object.keys(contentText["en_us"]);
  key.forEach((e) => {
    document.body.innerHTML = document.body.innerHTML.replaceAll(
      `{${e}}`,
      contentText[language][e] || contentText["en_us"][e]
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
  console.log(colorstr);
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
  if (result.length == 8) {
    result.splice(8, 0, result[0]);
    result.splice(9, 0, result[5]);
  }
  document.querySelector("#colorInput").value = result.join(",").toUpperCase();
  result.splice(1, 1);
  let cp = Array.from(document.querySelectorAll("div#colorPreview>div"));
  for (let i = 0; i < cp.length; i++) {
    cp[i].style.setProperty("--bgColor", result[i]);
    document
      .querySelector(":root")
      .style.setProperty(`--${property[i]}`, result[i]);
    let a = result[i].substr(1, 6).match(/.{2}/g);
    a = a.map((e) => parseInt(e, 16));
    // console.log(a);
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
  getColorScheme(result.join(","));
  document.querySelector("#colorInput").value = result.join(",");
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
  let query = [];
  if (q != "" && q != undefined) query.push(`q=${q}`);
  if (qt != "" && qt != undefined) query.push(`qt=${qt}`);
  let querystr = query.length != 0 ? "?" + query.join("&") : "";
  let uri =
    "https://script.google.com/macros/s/AKfycbxUEOZJsoVz3z1znXUYiBVhG7ZYy-kBFXLyUn6XGnjaCfTjDlubh-rgVJS6pIXtS-_p/exec" +
    querystr;
  console.log(uri);
  fetch(uri)
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      if (data.status == true) {
        setData(data.content);
        document.querySelector(".loading").classList.add("hidden");
      } else {
        console.error(data.content);
      }
    });
}
function setData(data) {
  data.forEach((e) => {
    let d = JSON.parse(e);
    let n = document.querySelector(".theme_item_template").cloneNode(true);
    n.classList.remove("theme_item_template");
    n.innerHTML = n.innerHTML.replace("{variable.themeAuthorName}", d.author);
    n.innerHTML = n.innerHTML.replace("{variable.themeName}", d.title);
    n.innerHTML = n.innerHTML.replace("{variable.themeCode}", d.code);
    n.innerHTML = n.innerHTML.replace("{variable.themeTag}", d.tag.join(", "));
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
}
function refresh() {
  get();
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
  document.querySelector(".editor_label>p").textContent =
    document.querySelector(".editor_input").value;
}
function preview(e) {
  getColorScheme(
    e.target
      .closest(".renderer")
      .querySelector(".stc-theme__code")
      .getAttribute("data-code")
  );
}
function copy(e) {
  navigator.clipboard.writeText(
    e.target
      .closest(".renderer")
      .querySelector(".stc-theme__code")
      .getAttribute("data-code")
  );
}
function openSearchModal() {
  $(".search-modal").iziModal("open", {
    title: "Search",
  });
}
setLangText();
getColorScheme();
$(".search-modal").iziModal();
document.querySelector("button#random").addEventListener("click", random);
document
  .querySelector("input#colorInput")
  .addEventListener("change", (e) => getColorScheme(e.target.value));
document.querySelector(".editor_input").addEventListener("input", editorStatus);
document.querySelector("button.filters").addEventListener("click", refresh);
document
  .querySelector("button.search")
  .addEventListener("click", openSearchModal);

get();
