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

  console.log({
    name: link.getAttribute("aria-label"),
    category: this.value,
  });
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
