"""ejecutar con 'python3 urls_largas.py' (con python2 puede que vaya, 
he usado python3 porque es donde tenia instalado el paquete requests)

Esta version igual peta, saca 17000 direcciones (direccion arriba, direccion abajo)"""
import requests
from bs4 import BeautifulSoup

def download(url):
    r = requests.get(url)
    if r.status_code != 200:
        return None
    return r.text
       
if __name__ == '__main__':
    first_url = "https://www.directoalpaladar.com/sitemap_index.xml"
    not_checked_urls = [first_url]
    checked_urls = []
    while len(not_checked_urls) > 0:
        url = not_checked_urls[0]
        not_checked_urls = not_checked_urls[1::]
        if "directoalpaladar.com" in url:
            if url not in checked_urls:
                checked_urls.append(url)
                if url[-4::] == ".xml":
                    info = download(url)
                    if info != None:
                        soup = BeautifulSoup(info, 'lxml')
                        for a in soup.find_all('loc'):
                            not_checked_urls.append(a.get_text())
                    
    if len(checked_urls) > 0:
        o_file = open("urls.txt", 'w')
        for url in checked_urls:
            if url[-4::] != ".xml":
                o_file.write(url+'\n')
        o_file.close()