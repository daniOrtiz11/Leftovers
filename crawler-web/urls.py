import requests, sys, os

from xml.dom import minidom

def download(url):
    r = requests.get(url)
    if r.status_code != 200:
        print("Error al leer la url")
        return None
    return r.text

def get_url(line):
    splitted = line.split('>')
    for a in splitted:
        if "http" in a:
            return(a.split('<')[0])
       
if __name__ == '__main__':
    url = "https://www.directoalpaladar.com/sitemap_index.xml"
    info = download(url)
    if info != None:
        #o_file = open("exit.txt", 'w')
        lines = info.split('\n')
        urls = []
        for a in lines:
            if "postres" in a or "/recetas-" in a:
                urls.append(get_url(a))
        print(urls)
        o_file = open("urls.txt", 'w')
        for url in urls:
            info = download(url)
            splitted = info.split()
            for a in splitted:
                if "href" in a:
                    o_file.write(a[6:-1]+'\n')
        o_file.close()