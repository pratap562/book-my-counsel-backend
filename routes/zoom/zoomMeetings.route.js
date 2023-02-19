const zoommeetings = require('express').Router()
require('domain').config()
zoommeetings.post('/create', (req, res) => {

    const userId = 'YOUR_USER_ID';
    const accessToken = 'YOUR_ACCESS_TOKEN';
    const zoomApiUrl = `https://api.zoom.us/v2/users/${userId}/meetings`;

    const requestBody = {
        topic: 'Meeting Topic',
        type: 2, // 2 is for scheduled meeting
        start_time: '2023-02-25T14:30:00Z', // The start time of the meeting in ISO 8601 format
        duration: 60, // The duration of the meeting in minutes
        timezone: 'UTC', // The timezone for the meeting
        agenda: 'Meeting Agenda',
        settings: {
            host_video: true, // Host video on or off
            participant_video: true, // Participant video on or off
            join_before_host: false, // Allow participants to join before the host
            mute_upon_entry: true, // Mute participants upon entry
            waiting_room: true // Enable waiting room
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    fetch(zoomApiUrl, requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to schedule meeting');
            }
        })
        .then(data => {
            // Do something with the meeting data
            console.log(data);
        })
        .catch(error => {
            // Handle the error
            console.error('There was a problem scheduling the meeting:', error);
        });
})
