# The Seal Team @ HackZurich2023

<!-- ![logo_final_white.png](images%2Flogo_final_white.png) -->

![logo_transparent.png](images%2Flogo_transparent.png)

## What is this?

This is the repository of the Seal Team for the HackZurich 2023.
We are a team of 5 students from different universities in Europe.

We are participating in the [Logitech Challenge](https://hackzurich.com/workshops) and our goal is to create a
solution that helps people to focus on their work using Logitech products.

# Project Story

## Inspiration

The inspiration behind "Mindtrics - Mind metrics. Made simple." stems from the growing importance of mental well-being and cognitive performance in our fast-paced digital world.
We wanted to create a tool that effortlessly integrates into daily life, leveraging cutting-edge EEG technology and Logitech's superior audio hardware to provide users with actionable insights into their focus levels and mental state.

## What it does

Our project, Mindtrics, uses the following:

- Logitech webcam
- Logitech headphones (with the proposed application of EEG electrodes onto the headphone frame)
- Logitech keyboards, and mice
  In order to create a seamless way to maintain the state of flow when carrying out any productive tasks.

Instead of doing a **timer-based system** which can lead to breaking of the state of flow for users, we focus on ensuring the state of flow is not broken and users can extend these flow ranges beyond just a set timer. Our project incorporates real-time EEG data acquisition which is used to identify the level of focus that a person has had throughout time. In case the person goes below a specific threshold of focus, we can indicate this using our interactive website or through peripherals that allow RGB lighting. This provides a subtle way of indicating if the user is still in a state of flow or if they are unable to focus.

## How we built it

We used OpenBCI's 8-channel EEG headset whose electrodes we plan on incorporating through the Logitech headphones. We used a Band Pass filter and notch filter to carry out the initial filtering of the signals obtained from the EEG electrodes and then convert them into Alpha, Beta, Gamma, Theta and Delta frequency wave categories. We use the ratio between Alpha and Beta waves to determine the level of focus the user has at different standpoints and a threshold to determine if they are focused or not. The logic is similar to most of the focus determining BCI tools available on the market and is possible to carry out with even 4 electrodes.

Our tool also uses a gaze detection neural network in order to identify eye movement patterns while performing tasks in front of the computer to check for changes in the direction of gaze.

## Challenges we ran into

Integrating the EEG electrodes seamlessly into the Logitech headphones presented a considerable challenge. We had to ensure a harmonious marriage of form and function, where the user experiences the EEG monitoring effortlessly while enjoying high-quality audio.
This demanded meticulous software design and a big number of tests.

## Accomplishments that we're proud of

Integration of all the different metrics to the dashboard was one of the major ch

## What we learned

Throughout this project, we deepened our understanding of EEG technology, signal processing, and BCI algorithms.
The experience taught us valuable lessons in hardware-software integration, user-centric design, and the significance of precise data analysis in providing meaningful insights.

## What's next for Mindtrics - Mind metrics. Made simple

Looking ahead, we envision further refinement and miniaturization of the EEG integration to enhance user comfort and convenience. We plan to develop a user-friendly interface or mobile application to present the focus metrics in an easily understandable and actionable format.

Additionally, we aim to incorporate machine learning techniques to personalize the threshold for focus determination based on individual user profiles, making Mindtrics a truly tailored mental wellness tool.

# Technical Choices

## Brain Waves and OpenBCI

We used OpenBCI's 8-channel EEG headset whose electrodes we plan on incorporating through the Logitech headphones. We used a Band Pass filter and notch filter to carry out the initial filtering of the signals obtained from the EEG electrodes and then convert them into Alpha, Beta, Gamma, Theta and Delta frequency wave categories. We use the ratio between Alpha and Beta waves to determine the level of focus the user has at different standpoints and a threshold to determine if they are focused or not. The logic is similar to most of the focus determining BCI tools available on the market and is possible to carry out with even 4 electrodes.

## Activity Recognition

Activity recognition was carried out using [mmaction](https://github.com/open-mmlab/mmaction2/)

## BCI

BCI was done using [brainflow](https://brainflow.org/)

## Gaze Estimation

Since gaze tracking model is using [existing repo](https://github.com/antoinelame/GazeTracking), you will also need to pull submodule for that model before running.

<!-- ![final_gaze_estimation_cut.gif](images/final_gaze_estimation_cut.gif) -->

<p align="center">
  <img src="images/final_gaze_estimation_cut.gif" width="50%" height="auto">
</p>

Gaze estimation is doing classic 2d vector gaze estimation and outputs statistics on first order rates of gaze change.
To run Gaze estimation with Plotly Dash dashboards (as in the figure above):

```
python gaze_estimation/gaze_2d_dash.py
```

To run Gaze estimation standalone:

```
python gaze_estimation/gaze_2d_csv.py
```

To connect Gaze estimation remotely to Mindtrics General Dashboard:

```
python message_gaze_and_mouse_estimation.py
```

## How to use the Dashboard

To run the dashboard, you need to have Node.js installed.
Then, you can run the following commands in the dashboard folder:

```bash
npm install
npm run dev
```

The dashboard will be available at http://localhost:3000

![dashboard_screenshot.png](images%2Fdashboard_screenshot.png)

The dashboard is divided in 4 parts:

1. The top part shows the statistics of your sessions, and the current session.
2. The bottom part shows the data of the session over a specific time period. The four graphs show
   different aspect of the session:
   - The first graph shows the focus level over time. The focus level is computed using the alpha and
     beta waves of the EEG.
   - The second graph shows the activities detected by the webcam over time.
   - The third graph shows the mouse position on the screen.
   - The final graph shows the gaze velocity over time.

You can also start a new session by clicking on the `Start Focusing!` button.

#### License and Credits

See the [LICENSE Information](https://hackzurich.com/faq) on the HackZurich Webpage.
