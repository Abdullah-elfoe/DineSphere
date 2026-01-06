from datetime import datetime, date, time

# Function to convert string to date
def string_to_date(date_string, date_format="%Y-%m-%d"):
    """
    Converts a string to a date object.

    Args:
        date_string (str): The date as a string.
        date_format (str): The format of the input date string. Default is "YYYY-MM-DD".

    Returns:
        datetime.date: The corresponding date object.
    """
    return datetime.strptime(date_string, date_format).date()


# Function to convert string to time
def string_to_time(time_string, time_format="%H:%M:%S"):
    """
    Converts a string to a time object.

    Args:
        time_string (str): The time as a string.
        time_format (str): The format of the input time string. Default is "HH:MM:SS".

    Returns:
        datetime.time: The corresponding time object.
    """
    return datetime.strptime(time_string, time_format).time()



def parse_date_time(date_str, time_str, date_fmt="%Y-%m-%d", time_fmt="%H:%M"):
    """
    Converts separate date and time strings (without seconds) into a datetime object.

    Args:
        date_str (str): Date string, e.g., "2026-01-06"
        time_str (str): Time string, e.g., "14:30"
        date_fmt (str): Format of the date string. Default: "%Y-%m-%d"
        time_fmt (str): Format of the time string. Default: "%H:%M"

    Returns:
        datetime: A datetime object suitable for Django DateTimeField.
    """
    try:
        combined_str = f"{date_str} {time_str}"
        combined_fmt = f"{date_fmt} {time_fmt}"
        return datetime.strptime(combined_str, combined_fmt)
    except ValueError as e:
        raise ValueError(f"Error parsing date/time: {e}")


moye = parse_date_time("2026-01-06", "14:30")
print(moye, type(moye))  # Example usage