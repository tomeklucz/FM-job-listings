"use strict";

/* VARIABLES */
const jobsContainer = document.querySelector(".jobs-container");
const requirementsContainer = document.querySelector(".requirements-container");
const filtersWindow = document.querySelector(".filters-window");
const filtersContainer = document.querySelector(".filters-container");
const clearBtn = document.querySelector(".btn-clear");

/* JOB LISTING APP */
const jobListingApp = function () {
  let filters = [];

  /* EVENT HANDLERS */
  /* job requirements filtering */
  jobsContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("btn-requirements")) return;
    if (filters.includes(e.target.innerHTML)) return;
    filters.push(e.target.innerText);
    displayFilters();
    filtersWindowHidden("remove");
    renderData();
  });
  /* clearing all filters */
  clearBtn.addEventListener("click", function () {
    filters = [];
    filtersWindowHidden("add");
    renderData();
  });
  /* removing filters from filters container */
  filtersContainer.addEventListener("click", function (e) {
    if (!e.target.classList.contains("btn-remove")) return;
    filterRemove(e.target.id);
    displayFilters();
    renderData();
  });

  /* FUNCTIONS */
  /* fetching data from json and filtering before render */
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

  const addBorder = function (featuredFlag) {
    let borderClass = "";
    if (featuredFlag) borderClass += `featured-border`;
    return borderClass;
  };

  const checkFlags = function (newFlag, featuredFlag) {
    let flags = "";
    if (newFlag) flags += `<span class="info-new">new!</span>`;
    if (featuredFlag) flags += `<span class="info-featured">featured</span>`;
    return flags;
  };

  const listRequirements = function (languages, tools) {
    const requirements = [...languages, ...tools];
    let reqMarkup = "";
    requirements.forEach(
      (req) => (reqMarkup += `<button class="btn-requirements">${req}</button>`)
    );
    return reqMarkup;
  };

  const displayFilters = function () {
    filtersContainer.innerHTML = "";
    filters.forEach((filter) => generateSingleFilterMarkup(filter));
    if (filters.length === 0) filtersWindowHidden("add");
  };

  const generateSingleFilterMarkup = function (filter) {
    const html = `
  <div class="filter-single">
  <span>${filter}</span>
  <button id="${filter}" class="btn-remove"></button>
  </div>`;
    filtersContainer.insertAdjacentHTML("beforeend", html);
  };

  const filterRemove = function (id) {
    const index = filters.indexOf(id);
    filters.splice(index, 1);
  };

  const filtersWindowHidden = function (command) {
    command === "add"
      ? filtersWindow.classList.add("hidden")
      : filtersWindow.classList.remove("hidden");
  };
};
jobListingApp();
