from VI_Slaves.common import csv_to_dictlist

voyage_list = csv_to_dictlist("../csv_data/data.csv")
region_list = csv_to_dictlist("../csv_data/regions.csv")

region_names = []
for region in region_list:
    region_names.append(region.get("name"))

nations = set()
regions = set()

for voyage in voyage_list:
    # Check nation
    nation = voyage.get("natinimp", None)
    if nation:
        nations.add(nation)
    else:
        nation = voyage.get("national", None)
        if nation:
            nations.add(nation)
    # Check region
    region_embark = voyage.get("embark_region", None)
    region_disembark = voyage.get("disembark_region", None)
    if region_embark:
        regions.add(region_embark)
    if region_disembark:
        regions.add(region_disembark)

nations = list(nations)
regions = list(regions)
nations.sort()
regions.sort()

with open("nations_list.txt", "w") as f:
    for nation in nations:
        f.write(nation+"\n")


with open("regions_list.txt", "w") as f:
    for region in regions:
        if region not in region_names:
            f.write(region+"\n")