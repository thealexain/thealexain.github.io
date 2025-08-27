import json, os
from bs4 import BeautifulSoup

# Загружаем данные из JSON
with open('data/data.json', 'r', encoding='utf-8') as f:
    works = json.load(f)
    
with open('src/html/reviews_rus.html', 'r', encoding='utf-8') as f:
    soupMain = BeautifulSoup(f.read(), 'html.parser')
    
container = soupMain.find('div', {'id': "Information"})

code = """<div class="ReviewBlock Inverted">
                    <div class="RBHeader">
                        <p class="DrukCyr Category" data-lang="CategoryCompany">Компания</p>
                        <p class="HoveringItem" id="JSTitle"><a href="" class="Link2 DrukCyr NoCaps Seventy">FluidPrompter</a></p>
                    </div>
                    <div class="OktaNeue TFFont Italic RBText">
                        <p class="Secondary NoSelect" id="JSTranslated" data-lang="ReviewTranslated" data-id="">(перевод с англ.)</p>
                        <p class="JustifyFont" id="JSText" data-inf="review" data-id="">Русский отзыв</p>
                    </div>
                </div>"""
                
for i in works:
    if "review" not in works[i]:
        continue
    
    
    card_soup = BeautifulSoup(code, 'html.parser')
    card = card_soup.find('div', {"class": "ReviewBlock"})
    card.find("p", {"id": "JSText"})["data-id"] = i
    card.find("p", {"id": "JSTranslated"})["data-id"] = i

    card.find("p", {"id": "JSText"}).string = works[i]['review']
    
    if "company" not in works[i]:
        card.find("p", {"class": "Category"}).decompose()
            
    # if "back" in works[i]:
    #     card["class"].remove("Inverted")
    #     card["class"] = ["ReviewBlock", "ColorAccent"]
    #     card["style"] = f"--colorAccent: {works[i]['back']['color3']}; --colorAccent2: {works[i]['back']['color1']};"
    #     if "inverted" in works[i]["back"]:
    #         card["style"] = f"--colorAccent: {works[i]['back']['color1']}; --colorAccent2: {works[i]['back']['color3']};"
    #     if "color4" in works[i]["back"]:
    #         card["style"] += f" --colorAccent3: {works[i]['back']['color4']};"
    #     if "notBlend" in works[i]["back"]:
    #         card["notBlend"] = ""
        
    # else:
    #     card["class"] = ["ReviewBlock", "Inverted"]
            
    card.select_one("#JSTitle > a").string = works[i]['name']
    
    if f'{i}.html' in os.listdir('src/html/'):
        card.select_one("#JSTitle > a")["href"] = f"{i}.html"
    else:
        card.find("p", {"id": "JSTitle"})['class'].remove('HoveringItem')
        card.select_one("#JSTitle > a")['class'].append('NoUnderline')
        
    container.append(card)
    print(f"Added {i}")
    
with open(f'src/html/REVIEWS.html', 'w+') as f:
        f.write(str(soupMain))
        print(f"Done! REVIEWS.html created!")
    