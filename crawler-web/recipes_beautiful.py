import requests
from bs4 import BeautifulSoup
# -*- coding: utf-8 -*-

class web_crawler(object):
    def __init__(self,url):
        self.titulo = ""
        self.instrucciones = ""
        self.dificultad = ""
        self.ingredientes = ""
        self.personas = ""
        self.instrucciones = ""
        self.readWeb(url)
        self.cleanParams()
        print("Receta:")
        print(self.titulo)
        print(self.dificultad)
        print(self.personas)
        print(self.ingredientes)
        print(self.instrucciones)
		
    def readWeb(self,url):
        req = requests.get(url)
        soup = BeautifulSoup(req.text, "lxml")
        self.titulo = soup.h1.string 
        self.instrucciones = soup.findAll("div", {"class": "blob js-post-images-container"})
        self.instrucciones = self.instrucciones[1].get_text()
        self.dificultad = soup.findAll("div", {"class": "asset-recipe-difficulty"})
        mydivs = soup.findAll("div", {"class": "asset-recipe-meta"})
        self.ingredientes = mydivs[0].ul
        self.personas = soup.findAll("div", {"class": "asset-recipe-yield"})

    def cleanParams(self):
        if('Fácil' in self.dificultad[0].string):
            self.dificultad = "Fácil"
        elif("Media" in self.dificultad[0].string):
            self.dificultad = "Media"
        else:
            self.dificultad = "Dificil"
        personasaux = self.personas[0].string.split('Para ')
        personasaux = personasaux[1].split(' ')
        self.personas = personasaux[0]
        
        ingliaux = self.ingredientes.get_text()
        lista = ingliaux.split('\n')
        indice = 0
        keyant = ""
        self.ingredientes = {}
        for aux in lista:
            if(indice != 0):
                if(indice == 2):
                        keyant = aux
                        self.ingredientes[aux] = ""
                        indice = indice + 1
                elif(indice == 3):
                        indice = 0
                        self.ingredientes[keyant] = aux	
                else:
                    indice = indice + 1
            else:
                indice = indice + 1
        instaux = self.instrucciones.split('Con qué acompañar')
        self.instrucciones = instaux[0]		
		
spyder = web_crawler('https://www.directoalpaladar.com/recetas-de-pescados-y-mariscos/salmon-al-horno-con-frutos-secos-la-receta-definitiva')