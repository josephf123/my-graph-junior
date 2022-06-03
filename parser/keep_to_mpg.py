# Still need to add functionality for lists (not sure how I will deal with them in MPG. Will they be their own data type?)

import json
import os

def convert_file(file_path):

    f = open(file_path)

    json_file = json.load(f)

    if "textContent" not in json_file:
        # We are not doing anything if it is a list. Still have to figure that stuff out
        return False

    mpg_json = {
        # Since there is no type in notes, use entry
        "type": "Entry",
        "time-added": json_file["createdTimestampUsec"],
        "time-last-modified": json_file["userEditedTimestampUsec"],
        "title": json_file["title"],
        "pinned": json_file["isPinned"],
        "deleted": json_file["isTrashed"]
    }

    # add textContent. We need to check since lists don't have this attr
    if "textContent" in json_file:
        mpg_json["content"] = json_file["textContent"]

    # add tags
    all_tags = []
    if "labels" in json_file:
        for x in json_file["labels"]:
            print(x)
            all_tags.append(x["name"])

    mpg_json["tags"] = all_tags

    f.close()
    file_name = file_path.rsplit("/", 1)[-1]
    file_name = "mpg_stuff/" + file_name
    new = open(file_name, "w")
    new.write(json.dumps(mpg_json))
    new.close()

    return mpg_json

def convert_all(new_dir, old_dir):
    os.mkdir(new_dir)

    directory = old_dir
    for filename in os.scandir(directory):
        if filename.is_file() and filename.path[-4:] == "json":
            convert_file(filename.path)


convert_all("mpg_stuff", "Takeout/Keep")