'use strict';

process.env.DEBUG = 'actions-on-google:*';

const assistant = require('actions-on-google').ApiAiAssistant;
const functions = require('firebase-functions');

const HACK_QUESTION = 'hack.add_medication';
const HACK_UNKNOWN = 'input.unknown';

exports.hackacthon = functions.https.onRequest((request, response) => {
    const app = new assistant({request: request, response: response});

    let actionMap = new Map();
    actionMap.set(HACK_ADD_MEDICATION, add_medication);
    actionMap.set(HACK_UNKNOWN, defaultHandler);

    app.handleRequest(actionMap);

    function add_medication(app) {
        const medication = app.getArgument('medication');
        if (app.data.medication) {
            app.data.medication.push(medication)
        }
    }

    function endSession(app) {
        if(app.getRawInput() === 'no' && app.data.prompt === 'question') {
            app.data.prompt = 'default';
            app.ask('Do you want to do something else');
        } else {
            app.tell('End Message');
        }
    }

    function defaultHandler(app) {
        if(app.data.question) {
            answer(app);
        } else {
            app.data.prompt = 'default';
            app.ask('Default Response')
        }
    }

} );