import os
import time
import json
import requests
import cloudant
import pandas as pd
import datetime

from cloudant import Cloudant
from docx import Document
from flask import Flask , request, make_response , render_template, session, g
from cloudant.error import CloudantException
from cloudant.result import Result, ResultByKey,QueryResult

host="49410c97-9bad-40fc-ab6d-3c9b8dc2a71d-bluemix.cloudantnosqldb.appdomain.cloud"
user="49410c97-9bad-40fc-ab6d-3c9b8dc2a71d-bluemix"
password="9c3a638d575656bb718d8cbaabae961441f657188b2daba9967f3c92c1bd0239"
url = 'https://' + host


app = Flask(__name__)
app.config['BASIC_AUTH_USERNAME'] = 'admin'
app.config['BASIC_AUTH_PASSWORD'] = 'admin'

client = Cloudant(user, password, url=url, connect=True)

@app.route('/')
def home():
    
    session = client.session()
    quiz_db = client['infinity_portal_quiz_db']
    try:
        quiz_id = 'quiz_test_'+datetime.datetime.now().strftime("%d%m%Y")
        quiz_doc = quiz_db[quiz_id]
        quiz_name = quiz_doc['Quiz name']
        return render_template('register.html',quiz_name=quiz_name,quiz_id=quiz_id)
    except:
        return render_template('index.html')

@app.route('/questions/<quiz_id>')
def question(quiz_id):
    #TEST
    mailid = request.args.get('mailid')
    session = client.session()
    quiz_db = client['infinity_portal_quiz_db']
    results_db = client['infinity_portal_results_db']
    try:
        my_doc=results_db[mailid]
        if my_doc[quiz_id]['flag'] == 1:
            return "<html><div>You have already attended the Test. Please try the next quiz or Contact admin </div></html>"
        else:
            my_doc[quiz_id]['flag']=1
            my_doc[quiz_id]['start_time']=datetime.datetime.now().strftime("%c")
            my_doc.save()
            quiz_name=quiz_db[quiz_id]['Quiz name']
            questions=quiz_db[quiz_id]['questions']
            return render_template('quizpage.html',quiz_name=quiz_name,questions=questions,mailid=mailid,quiz_id=quiz_id)
    except:
        data= {'_id':mailid,quiz_id:{'flag':1,'start_time':datetime.datetime.now().strftime("%c")}}
        my_doc = results_db.create_document(data)
        my_doc.save()
        quiz_name=quiz_db[quiz_id]['Quiz name']
        questions=quiz_db[quiz_id]['questions']
        return render_template('quizpage.html',quiz_name=quiz_name,questions=questions,mailid=mailid,quiz_id=quiz_id)
    
@app.route('/results/<quiz_id>/<mailid>', methods=["POST"])
def results(mailid,quiz_id):
    session = client.session()
    results_db = client['infinity_portal_results_db']
    my_doc=results_db[mailid]
    my_doc[quiz_id]['end_time']=datetime.datetime.now().strftime("%c")
    answers=request.form.items()
    quiz_db = client['infinity_portal_quiz_db']
    correctanswers = quiz_db[quiz_id]['questions']
    
    score = 0
    for cans,ans in zip(correctanswers,answers):
        if ans[1] == cans['answer']:
            score = score +1
    
    my_doc[quiz_id]['score']=score*100/len(cans)
    my_doc.save()
    return "SCORE :" + str(score*100/len(cans))+"%"

port = os.getenv('VCAP_APP_PORT', '5000')
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=int(port), use_reloader=True, debug=True)    
#@atexit.register
#def shutdown():
#    client.disconnect()
