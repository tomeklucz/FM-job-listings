"use strict";

const jobsContainer = document.querySelector(".jobs-container");
const requirementsContainer = document.querySelector(".requirements-container");
const filtersWindow = document.querySelector(".filters-window");
const filtersContainer = document.querySelector(".filters-container");
const clearBtn = document.querySelector(".btn-clear");

const jobListingApp = function () {
  let filters = [];
  jobsContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("btn-requirements")) return;
    if (filters.includes(e.target.innerHTML)) return;
    filters.push(e.target.innerText);
    displayFilters();
    filtersWindow.classList.remove("hidden");
    renderData();
  });

  clearBtn.addEventListener("click", function () {
    filters = [];
    filtersWindow.classList.add("hidden");
    renderData();
  });

  filtersContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("btn-remove")) return;
    filterRemove(e.target.id);
    displayFilters();
    renderData();
  });

  const renderData = async () => {
    jobsContainer.innerHTML = "";
    fetch("data.json")
      .then((response) => response.json())
      .then((data) =>
        data.forEach((item) => {
          const dataToFilter = [
            item.role,
            item.level,
            ...item.languages,
            ...item.tools,
          ];
          if (!filters.every((item) => dataToFilter.includes(item))) return;
          generateSingleJobMarkup(item);
        })
      );
  };

  renderData();

  const displayFilters = function () {
    filtersContainer.innerHTML = "";
    filters.forEach((filter) => generateSingleFilterMarkup(filter));
    if (filters.length === 0) filtersWindow.classList.add("hidden");
  };

  const filterRemove = function (id) {
    const index = filters.indexOf(id);
    filters.splice(index, 1);
  };

  const generateSingleJobMarkup = function (item) {
    const html = `
  <section class="single-job-container ${addBorder(item.featured)}">
    <img class="company-logo" src="${item.logo}" alt="" />
    <div class="job-description">
      <div class="main-info">
        <h2 class="company-name">${item.company}</h2>
        ${checkFlags(item.new, item.featured)}
      </div>
      <h3 class="job-position">${item.position}</h3>
      <div class="additional-info">
        <span>${item.postedAt}</span>
        <span>&middot;</span>
        <span>${item.contract}</span>
        <span>&middot;</span>
        <span>${item.location}</span>
      </div>
    </div>
    <div class="job-requirements">
        <button class="btn-requirements">${item.role}</button>
        <button class="btn-requirements">${item.level}</button>
        ${listRequirements(item.languages, item.tools)}
    </div>
  </section>`;
    jobsContainer.insertAdjacentHTML("beforeend", html);
  };

  const checkFlags = function (newFlag, featuredFlag) {
    let flags = "";
    if (newFlag) flags += `<span class="info-new">new!</span>`;
    if (featuredFlag) flags += `<span class="info-featured">featured</span>`;
    return flags;
  };

  const addBorder = function (featuredFlag) {
    let borderClass = "featured-border";
    if (!featuredFlag) return;
    return borderClass;
  };

  const listRequirements = function (languages, tools) {
    const requirements = [...languages, ...tools];
    let reqMarkup = "";
    requirements.forEach(
      (req) => (reqMarkup += `<button class="btn-requirements">${req}</button>`)
    );
    return reqMarkup;
  };

  const generateSingleFilterMarkup = function (filter) {
    const html = `
  <div class="filter-single">
  <span>${filter}</span>
  <button id="${filter}" class="btn-remove"></button>
  </div>`;
    filtersContainer.insertAdjacentHTML("beforeend", html);
  };
};
jobListingApp();

/* PROBLEMS
-> przy klasie borderowej dodaje do pozostałych ogłoszeń "undefined"
-> wyśrodkowanie napisów w buttonach
*/
