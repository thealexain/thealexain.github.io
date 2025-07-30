import json
import os
from bs4 import BeautifulSoup

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


def CreateFiles(work = ''):
    with open('data/languages.json', 'r', encoding='utf-8') as f:
        langs = json.load(f)
    
    # Загружаем данные из JSON
    
    with open('data/data.json', 'r', encoding='utf-8') as f:
        works = json.load(f)
        
    with open('src/templates/template_work_rus.html', 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
        
    soupC = None
        
    for i in works:
        SRBlock = True
        if "notWork" in works[i]:
            continue
        
        if work in works:
            i = work
        soupC = soup.__copy__()
        soupC.find("title").string = works[i]['name'] + " Алексайн"
        soupC.find("p", {"id": "JSName"}).string = works[i]['name']
        
        soupC.find("p", {"id": "JSCategory"}).string = langs[f"Category{str(works[i]['category']).capitalize()}"][0]
        soupC.find("p", {"id": "JSCategory"})["data-lang"] = "Category" + str(works[i]['category']).capitalize()
        
        soupC.find("p", {"id": "JSDescription"}).string = works[i]['description']
        if "task" in works[i]:
            soupC.find("p", {"id": "JSTask"}).string = works[i]['task']
        else:
            soupC.find("p", {"id": "JSTask"}).find_parent('div', {"class": ["ReviewBlock"]}).decompose()
            
        if "review" not in works[i]:
            if "solution" not in works[i]:
                SRBlock = False
                soupC.find("p", {"id": "RBSolutionName"}).find_parent("div", {"class": ["ReviewBlock"]}).decompose()
        
        if SRBlock:
            if "solution" in works[i]:
                soupC.find("p", {"id": "JSSolution"}).string = works[i]['solution']
            else:
                # soupC.find("p", {"id": "JSSolution"}).find_parent('div', {"class": ["ReviewBlock"]}).decompose()
                    soupC.find("p", {"id": "JSSolution"}).find_parent('div', {"class": ["RBText"]}).decompose()
                    soupC.find("p", {"id": "RBSolutionName"}).decompose()
                    
            if "review" in works[i]:
                if SRBlock:
                    soupC.find("p", {"id": "JSReview"}).string = works[i]['review']
                    
                    soupC.select_one(".RBHeader a.Link2")["href"] = f"REVIEWS.html#{i}"
                        
                    if "reviewEng" in works[i]:
                        soupC.find("p", {"id": "JSReviewTranslated"}).string = works[i]['reviewEng']
                        soupC.find("p", {"id": "JSTranslatedRussian"}).decompose()
                    else:
                        soupC.find("p", {"id": "JSReviewTranslated"}).string = works[i]["review"]
                        soupC.find("p", {"id": "JSTranslatedRussian"}).decompose()
            else:
                soupC.find("p", {"id": "JSReview"}).find_parent("div", {"class": ["ReviewBlock"]}).select_one(".RBHeader > a").find_parent("p").decompose()
                soupC.find("p", {"id": "JSReview"}).find_parent("div", {"class": ["RBText"]}).decompose()
                
            if 'translated' not in works[i]:
                if "review" in works[i]:
                    soupC.find("p", {"id": "JSTranslated"}).decompose() # установка параметра в отзыве переведено ли
                
        soupC.find("p", {"id": "JSProcess"}).string = works[i]['workProcess']['text']
        
        if "notDark" in works[i]:
            if works[i]['notDark'] == True:
                soupC.find("div", {"id": "Darker"}).decompose();
                soupC.find("div", {"id": "Noise"}).decompose();
                soupC.find("body")["style"] = f"--colorAccent: {works[i]['back']['color3']}; --colorAccent2: {works[i]['back']['color1']}"
            
        else: 
            soupC.find("body")["style"] = f"--colorAccent: {works[i]['back']['color3']}; --colorAccent2: rgb{FindColor(works[i]['back']['color1'])}"
            
        
        if "gallery" in works[i]: # работа с галерей
            map = works[i]['gallery']['map']
            img = []
            if 'image' in works[i]['gallery']:
                img = works[i]['gallery']['image']
                
            
            if sum(map) <= 6.5: 
                for n in range(len(map)):
                    s = soup.new_tag("div", attrs={"data-lang": "WorksShowAttributeContent", "class": ["GalleryBlock", "HoveringItem"], "data-content": "Посмотреть в полном разрешении", "onclick": "openFullscreen(this)"});
                    if img != []:
                        if len(img) == len(map):
                            if img[n] != "":
                                s["style"] = f"--backUrl: url(../../img/works/{i}/{img[n]}.png);"
                            else:
                                s["none"] = ""
                                
                    if map[n] == 1:
                        s["square"] = ""
                        soupC.find("div", {"id": "Gallery"}).append(s)
                        
                    elif map[n] == 2:
                        s["horizontal"] = ""
                        soupC.find("div", {"id": "Gallery"}).append(s)
                    elif map[n] == 1.5:
                        s["vertical"] = ""
                        soupC.find("div", {"id": "Gallery"}).append(s)
            else:
                break
            
        else: 
            soupC.find("div", {"id": "Gallery"}).decompose() #удалить если нету галереи в параметрах
        
        soupC.find("div", {"id": "Main"})['style'] = f"--bg_c1: {works[i]['back']['color1']}; --bg_c2: {works[i]['back']['color2']};"
        for n in range(len(works[i]['back']['map'])):
            soupC.find("div", {"id": "Back"}).append(soup.new_tag("div", attrs={
                "class": f"{str(works[i]['back']['map'][n]).capitalize()}", 
                f"{'topLeft' if n == 0 else 'topRight' if n == 1 else 'bottomLeft' if n == 2 else 'bottomRight'}": ""}) if str(works[i]['back']['map'][n]) != "" else "")
        
        for app in list(set(['figma', 'ai', 'ae', 'ps']) - set(works[i]['workProcess']['apps'])):
            soupC.find("div", {"id": app}).decompose()
            
        button = soupC.find("button", {"id": "JSLink"})
        link = works[i].get('link', '')

        if link:
            button['href'] = link
        else:
            button['class'].append('Disabled')
            
        if 'video' in works[i]['workProcess']:
            soupC.find("button", {"id": "JSVideo"})['href'] = works[i]['workProcess']['video']
        else:
            soupC.find("button", {"id": "JSVideo"})['class'].append('Disabled')
            
        if works[i]['image'] == 'svg':
            with open(f'data/svgs/{i}.txt', 'r') as f:
                soupC.find("div", {"id": "MainLogo"}).append(BeautifulSoup(f.read(), 'html.parser'))
            
            if "styleImage" in works[i]:
                # soupC.find("div", {"id": "MainLogo"})["style"] = works[i]["styleImage"]
                soupC.select_one("div#MainLogo > *")["style"] = works[i]["styleImage"]
                
        elif works[i]['image'] == 'img':
            soupC.find("div", {"id": "MainLogo"}).append(soupC.new_tag("img", attrs={"src": f"../../img/logo/{i}.png"}))
        
        if "effects" in works[i]:
            if "horizontal" in works[i]['effects']:
                soupC.find("div", {"id": "MainLogo"})['class'].append("horizontal")
        
        with open(f'src/html/{i}.html', 'w+') as f:
            f.write(str(soupC))
            print(f"Done! {i}.html created!")
            
        if i == work:
            break
    
CreateFiles()