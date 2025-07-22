import json
import re
from datetime import datetime

def parse_date_time(date_str, time_str):
    """
    Parse the date and time strings from the JSON and return ISO format datetime string (YYYY-MM-DDTHH:MM:SS).
    Handles single dates and date ranges (takes start date and start time).
    Returns None if date cannot be parsed.
    """
    if not date_str or "schedule" in date_str.lower():
        return None
    # Check for date range separated by '-'
    if '-' in date_str:
        parts = date_str.split('-')
        start_date_str = parts[0].strip()
    else:
        start_date_str = date_str.strip()
    # Parse date part
    dt_date = None
    for fmt in ("%a %b %d, %Y", "%b %d, %Y", "%B %d, %Y"):
        try:
            dt_date = datetime.strptime(start_date_str, fmt).date()
            break
        except ValueError:
            continue
    if dt_date is None:
        return None
    # Parse time part (take start time if range)
    dt_time = None
    if time_str:
        time_part = time_str.split('-')[0].strip()
        # Try parsing time with AM/PM
        for time_fmt in ("%I:%M %p", "%I %p"):
            try:
                dt_time = datetime.strptime(time_part, time_fmt).time()
                break
            except ValueError:
                continue
    if dt_time is None:
        # Default to midnight if no time or unparseable
        dt_time = datetime.min.time()
    # Combine date and time
    dt_combined = datetime.combine(dt_date, dt_time)
    return dt_combined.isoformat()

def append_date_time_to_description(description, date_str, time_str):
    """
    Append the date and time information to the description string.
    """
    if date_str and "schedule" in date_str.lower():
        # Just append the date_str text without brackets
        if date_str not in description:
            description += " " + date_str
        return description

    parts = []
    if date_str:
        parts.append(f"Date: {date_str}")
    if time_str:
        parts.append(f"Time: {time_str}")
    if parts:
        appended_text = " [" + ", ".join(parts) + "]"
        if appended_text not in description:
            description += appended_text
    return description

def main():
    input_file = "/Users/aisinkaye/codepath/VolunteerGo/VolunteerAPI/opp_scraper/opp_scraper/opportunity.json"
    output_file = "/Users/aisinkaye/codepath/VolunteerGo/VolunteerAPI/opp_scraper/opp_scraper/opportunity_updated.json"

    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    for opportunity in data:
        when = opportunity.get("when", {})
        date_str = when.get("date", "")
        time_str = when.get("time", "")

        iso_date = parse_date_time(date_str, time_str)
        opportunity["date"] = iso_date

        # Append date and time to description
        description = opportunity.get("description", "")
        updated_description = append_date_time_to_description(description, date_str, time_str)
        opportunity["description"] = updated_description

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Updated opportunities saved to {output_file}")

if __name__ == "__main__":
    main()
