"use client"

import '@/styles/style.css'
import React, { useEffect } from 'react';

export default function CountdownTimer({ countdownTime, countdown, countdown_cb }: { countdownTime: number, countdown?: boolean, countdown_cb?: any }) {
    useEffect(() => {
        const second = 1;
        const minute = second * 60;
        //const hour = minute * 60;
        //const day = hour * 24;

        if (countdown) {
            setInterval(() => {
                countdownTime--;
            }, 1000);
        }

        const intervalId = setInterval(() => {
            const distance = countdownTime;

            //const daysElement = document.getElementById('days');
            //const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');

            if (/*daysElement && hoursElement && */minutesElement && secondsElement) {
                //daysElement.innerText = String(Math.floor(distance / day));
                //hoursElement.innerText = String(Math.floor((distance % day) / hour));
                minutesElement.innerText = String(Math.floor((distance) / minute));
                secondsElement.innerText = String(Math.floor((distance % minute) / second));
            }

            if (distance < 0) {
                const headlineElement = document.getElementById('headline');
                const countdownElement = document.getElementById('countdown');
                const contentElement = document.getElementById('content');

                if (headlineElement) headlineElement.innerText = "Fully focused out!";
                if (countdownElement) countdownElement.style.display = 'none';
                if (contentElement) contentElement.style.display = 'block';

                countdown_cb();

                clearInterval(intervalId);
            }
        }, 0);

        return () => clearInterval(intervalId);
    }, [countdownTime]);

    return (
        <div className="col container inline-block">
            {countdown && (
                <h1 id="headline">Focusation in progress...</h1>
            )}
            <div id="countdown">
                <ul>
                    {/*<li>
                        <span id="days"></span>days
                    </li>
                    <li>
                        <span id="hours"></span>Hours
                    </li>*/}
                    <li>
                        <span id="minutes"></span>Minutes
                    </li>
                    <li>
                        <span id="seconds"></span>Seconds
                    </li>
                </ul>
            </div>
        </div>
    );
};

