import { useState } from "react";
import SearchHeader from "../SearchHeader/SearchHeader";
import OpportunityGrid from "../OpportunityGrid/OpportunityGrid";
import { useOpportunity } from "../../contexts/OpportunityContext";
import "./SearchPage.css";

function SearchPage({ apiLoaded }) {
  // Track city, tag, format, skill in searchResults
  const [searchResults, setSearchResults] = useState({
    city: "",
    tag: "",
    format: "",
    skill: "",
  });
  const [smartResults, setSmartResults] = useState([]);
  const { opportunities } = useOpportunity();

  // Unique tags and skills for dropdowns
  const allTags = opportunities
    ? opportunities.flatMap((opp) => (Array.isArray(opp.tags) ? opp.tags : []))
    : [];
  const allSkills = opportunities
    ? opportunities.flatMap((opp) =>
        Array.isArray(opp.skills) ? opp.skills : []
      )
    : [];
  const uniqueTags = Array.from(new Set(allTags)).sort();
  const uniqueSkills = Array.from(new Set(allSkills)).sort();

  // Smart filter includes city, tag, format, skill
  const smartFilter = (recommendations, city) => {
    let filtered = recommendations.filter((opp) => {
      if (!city) return true;
      if (!opp.location) return false;
      return opp.location.toLowerCase().includes(city.toLowerCase());
    });

    if (searchResults.tag) {
      filtered = filtered.filter((opp) =>
        opp.tags?.includes(searchResults.tag)
      );
    }
    if (searchResults.format) {
      filtered = filtered.filter((opp) => {
        if (searchResults.format === "remote") {
          return (
            !opp.location ||
            ["virtual", "online", "remote", "zoom"].some((kw) =>
              opp.location.toLowerCase().includes(kw)
            )
          );
        }
        if (searchResults.format === "in-person") {
          return (
            opp.location &&
            opp.date &&
            !["virtual", "online", "remote", "zoom"].some((kw) =>
              opp.location.toLowerCase().includes(kw)
            )
          );
        }
        if (searchResults.format === "hybrid") {
          return (
            opp.location &&
            !opp.date &&
            !["virtual", "online", "remote", "zoom"].some((kw) =>
              opp.location.toLowerCase().includes(kw)
            )
          );
        }
        return true;
      });
    }
    if (searchResults.skill) {
      filtered = filtered.filter((opp) =>
        opp.skills?.includes(searchResults.skill)
      );
    }

    setSmartResults(filtered);
    setSearchResults((prev) => ({ ...prev, city }));
  };

  // Tag change handler
  const handleTagChange = (tag) => {
    setSearchResults((prev) => {
      const updated = { ...prev, tag };
      let filtered = smartResults.filter((opp) => {
        const cityMatch =
          !updated.city ||
          (opp.location &&
            opp.location.toLowerCase().includes(updated.city.toLowerCase()));
        const tagMatch = !tag || opp.tags?.includes(tag);
        return cityMatch && tagMatch;
      });
      setSmartResults(filtered);
      return updated;
    });
  };

  // Skill change handler
  const handleSkillChange = (skill) => {
    setSearchResults((prev) => {
      const updated = { ...prev, skill };
      let filtered = smartResults.filter((opp) => {
        const skillMatch = !skill || opp.skills?.includes(skill);
        return skillMatch;
      });
      setSmartResults(filtered);
      return updated;
    });
  };

  // Format change handler
  const handleFormatChange = (format) => {
    setSearchResults((prev) => {
      const updated = { ...prev, format };
      let filtered = smartResults.filter((opp) => {
        if (!format || format === "") return true;
        if (format === "remote") {
          return (
            !opp.location ||
            ["virtual", "online", "remote", "zoom"].some((kw) =>
              opp.location.toLowerCase().includes(kw)
            )
          );
        }
        if (format === "in-person") {
          return (
            opp.location &&
            opp.date &&
            !["virtual", "online", "remote", "zoom"].some((kw) =>
              opp.location.toLowerCase().includes(kw)
            )
          );
        }
        if (format === "hybrid") {
          return (
            opp.location &&
            !opp.date &&
            !["virtual", "online", "remote", "zoom"].some((kw) =>
              opp.location.toLowerCase().includes(kw)
            )
          );
        }
        return true;
      });
      setSmartResults(filtered);
      return updated;
    });
  };

  return (
    <div className="search-page">
      <div className="search-page-content">
        <SearchHeader
          onSearch={() => {}}
          tags={uniqueTags}
          selectedTag={searchResults.tag}
          onTagChange={handleTagChange}
          selectedFormat={searchResults.format}
          onFormatChange={handleFormatChange}
          skills={uniqueSkills}
          selectedSkill={searchResults.skill}
          onSkillChange={handleSkillChange}
          onSmartSearch={smartFilter}
          apiLoaded={apiLoaded}
        />
        <OpportunityGrid
          searchResults={searchResults}
          overrideOpportunities={smartResults}
        />
      </div>
    </div>
  );
}

export default SearchPage;
