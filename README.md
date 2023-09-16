# The Seal Team @ HackZurich2023

![logo_final_white.png](images%2Flogo_final_white.png)

## What is this?

This is the repository of the Seal Team for the HackZurich 2023. 
We are a team of 5 students from different universities in Europe.

We are participating in the [Logitech Challenge](https://hackzurich.com/workshops) and our goal is to create a
solution that helps people to focus on their work using Logitech products.

## Brain Waves and OpenBCI



## Gaze Estimation



## How to use the Dashboard

To run the dashboard, you need to have Node.js installed.
Then, you can run the following commands in the dashboard folder:

```bash
npm install
npm run dev
```

The dashboard will be available at http://localhost:3000

![dashboard_screenshot.png](images%2Fdashboard_screenshot.png)

The dashboard is divided in 2 parts:

1. The top part shows the statistics of your sessions, and the current session.
2. The bottom part shows the data of the session over a specific time period. The two graphs show
   the overall focus time and the **Focus Score** which is a metric we created to measure the
   focus of the user. The **Focus Score** is calculated by multiplying the focus time by the
   average focus value. The **Focus Score** is a number between 0 and 1, where 1 is the best.

You can also start a new session by clicking on the `Start Focusing!` button.

#### References

1. Lorem Ipsum
2. Lorem Ipsum
3. Lorem Ipsum

#### License and Credits
See the [LICENSE Information](https://hackzurich.com/faq) on the HackZurich Webpage.