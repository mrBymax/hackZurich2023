import cv2
from gaze_tracking_model.gaze_tracking import GazeTracking
from dash import Dash, dcc, html, Input, Output
from threading import Thread
import csv
import pyautogui


# Global list to store gaze ratios
gaze_ratios = []
rate_of_change_horizontal = []
rate_of_change_vertical = []
total_rate_of_change_squared = []
cumulative_change_minute = []
cumulative_change_second = []

gaze = GazeTracking()
fps=30
webcam = cv2.VideoCapture(0)

ctr = 0 # counter for mouse track

window_name = "2D Gaze estimation"

cv2.namedWindow(window_name, cv2.WND_PROP_FULLSCREEN)
cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)


def update_graph(gaze_ratios):
    if len(gaze_ratios) > 1:
        delta_horizontal = gaze_ratios[-1][0] - gaze_ratios[-2][0]
        delta_vertical = gaze_ratios[-1][1] - gaze_ratios[-2][1]
        delta_time = 1 / fps  # Assuming 30 FPS for now

        rate_of_change_horizontal.append(delta_horizontal / delta_time)
        rate_of_change_vertical.append(delta_vertical / delta_time)
        total_rate_of_change_squared.append((delta_horizontal / delta_time) ** 2 + (delta_vertical / delta_time) ** 2)

        # Calculate cumulative change for the last minute and last second
        cumulative_change_minute.append(sum(total_rate_of_change_squared[-int(fps * 60):]))
        cumulative_change_second.append(sum(total_rate_of_change_squared[-int(fps):]))

    time_axis = [i / fps for i in range(len(gaze_ratios))]

    # Update CSV files for each figure
    with open('gaze_rate.csv', 'w+', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['Time', 'Rate of Change - Horizontal', 'Rate of Change - Vertical', 'Total Rate of Change Squared'])
        csvwriter.writerows(zip(time_axis[1:], rate_of_change_horizontal, rate_of_change_vertical, total_rate_of_change_squared))

    with open('gaze_minute.csv', 'w+', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['Time', 'Cumulative Change - Last Minute'])
        csvwriter.writerows(zip(time_axis[1:], cumulative_change_minute))

    with open('gaze_second.csv', 'w+', newline='') as csvfile:
        csvwriter = csv.writer(csvfile)
        csvwriter.writerow(['Time', 'Cumulative Change - Last Second'])
        csvwriter.writerows(zip(time_axis[1:], cumulative_change_second))

        

while True:
    _, frame = webcam.read()
    gaze.refresh(frame)

    new_frame = gaze.annotated_frame()
    text = ""

    # Get new gaze ratios
    cv2.imshow(window_name, frame)


    gaze.refresh(frame)
    new_frame = gaze.annotated_frame()


    try:

        horizontal_ratio = gaze.horizontal_ratio()
        vertical_ratio = gaze.vertical_ratio()

        # Store the gaze ratios in the global list
        if horizontal_ratio is not None and vertical_ratio is not None:
            gaze_ratios.append((horizontal_ratio, vertical_ratio))

        update_graph(gaze_ratios)
        

        text = f'Horiz: {horizontal_ratio:.2f}, Vert: {vertical_ratio:.2f}'
        color = (0, 255, 0)
        

    except:
        text = "Blinking/No eyes detected"
        color = (255,255,0)

    cv2.putText(new_frame, text, (20,  20), cv2.FONT_HERSHEY_DUPLEX, 1, color, 2)

    if(len(total_rate_of_change_squared) > 0 and not text == "Blinking/No eyes detected"):

        if(total_rate_of_change_squared[-1] > 10.00):
            cv2.putText(new_frame, "Extreme movement", (20,  50), cv2.FONT_HERSHEY_DUPLEX, 1, (0, 0, 255), 2)
        elif(total_rate_of_change_squared[-1] < 3.00):
            cv2.putText(new_frame, "Slow eye movement", (20,  50), cv2.FONT_HERSHEY_DUPLEX, 1, (255, 0, 0), 2)
    

    cv2.imshow(window_name, new_frame)


    # with open("mouse_track.txt", "a+") as f_m:
    #     ctr = ctr+1
    #     if ctr % 5000 == 0:
    #         x, y = pyautogui.position()
    #         f_m.write(str(x)+','+str(y)+'\n')
    # f_m.close()

    if cv2.waitKey(1) == 27:    
        break