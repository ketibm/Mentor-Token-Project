import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JobPopup from "../Popup/JobPopup";
import "./SearchComp.css";

const SearchComp = ({ img, placeholder, onFilteredData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [currentUserRole, setCurrentUserRole] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const role = localStorage.getItem("currentUserRole") || "";
        setCurrentUserRole(role);

        const [usersResponse, jobsResponse] = await Promise.all([
          fetch("http://localhost:8000/api/users", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              "Content-Type": "application/json",
            },
          }),
          fetch("http://localhost:8000/api/jobs", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        if (!usersResponse.ok || !jobsResponse.ok) {
          throw new Error("Error fetching data");
        }

        const users = await usersResponse.json();
        const jobs = await jobsResponse.json();

        setData([
          ...users.map((user) => ({
            ...user,
            type: user.role === "mentor" ? "mentor" : "user",
          })),
          ...jobs.map((job) => ({ ...job, type: "job" })),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = (data || []).filter((item) => {
    if (currentUserRole === "startup") {
      return (
        item.type === "mentor" &&
        item.name?.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
    }
    if (currentUserRole === "mentor" && item.type === "job" && item.title) {
      return (
        item.title.toLowerCase().startsWith(searchTerm.toLowerCase()) &&
        item.status === "Open"
      );
    }
    return false;
  });

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (onFilteredData && typeof onFilteredData === "function") {
      onFilteredData(filteredData);
    }
  };

  const handleItemClick = (item) => {
    setSearchTerm("");
    onFilteredData([]);

    if (item.type === "job") {
      setSelectedJob(item);
      setPopupVisible(true);
    } else if (item.type === "mentor" && currentUserRole === "startup") {
      navigate(`/mentor/${item._id}`);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedJob(null);
  };

  return (
    <div className="search-bar">
      <img src={img} alt="Search Icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleInputChange}
      />
      {searchTerm && (
        <div className="search-results">
          {filteredData.map((item, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleItemClick(item)}
            >
              {item.type === "job" ? item.title : item.name}
            </div>
          ))}
        </div>
      )}
      {popupVisible && selectedJob && (
        <JobPopup
          jobId={selectedJob._id}
          job={selectedJob}
          onClose={handleClosePopup}
          showApplyButton={true}
          appliedMentors={selectedJob.appliedMentors || []}
          companyId={selectedJob.companyId}
          companyImage={
            selectedJob.companyId.profileImage
              ? `http://localhost:8000/${selectedJob.companyId.profileImage}`
              : "/path/to/default/image.jpg"
          }
          incrementAppliedJobs={() => {}}
          isInPopup={true}
        />
      )}
    </div>
  );
};

export default SearchComp;
