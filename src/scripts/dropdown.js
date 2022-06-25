var storage_name = "tfcm-ext-sources";

var tplDropdown = `
<div class="tfcm-root tfcm-dropdown">
    <select class="tfcm-dropdown-select" name="category">
        <option value="">-- choose --</option>
        <option value="artist">Artist</option>
        <option value="gamer-qc">Gamer QC</option>
        <option value="gamer-fr">Gamer FR</option>
        <option value="other">Other</option>
    </select>
</div>
`;

/**
 * Set tfcm category on card at dropdown change
 */

function onChangeDropdown(value) {
  const card = this.closest(".channel-follow-listing--card");
  const link = card.querySelector(".tw-link");

  card.setAttribute("data-tfcm-category", this.value);

  const savedData = JSON.parse(localStorage.getItem(storage_name)) || [];

  datas = savedData.filter(
    (item) => item.name !== link.getAttribute("aria-label")
  );

  datas.push({
    name: link.getAttribute("aria-label"),
    category: this.value,
  });

  localStorage.setItem(storage_name, JSON.stringify(datas));
}

/**
 * Set tfcm category on card at load
 */

document.querySelectorAll(".channel-follow-listing--card").forEach((card) => {
  card.insertAdjacentHTML("afterbegin", tplDropdown);
  card
    .querySelector(`.tfcm-dropdown-select`)
    .addEventListener("change", onChangeDropdown);
});

const savedData = JSON.parse(localStorage.getItem(storage_name)) || [];

savedData.forEach((data) => {
  const { name, category } = data;

  const link = document.querySelector(`[aria-label="${name}"]`);
  const card = link.closest(".channel-follow-listing--card");
  const dropdown = card.querySelector(`.tfcm-dropdown-select`);

  card.setAttribute("data-tfcm-category", category);
  dropdown.value = category;
});
