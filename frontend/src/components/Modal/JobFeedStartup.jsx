import React, { useState, useEffect } from "react";
import filter from "../../assets/DashAssets/filter.svg";
import sort from "../../assets/DashAssets/sort.svg";
import triangleIcon from "../../assets/DashAssets/triangleIcon.svg";
import "./JobFeedStartup.css";

const JobFeedStartup = ({
  setSortedOrder,
  setCategory,
  setFilter,
  companyList,
}) => {
  const [sortOrder, setSortOrderState] = useState("a-z");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [companySearch, setCompanySearch] = useState("");
  const [companies, setCompanies] = useState("");
  const [jobs, setJobs] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const response = await fetch("http://localhost:8000/api/jobs", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAllJobs(data);

      const uniqueCompanies = Array.from(
        new Set(data.map((job) => job.companyId.name))
      ).map((name) => ({
        name,
        id: data.find((job) => job.companyId.name === name).companyId._id,
      }));

      setCompanies(uniqueCompanies);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let newFilteredJobs = jobs;

    if (selectedCompany) {
      newFilteredJobs = newFilteredJobs.filter(
        (job) => job.companyId._id === selectedCompany
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      newFilteredJobs = newFilteredJobs.filter(
        (job) =>
          job.category &&
          job.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredJobs(newFilteredJobs);
  }, [selectedCompany, selectedCategory, jobs]);

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    console.log("New sort order selected:", newSortOrder);
    setSortedOrder(newSortOrder);
    setSortOrderState(newSortOrder);
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setCategory(newCategory);
  };

  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    setSelectedFilter(newFilter);
    setSelectedCompany(newFilter);
    setFilter(newFilter);
  };

  const handleCompanySelect = (companyId) => {
    setSelectedCompany(companyId);
    setShowDropdown(false);
    setFilter(companyId);
  };

  const handleCompanySearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setCompanySearch(searchValue);

    const filteredComp = companyList.filter((company) =>
      company.name.toLowerCase().includes(searchValue)
    );

    setFilteredCompanies(filteredComp);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const filteredComp = companyList.filter((company) =>
    company.name.toLowerCase().includes(companySearch.toLowerCase())
  );
  return (
    <div className="jobFeedStartup-container">
      <h1>Your Startup Jobs</h1>
      <div className="filters-container">
        {/* <div className="sort-select-container"> */}
        <div className="sort-container_left">
          <div className="sort-container">
            <label htmlFor="sort" className="sort-label">
              Sort by:
            </label>
            <div className="select-wrapper">
              <select
                id="sort"
                value={sortOrder}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="a-z">Job Title (A-Z)</option>
                <option value="z-a">Job Title (Z-A)</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <img src={triangleIcon} alt="icon" className="triangle-icon" />
            </div>
          </div>
          <div className="sort-container">
            <label htmlFor="category" className="sort-label">
              Category:
            </label>
            <div className="select-wrapper">
              <select
                id="category"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="sort-select"
              >
                <option value="all">All Categories</option>
                <option value="it">IT</option>
                <option value="management">Management</option>
                <option value="marketing">Marketing</option>
                <option value="finance">Finance</option>
                <option value="hr">HR</option>
              </select>
              <img src={triangleIcon} alt="icon" className="triangle-icon" />
            </div>
          </div>
        </div>
        <div className="sort-container_right">
          <div className="sort-container_filter">
            <img
              src={filter}
              alt="filter"
              className="filter"
              onClick={toggleDropdown}
            />
            <label
              htmlFor="filter"
              className="sort-label"
              onClick={toggleDropdown}
            >
              Filters
            </label>
            <div className="select-wrapper">
              <select
                id="filter"
                value={selectedFilter}
                onChange={handleFilterChange}
                className="sort-select"
              >
                <option value="all"></option>
                {filteredCompanies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="company-search-container">
            {showDropdown && (
              <ul>
                {filteredComp.map((company) => (
                  <li
                    key={company.id}
                    onClick={() => handleCompanySearch(company.id)}
                  >
                    {company.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <img src={sort} alt="sort" className="sort" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobFeedStartup;
