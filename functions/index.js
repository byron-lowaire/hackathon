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
        if(medication !== null) {
            if (!app.data.medication) {
                app.data.medication = [];
            }

            let exists = false;
            for (const medications in app.data.medications) {
                if (medication === app.data.medications[medications]) {
                    exists = true;
                }
            }
            if (!exists) {
                app.data.medication.push(medication);
                app.ask(`${medication} has been added to your list of medications, Do you want to do something else`);
            } else {
                app.ask(`${medication} is already on your list of medications, Do you want to do something else`);
            }
        } else {
            app.ask(`I can't add that as it is not a medication, Do you want to do something else`);
        }

    }

    function remove_medication(app) {
        const medication = app.getArgument('medication');
        if(medication !== null) {
            let exists = false;
            for (const medications in app.data.medications) {
                if (medication === app.data.medications[medications]) {
                    exists = true;
                    app.data.medications.splice(app.data.medications, 0)
                }
            }
            if (exists) {
                app.ask(`${medication} has been removed from your list of medications, Do you want to do something else`);
            } else {
                app.ask(`${medication} is not on your list of medications, Do you want to do something else`);
            }
        } else {
            app.ask(`I can't remove that as it is not a medication, Do you want to do something else`);
        }
    }

   function add_hobbies(app) {
        const hobbies = app.getArgument('hobbies');
        if(hobbies !== null) {
            if (!app.data.hobbies) {
                app.data.hobbies = [];
            }

            let exists = false;
            for (const hobbies in app.data.hobbies) {
                if (hobbies === app.data.hobbies[hobbies]) {
                    exists = true;
                }
            }
            if (!exists) {
                app.data.hobbies.push(hobbies);
                app.ask(`${hobbies} has been added to your list of hobbies, Do you want to do something else`);
            } else {
                app.ask(`${hobbies} is already on your list of hobbies, Do you want to do something else`);
            }
        } else {
            app.ask(`I can't add that as it is not a hobbies, Do you want to do something else`);
        }

    }

    function remove_hobbies(app) {
        const hobbies = app.getArgument('hobbies');
        if(hobbies !== null) {
            let exists = false;
            for (const hobbies in app.data.hobbies) {
                if (hobbies === app.data.hobbies[hobbies]) {
                    exists = true;
                    app.data.hobbies.splice(app.data.hobbies, 0)
                }
            }
            if (exists) {
                app.ask(`${hobbies} has been removed from your list of hobbies, Do you want to do something else`);
            } else {
                app.ask(`${hobbies} is not on your list of hobbies, Do you want to do something else`);
            }
        } else {
            app.ask(`I can't remove that as it is not a hobbies, Do you want to do something else`);
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
