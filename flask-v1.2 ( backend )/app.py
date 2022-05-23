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
from bs4 import BeautifulSoup
import urllib.request
from os import path
import urllib3

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "*"}})


@app.route('/getgrants', methods=['GET'])
def display():
    # return 'Flask app is deployed.'
    return 'Version1.2 getgrants'

@app.route('/getgrants', methods=['POST'])
@cross_origin(origin='*')
def list_grant():
    temp= request.json
    searchsent = []
    searchsent.append(temp["searchSentence"])
    #stop_words = set(stopwords.words('english'))
    with open('./stopwords_list/corpora/stopwords/english', errors='ignore') as txt:
        stop_words = txt.read().splitlines()
        print(stop_words)

    def report(count, blockSize, totalSize):
        percent = int(count*blockSize*100/totalSize)
        if percent%10==0:
            print(str(percent) + '% complete', flush=True)    

    def preprocess_sentence(text):
        text = text.replace('/', ' / ')
        text = text.replace('.-', ' .- ')
        text = text.replace('.', ' . ')
        text = text.replace('\'', ' \' ')
        text = text.lower()

        tokens = [token for token in word_tokenize(text) if token not in stop_words]
        return ' '.join(tokens)

    a = []
    b = []
    c = []
    final=[]

    model = sent2vec.Sent2vecModel()
    # if(path.exists('./BioSentVecModelFile.bin')==False):
    #     print('downloading...')
    #     urllib.request.urlretrieve("https://ftp.ncbi.nlm.nih.gov/pub/lu/Suppl/BioSentVec/BioSentVec_PubMed_MIMICIII-bigram_d700.bin", "BioSentVecModelFile.bin", reporthook=report)
    #     print('downloaded')
    # http = urllib3.PoolManager()

    # url = 'https://ftp.ncbi.nlm.nih.gov/pub/lu/Suppl/BioSentVec/BioSentVec_PubMed_MIMICIII-bigram_d700.bin'

    # contents = http.request('GET', url)
    try:
        print('loading model')
        model.load_model('./BioSentVec_PubMed_MIMICIII-bigram_d700_2.bin')
        # model.load_model(contents.data)
    except Exception as e:
        print(e)
    print('model successfully loaded')


    with open('./new2.csv', errors='ignore') as csv_file:  # read grants file
        csv_reader = csv.reader(csv_file, delimiter=',')
        next(csv_reader)
        c = []
        for row in csv_reader:
            a.append(row[1])
            b.append(row[2])
    searchsent[0] = model.embed_sentence(preprocess_sentence(searchsent[0]))
    for i in a:
        searchsent.append(model.embed_sentence(preprocess_sentence(i)))

    print("Calculating distance..")
    # vectorizer = Vectorizer()
    # vectorizer.run(searchsent)
    # vectors_bert = vectorizer.vectors
    for i in range(1, len(searchsent)):
      c.append(spatial.distance.cosine(searchsent[0], searchsent[i]))
      final.append({'a':a[i-1],'b':b[i-1],'c':c[i-1]})
    print("Ranking")
    finallist = sorted(final, key=lambda d: d['c'])
    response = jsonify({'finaldata': finallist[:30]})
    print("Sending data..")
    #response.headers.add("Access-Control-Allow-Origin", "*")
    return response

# @app.route('/piinfo', methods=['POST'])
# def pi_information():
#     temp = request.json
    #
    # # type 2 and type 3 works the best
    # def type1(soup, g):
    #     for a1 in soup.find(text="Purpose").find_all_next():
    #         description = a1.text
    #         if a1.text == "Section II. Award Information" or a1.text == "Funding Instrument":
    #             break
    #     p = a1.text
    #     return p
    #
    # def type2(soup, g):
    #     td = []
    #     for td in soup.find(text='Section I. Funding Opportunity Description').parent.find_next_siblings():
    #
    #         description = td.text
    #
    #         if td.text == "Section II. Award Information" or td.text == "Funding Instrument":
    #             break
    #     p = td.text
    #     return p
    #
    # def type3(soup, g):
    #     for a1 in soup.find("h2", class_="heading2", text="Section I. Funding Opportunity Description").find_all_next():
    #         description = a1.text
    #         f.write(b)
    #         if a1.text == "Section II. Award Information" or a1.text == "Funding Instrument":
    #             break
    #
    #
    # with open('./nih_grant_investigators.csv', errors='ignore') as csv_file:  # read grants file
    #     csv_reader = csv.reader(csv_file, delimiter=',')
    #     next(csv_reader)
    #     app_ids = []
    #
    #     for row in csv_reader:
    #         if row[0] == temp["f_name"] and row[1] == temp["l_name"]:
    #             pi_id = row[3]
    #             app_ids.append(row[4])
    #             type_of_grant = row[4].split("-")
    #             page = 'https://grants.nih.gov/grants/guide/' + type_of_grant[0] + '-files/' + row[4] + '.html'
    #             page = requests.get("%s" % page)
    #             soup = BeautifulSoup(page.content, 'html.parser')
    #
    #             try:
    #                 p = type3(soup, row[4])
    #             except(AttributeError, UnicodeEncodeError) as e:
    #                 try:
    #                     p = type2(soup, row[4])
    #                 except(AttributeError, UnicodeEncodeError) as e:
    #                     try:
    #                         p = type1(soup, row[4])
    #
    #                     except(AttributeError, UnicodeEncodeError) as e:
    #                         pass
    #






if __name__ == "__main__":
   app.run(host='0.0.0.0', port=8080)