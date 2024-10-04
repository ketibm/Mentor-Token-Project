import React, { useState, useEffect } from "react";
import ApexCharts from "react-apexcharts";

const StatisticsComp = () => {
  const currentUserId = localStorage.getItem("currentUserId");
  const currentUserRole = localStorage.getItem("currentUserRole");

  const [chartData, setChartData] = useState({
    series: [{ name: "Jobs Completed", data: [] }],
    options: {
      chart: { type: "line", height: 350 },
      xaxis: { categories: [], title: { text: "Month" } },
      yaxis: { title: { text: "Number of Completed Jobs" } },
      tooltip: { enabled: true, shared: true },
      colors: ["rgba(105, 108, 255, 0.75)"],
    },
  });
  useEffect(() => {
    const fetchApplicationsData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/apps", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const applicationsData = await response.json();

        let finishedJobs;
        if (currentUserRole === "mentor") {
          finishedJobs = applicationsData.filter(
            (app) =>
              app.acceptedStatus === "DONE" &&
              app.mentorId._id === currentUserId
          );
        } else if (currentUserRole === "startup") {
          finishedJobs = applicationsData.filter(
            (app) => app.acceptedStatus === "DONE"
          );
        }
        console.log("Finished jobs:", finishedJobs);
        if (finishedJobs.length === 0) {
          console.log("No jobs with status DONE were found.");
        }

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const currentYear = new Date().getFullYear();
        const dataMap = monthNames.reduce((acc, month) => {
          acc[`${month}-${currentYear}`] = 0;
          return acc;
        }, {});

        monthNames.forEach((month) => {
          dataMap[`${month}-${currentYear}`] = 0;
        });

        finishedJobs.forEach((job) => {
          const dateStr = job.date || new Date();

          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              const month = monthNames[date.getMonth()];
              const key = `${month}-${currentYear}`;
              dataMap[key]++;
            }
          }
        });

        const categories = Object.keys(dataMap);
        const data = Object.values(dataMap);

        setChartData((prevChartData) => ({
          ...prevChartData,
          series: [
            {
              name: "Jobs Completed",
              data: data,
            },
          ],
          options: {
            ...prevChartData.options,
            xaxis: {
              ...prevChartData.options.xaxis,
              categories: categories,
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    };

    fetchApplicationsData();
  }, [currentUserId, currentUserRole]);

  return (
    <div className="statistics-chart">
      <h3>STATISTICS</h3>
      <p>Overall target accomplishment over the year</p>
      <ApexCharts
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={180}
      />
    </div>
  );
};

export default StatisticsComp;
