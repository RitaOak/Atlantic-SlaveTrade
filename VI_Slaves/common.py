import csv


def csv_to_dictlist(filepath):
    # Read the main Voyage data
    dict_list = []
    f = open(filepath, "r")
    # Determine the dialect of the CSV file
    file_dialect = csv.Sniffer().sniff(f.read())
    # Set the file pointer back to the start
    f.seek(0)
    csv_reader = csv.DictReader(f, dialect=file_dialect)
    for line in csv_reader:
        dict_list.append(line)
    # Close the file
    f.close()
    return dict_list