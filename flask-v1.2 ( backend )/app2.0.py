import sent2vec
import json
from flask_cors import CORS, cross_origin
import requests
from flask import Flask, jsonify, request
from scipy import spatial
import nltk
nltk.download('punkt')
#from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
# from string import punctuation
import csv
import html2text
from bs4 import BeautifulSoup
import urllib.request
from os import path
import urllib3

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})
a=[]
b=[]
stop_words=[]
desc=[]
with open('./stopwords_list/corpora/stopwords/english', errors='ignore') as txt:
        stop_words = txt.read().splitlines()
        # print(stop_words)

def preprocess_sentence(text):
    
    text = text.replace('/', ' / ')
    text = text.replace('.-', ' .- ')
    text = text.replace('.', ' . ')
    text = text.replace('\'', ' \' ')
    text = text.replace('-', ' - ')
    text = text.lower()

    tokens = [token for token in word_tokenize(text) if token not in stop_words]
    return ' '.join(tokens)

def embeddings(model,text):
    searchsent=[]
    searchsent.clear()
    with open('./new2.csv', errors='ignore') as csv_file:  # read grants file
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader)
        a.clear()
        b.clear()
        desc.clear()

        for row in csv_reader:
            if " " in row[1]:
                a.append(row[1])
                b.append(row[2])
            # desc.append(row[17])
    searchsent.append(model.embed_sentence(preprocess_sentence(text)))
    for i in a:
        searchsent.append(model.embed_sentence(preprocess_sentence(i)))
    return searchsent


@app.route('/getgrants', methods=['GET'])
def display():
    # return 'Flask app is deployed.'
    return 'Version1.2 getgrants'

@app.route('/getgrants', methods=['POST'])
@cross_origin(origin='*')
def list_grant():
    temp= request.json


    c = []
    final=[]
    final.clear()
    model = sent2vec.Sent2vecModel()

    try:
        print('loading model')
        model.load_model('./BioSentVec_PubMed_MIMICIII-bigram_d700_2.bin')
        # model.load_model(contents.data)
    except Exception as e:
        print(e)
    print('model successfully loaded')


    searchsent=embeddings(model,temp["searchSentence"])
    # print(searchsent)
    print("Calculating distance..")
    for i in range(1, len(searchsent)):
      c.append(spatial.distance.cosine(searchsent[0], searchsent[i]))
      final.append({'a':a[i-1],'b':b[i-1],'c':c[i-1]})
    print("Ranking")
    finallist = sorted(final, key=lambda d: d['c'])
    response = jsonify({'finaldata': finallist[:30]})
    print("Sending data..")
    #response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/piinfo', methods=['POST'])
@cross_origin(origin='*')
def pi_information():
    pi_text =""
    temp = request.json
    pi_fname = temp["First_Name"]
    pi_lname = temp["Last_Name"]
    summary = temp["Summary"]
    foas=[]
    with open('./nih_grant_investigators.csv', errors='ignore') as csv_file:  # read pi file
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader)
        final=[]
        final.clear()
        rows=[]
        rows.clear()
        for row in csv_reader:
            if(row[0] == pi_fname and row[1] == pi_lname):
                print("searched")
                pi_id = row[3]
                if row[4] in rows:
                    continue
                rows.append(row[4])
                app_id=row[4].split("-")
                # resource = urllib.request.urlopen('https://grants.nih.gov/grants/guide/'+app_id[0]+'-files/'+ row[4] +'.html')
                # content = resource.read()
                # charset = resource.headers.get_content_charset()
                # content = content.decode(charset)
                if app_id[0]=='pa' or app_id[0]=='par':
                    link='https://grants.nih.gov/grants/guide/pa-files/'+ row[4] +'.html'
                else:
                    link='https://grants.nih.gov/grants/guide/'+app_id[0]+'-files/'+ row[4] +'.html'
                page = requests.get("%s" % link)
                PO=FO=FOA=""
                # print(html2text.html2text(content))
                try:
                    soup = BeautifulSoup(page.content, 'html.parser')
                    D=[]
                    PO = soup.find(text="Participating Organization(s)").find_next()
                    PO = PO.text
                    # print(PO)
                except Exception as e:
                    # print(e)
                    pass
                try:
                    FO = soup.find(text="Funding Opportunity Title").find_next()
                    FO = FO.text
                    print(FO)
                except Exception as e:
                    # print(e)
                    pass
                try:
                    FOA = soup.find(text="Funding Opportunity Announcement (FOA) Number").find_next()
                    FOA = FOA.text
                    # print(FOA)
                except Exception as e:
                    # print(e)
                    pass
                try:
                    for a1 in soup.find_all(text="Section I. Funding Opportunity Description")[-1].find_all_next():
                        if a1.text == "Section II. Award Information" or a1.text == "Funding Instrument":
                            break
                        D.append(a1.text)
                except Exception as e:
                    print(e)
                flag=0
                if len(D)!=0:
                    pi_text = pi_text + ' '.join(D)
                    # print(D)
                    final.append({'PO':PO,'FO':FO,'FOA':FOA,'D':D})
    
    model = sent2vec.Sent2vecModel()
    try:
        print('loading model')
        model.load_model('./BioSentVec_PubMed_MIMICIII-bigram_d700_2.bin')
        # model.load_model(contents.data)
    except Exception as e:
        print(e)
    print('model successfully loaded')
    c=[]
    final2=[]
    final2.clear()
    searchsent=embeddings(model,pi_text)
    print("Calculating distance..")
    for i in range(1, len(searchsent)):
        c.append(spatial.distance.cosine(searchsent[0], searchsent[i]))
        final2.append({'a':a[i-1],'b':b[i-1],'c':c[i-1]})
    print("Ranking")
    finallist = sorted(final2, key=lambda d: d['c'])
    response = jsonify({'finaldata': final,'rankdata': finallist[:30], 'pi_id' : pi_id})
    return response
if __name__ == "__main__":
   app.run(host='0.0.0.0', port=8080)