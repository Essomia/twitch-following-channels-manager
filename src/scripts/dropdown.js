var module_prefix = "tfcm";

var storageKey = `${module_prefix}-ext-sources`;
var attrCategory = `data-${module_prefix}-category`;
var attrFilter = `data-${module_prefix}-filter`;

var tplDropdownClass = `.${module_prefix}-dropdown-select`;
var tplDropdown = `
  <div class="${module_prefix}-root ${module_prefix}-dropdown">
      <select class="${module_prefix}-dropdown-select" name="category">
          <option value="">-- choose --</option>
          <option value="artist">Artist</option>
          <option value="gamer">Gamer</option>
          <option value="other">Other</option>
      </select>
  </div>
`;

var classCardToHide = `${module_prefix}-card-hidden`;

var tplFiltersClass = `.${module_prefix}-filters-select`;
var tplFilters = `
  <div class="${module_prefix}-root ${module_prefix}-filters">
      <ul class="${module_prefix}-filters-select">
          <li data-${module_prefix}-filter="">All</li>
          <li data-${module_prefix}-filter="artist">Artist</li>
          <li data-${module_prefix}-filter="gamer">Gamer</li>
          <li data-${module_prefix}-filter="other">Other</li>
      </ul>
  </div>
`;

/**
 * Get elements from subelement
 * @param {ObjectHTML} subelement
 */
function getDOMElements(subelement) {
  const card = subelement.closest(`.channel-follow-listing--card`);
  const dropdown = card.querySelector(tplDropdownClass);
  const link = card.querySelector(`.tw-link`);
  const ariaName = link.getAttribute("aria-label");

  return {
    card,
    dropdown,
    link,
    ariaName,
  };
}

/**
 * Save value when dropdown value change
 */
function onDropdownChange() {
  const { card, link, ariaName } = getDOMElements(this);

  // Set chosen value on card attributes
  card.setAttribute(attrCategory, this.value);

  // Get already saved datas
  const savedData = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Clean datas to remove any old value
  const datas = savedData.filter((item) => item.name !== ariaName);

  // Add new data with chosen value
  datas.push({
    name: ariaName,
    category: this.value,
  });

  // Save chosen value in storage
  localStorage.setItem(storageKey, JSON.stringify(datas));
}

/**
 * Be sure to display default value in dropdown from saved datas on initialization
 * @param {[Node|ObjectHTML]} newCard
 */
function initDropdownValue(newCard) {
  const { card, dropdown, ariaName } = getDOMElements(newCard);

  // Get already saved datas for current card
  const savedData = JSON.parse(localStorage.getItem(storageKey)) || [];
  const datas = savedData.find((item) => item.name === ariaName);

  if (datas === undefined) {
    return false;
  }

  // Set default value on card attributes
  card.setAttribute(attrCategory, datas.category);

  // Set default value on dropdown
  dropdown.value = datas.category;
}

/**
 * Add dropdown for each card and bind event
 * @param {[NodeList|ObjectHTML]} cardList
 */
function insertDropdown(cardList) {
  cardList.forEach((card) => {
    // Check if card already have a dropdown
    if (card.querySelector(tplDropdownClass) !== null) {
      // Do nothing
    } else {
      card.insertAdjacentHTML("afterbegin", tplDropdown);

      card
        .querySelector(tplDropdownClass)
        .addEventListener("change", onDropdownChange);

      initDropdownValue(card);
    }
  });
}

// On load
insertDropdown(document.querySelectorAll(".channel-follow-listing--card"));

// On scroll
document
  .querySelector(".tw-tower")
  .addEventListener("DOMNodeInserted", function (event) {
    const newCard = event.target;

    if (
      !newCard.classList ||
      !newCard.classList.contains("channel-follow-listing--card")
    ) {
      return false;
    }

    insertDropdown([newCard]);
  });

/**
 * Filters on click
 */
function onFilterClick() {
  // Get filter name we want
  const filterName = this.getAttribute(attrFilter);

  const cardList = document.querySelectorAll(`[${attrCategory}]`);

  cardList.forEach((card) => {
    // Remove class if already added
    if (card.classList.contains(classCardToHide)) {
      card.classList.toggle(classCardToHide);
    }

    // Add class if card has correct category name
    if (card.dataset.tfcmCategory === filterName) {
      card.classList.add(classCardToHide);
    }
  });
}

/**
 * Add filters list on top
 * @param {[NodeList|ObjectHTML]} parents
 */
function insertFilters(parents) {
  parents.forEach((parent) => {
    parent.insertAdjacentHTML("beforeend", tplFilters);
    parent
      .querySelector(tplFiltersClass)
      .querySelectorAll("li")
      .forEach((filter) => {
        filter.addEventListener("click", onFilterClick);
      });
  });
}

// On load
insertFilters(document.querySelectorAll(".tw-tabs"));
