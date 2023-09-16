"use client"

import '../../styles/style.css'
import React, { useEffect } from 'react';

export default function CountdownTimer(){
    useEffect(() => {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;

        let today: string;
        let dd = "16"
        let mm = "09"
        let yyyy = new Date().getFullYear();
        let nextYear = yyyy + 1;
        let dayMonth = '09/30/';
        let birthday = dayMonth + yyyy;

        today = "16/09/2023";
        if (today > birthday) {
            birthday = dayMonth + nextYear;
        }

        const countDown = new Date(birthday).getTime();
        const intervalId = setInterval(() => {
            const now = new Date().getTime();
            const distance = countDown - now;

            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (daysElement && hoursElement && minutesElement && secondsElement) {
                daysElement.innerText = String(Math.floor(distance / day));
                hoursElement.innerText = String(Math.floor((distance % day) / hour));
                minutesElement.innerText = String(Math.floor((distance % hour) / minute));
                secondsElement.innerText = String(Math.floor((distance % minute) / second));
            }

            if (distance < 0) {
                const headlineElement = document.getElementById('headline');
                const countdownElement = document.getElementById('countdown');
                const contentElement = document.getElementById('content');

                if (headlineElement) headlineElement.innerText = "It's my birthday!";
                if (countdownElement) countdownElement.style.display = 'none';
                if (contentElement) contentElement.style.display = 'block';

                clearInterval(intervalId);
            }
        }, 0);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="container">
            <h1 id="headline">Countdown to my birthday</h1>
            <div id="countdown">
                <ul>
                    <li>
                        <span id="days"></span>days
                    </li>
                    <li>
                        <span id="hours"></span>Hours
                    </li>
                    <li>
                        <span id="minutes"></span>Minutes
                    </li>
                    <li>
                        <span id="seconds"></span>Seconds
                    </li>
                </ul>
            </div>
            <div id="content" className="emoji">
                <span>🥳</span>
                <span>🎉</span>
                <span>🎂</span>
            </div>
        </div>
    );
};

