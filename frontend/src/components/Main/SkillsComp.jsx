import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./SkillsComp.css";

const skills = [
  { value: "3ds Max", label: "3ds Max" },
  { value: "AI for Games", label: "AI for Games" },
  { value: "ASP.NET", label: "ASP.NET" },
  { value: "AWS Development", label: "AWS Development" },
  { value: "AWS Operations", label: "AWS Operations" },
  { value: "AWS System Architecture", label: "AWS System Architecture" },
  { value: "Adobe After Effects", label: "Adobe After Effects" },
  { value: "Adobe InDesign", label: "Adobe InDesign" },
  { value: "Adobe Photoshop", label: "Adobe Photoshop" },
  { value: "Adobe Premiere Pro", label: "Adobe Premiere Pro" },
  { value: "Adobe Substance Painter", label: "Adobe Substance Painter" },
  { value: "Affiliate Marketing", label: "Affiliate Marketing" },
  { value: "Agile Principles", label: "Agile Principles" },
  {
    value: "Applicant Tracking Systems(ATS)",
    label: "Applicant Tracking Systems(ATS)",
  },
  { value: "Artificial Intelligence", label: "Artificial Intelligence" },
  { value: "AutoCAD", label: "AutoCAD" },
  { value: "Autodesk Fusion360", label: "Autodesk Fusion360" },
  { value: "Autodesk Inventor", label: "Autodesk Inventor" },
  { value: "Autodesk Maya", label: "Autodesk Maya" },
  { value: "Automatic Software Testing", label: "Automatic Software Testing" },
  { value: "Azure AI", label: "Azure AI" },
  { value: "Business Intelligence", label: "Business Intelligence" },
  { value: "Business Systems", label: "Business Systems" },
  { value: "Business Engagement", label: "Business Engagement" },
  { value: "Business Requirements", label: "Business Requirements" },
  { value: "Cisco", label: "Cisco" },
  { value: "Cybersecurity", label: "Cybersecurity" },
  { value: "Cloud Security", label: "Cloud Security" },
  { value: "Computer Science", label: "Computer Science" },
  { value: "Ethical Hacking", label: "Ethical Hacking" },
  { value: "Figma", label: "Figma" },
  { value: "Financial Modeling", label: "Financial Modeling" },
  { value: "Financial Engineering", label: "Financial Engineering" },
  { value: "Front-end Development", label: "Front-end Development" },
  { value: "Back-end Development", label: "Back-end Development" },
  { value: "GNU/Linux", label: "GNU/Linux" },
  { value: "Game Development", label: "Game Development" },
  { value: "General Business Skills", label: "General Business Skills" },
  { value: "Git", label: "Git" },
  { value: "Graphic Design", label: "Graphic Design" },
  {
    value: "HRIS (Human Resource Information System)",
    label: "HRIS (Human Resource Information System)",
  },
  { value: "Java", label: "Java" },
  { value: "JavaScript", label: "JavaScript" },
  { value: "Jupyter", label: "Jupyter" },
  { value: "M365 Administration", label: "M365 Administration" },
  { value: "Machine Learning", label: "Machine Learning" },
  { value: "Manual Software Testing", label: "Manual Software Testing" },
  { value: "Market Research", label: "Market Research" },
  { value: "Marketing Strategy", label: "Marketing Strategy" },
  {
    value: "Microsoft Cloud Administration",
    label: "Microsoft Cloud Administration",
  },
  { value: "Microsoft Copilot", label: "Microsoft Copilot" },
  { value: "Networks", label: "Networks" },
  { value: "Power BI", label: "Power BI" },
  { value: "Power Platform", label: "Power Platform" },
  { value: "Project Management", label: "Project Management" },
  { value: "PyTorch", label: "PyTorch" },
  { value: "Recruitment", label: "Recruitment" },
  { value: "Responsive Web Design", label: "Responsive Web Design" },
  {
    value: "SEM (Search Engine Marketing)",
    label: "SEM (Search Engine Marketing)",
  },
  { value: "Systems Analysis", label: "Systems Analysis" },
  { value: "Scrum", label: "Scrum" },
  { value: "Social Media Marketing", label: "Social Media Marketing" },
  { value: "Talent Management", label: "Talent Management" },
  { value: "UX/UI Design", label: "UX/UI Design" },
  { value: "Unity", label: "Unity" },
  { value: "Unity 2D Game Development", label: "Unity 2D Game Development" },
  { value: "Unity 3D Game Development", label: "Unity 3D Game Development" },
  { value: "User Research", label: "User Research" },
  { value: "V-Ray", label: "V-Ray" },
  {
    value: "VMware Cloud Management and Automation",
    label: "VMware Cloud Management and Automation",
  },
  {
    value: "VMware Data Center Virtualization",
    label: "VMware Data Center Virtualization",
  },
  { value: "VMware Desktop Management", label: "VMware Desktop Management" },
  {
    value: "VMware Network Virtualization",
    label: "VMware Network Virtualization",
  },
  { value: "WordPress", label: "WordPress" },
  { value: "Workflow Analysis", label: "Workflow Analysis" },
  { value: "Wix", label: "Wix" },
  { value: "React", label: "React" },
  { value: "Node.js", label: "Node.js" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "CSS", label: "CSS" },
  { value: "CSS3", label: "CSS3" },
  { value: "HTML", label: "HTML" },
  { value: "Python", label: "Python" },
  { value: "Django", label: "Django" },
  { value: "Flask", label: "Flask" },
  { value: "Performance Management", label: "Performance Management" },
  { value: "Spring", label: "Spring" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Swift", label: "Swift" },
  { value: "Objective-C", label: "Objective-C" },
  { value: "C++", label: "C++" },
  { value: "C#", label: "C#" },
  { value: "Ruby", label: "Ruby" },
  { value: "Rails", label: "Rails" },
  { value: "SQL", label: "SQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "MySQL", label: "MySQL" },
  { value: "AWS Cloud Adminstration", label: "AWS Cloud Adminstration" },
  { value: "Azure Development", label: "Azure Development" },
  { value: "Azure Infrastructure", label: "Azure Infrastructure" },
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "Express", label: "Express" },
  { value: "Bootstrap", label: "Bootstrap" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Tailwind", label: "Tailwind" },
  { value: "Angular", label: "Angular" },
  { value: "PHP", label: "PHP" },
  { value: "UNIX", label: "UNIX" },
  { value: "Next.js", label: "Next.js" },
];

const sortedSkills = skills.sort((a, b) => a.label.localeCompare(b.label));
const SkillsComp = ({ selectedSkills, handleSkillsChange }) => {
  return (
    <Select
      className="skills-select-job"
      id="skills"
      name="skills"
      isMulti
      value={selectedSkills}
      onChange={handleSkillsChange}
      options={sortedSkills}
      components={makeAnimated()}
      placeholder="Select Skills"
    />
  );
};

export default SkillsComp;
