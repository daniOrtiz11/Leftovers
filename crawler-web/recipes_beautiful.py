import requests
import pymysql

from bs4 import BeautifulSoup
# -*- coding: utf-8 -*-

class web_crawler(object):
    def __init__(self):
        with open("urls.txt") as fichero:
            self.idR = 1
            for linea in fichero:
               self.titulo = ""
               self.instrucciones = ""
               self.dificultad = ""
               self.ingredientes = ""
               self.personas = ""
               self.instrucciones = ""
               self.tiempo = ""
               self.valida = False
               self.readWeb(linea)
               if(self.valida == True):
                   self.cleanParams()
                   self.insertReceta()
		
    def readWeb(self,url):
        req = requests.get(url)
        soup = BeautifulSoup(req.text, "lxml")
        self.titulo = soup.h1.string 
        self.instrucciones = soup.findAll("div", {"class": "blob js-post-images-container"})
        self.tiempo = soup.findAll("li", {"class": "asset-recipe-list-item m-is-totaltime"})
        longt = len(self.tiempo)
        if(longt > 0):
            self.valida = True
            self.tiempo = self.tiempo[0].get_text()
            self.instrucciones = self.instrucciones[1].get_text()
            self.dificultad = soup.findAll("div", {"class": "asset-recipe-difficulty"})
            mydivs = soup.findAll("div", {"class": "asset-recipe-meta"})
            self.ingredientes = mydivs[0].ul
            self.personas = soup.findAll("div", {"class": "asset-recipe-yield"})
        else:
            self.valida = False
		
    def cleanParams(self):
        times = self.tiempo.split('\n')
        self.tiempo = times[2]
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
                        if(aux != ''):
                            indice = 0
                            self.ingredientes[keyant] = aux	
                        else:
                            indice = 1
                            self.ingredientes[keyant] = 1	
                else:
                    indice = indice + 1
            else:
                indice = indice + 1
        instaux = self.instrucciones.split('Con qué acompañar')
        self.instrucciones = instaux[0]

    def insertReceta(self):
        connection = pymysql.connect(host='localhost',
                             user='root',
                             password='',
                             db='leftovers',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
        try:
            with connection.cursor() as cursor:
                sql = "INSERT INTO `recetas` (`id`,`titulo`, `npersonas`, `tiempo`, `dificultad`, `instrucciones`) VALUES (%s, %s, %s, %s, %s, %s )"
                cursor.execute(sql, (self.idR, self.titulo, self.personas, self.tiempo ,self.dificultad, self.instrucciones))
            connection.commit()
            
            with connection.cursor() as cursor:
                for k,v in self.ingredientes.items():
                    sql = "INSERT INTO `ingredientes` (`nombre`, `idreceta`, `cantidad`) VALUES (%s, %s, %s)"
                    cursor.execute(sql, (k, self.idR, v))
            connection.commit()

        finally:
            connection.close()

        self.idR = self.idR + 1			
		
spyder = web_crawler()