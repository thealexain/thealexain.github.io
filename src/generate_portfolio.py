import json, os, random
from bs4 import BeautifulSoup

# Загружаем данные из JSON
with open('data/data.json', 'r', encoding='utf-8') as f:
    works = json.load(f)
    
with open('data/languages.json', 'r', encoding='utf-8') as f:
    langs = json.load(f)
    
with open('src/html/portfolio_rus.html', 'r', encoding='utf-8') as f:
    soupMain = BeautifulSoup(f.read(), 'html.parser')
    
container = soupMain.find('div', {'id': "Works"})

def hex_to_rgb(hex_color):
    """Конвертирует HEX в RGB (0-255)."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(rgb_color):
    """Конвертирует RGB (0-255) в HEX."""
    return '#{:02x}{:02x}{:02x}'.format(*rgb_color)

def multiply_blend(base, blend):
    """Режим наложения 'Умножение'."""
    return tuple(int(b * m / 255) for b, m in zip(base, blend))

def apply_blend_with_opacity(base, blend, opacity=0.5):
    """Наложение цвета с прозрачностью."""
    blended = multiply_blend(base, blend)
    return tuple(int(b * (1 - opacity) + bl * opacity) for b, bl in zip(base, blended))

# Исходные цвета
def FindColor(color, notDark = False):
    random_color = hex_to_rgb(color)
    intermediate_color = apply_blend_with_opacity(random_color, hex_to_rgb('C0C0C0'), 0.5)
    final_color = apply_blend_with_opacity(intermediate_color, hex_to_rgb('171717'), 0.5)
    if notDark:
        return intermediate_color
    else:
        return final_color

code = """<div class="PortfolioWork HoveringItem" square style="--bg_c1: #35A8EF; --bg_c2: #0070BC; --colorAccent: #ffffff; --colorAccent2: var(--black); --HIScale: 1.01;">
                        <a href="" class="PWLink">
                            <div class="PWBackground">
                            </div>

                            <div class="PWNoise"></div>
                            <div class="PWDarker"></div>

                            <div class="PWForeground">
                            </div>

                            <div class="PWText DrukCyr">
                                <p class="Category">Категория</p>
                                <p class="NoCaps Italic PWName">Название</p>
                            </div>
                        </a>
                </div>"""

def CreatePortfolio():
    for i in works:
        if "notWork" in works[i]:
            continue
        card_soup = BeautifulSoup(code, 'html.parser')
        card = card_soup.find('div', {"class": "PortfolioWork"})
        
        card.find("p", {"class": "Category"}).string = langs[f"Category{str(works[i]['category']).capitalize()}"][0]
        card.find("p", {"class": "Category"})["data-lang"] = "Category" + str(works[i]['category']).capitalize()
        card.find("p", {"class": "PWName"}).string = works[i]['name']
        card.find("a", {"class": "PWLink"})['href'] = f"{i}.html"
        
        card['style'] = f"--bg_c1: {works[i]['back']['color1']}; --bg_c2: {works[i]['back']['color2']}; --colorAccent: {works[i]['back']['color3']}; --HIScale: 1.01;"
        if "notDark" in works[i]:
                if works[i]['notDark'] == True:
                    card.find("div", {"class": "PWDarker"}).decompose()
                    card.find("div", {"class": "PWNoise"}).decompose()
                    card['style'] += f"--colorAccent2: {works[i]['back']['color1']}"
                    
        else: 
            card['style'] += f"--colorAccent2: rgb{FindColor(works[i]['back']['color1'])}"
            
        if works[i]['image'] == 'svg':
            with open(f'data/svgs/{i}.txt', 'r') as f:
                card.find("div", {"class": "PWForeground"}).append(BeautifulSoup(f.read(), 'html.parser'))
                
            if "styleImage" in works[i]:
                card.select_one("div.PWForeground > *")["style"] = works[i]["styleImage"]
                
        if works[i]['image'] == 'img':
            card.find("div", {"class": "PWForeground"}).append(soupMain.new_tag("img", attrs={"src": f"../../img/logo/{i}.png"}))
                
        for n in range(len(works[i]['back']['map'])):
            card.find("div", {"class": "PWBackground"}).append(soupMain.new_tag("div", attrs={
                "class": f"{str(works[i]['back']['map'][n]).capitalize()}", 
                f"{'topLeft' if n == 0 else 'topRight' if n == 1 else 'bottomLeft' if n == 2 else 'bottomRight'}": ""}) if str(works[i]['back']['map'][n]) != "" else "")
        
        container.append(card)
        
    with open(f'src/html/PORTFOLIO.html', 'w+') as f:
            f.write(str(soupMain))
            print(f"Done! PORTFOLIO.html created!")
        
            
CreatePortfolio()