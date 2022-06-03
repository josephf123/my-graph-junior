import json

f = open("fileName")

json_file = json.load(f)

all_tags_string = ""
for x in json_file.tags:
    all_tags_string += "#" + x + " "
mpg_string = '''
{json_file.type}
---
{json_file.title}
{json_file.text}
-----
{all_tags_string}
--------
'''

#An example of this would be 

# Entry
# ---
# First note
# This note is the first note of all time, the start
# of something great
# -----
# #first #living #cool
# -------